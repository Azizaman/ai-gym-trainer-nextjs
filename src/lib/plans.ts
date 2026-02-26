export type PlanType = "starter" | "pro" | "team";
export type Currency = "INR" | "USD";

export interface PlanPricing {
    INR: number;
    USD: number;
}

export interface PlanLimits {
    name: string;
    pricing: PlanPricing;
    analysesPerMonth: number;
    maxVideoSizeMB: number;
    allowedExercises: string[] | "all";
    features: {
        fullReport: boolean;
        maxHistoryVisible: number | "unlimited";
        sideBySide: boolean;
        teamProfiles: number;
        prioritySupport: boolean;
    };
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    starter: {
        name: "Starter",
        pricing: { INR: 0, USD: 0 },
        analysesPerMonth: 3,
        maxVideoSizeMB: 25,
        allowedExercises: ["squat", "deadlift", "bench-press", "push-up", "plank"],
        features: {
            fullReport: false,
            maxHistoryVisible: 5,
            sideBySide: false,
            teamProfiles: 0,
            prioritySupport: false,
        },
    },
    pro: {
        name: "Pro",
        pricing: { INR: 699, USD: 15 },
        analysesPerMonth: 50,
        maxVideoSizeMB: 100,
        allowedExercises: "all",
        features: {
            fullReport: true,
            maxHistoryVisible: "unlimited",
            sideBySide: true,
            teamProfiles: 0,
            prioritySupport: true,
        },
    },
    team: {
        name: "Team",
        pricing: { INR: 1499, USD: 50 },
        analysesPerMonth: 150,
        maxVideoSizeMB: 100,
        allowedExercises: "all",
        features: {
            fullReport: true,
            maxHistoryVisible: "unlimited",
            sideBySide: true,
            teamProfiles: 20,
            prioritySupport: true,
        },
    },
};

/** Check if an exercise is allowed for a given plan */
export function isExerciseAllowed(plan: PlanType, exerciseId: string): boolean {
    const limits = PLAN_LIMITS[plan];
    if (limits.allowedExercises === "all") return true;
    return limits.allowedExercises.includes(exerciseId);
}

/** Get remaining analyses for a subscription */
export function getRemainingAnalyses(plan: PlanType, used: number): number {
    return Math.max(0, PLAN_LIMITS[plan].analysesPerMonth - used);
}

/** Check if usage period needs resetting (monthly) */
export function shouldResetUsage(periodStart: Date): boolean {
    const now = new Date();
    const monthsSince =
        (now.getFullYear() - periodStart.getFullYear()) * 12 +
        (now.getMonth() - periodStart.getMonth());
    return monthsSince >= 1;
}

/** Format price for display based on currency */
export function formatPrice(plan: PlanType, currency: Currency): string {
    const price = PLAN_LIMITS[plan].pricing[currency];
    if (price === 0) return "Free";
    if (currency === "INR") return `₹${price}`;
    return `$${price}`;
}
