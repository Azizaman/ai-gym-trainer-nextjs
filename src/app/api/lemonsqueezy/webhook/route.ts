import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/** Lemon Squeezy sends webhook events here — we verify the signature */
export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // Verify webhook signature (HMAC SHA256 hex digest)
        const expectedSignature = crypto
            .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
            .update(rawBody)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Webhook signature mismatch");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(rawBody);
        const eventName: string = event.meta?.event_name;
        const customData = event.meta?.custom_data;
        const userId: string | undefined = customData?.user_id;
        const plan: string | undefined = customData?.plan;
        const subAttributes = event.data?.attributes;
        const lsSubscriptionId = String(event.data?.id);
        const lsCustomerId = subAttributes?.customer_id ? String(subAttributes.customer_id) : null;
        const lsVariantId = subAttributes?.variant_id ? String(subAttributes.variant_id) : null;

        console.log(`[LemonSqueezy Webhook] ${eventName} — userId: ${userId}`);

        switch (eventName) {
            case "subscription_created": {
                if (!userId || !plan) {
                    console.error("Missing userId or plan in custom_data for subscription_created");
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
                        status: "active",
                        lsSubscriptionId,
                        lsCustomerId,
                        lsVariantId,
                        analysesUsedThisMonth: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    },
                    update: {
                        plan,
                        status: "active",
                        lsSubscriptionId,
                        lsCustomerId,
                        lsVariantId,
                        analysesUsedThisMonth: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                    },
                });
                break;
            }

            case "subscription_updated": {
                if (!lsSubscriptionId) break;

                const status = subAttributes?.status;
                const dbStatus =
                    status === "active" ? "active" :
                        status === "past_due" ? "past_due" :
                            status === "paused" ? "past_due" :
                                status === "cancelled" ? "cancelled" :
                                    status === "expired" ? "cancelled" :
                                        "active";

                await prisma.subscription.updateMany({
                    where: { lsSubscriptionId },
                    data: { status: dbStatus },
                });
                break;
            }

            case "subscription_cancelled":
            case "subscription_expired": {
                if (!lsSubscriptionId) break;

                await prisma.subscription.updateMany({
                    where: { lsSubscriptionId },
                    data: {
                        plan: "starter",
                        status: "cancelled",
                        lsSubscriptionId: null,
                        lsCustomerId: null,
                        lsVariantId: null,
                    },
                });
                break;
            }

            case "subscription_payment_success": {
                if (!lsSubscriptionId) break;

                const now = new Date();
                const periodEnd = new Date(now);
                periodEnd.setMonth(periodEnd.getMonth() + 1);

                await prisma.subscription.updateMany({
                    where: { lsSubscriptionId },
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
                console.log(`[LemonSqueezy Webhook] Unhandled event: ${eventName}`);
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
