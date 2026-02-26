import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are FormAI Coach, an expert fitness and nutrition assistant. You are helpful, motivating, and knowledgeable about:

- Diet plans, macros, calories, meal prep
- Workout programming and periodization
- Injury prevention and recovery
- Supplements and hydration
- Exercise form and technique tips
- Goal-specific advice (weight loss, muscle gain, endurance, flexibility)

Guidelines:
- Keep answers concise but thorough (2-4 paragraphs max)
- Use bullet points for lists
- Be encouraging and positive
- If asked about medical conditions, advise consulting a healthcare professional
- Format responses with markdown for readability
- Use emojis sparingly for a friendly tone`;

interface ChatMessage {
    role: "user" | "model";
    text: string;
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message, history } = (await request.json()) as {
            message: string;
            history: ChatMessage[];
        };

        if (!message?.trim()) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build conversation contents for Gemini
        const contents = [
            { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model" as const, parts: [{ text: "Understood! I'm FormAI Coach, ready to help with fitness and nutrition questions. How can I help you today? 💪" }] },
            ...history.map((msg) => ({
                role: msg.role === "user" ? ("user" as const) : ("model" as const),
                parts: [{ text: msg.text }],
            })),
            { role: "user" as const, parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents,
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        const reply = response.text?.trim() ?? "Sorry, I couldn't process that. Please try again.";

        return NextResponse.json({ success: true, reply });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Failed to get response" },
            { status: 500 }
        );
    }
}
