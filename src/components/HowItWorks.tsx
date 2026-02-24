const STEPS = [
    { n: "01", icon: "📹", title: "Record your set", desc: "Film any exercise on your phone. Any angle, any lighting.", color: "bg-indigo-500 shadow-[0_8px_24px_rgba(99,102,241,0.35)]" },
    { n: "02", icon: "⬆️", title: "Upload the clip", desc: "Drag & drop or browse. MP4, MOV, AVI up to 500 MB.", color: "bg-sky-500 shadow-[0_8px_24px_rgba(14,165,233,0.35)]" },
    { n: "03", icon: "🤖", title: "AI maps your body", desc: "33 keypoints tracked frame-by-frame using pose estimation.", color: "bg-violet-500 shadow-[0_8px_24px_rgba(139,92,246,0.35)]" },
    { n: "04", icon: "📊", title: "Get your report", desc: "Scores, corrections, and curated drills - in 30 seconds.", color: "bg-emerald-500 shadow-[0_8px_24px_rgba(34,197,94,0.35)]" },
];

export function HowItWorks() {
    return (
        <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-14 text-center sm:mb-16 lg:mb-18">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        HOW IT WORKS
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                        From upload to insight
                        <br />
                        in under 30 seconds
                    </h2>
                </div>

                <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 rounded bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-40 lg:block" />

                    {STEPS.map((step) => (
                        <article key={step.n} className="relative z-10 flex flex-col items-center px-2 text-center lg:px-5">
                            <div className={`mb-7 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-zinc-900 text-2xl ${step.color}`}>
                                {step.icon}
                            </div>
                            <p className="mb-2 text-xs font-bold tracking-[0.1em] text-zinc-600">STEP {step.n}</p>
                            <h3 className="mb-2.5 text-base font-bold tracking-[-0.02em] text-white sm:text-[17px]">{step.title}</h3>
                            <p className="text-sm leading-7 text-zinc-400">{step.desc}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
