"use client";

import { useRef, useState } from "react";
import { Upload, Video, Loader2, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { ExerciseFeedback } from "@/types";

const EXERCISES = [
    { id: "squat", name: "Squat" },
    { id: "deadlift", name: "Deadlift" },
    { id: "bench-press", name: "Bench Press" },
    { id: "overhead-press", name: "Overhead Press" },
    { id: "pull-up", name: "Pull-Up" },
    { id: "push-up", name: "Push-Up" },
    { id: "lunge", name: "Lunge" },
    { id: "romanian-deadlift", name: "Romanian Deadlift" },
    { id: "hip-thrust", name: "Hip Thrust" },
    { id: "plank", name: "Plank" },
    { id: "burpee", name: "Burpee" },
    { id: "kettlebell-swing", name: "Kettlebell Swing" },
];

const FITNESS_LEVELS = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

type AnalyzeState = "select" | "uploading" | "analyzing" | "done" | "error";

export default function AnalyzePage() {
    const [state, setState] = useState<AnalyzeState>("select");
    const [exerciseType, setExerciseType] = useState("squat");
    const [fitnessLevel, setFitnessLevel] = useState("intermediate");
    const [file, setFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setState("uploading");
        setError("");

        try {
            const formData = new FormData();
            formData.append("video", file);
            formData.append("exerciseType", exerciseType);
            formData.append("fitnessLevel", fitnessLevel);

            setState("analyzing");

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Analysis failed");
            }

            setFeedback(data.data);
            setState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setState("error");
        }
    };

    const reset = () => {
        setState("select");
        setFile(null);
        setFeedback(null);
        setError("");
    };

    const scoreColor = (score: number) =>
        score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400";

    const scoreBg = (score: number) =>
        score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500";

    const severityColor = (severity: string) =>
        severity === "critical" ? "border-rose-500/30 bg-rose-500/10" : severity === "moderate" ? "border-amber-500/30 bg-amber-500/10" : "border-sky-500/30 bg-sky-500/10";

    const severityBadge = (severity: string) =>
        severity === "critical" ? "bg-rose-500/20 text-rose-400" : severity === "moderate" ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400";

    return (
        <div className="px-8 py-8">
            <div className="mb-6 flex items-center gap-3">
                <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white">Analyze Video</h1>
                    <p className="text-sm text-slate-400">Upload a workout video for AI-powered form analysis</p>
                </div>
            </div>

            {/* Select state */}
            {state === "select" && (
                <div className="mx-auto max-w-3xl space-y-6">
                    {/* Exercise Selection */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-bold text-white">Exercise Type</h3>
                        <div className="flex flex-wrap gap-2">
                            {EXERCISES.map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => setExerciseType(ex.id)}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${exerciseType === ex.id
                                            ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                                            : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    {ex.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fitness Level */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="mb-4 text-sm font-bold text-white">Fitness Level</h3>
                        <div className="flex gap-2">
                            {FITNESS_LEVELS.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setFitnessLevel(level.id)}
                                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${fitnessLevel === level.id
                                            ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                                            : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${file ? "border-indigo-500/30 bg-indigo-500/5" : "border-white/10 bg-white/[0.02] hover:border-indigo-500/20 hover:bg-white/[0.03]"
                            }`}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileSelect(f);
                            }}
                        />
                        {file ? (
                            <div>
                                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-indigo-400" />
                                <p className="mb-1 text-base font-bold text-white">{file.name}</p>
                                <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                <p className="mt-3 text-xs text-slate-500">Click to change file</p>
                            </div>
                        ) : (
                            <div>
                                <Upload className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                                <p className="mb-1 text-base font-bold text-white">Drop your workout video</p>
                                <p className="text-sm text-slate-400">
                                    or <span className="font-semibold text-indigo-400">click to browse</span> — MP4, MOV, AVI, WebM
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleAnalyze}
                        disabled={!file}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 py-4 text-base font-bold text-white shadow-[0_8px_28px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                        <Video className="h-5 w-5" /> Analyze My Form
                    </button>
                </div>
            )}

            {/* Uploading / Analyzing */}
            {(state === "uploading" || state === "analyzing") && (
                <div className="mx-auto max-w-lg rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-sky-500/5 p-12 text-center">
                    <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-indigo-400" />
                    <h2 className="mb-2 text-xl font-bold text-white">
                        {state === "uploading" ? "Uploading video..." : "AI is analyzing your form..."}
                    </h2>
                    <p className="text-sm text-slate-400">
                        {state === "uploading"
                            ? "Securely uploading to our servers"
                            : "Detecting keypoints, measuring angles, scoring movement patterns..."}
                    </p>
                </div>
            )}

            {/* Error */}
            {state === "error" && (
                <div className="mx-auto max-w-lg rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-rose-400" />
                    <h2 className="mb-2 text-xl font-bold text-white">Analysis Failed</h2>
                    <p className="mb-6 text-sm text-slate-400">{error}</p>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                        <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                </div>
            )}

            {/* Results */}
            {state === "done" && feedback && (
                <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
                    {/* Score Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 to-sky-900 p-8">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2),transparent)]" />
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#4ADE80]" />
                                    <span className="text-[11px] font-semibold tracking-[0.1em] text-white/50">ANALYSIS COMPLETE</span>
                                </div>
                                <h2 className="text-2xl font-bold capitalize text-white">{feedback.exerciseDetected || exerciseType.replace("-", " ")}</h2>
                                <p className="mt-1 text-sm text-white/40">
                                    {feedback.repCount ? `${feedback.repCount} reps detected` : "Reps: N/A"} · Just now
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="relative inline-flex">
                                    <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeDasharray={`${feedback.score * 3.14} 314`} strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#38BDF8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-extrabold ${scoreColor(feedback.score)}`}>{feedback.score}</span>
                                        <span className="text-[10px] font-bold text-white/40">/100</span>
                                    </div>
                                </div>
                                <p className="mt-1 text-[11px] font-semibold tracking-[0.08em] text-white/40">FORM SCORE</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="mb-3 text-sm font-bold text-white">Summary</h3>
                        <p className="text-sm leading-7 text-slate-300">{feedback.summary}</p>
                    </div>

                    {/* Good Points */}
                    {feedback.goodPoints.length > 0 && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> What You&apos;re Doing Well
                            </h3>
                            <ul className="space-y-2">
                                {feedback.goodPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Issues */}
                    {feedback.issues.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white">Issues Found</h3>
                            {feedback.issues.map((issue, i) => (
                                <div key={i} className={`rounded-xl border p-4 ${severityColor(issue.severity)}`}>
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${severityBadge(issue.severity)}`}>
                                            {issue.severity}
                                        </span>
                                        <span className="text-sm font-semibold text-white">{issue.body_part}</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{issue.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Corrections */}
                    {feedback.corrections.length > 0 && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                            <h3 className="mb-3 text-sm font-bold text-white">🎯 Corrections</h3>
                            <ul className="space-y-2">
                                {feedback.corrections.map((c, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-indigo-500" />
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Safety Warnings */}
                    {feedback.safetyWarnings.length > 0 && (
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-400">
                                <AlertTriangle className="h-4 w-4" /> Safety Warnings
                            </h3>
                            <ul className="space-y-2">
                                {feedback.safetyWarnings.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-rose-500" />
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommended Drills */}
                    {feedback.recommendedDrills.length > 0 && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                            <h3 className="mb-3 text-sm font-bold text-white">💪 Recommended Drills</h3>
                            <div className="flex flex-wrap gap-2">
                                {feedback.recommendedDrills.map((drill, i) => (
                                    <span key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
                                        {drill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                        <button
                            onClick={reset}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                        >
                            <RefreshCw className="h-4 w-4" /> Analyze Another
                        </button>
                        <Link
                            href="/dashboard/history"
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5"
                        >
                            View History
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
