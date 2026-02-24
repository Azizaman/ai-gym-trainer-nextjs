"use client";

import { useRef, useState, type RefObject } from "react";

const FEEDBACK = [
    {
        category: "Posture Alignment",
        score: 87,
        status: "Good",
        rowClass: "border-emerald-200 bg-emerald-50",
        iconClass: "bg-emerald-100 text-emerald-500",
        badgeClass: "bg-emerald-100 text-emerald-600",
        scoreClass: "text-emerald-500",
        barClass: "bg-emerald-500",
        note: "Slight forward lean at peak. Brace core harder on the concentric phase.",
        icon: "◎",
    },
    {
        category: "Range of Motion",
        score: 72,
        status: "Fair",
        rowClass: "border-amber-200 bg-amber-50",
        iconClass: "bg-amber-100 text-amber-500",
        badgeClass: "bg-amber-100 text-amber-600",
        scoreClass: "text-amber-500",
        barClass: "bg-amber-500",
        note: "Depth is short of parallel. Add hip flexor mobility to your warm-up.",
        icon: "◈",
    },
    {
        category: "Tempo Control",
        score: 91,
        status: "Elite",
        rowClass: "border-indigo-200 bg-indigo-50",
        iconClass: "bg-indigo-100 text-indigo-500",
        badgeClass: "bg-indigo-100 text-indigo-600",
        scoreClass: "text-indigo-500",
        barClass: "bg-indigo-500",
        note: "Excellent eccentric control. Maintain this 3-1-1 cadence every set.",
        icon: "⏱",
    },
    {
        category: "Bar Path",
        score: 64,
        status: "Fix",
        rowClass: "border-rose-200 bg-rose-50",
        iconClass: "bg-rose-100 text-rose-500",
        badgeClass: "bg-rose-100 text-rose-600",
        scoreClass: "text-rose-500",
        barClass: "bg-rose-500",
        note: "Bar drifts 5 cm forward on ascent. Stack it directly over mid-foot.",
        icon: "⬆",
    },
] as const;

type UploadState = "idle" | "dragging" | "uploading" | "analyzing" | "done";

type UploadDemoProps = {
    uploadRef: RefObject<HTMLDivElement | null>;
};

