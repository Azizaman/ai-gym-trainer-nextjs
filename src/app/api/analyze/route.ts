import { NextResponse } from "next/server";
import { analyzeExerciseVideo } from "@/lib/gemini";
import { config } from "@/lib/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, isExerciseAllowed, shouldResetUsage, getRemainingAnalyses } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";

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

        // ── Subscription check ──────────────────────────────────
        let subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });

        if (!subscription) {
            subscription = await prisma.subscription.create({
                data: { userId: session.user.id, plan: "starter", status: "active" },
            });
        }

        const plan = subscription.plan as PlanType;
        const limits = PLAN_LIMITS[plan];

        // Auto-reset usage if new billing period
        if (shouldResetUsage(subscription.currentPeriodStart)) {
            subscription = await prisma.subscription.update({
                where: { id: subscription.id },
                data: { analysesUsedThisMonth: 0, currentPeriodStart: new Date() },
            });
        }

        // Check monthly analysis limit
        const remaining = getRemainingAnalyses(plan, subscription.analysesUsedThisMonth);
        if (remaining <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `You've used all ${limits.analysesPerMonth} analyses this month on the ${limits.name} plan. Upgrade for more.`,
                    code: "LIMIT_REACHED",
                },
                { status: 403 }
            );
        }
        // ── End subscription check ──────────────────────────────

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

        // Check exercise type allowed for plan
        if (!isExerciseAllowed(plan, exerciseType)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `${exerciseType.replace("-", " ")} is not available on the ${limits.name} plan. Upgrade to Pro for all exercises.`,
                    code: "EXERCISE_LOCKED",
                },
                { status: 403 }
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

        // Validate file size against plan limit
        const planMaxBytes = limits.maxVideoSizeMB * 1024 * 1024;
        const globalMaxBytes = config.MAX_FILE_SIZE_MB * 1024 * 1024;
        const maxBytes = Math.min(planMaxBytes, globalMaxBytes);
        if (video.size > maxBytes) {
            return NextResponse.json(
                {
                    success: false,
                    error: `File too large. Max size for ${limits.name} plan: ${limits.maxVideoSizeMB} MB`,
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

        // Save to database & increment usage
        try {
            await prisma.$transaction([
                prisma.analysisHistory.create({
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
                }),
                prisma.subscription.update({
                    where: { id: subscription!.id },
                    data: { analysesUsedThisMonth: { increment: 1 } },
                }),
            ]);
        } catch (dbError) {
            console.warn("Failed to save analysis to DB:", dbError);
            // Don't fail the request if DB save fails
        }

        return NextResponse.json({
            success: true,
            data: feedback,
            meta: {
                analysesRemaining: remaining - 1,
                plan,
            },
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
