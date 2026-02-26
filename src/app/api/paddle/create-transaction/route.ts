import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { paddle, getPaddlePriceId } from "@/lib/paddle";
import type { PlanType } from "@/lib/plans";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session?.user?.email) {
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

        const priceId = getPaddlePriceId(plan as PlanType, currency as "INR" | "USD");
        if (!priceId) {
            return NextResponse.json(
                { error: "Plan price not configured for this plan/currency." },
                { status: 500 }
            );
        }

        // Create Paddle Transaction
        const transaction = await paddle.transactions.create({
            items: [
                {
                    priceId,
                    quantity: 1,
                },
            ],
            customData: {
                user_id: session.user.id,
                plan,
                currency,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                transactionId: transaction.id,
            },
        });
    } catch (error) {
        console.error("Paddle create transaction error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create transaction" },
            { status: 500 }
        );
    }
}