export function UploadDemo({ uploadRef }: UploadDemoProps) {
    const [state, setState] = useState<UploadState>("idle");
    const [file, setFile] = useState("");
    const [progress, setProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);

    const analysisSteps = [
        "Detecting body keypoints...",
        "Measuring joint angles...",
        "Scoring movement patterns...",
        "Generating drill recommendations...",
    ];

    const simulate = (name: string) => {
        setFile(name);
        setState("uploading");
        let p = 0;

        const iv = setInterval(() => {
            p += Math.random() * 14 + 3;
            if (p >= 100) {
                p = 100;
                clearInterval(iv);
                setState("analyzing");
                animateAnalysis();
            }
            setProgress(Math.min(p, 100));
        }, 160);
    };

    const animateAnalysis = () => {
        let step = 0;
        const iv = setInterval(() => {
            setAnalysisStep(step++);
            if (step >= analysisSteps.length) {
                clearInterval(iv);
                setTimeout(() => setState("done"), 500);
            }
        }, 500);
    };

    const totalScore = Math.round(FEEDBACK.reduce((sum, item) => sum + item.score, 0) / FEEDBACK.length);

    return (
        <section ref={uploadRef} className="bg-white px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-12 text-center sm:mb-14">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        TRY IT FREE
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-slate-900 sm:text-4xl lg:text-5xl">
                        See it work on your video
                    </h2>
                    <p className="mt-4 text-base leading-7 text-slate-500 sm:text-[17px]">No account needed. First 3 analyses are completely free.</p>
                </div>

                {(state === "idle" || state === "dragging") && (
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setState("dragging");
                        }}
                        onDragLeave={() => setState("idle")}
                        onDrop={(e) => {
                            e.preventDefault();
                            setState("idle");
                            const pickedFile = e.dataTransfer.files[0];
                            if (pickedFile) {
                                simulate(pickedFile.name);
                            }
                        }}
                        onClick={() => fileRef.current?.click()}
                        className={`relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed px-5 py-14 text-center transition sm:px-8 sm:py-16 ${state === "dragging"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-slate-200 bg-[#FAFBFF] hover:border-indigo-300 hover:bg-indigo-50/40"
                            }`}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                                const pickedFile = e.target.files?.[0];
                                if (pickedFile) {
                                    simulate(pickedFile.name);
                                }
                            }}
                        />

                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-indigo-400/10" />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-indigo-400/10 [animation-delay:1s]" />

                        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-sky-100 sm:h-[72px] sm:w-[72px]">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round">
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                        </div>

                        <p className="relative mb-2 text-xl font-bold text-slate-900">
                            {state === "dragging" ? "Drop it!" : "Drop your workout video"}
                        </p>
                        <p className="relative text-sm text-slate-400">
                            or <span className="font-semibold text-indigo-500">click to browse</span> - MP4, MOV, AVI - up to 500 MB
                        </p>

                        <div className="relative mt-7 flex flex-wrap justify-center gap-2">
                            {["Squat", "Deadlift", "Bench Press", "Clean & Jerk", "Running", "Pull-ups", "Snatch", "+243 more"].map((exercise) => (
                                <span key={exercise} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                    {exercise}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {state === "uploading" && (
                    <div className="rounded-3xl border border-slate-200 bg-[#FAFBFF] px-6 py-12 text-center sm:px-10 sm:py-14">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-100 sm:h-[72px] sm:w-[72px]">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round">
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                        </div>
                        <p className="mb-2 text-xs text-slate-400 sm:text-sm">{file}</p>
                        <p className="mb-6 text-5xl font-extrabold leading-none tracking-[-0.04em] text-slate-900 sm:text-[52px]">{Math.round(progress)}%</p>
                        <div className="mx-auto max-w-md">
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-150"
                                />
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-300 sm:text-sm">Uploading securely...</p>
                    </div>
                )}

                {state === "analyzing" && (
                    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-100 px-6 py-12 text-center sm:px-10 sm:py-14">
                        <div className="mx-auto mb-6 h-[72px] w-[72px] animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-500" />
                        <p className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">AI is analysing your movement...</p>
                        <p className="text-sm font-semibold text-indigo-500 sm:text-base">{analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}</p>

                        <div className="mt-6 flex justify-center gap-1.5">
                            {analysisSteps.map((_, i) => (
                                <div
                                    key={`step-${i}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${i <= analysisStep ? "w-6 bg-indigo-500" : "w-2 bg-indigo-100"}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {state === "done" && (
                    <div className="animate-fade-up overflow-hidden rounded-3xl border border-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.1)]">
                        <div className="relative flex flex-col gap-6 bg-gradient-to-br from-indigo-950 to-sky-900 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25),transparent)]" />
                            <div className="pointer-events-none absolute -bottom-10 left-[30%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.15),transparent)]" />

                            <div className="relative">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#4ADE80]" />
                                    <span className="text-[11px] font-semibold tracking-[0.1em] text-white/50">ANALYSIS COMPLETE</span>
                                </div>
                                <p className="text-xl font-bold text-white">{file}</p>
                                <p className="mt-0.5 text-xs text-white/40">4 metrics analysed - Just now</p>
                            </div>

                            <div className="relative text-center">
                                <div className="relative inline-block">
                                    <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="url(#scoreGrad)"
                                            strokeWidth="8"
                                            strokeDasharray={`${totalScore * 2.64} 264`}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#818CF8" />
                                                <stop offset="100%" stopColor="#38BDF8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                        <p className="text-2xl font-extrabold leading-none tracking-[-0.04em] text-white">{totalScore}</p>
                                        <p className="text-[9px] font-bold tracking-[0.08em] text-white/40">/100</p>
                                    </div>
                                </div>
                                <p className="mt-1 text-[11px] font-semibold tracking-[0.08em] text-white/40">FORM SCORE</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 bg-white px-4 py-6 sm:px-6 lg:px-10 lg:py-7">
                            {FEEDBACK.map((item) => (
                                <div
                                    key={item.category}
                                    className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:gap-4 sm:px-5 ${item.rowClass}`}
                                >
                                    <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-lg font-bold ${item.iconClass}`}>
                                        {item.icon}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-sm font-bold text-slate-900 sm:text-[15px]">{item.category}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.badgeClass}`}>{item.status}</span>
                                                <span className={`text-xl font-extrabold tracking-[-0.03em] ${item.scoreClass}`}>{item.score}</span>
                                            </div>
                                        </div>

                                        <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-black/5">
                                            <div style={{ width: `${item.score}%` }} className={`h-full rounded-full ${item.barClass}`} />
                                        </div>
                                        <p className="text-sm leading-6 text-slate-600">{item.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
                            <button
                                onClick={() => {
                                    setState("idle");
                                    setProgress(0);
                                    setFile("");
                                    setAnalysisStep(0);
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-400 sm:w-auto"
                            >
                                ← Analyse Another
                            </button>
                            <button className="w-full rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.45)] sm:w-auto">
                                Save Report & Sign Up →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
