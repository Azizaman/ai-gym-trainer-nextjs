const FEATURES = [
    {
        icon: "🦾",
        title: "33-Point Skeleton Tracking",
        desc: "Frame-by-frame pose estimation catches subtle deviations in joint angles and bar path invisible to the naked eye.",
        tag: "Computer Vision",
    },
    {
        icon: "⚡",
        title: "Results in 30 Seconds",
        desc: "No waiting. Upload, AI processes your clip end-to-end, and your scored report lands instantly.",
        tag: "Real-time AI",
    },
    {
        icon: "📈",
        title: "Weekly Progress Graphs",
        desc: "Track form score trends over time. Side-by-side overlays prove your technique is genuinely improving.",
        tag: "Analytics",
    },
    {
        icon: "🎯",
        title: "Drill Recommendations",
        desc: "Every weak point is matched to curated corrective exercises from certified coaches and sports scientists.",
        tag: "Smart Coaching",
    },
    {
        icon: "🏋️",
        title: "250+ Exercises",
        desc: "Squats, deadlifts, Olympic lifts, running gait, yoga - our model covers virtually every training discipline.",
        tag: "Exercise Library",
    },
    {
        icon: "📱",
        title: "Any Device, Any Camera",
        desc: "iPhone, Android, GoPro, webcam - fully browser-based. No app download ever required.",
        tag: "Cross-Platform",
    },
];

export function Features() {
    return (
        <section className="bg-gradient-to-b from-zinc-900/50 to-zinc-950 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-14 text-center sm:mb-16 lg:mb-18">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        FEATURES
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                        Everything a world-class
                        <br />
                        coach would catch
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-400 sm:text-[17px]">
                        FormAI merges computer vision, biomechanics research, and coaching expertise.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature) => (
                        <article
                            key={feature.title}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-7 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] sm:p-8"
                        >
                            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-[80px] bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent)]" />
                            <div className="mb-4 text-3xl">{feature.icon}</div>
                            <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-indigo-400">
                                {feature.tag}
                            </span>
                            <h3 className="my-3 text-lg font-bold tracking-[-0.02em] text-white">{feature.title}</h3>
                            <p className="text-sm leading-7 text-zinc-400">{feature.desc}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
