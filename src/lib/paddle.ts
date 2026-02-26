import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import type { PlanType } from "./plans";

export const paddle = new Paddle(process.env.PADDLE_API_KEY || "", {
    environment: process.env.PADDLE_ENVIRONMENT === "sandbox" ? Environment.sandbox : Environment.production,
    logLevel: LogLevel.verbose,
});

export const PRICE_IDS: Record<string, string> = {
    pro_INR: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_INR || "",
    team_INR: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_INR || "",
    pro_USD: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_USD || "",
    team_USD: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_USD || "",
};

export function getPaddlePriceId(plan: PlanType, currency: "INR" | "USD"): string | null {
    const key = `${plan}_${currency}`;
    return PRICE_IDS[key] || null;
}
