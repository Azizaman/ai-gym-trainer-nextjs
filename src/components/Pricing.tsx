"use client";

import { useState } from "react";

type Plan = {
    name: string;
    price: number;
    period: string;
    features: string[];
    dotClass: string;
    iconBgClass: string;
    checkClass: string;
    popular?: boolean;
};

const PLANS: Plan[] = [
    {
        name: "Starter",
        price: 0,
        period: "Free forever",
        features: ["3 analyses / month", "Basic form score", "5 exercise types", "Community support"],
        dotClass: "bg-zinc-400",
        iconBgClass: "bg-zinc-800",
        checkClass: "stroke-zinc-400",
    },
    {
        name: "Pro",
        price: 19,
        period: "per month",
        features: [
            "Unlimited analyses",
            "Full biomechanical report",
            "250+ exercises",
            "Progress history",
            "Side-by-side compare",
            "Priority support",
        ],
        dotClass: "bg-indigo-500",
        iconBgClass: "bg-indigo-500/15",
        checkClass: "stroke-indigo-400",
        popular: true,
    },
    {
        name: "Team",
        price: 79,
        period: "per month",
        features: ["Everything in Pro", "20 athlete profiles", "Coach dashboard", "Custom branding", "CSV/PDF export", "Dedicated manager"],
        dotClass: "bg-sky-500",
        iconBgClass: "bg-sky-500/15",
        checkClass: "stroke-sky-400",
    },
];

export function Pricing() {
    const [annual, setAnnual] = useState(false);

    return (
        <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-12 text-center sm:mb-14">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        PRICING
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                        Simple, honest pricing
                    </h2>
                    <p className="mt-3 text-base text-zinc-400">Start free. Upgrade when you&apos;re ready.</p>

                    <div className="mt-6 inline-flex items-center gap-1 rounded-xl bg-zinc-800/80 p-1">
                        {["Monthly", "Annual"].map((label, index) => {
                            const selected = annual === (index === 1);
                            return (
                                <button
                                    key={label}
                                    onClick={() => setAnnual(index === 1)}
                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition sm:px-5 ${selected ? "bg-zinc-700 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : "text-zinc-500"
                                        }`}
                                >
                                    {label}
                                    {index === 1 ? (
                                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-extrabold text-emerald-400">-20%</span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:items-center">
                    {PLANS.map((plan, i) => {
                        const price = annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
                        const cta = i === 0 ? "Get started free" : i === 1 ? "Start 14-day free trial" : "Contact sales";

                        return (
                            <article
                                key={plan.name}
                                className={`relative rounded-3xl p-8 transition duration-200 lg:p-9 ${plan.popular
                                    ? "bg-gradient-to-br from-indigo-950 to-sky-900 text-white shadow-[0_24px_64px_rgba(99,102,241,0.3)] xl:scale-[1.03]"
                                    : "border border-white/10 bg-zinc-900/60 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
                                    }`}
                            >
                                {plan.popular ? (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-br from-amber-500 to-red-500 px-4 py-1 text-[11px] font-extrabold tracking-[0.06em] text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                                        ⚡ MOST POPULAR
                                    </div>
                                ) : null}

                                <div className="mb-5 flex items-center gap-2.5">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${plan.popular ? "bg-white/15" : plan.iconBgClass}`}>
                                        <div className={`h-4 w-4 rounded-full ${plan.dotClass}`} />
                                    </div>
                                    <span className="text-lg font-extrabold tracking-[-0.02em] text-white">
                                        {plan.name}
                                    </span>
                                </div>

                                <div className="mb-1">
                                    <span className="text-5xl font-extrabold tracking-[-0.05em] leading-none text-white">
                                        {price === 0 ? "Free" : `$${price}`}
                                    </span>
                                    {price > 0 ? (
                                        <span className={`ml-1 text-sm ${plan.popular ? "text-white/55" : "text-zinc-500"}`}>/mo</span>
                                    ) : null}
                                </div>
                                <p className={`mb-7 text-sm ${plan.popular ? "text-white/55" : "text-zinc-500"}`}>{plan.period}</p>

                                <button
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 ${plan.popular
                                        ? "bg-gradient-to-br from-indigo-400 to-sky-400 shadow-[0_4px_20px_rgba(129,140,248,0.4)]"
                                        : "bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                                        }`}
                                >
                                    {cta}
                                </button>

                                <div className={`my-7 h-px ${plan.popular ? "bg-white/15" : "bg-white/10"}`} />

                                <ul className="flex list-none flex-col gap-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5">
                                            <div className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${plan.popular ? "bg-white/15" : plan.iconBgClass}`}>
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                    <path
                                                        d="M2 5L4 7L8 3"
                                                        className={plan.popular ? "stroke-white" : plan.checkClass}
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <span className={`text-sm leading-6 ${plan.popular ? "text-white/80" : "text-zinc-400"}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-zinc-500">
                    {["🔒 SSL secured", "✅ No contracts", "↩️ 30-day refund", "🌍 Cancel anytime"].map((item) => (
                        <span key={item}>{item}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}
