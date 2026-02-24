"use client";

import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
            {/* Background gradient orbs */}
            <div className="pointer-events-none absolute -left-24 top-[10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-24 top-[30%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,transparent_70%)]" />

            <div className="relative mx-auto max-w-4xl text-center">
                {/* Badge */}
                <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 to-sky-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 shadow-[0_2px_8px_rgba(99,102,241,0.2)]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-[9px] font-extrabold text-white">
                        NEW
                    </span>
                    Real-time rep counting + form feedback
                </div>

                {/* Headline */}
                <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl [animation-delay:50ms]">
                    Your personal AI trainer{" "}
                    <span className="relative whitespace-nowrap font-['Outfit'] italic text-indigo-400">
                        that never misses a rep.
                        <svg
                            viewBox="0 0 286 8"
                            preserveAspectRatio="none"
                            className="absolute -bottom-1 left-0 w-full"
                        >
                            <path d="M2 6C60 2 200 1 284 5" stroke="url(#underlineGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#0EA5E9" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                </h1>

                <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg [animation-delay:100ms]">
                    Upload any workout video and get instant, expert-level biomechanical feedback. Fix your form, prevent injuries, hit new PRs.
                </p>

                {/* CTAs */}
                <div className="animate-fade-up mt-8 flex w-full flex-wrap items-center justify-center gap-3.5 [animation-delay:150ms]">
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_28px_rgba(99,102,241,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(99,102,241,0.55)] sm:text-base"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        Analyse My Form – Free
                    </Link>
                    <a
                        href="#demo"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 sm:text-base"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        See it in action
                    </a>
                </div>

                {/* Social proof */}
                <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 [animation-delay:200ms]">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {["from-indigo-500 to-indigo-300", "from-sky-500 to-sky-300", "from-emerald-500 to-emerald-300", "from-amber-500 to-amber-300", "from-rose-500 to-rose-300"].map((grad, i) => (
                                <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-gradient-to-br ${grad} text-[9px] font-extrabold text-white`}>
                                    {["A", "S", "K", "M", "J"][i]}
                                </div>
                            ))}
                        </div>
                        <span className="font-semibold text-zinc-400">
                            <strong className="text-white">50,000+</strong> athletes trust FormAI
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold text-zinc-400">
                            <strong className="text-white">4.9/5</strong> on App Store
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="animate-fade-up mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 [animation-delay:250ms]">
                    {[
                        { value: "50K+", label: "Athletes trained" },
                        { value: "4.9★", label: "App Store rating" },
                        { value: "250+", label: "Exercise types" },
                        { value: "98.2%", label: "AI accuracy" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">{stat.value}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
