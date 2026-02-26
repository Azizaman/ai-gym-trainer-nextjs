"use client";

import { useEffect, useState, useCallback } from "react";
import { Crown, Zap, Users, Check, Loader2, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

type PlanType = "starter" | "pro" | "team";
type Currency = "INR" | "USD";

interface SubscriptionData {
    plan: PlanType;
    planName: string;
    status: string;
    currency: Currency;
    hasActivePaddle: boolean;
    usage: { used: number; limit: number; remaining: number };
    limits: {
        maxVideoSizeMB: number;
        allowedExercises: string[] | "all";
        features: {
            fullReport: boolean;
            maxHistoryVisible: number | "unlimited";
            sideBySide: boolean;
            teamProfiles: number;
            prioritySupport: boolean;
        };
    };
    currentPeriodStart: string;
}

interface PlanCard {
    id: PlanType;
    name: string;
    priceINR: number;
    priceUSD: number;
    period: string;
    icon: typeof Zap;
    color: string;
    borderColor: string;
    bgGlow: string;
    popular?: boolean;
    features: string[];
}

const PLAN_CARDS: PlanCard[] = [
    {
        id: "starter",
        name: "Starter",
        priceINR: 0,
        priceUSD: 0,
        period: "Free forever",
        icon: Zap,
        color: "from-zinc-500 to-zinc-600",
        borderColor: "border-zinc-700",
        bgGlow: "rgba(161,161,170,0.08)",
        features: [
            "3 analyses / month",
            "Basic form score",
            "5 exercise types",
            "25 MB video limit",
            "Last 5 history entries",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        priceINR: 699,
        priceUSD: 15,
        period: "per month",
        icon: Crown,
        color: "from-indigo-500 to-sky-500",
        borderColor: "border-indigo-500/30",
        bgGlow: "rgba(99,102,241,0.12)",
        popular: true,
        features: [
            "50 analyses / month",
            "Full biomechanical report",
            "All exercise types",
            "100 MB video limit",
            "Unlimited history",
            "Side-by-side compare",
            "Priority support",
        ],
    },
    {
        id: "team",
        name: "Team",
        priceINR: 1499,
        priceUSD: 50,
        period: "per month",
        icon: Users,
        color: "from-sky-500 to-cyan-500",
        borderColor: "border-sky-500/30",
        bgGlow: "rgba(14,165,233,0.10)",
        features: [
            "150 analyses / month",
            "Everything in Pro",
            "20 athlete profiles",
            "Coach dashboard",
            "CSV/PDF export",
            "Dedicated manager",
        ],
    },
];

/** Detect if the user is likely from India based on timezone */
function detectCurrency(): Currency {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) {
            return "INR";
        }
        return "USD";
    } catch {
        return "USD";
    }
}

