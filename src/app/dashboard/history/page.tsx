"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Video, TrendingUp } from "lucide-react";

interface Analysis {
    id: string;
    exerciseType: string;
    fitnessLevel: string;
    score: number;
    isFormCorrect: boolean;
    exerciseDetected: string;
    summary: string;
    createdAt: string;
}

export default function HistoryPage() {
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    useEffect(() => {
        fetch("/api/analyses")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setAnalyses(data.data || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const scoreColor = (score: number) =>
        score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400";

    const scoreBg = (score: number) =>
        score >= 80 ? "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20" : score >= 60 ? "from-amber-500/15 to-amber-500/5 border-amber-500/20" : "from-rose-500/15 to-rose-500/5 border-rose-500/20";

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 flex items-center gap-3">
                <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white">Analysis History</h1>
                    <p className="text-sm text-slate-400">Review your past form analyses</p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
                </div>
            )}

            {!loading && analyses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                    <TrendingUp className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <h3 className="mb-2 text-lg font-bold text-white">No analyses yet</h3>
                    <p className="mb-6 text-sm text-slate-400">
                        Your analysis history will appear here after your first video analysis
                    </p>
                    <Link
                        href="/dashboard/analyze"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5"
                    >
                        <Video className="h-4 w-4" /> Analyze Your First Video
                    </Link>
                </div>
            )}

            {!loading && analyses.length > 0 && (
                <div className="space-y-4">
                    {analyses.map((analysis) => (
                        <div
                            key={analysis.id}
                            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-r p-5 cursor-pointer transition-all hover:border-indigo-500/50 ${scoreBg(analysis.score)}`}
                            onClick={() => toggleExpand(analysis.id)}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                                        <Activity className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold capitalize text-white">
                                            {analysis.exerciseDetected || analysis.exerciseType.replace("-", " ")}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                            <span className="capitalize">{analysis.fitnessLevel}</span>
                                            <span>·</span>
                                            <span>
                                                {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className={`text-3xl font-extrabold tracking-[-0.03em] ${scoreColor(analysis.score)}`}>
                                            {analysis.score}
                                        </span>
                                        <span className="text-sm text-slate-500">/100</span>
                                    </div>
                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${analysis.isFormCorrect
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-amber-500/20 text-amber-400"
                                            }`}
                                    >
                                        {analysis.isFormCorrect ? "Good Form" : "Needs Work"}
                                    </div>
                                </div>
                            </div>

                            {analysis.summary && (
                                <div className="mt-4">
                                    <p className={`text-sm leading-6 text-slate-300 ${expandedIds.has(analysis.id) ? "" : "line-clamp-2"}`}>
                                        {analysis.summary}
                                    </p>
                                    <p className="mt-2 text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                        {expandedIds.has(analysis.id) ? "Show less" : "Show more"}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
