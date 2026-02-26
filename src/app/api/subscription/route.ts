import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, shouldResetUsage, getRemainingAnalyses } from "@/lib/plans";
import { paddle } from "@/lib/paddle";
import type { PlanType } from "@/lib/plans";

/** GET — Return current subscription, usage, and limits */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find or create subscription
        let subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });

        if (!subscription) {
            subscription = await prisma.subscription.create({
                data: {
                    userId: session.user.id,
                    plan: "starter",
                    status: "active",
                },
            });
        }

        const plan = subscription.plan as PlanType;

        // Auto-reset usage if new billing period
        if (shouldResetUsage(subscription.currentPeriodStart)) {
            subscription = await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    analysesUsedThisMonth: 0,
                    currentPeriodStart: new Date(),
                },
            });
        }

        const limits = PLAN_LIMITS[plan];
        const remaining = getRemainingAnalyses(plan, subscription.analysesUsedThisMonth);

        return NextResponse.json({
            success: true,
            data: {
                plan,
                planName: limits.name,
                status: subscription.status,
                currency: subscription.currency || "INR",
                hasActivePaddle: !!subscription.paddleSubscriptionId,
                usage: {
                    used: subscription.analysesUsedThisMonth,
                    limit: limits.analysesPerMonth,
                    remaining,
                },
                limits: {
                    maxVideoSizeMB: limits.maxVideoSizeMB,
                    allowedExercises: limits.allowedExercises,
                    features: limits.features,
                },
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
            },
        });
    } catch (error) {
        console.error("Subscription fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch subscription" },
            { status: 500 }
        );
    }
}

/** POST — Downgrade to starter (cancels Paddle sub) or upgrade initiation */
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await request.json();

        // Only allow downgrade to starter via this endpoint
        // Upgrades to paid plans must go through checkout
        if (plan !== "starter") {
            return NextResponse.json(
                {
                    success: false,
                    error: "To upgrade to a paid plan, use the payment flow.",
                },
                { status: 400 }
            );
        }

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });

        if (!subscription) {
            return NextResponse.json(
                { success: false, error: "No subscription found" },
                { status: 404 }
            );
        }

        // Cancel active Paddle subscription if exists
        if (subscription.paddleSubscriptionId) {
            try {
                await paddle.subscriptions.cancel(subscription.paddleSubscriptionId, {
                    effectiveFrom: "immediately",
                });
            } catch (err) {
                console.warn("Failed to cancel Paddle subscription (may already be cancelled):", err);
            }
        }

        // Downgrade to starter
        const updated = await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                plan: "starter",
                status: "active",
                paddleSubscriptionId: null,
                paddleCustomerId: null,
                paddlePriceId: null,
                analysesUsedThisMonth: 0,
                currentPeriodStart: new Date(),
                currentPeriodEnd: null,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                plan: updated.plan,
                planName: PLAN_LIMITS.starter.name,
                status: updated.status,
                message: "Successfully downgraded to Starter plan",
            },
        });
    } catch (error) {
        console.error("Subscription update error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update subscription" },
            { status: 500 }
        );
    }
}
