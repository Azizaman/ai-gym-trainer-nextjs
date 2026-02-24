import Link from "next/link";

export function DemoPreview() {
    const metrics = [
        { category: "Posture Alignment", score: 87, status: "Good", barColor: "bg-emerald-500", badgeColor: "bg-emerald-500/15 text-emerald-400" },
        { category: "Range of Motion", score: 72, status: "Fair", barColor: "bg-amber-500", badgeColor: "bg-amber-500/15 text-amber-400" },
        { category: "Tempo Control", score: 91, status: "Elite", barColor: "bg-indigo-500", badgeColor: "bg-indigo-500/15 text-indigo-400" },
        { category: "Bar Path", score: 64, status: "Fix", barColor: "bg-rose-500", badgeColor: "bg-rose-500/15 text-rose-400" },
    ];

    const totalScore = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);

    return (
        <section id="demo" className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-12 text-center sm:mb-14">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        SEE IT IN ACTION
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                        What your report looks like
                    </h2>
                    <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-[17px]">
                        Every analysis gives you a detailed breakdown of your form across key metrics
                    </p>
                </div>

                {/* Demo Card */}
                <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
                    {/* Header */}
                    <div className="relative flex flex-col gap-6 bg-gradient-to-br from-indigo-950 to-sky-900 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25),transparent)]" />
                        <div className="relative">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#4ADE80]" />
                                <span className="text-[11px] font-semibold tracking-[0.1em] text-white/50">SAMPLE ANALYSIS</span>
                            </div>
                            <p className="text-xl font-bold text-white">Barbell Back Squat</p>
                            <p className="mt-0.5 text-xs text-white/40">4 metrics analysed · Demo report</p>
                        </div>
                        <div className="relative text-center">
                            <div className="relative inline-block">
                                <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#demoScoreGrad)" strokeWidth="8" strokeDasharray={`${totalScore * 2.64} 264`} strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="demoScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#38BDF8" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-2xl font-extrabold leading-none tracking-[-0.04em] text-white">{totalScore}</p>
                                    <p className="text-[9px] font-bold tracking-[0.08em] text-white/40">/100</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-col gap-4 bg-zinc-900/80 px-4 py-6 sm:px-6 lg:px-10 lg:py-7">
                        {metrics.map((item) => (
                            <div key={item.category} className="rounded-xl border border-white/10 bg-zinc-800/60 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-bold text-white">{item.category}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.badgeColor}`}>{item.status}</span>
                                        <span className="text-lg font-extrabold text-white">{item.score}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-700">
                                    <div style={{ width: `${item.score}%` }} className={`h-full rounded-full ${item.barColor}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center border-t border-white/10 bg-zinc-900/60 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
                        <Link
                            href="/signup"
                            className="rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5"
                        >
                            Try It Free — Get Your Own Report →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
