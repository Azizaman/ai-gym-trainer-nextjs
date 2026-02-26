import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import type { PlanType } from "./plans";

/** Initialize the Lemon Squeezy SDK — call once at module level */
lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

/** Map plan + currency → Lemon Squeezy variant ID from env */
export const VARIANT_IDS: Record<string, string> = {
    pro_INR: process.env.LEMONSQUEEZY_VARIANT_ID_PRO_INR || "",
    team_INR: process.env.LEMONSQUEEZY_VARIANT_ID_TEAM_INR || "",
    pro_USD: process.env.LEMONSQUEEZY_VARIANT_ID_PRO_USD || "",
    team_USD: process.env.LEMONSQUEEZY_VARIANT_ID_TEAM_USD || "",
};

/** Get the variant ID for a given plan + currency combo */
export function getVariantId(
    plan: PlanType,
    currency: "INR" | "USD"
): string | null {
    const key = `${plan}_${currency}`;
    return VARIANT_IDS[key] || null;
}

export const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;
