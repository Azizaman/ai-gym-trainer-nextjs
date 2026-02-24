const TESTIMONIALS = [
    {
        name: "Marcus T.",
        role: "Powerlifter - 3x National Champion",
        text: "Fixed my squat depth issue in two sessions. My coach was genuinely shocked.",
        init: "MT",
        avatarClass: "from-indigo-500 to-indigo-300",
    },
    {
        name: "Sarah K.",
        role: "CrossFit Coach - CF-L2 Trainer",
        text: "I run every client video through FormAI now. The bar path analysis alone pays for itself.",
        init: "SK",
        avatarClass: "from-sky-500 to-sky-300",
    },
    {
        name: "James L.",
        role: "Personal Trainer - 200+ clients",
        text: "Saves me 30 min per client review. The AI catches things even I miss on first watch.",
        init: "JL",
        avatarClass: "from-emerald-500 to-emerald-300",
    },
];

export function Testimonials() {
    return (
        <section className="bg-zinc-900/40 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-12 text-center sm:mb-14 lg:mb-16">
                    <span className="bg-gradient-to-br from-indigo-500 to-sky-500 bg-clip-text text-xs font-bold tracking-[0.1em] text-transparent sm:text-[13px]">
                        TESTIMONIALS
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                        What athletes are saying
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {TESTIMONIALS.map((testimonial) => (
                        <article
                            key={testimonial.name}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-8 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
                        >
                            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-[80px] bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent)]" />
                            <div className="mb-5 flex gap-0.5 text-base text-amber-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>★</span>
                                ))}
                            </div>
                            <p className="mb-7 text-base leading-7 text-zinc-200">&quot;{testimonial.text}&quot;</p>
                            <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                                <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br text-xs font-extrabold text-white ${testimonial.avatarClass}`}>
                                    {testimonial.init}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{testimonial.name}</p>
                                    <p className="mt-0.5 text-xs text-zinc-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
