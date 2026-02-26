import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { getVariantId, STORE_ID } from "@/lib/lemonsqueezy";
import type { PlanType } from "@/lib/plans";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan, currency = "INR" } = await request.json();

        if (!plan || !["pro", "team"].includes(plan)) {
            return NextResponse.json(
                { error: "Invalid plan. Must be pro or team." },
                { status: 400 }
            );
        }

        if (!["INR", "USD"].includes(currency)) {
            return NextResponse.json(
                { error: "Invalid currency. Must be INR or USD." },
                { status: 400 }
            );
        }

        const variantId = getVariantId(plan as PlanType, currency as "INR" | "USD");
        if (!variantId) {
            return NextResponse.json(
                { error: "Plan variant not configured for this plan/currency." },
                { status: 500 }
            );
        }

        // Create Lemon Squeezy checkout
        const { data: checkout, error } = await createCheckout(STORE_ID, variantId, {
            checkoutData: {
                custom: {
                    user_id: session.user.id,
                    plan,
                    currency,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/subscription?success=true`,
            },
        });

        if (error) {
            console.error("Lemon Squeezy checkout error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to create checkout" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                checkoutUrl: checkout?.data?.attributes?.url,
            },
        });
    } catch (error) {
        console.error("Lemon Squeezy create checkout error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create checkout" },
            { status: 500 }
        );
    }
}
