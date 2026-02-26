"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Video, Activity, TrendingUp, Clock, ArrowRight, Crown } from "lucide-react";

interface AnalysisSummary {
    id: string;
    exerciseType: string;
    exerciseDetected: string;
    score: number;
    createdAt: string;
}

interface SubInfo {
    plan: string;
    planName: string;
    usage: { used: number; limit: number; remaining: number };
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [recentAnalyses, setRecentAnalyses] = useState<AnalysisSummary[]>([]);
    const [stats, setStats] = useState({ total: 0, avgScore: 0 });
    const [sub, setSub] = useState<SubInfo | null>(null);
    const [thisWeekCount, setThisWeekCount] = useState(0);

    useEffect(() => {
        fetch("/api/analyses")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setRecentAnalyses(data.data.slice(0, 5));
                    const total = data.data.length;
                    const avgScore =
                        total > 0
                            ? Math.round(data.data.reduce((sum: number, a: AnalysisSummary) => sum + a.score, 0) / total)
                            : 0;
                    setStats({ total, avgScore });
                    const now = Date.now();
                    setThisWeekCount(
                        data.data.filter((a: AnalysisSummary) => new Date(a.createdAt).getTime() > now - 7 * 86400000).length
                    );
                }
            })
            .catch(() => { });

        fetch("/api/subscription")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setSub(data.data);
            })
            .catch(() => { });
    }, []);

    const firstName = session?.user?.name?.split(" ")[0] || "there";

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">
                    Welcome back, {firstName} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Here&apos;s an overview of your training analytics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {[
                    {
                        label: "Total Analyses",
                        value: stats.total,
                        icon: Activity,
                        color: "from-indigo-500 to-indigo-600",
                        glow: "rgba(99,102,241,0.15)",
                    },
                    {
                        label: "Avg. Form Score",
                        value: stats.avgScore || "—",
                        icon: TrendingUp,
                        color: "from-emerald-500 to-emerald-600",
                        glow: "rgba(34,197,94,0.15)",
                    },
                    {
                        label: "This Week",
                        value: thisWeekCount,
                        icon: Clock,
                        color: "from-sky-500 to-sky-600",
                        glow: "rgba(14,165,233,0.15)",
                    },
                    {
                        label: "Plan / Usage",
                        value: sub ? `${sub.usage.remaining}/${sub.usage.limit}` : "—",
                        icon: Crown,
                        color: "from-purple-500 to-purple-600",
                        glow: "rgba(168,85,247,0.15)",
                        sublabel: sub ? `${sub.planName} plan` : undefined,
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5"
                    >
                        <div
                            className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full"
                            style={{ background: `radial-gradient(circle, ${stat.glow}, transparent)` }}
                        />
                        <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${stat.color} p-2.5`}>
                            <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-2xl font-extrabold tracking-[-0.03em] text-white">{stat.value}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
                        {(stat as { sublabel?: string }).sublabel && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">{(stat as { sublabel?: string }).sublabel}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid gap-4 lg:grid-cols-2">
                {/* Analyze CTA */}
                <Link
                    href="/dashboard/analyze"
                    className="group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-sky-500/5 p-6 transition hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]"
                >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent)]" />
                    <div className="relative">
                        <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-3 shadow-[0_4px_16px_rgba(99,102,241,0.3)]">
                            <Video className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white">Analyze a New Video</h3>
                        <p className="mb-4 text-sm text-slate-400">
                            Upload your workout video and get instant AI-powered form feedback
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition group-hover:gap-2.5">
                            Start Analysis <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </Link>

                {/* Subscription / Upgrade CTA */}
                <Link
                    href={sub?.plan === "starter" ? "/dashboard/subscription" : "/dashboard/history"}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1),transparent)]" />
                    <div className="relative">
                        <div className="mb-4 inline-flex rounded-2xl bg-slate-800 p-3">
                            {sub?.plan === "starter" ? <Crown className="h-6 w-6 text-amber-400" /> : <Clock className="h-6 w-6 text-slate-300" />}
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white">
                            {sub?.plan === "starter" ? "Upgrade Your Plan" : "View Analysis History"}
                        </h3>
                        <p className="mb-4 text-sm text-slate-400">
                            {sub?.plan === "starter"
                                ? "Unlock unlimited analyses, all exercises, and full reports"
                                : "Review your past analyses and track your form improvement"}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition group-hover:gap-2.5 group-hover:text-white">
                            {sub?.plan === "starter" ? "View Plans" : "View History"} <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </Link>
            </div>

            {/* Recent Analyses */}
            {recentAnalyses.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
                        <Link href="/dashboard/history" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                            View all →
                        </Link>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                        {recentAnalyses.map((analysis, i) => (
                            <div
                                key={analysis.id}
                                className={`flex items-center justify-between px-5 py-4 ${i < recentAnalyses.length - 1 ? "border-b border-white/5" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-sky-500/10">
                                        <Activity className="h-4 w-4 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold capitalize text-white">{analysis.exerciseDetected || analysis.exerciseType.replace("-", " ")}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-lg font-extrabold ${analysis.score >= 80
                                            ? "text-emerald-400"
                                            : analysis.score >= 60
                                                ? "text-amber-400"
                                                : "text-rose-400"
                                            }`}
                                    >
                                        {analysis.score}
                                    </span>
                                    <span className="text-xs text-slate-500">/100</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recentAnalyses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center sm:p-12">
                    <Video className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <h3 className="mb-2 text-lg font-bold text-white">No analyses yet</h3>
                    <p className="mb-6 text-sm text-slate-400">
                        Upload your first workout video to get AI-powered form feedback
                    </p>
                    <Link
                        href="/dashboard/analyze"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5"
                    >
                        <Video className="h-4 w-4" /> Analyze Your First Video
                    </Link>
                </div>
            )}
        </div>
    );
}
