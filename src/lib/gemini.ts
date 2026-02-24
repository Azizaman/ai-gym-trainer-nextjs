import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
} from "@google/genai";
import { config } from "./config";
import type { ExerciseFeedback, AnalysisOptions } from "@/types";

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Poll until Gemini is done processing the uploaded video
async function waitForFileReady(fileName: string): Promise<void> {
    const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutes
    const POLL_INTERVAL_MS = 3000;
    const start = Date.now();

    while (Date.now() - start < MAX_WAIT_MS) {
        const file = await ai.files.get({ name: fileName });

        if (file.state === "ACTIVE") return;
        if (file.state === "FAILED") {
            throw new Error("Gemini failed to process the uploaded video.");
        }

        // Still PROCESSING — wait and retry
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    throw new Error("Timed out waiting for Gemini to process the video.");
}

function buildPrompt(exerciseType: string, options: AnalysisOptions): string {
    const focusAreas = options.focusAreas?.join(", ") || "general form";
    const fitnessLevel = options.fitnessLevel || "intermediate";

    return `Expert trainer. Analyze ${exerciseType} video for ${fitnessLevel} athlete. Focus: ${focusAreas}. 

Respond JSON only (no markdown):
{"isFormCorrect":boolean,"score":0-100,"exerciseDetected":"string","repCount":number|null,"goodPoints":string[],"issues":[{"severity":"critical"|"moderate"|"minor","body_part":"string","description":"string"}],"corrections":string[],"safetyWarnings":string[],"summary":"string","recommendedDrills":string[]}`;
}

export async function analyzeExerciseVideo(
    videoBuffer: Buffer,
    mimeType: string,
    exerciseType: string,
    options: AnalysisOptions = {}
): Promise<ExerciseFeedback> {
    let uploadedFileName: string | null = null;

    try {
        // 1. Upload video to Gemini File API
        console.log(`⬆️  Uploading video to Gemini...`);
        const blob = new Blob([new Uint8Array(videoBuffer)], { type: mimeType });

        const uploadResponse = await ai.files.upload({
            file: blob,
            config: {
                displayName: `exercise_${exerciseType}_${Date.now()}`,
                mimeType,
            },
        });

        uploadedFileName = uploadResponse.name!;

        // 2. Wait for Gemini to finish processing
        console.log(`⏳ Waiting for Gemini to process video...`);
        await waitForFileReady(uploadedFileName);

        // 3. Re-fetch to get the final URI
        const processedFile = await ai.files.get({ name: uploadedFileName });

        // 4. Run analysis using official SDK helpers
        console.log(`🤖 Running AI analysis...`);
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: createUserContent([
                createPartFromUri(processedFile.uri!, processedFile.mimeType!),
                buildPrompt(exerciseType, options),
            ]),
            config: {
                temperature: 0.2,
                maxOutputTokens: 2048,
            },
        });

        const rawText = response.text?.trim() ?? "";

        // Parse JSON — strip markdown fences if Gemini added them
        let feedback: ExerciseFeedback;
        try {
            feedback = JSON.parse(rawText);
        } catch {
            const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
            feedback = JSON.parse(cleaned);
        }

        return feedback;
    } finally {
        // Always delete temp file from Gemini servers
        if (uploadedFileName) {
            try {
                await ai.files.delete({ name: uploadedFileName });
                console.log(`🗑️  Deleted file from Gemini servers.`);
            } catch (err) {
                console.warn("Could not delete file from Gemini:", err);
            }
        }
    }
}
