import { NextResponse } from "next/server";
import { analyzeExerciseVideo } from "@/lib/gemini";
import { config } from "@/lib/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        // Auth check
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Please sign in to analyze videos" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const video = formData.get("video") as File | null;
        const exerciseType = (formData.get("exerciseType") as string) || "general";
        const fitnessLevel = (formData.get("fitnessLevel") as string) || "intermediate";

        if (!video) {
            return NextResponse.json(
                { success: false, error: "No video file provided" },
                { status: 400 }
            );
        }

        // Validate MIME type
        if (!config.SUPPORTED_MIME_TYPES.includes(video.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Unsupported file type: ${video.type}. Supported: ${config.SUPPORTED_MIME_TYPES.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Validate file size
        const maxBytes = config.MAX_FILE_SIZE_MB * 1024 * 1024;
        if (video.size > maxBytes) {
            return NextResponse.json(
                {
                    success: false,
                    error: `File too large. Max size: ${config.MAX_FILE_SIZE_MB} MB`,
                },
                { status: 400 }
            );
        }

        // Read file into buffer
        const arrayBuffer = await video.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Run analysis
        const feedback = await analyzeExerciseVideo(buffer, video.type, exerciseType, {
            fitnessLevel: fitnessLevel as "beginner" | "intermediate" | "advanced",
        });

        // Save to database
        try {
            await prisma.analysisHistory.create({
                data: {
                    userId: session.user.id,
                    exerciseType,
                    fitnessLevel,
                    score: feedback.score,
                    isFormCorrect: feedback.isFormCorrect,
                    exerciseDetected: feedback.exerciseDetected || exerciseType,
                    repCount: feedback.repCount || null,
                    summary: feedback.summary || "",
                    goodPoints: JSON.stringify(feedback.goodPoints || []),
                    issues: JSON.stringify(feedback.issues || []),
                    corrections: JSON.stringify(feedback.corrections || []),
                    safetyWarnings: JSON.stringify(feedback.safetyWarnings || []),
                    recommendedDrills: JSON.stringify(feedback.recommendedDrills || []),
                    fileSizeMB: video.size / 1024 / 1024,
                },
            });
        } catch (dbError) {
            console.warn("Failed to save analysis to DB:", dbError);
            // Don't fail the request if DB save fails
        }

        return NextResponse.json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        console.error("Analysis error:", error);
        const message =
            error instanceof Error ? error.message : "Analysis failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