export default function SubscriptionPage() {
    const [sub, setSub] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<PlanType | null>(null);
    const [currency, setCurrency] = useState<Currency>("INR");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [paddle, setPaddle] = useState<Paddle | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const fetchSubscription = useCallback(() => {
        setLoading(true);
        fetch("/api/subscription")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setSub(data.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setCurrency(detectCurrency());
        fetchSubscription();

        // Initialize Paddle
        initializePaddle({
            environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox" ? "sandbox" : "production",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "test_client_token",
            eventCallback: function (data) {
                if (data.name === "checkout.completed") {
                    showToast("Payment successful! Your plan will be activated shortly.", "success");
                    paddle?.Checkout.close();
                    setTimeout(() => fetchSubscription(), 3000);
                }
            }
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, [fetchSubscription, paddle]);

    /** Handle paid plan upgrade via Paddle Checkout */
    const handleUpgrade = async (plan: PlanType) => {
        if (upgrading) return;

        // Downgrade to starter
        if (plan === "starter") {
            setUpgrading(plan);
            try {
                const res = await fetch("/api/subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: "starter" }),
                });
                const data = await res.json();
                if (data.success) {
                    showToast("Successfully downgraded to Starter plan", "success");
                    fetchSubscription();
                } else {
                    showToast(data.error || "Failed to downgrade", "error");
                }
            } catch {
                showToast("Network error. Please try again.", "error");
            } finally {
                setUpgrading(null);
            }
            return;
        }

        if (!paddle) {
            showToast("Payment system is still loading. Please try again in a moment.", "error");
            return;
        }

        // Paid plan — redirect to Paddle checkout via our secure transaction API
        setUpgrading(plan);
        try {
            const res = await fetch("/api/paddle/create-transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, currency }),
            });
            const data = await res.json();

            if (!data.success || !data.data?.transactionId) {
                showToast(data.error || "Failed to initiate payment", "error");
                setUpgrading(null);
                return;
            }

            // Open Paddle Checkout modal
            paddle.Checkout.open({
                transactionId: data.data.transactionId
            });
        } catch {
            showToast("Failed to initiate payment. Please try again.", "error");
        } finally {
            setUpgrading(null);
        }
    };

    if (loading && !sub) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    const usagePercent = sub ? Math.min(100, (sub.usage.used / sub.usage.limit) * 100) : 0;
    const usageColor =
        usagePercent >= 90 ? "bg-rose-500" : usagePercent >= 70 ? "bg-amber-500" : "bg-indigo-500";

    const formatPrice = (card: PlanCard) => {
        if (card.priceINR === 0) return "Free";
        return currency === "INR" ? `₹${card.priceINR}` : `$${card.priceUSD}`;
    };

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl transition-all duration-300 ${toast.type === "success"
                        ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-300 backdrop-blur-lg"
                        : "border border-rose-500/20 bg-rose-500/15 text-rose-300 backdrop-blur-lg"
                        }`}
                >
                    {toast.type === "success" ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">
                        Subscription
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage your plan and track your usage
                    </p>
                </div>

                {/* Currency toggle */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                    {(["INR", "USD"] as Currency[]).map((c) => (
                        <button
                            key={c}
                            onClick={() => setCurrency(c)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${currency === c
                                ? "bg-indigo-500 text-white shadow"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {c === "INR" ? "🇮🇳 INR" : "🇺🇸 USD"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Plan Card */}
            {sub && (
                <div className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="mb-3 flex items-center gap-2.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold text-white">{sub.planName} Plan</h2>
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${sub.status === "active"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : sub.status === "pending"
                                                    ? "bg-amber-500/20 text-amber-400"
                                                    : "bg-rose-500/20 text-rose-400"
                                                }`}
                                        >
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Period started{" "}
                                    {new Date(sub.currentPeriodStart).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            {/* Usage */}
                            <div className="w-full max-w-xs">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-white">Monthly Usage</span>
                                    <span className="text-sm font-bold text-slate-400">
                                        {sub.usage.used} / {sub.usage.limit}
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className={`h-full rounded-full ${usageColor} transition-all duration-500`}
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-slate-500">
                                    {sub.usage.remaining} analyses remaining this month
                                </p>
                            </div>
                        </div>

                        {/* Feature pills */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                `${sub.limits.maxVideoSizeMB} MB videos`,
                                sub.limits.allowedExercises === "all"
                                    ? "All exercises"
                                    : `${(sub.limits.allowedExercises as string[]).length} exercises`,
                                sub.limits.features.fullReport ? "Full reports" : "Basic score",
                                sub.limits.features.prioritySupport ? "Priority support" : "Community support",
                            ].map((feature) => (
                                <span
                                    key={feature}
                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Cards */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-white">
                    {sub?.plan === "starter" ? "Upgrade your plan" : "Available Plans"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">Choose the plan that fits your training needs</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:items-start">
                {PLAN_CARDS.map((card) => {
                    const isCurrent = sub?.plan === card.id;
                    const Icon = card.icon;
                    const isPaid = card.priceINR > 0;
                    const isDowngrade = !isPaid && sub?.plan !== "starter";

                    return (
                        <article
                            key={card.id}
                            className={`relative rounded-2xl p-6 transition duration-200 lg:p-7 ${card.popular
                                ? "bg-gradient-to-br from-indigo-950 to-sky-900 text-white shadow-[0_24px_64px_rgba(99,102,241,0.2)]"
                                : "border border-white/5 bg-white/[0.03]"
                                }`}
                        >
                            {card.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-br from-amber-500 to-red-500 px-4 py-1 text-[11px] font-extrabold tracking-[0.06em] text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                                    ⚡ MOST POPULAR
                                </div>
                            )}

                            {isCurrent && (
                                <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(34,197,94,0.4)]">
                                    CURRENT
                                </div>
                            )}

                            <div className="mb-4 flex items-center gap-2.5">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}
                                >
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-extrabold tracking-[-0.02em] text-white">
                                    {card.name}
                                </span>
                            </div>

                            <div className="mb-1">
                                <span className="text-4xl font-extrabold tracking-[-0.05em] text-white">
                                    {formatPrice(card)}
                                </span>
                                {isPaid && (
                                    <span className={`ml-1 text-sm ${card.popular ? "text-white/55" : "text-slate-500"}`}>
                                        /mo
                                    </span>
                                )}
                            </div>
                            <p className={`mb-5 text-sm ${card.popular ? "text-white/55" : "text-slate-500"}`}>
                                {card.period}
                            </p>

                            {isCurrent ? (
                                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400">
                                    <Check className="h-4 w-4" /> Current Plan
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(card.id)}
                                    disabled={!!upgrading}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50 ${card.popular
                                        ? "bg-gradient-to-br from-indigo-400 to-sky-400 shadow-[0_4px_20px_rgba(129,140,248,0.4)]"
                                        : isDowngrade
                                            ? "bg-zinc-700 hover:bg-zinc-600"
                                            : "bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                                        }`}
                                >
                                    {upgrading === card.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            {isDowngrade ? "Downgrade" : "Upgrade"} <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            )}

                            <div className={`my-5 h-px ${card.popular ? "bg-white/15" : "bg-white/10"}`} />

                            <ul className="flex list-none flex-col gap-2.5">
                                {card.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <div
                                            className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${card.popular ? "bg-white/15" : "bg-white/10"
                                                }`}
                                        >
                                            <Check className={`h-3 w-3 ${card.popular ? "text-white" : "text-slate-400"}`} />
                                        </div>
                                        <span className={`text-sm ${card.popular ? "text-white/80" : "text-slate-400"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
            </div>

            {/* Bottom note */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-slate-500">
                {["🔒 SSL secured", "✅ No contracts", "↩️ 30-day refund", "🌍 Cancel anytime"].map(
                    (item) => (
                        <span key={item}>{item}</span>
                    )
                )}
            </div>

            {/* Paddle branding */}
            <div className="mt-4 text-center text-xs text-slate-600">
                Payments powered by Paddle
            </div>
        </div>
    );
}
