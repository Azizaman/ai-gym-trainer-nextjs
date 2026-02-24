import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const analyses = await prisma.analysisHistory.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                exerciseType: true,
                fitnessLevel: true,
                score: true,
                isFormCorrect: true,
                exerciseDetected: true,
                summary: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ success: true, data: analyses });
    } catch (error) {
        console.error("Error fetching analyses:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch analyses" },
            { status: 500 }
        );
    }
}
