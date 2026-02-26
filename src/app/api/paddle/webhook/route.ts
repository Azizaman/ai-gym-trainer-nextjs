import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paddle } from "@/lib/paddle";

/** Paddle sends webhook events here — we verify the signature */
export async function POST(request: Request) {
    try {
        const signature = request.headers.get("paddle-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const rawBody = await request.text();

        // Verify webhook signature
        const eventData = await paddle.webhooks.unmarshal(
            rawBody,
            process.env.PADDLE_WEBHOOK_SECRET!,
            signature
        );

        if (!eventData) {
            console.error("Webhook signature mismatch");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const eventName = eventData.eventType;
        console.log(`[Paddle Webhook] ${eventName}`);

        switch (eventName) {
            case "subscription.created": {
                const subscription = eventData.data;
                const customData = subscription.customData;

                const userId: string | undefined = customData?.user_id;
                const plan: string | undefined = customData?.plan;

                if (!userId || !plan) {
                    console.error("Missing userId or plan in customData for subscription.created");
                    break;
                }

                const now = new Date();
                const periodEnd = new Date(now);
                periodEnd.setMonth(periodEnd.getMonth() + 1);

                await prisma.subscription.upsert({
                    where: { userId },
                    create: {
                        userId,
                        plan,
                        status: subscription.status === "active" ? "active" : "pending",
                        paddleSubscriptionId: subscription.id,
                        paddleCustomerId: subscription.customerId,
                        paddlePriceId: subscription.items?.[0]?.price?.id || null,
                        analysesUsedThisMonth: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    },
                    update: {
                        plan,
                        status: subscription.status === "active" ? "active" : "pending",
                        paddleSubscriptionId: subscription.id,
                        paddleCustomerId: subscription.customerId,
                        paddlePriceId: subscription.items?.[0]?.price?.id || null,
                        analysesUsedThisMonth: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    },
                });
                break;
            }

            case "subscription.updated": {
                const subscription = eventData.data;
                const status = subscription.status;
                const dbStatus =
                    status === "active" ? "active" :
                        status === "past_due" ? "past_due" :
                            status === "paused" ? "past_due" :
                                status === "canceled" ? "cancelled" :
                                    "active";

                await prisma.subscription.updateMany({
                    where: { paddleSubscriptionId: subscription.id },
                    data: { status: dbStatus },
                });
                break;
            }

            case "subscription.canceled": {
                const subscription = eventData.data;

                await prisma.subscription.updateMany({
                    where: { paddleSubscriptionId: subscription.id },
                    data: {
                        plan: "starter",
                        status: "cancelled",
                        paddleSubscriptionId: null,
                        paddleCustomerId: null,
                        paddlePriceId: null,
                    },
                });
                break;
            }

            case "transaction.completed": {
                // We update the period on transaction completion (recurring payment)
                const transaction = eventData.data;

                if (!transaction.subscriptionId) break;

                const now = new Date();
                const periodEnd = new Date(now);
                periodEnd.setMonth(periodEnd.getMonth() + 1);

                await prisma.subscription.updateMany({
                    where: { paddleSubscriptionId: transaction.subscriptionId },
                    data: {
                        status: "active",
                        analysesUsedThisMonth: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    },
                });
                break;
            }

            default:
                console.log(`[Paddle Webhook] Unhandled event: ${eventName}`);
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
