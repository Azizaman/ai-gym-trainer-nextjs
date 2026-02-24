import Link from "next/link";

export function CTABanner() {
    return (
        <section className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 to-sky-900 px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
                    <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2),transparent)]" />
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.15),transparent)]" />

                    <div className="relative">
                        <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-6xl">
                            Stop training blind.
                            <br />
                            <span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">Start training smart.</span>
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                            Join 50,000+ athletes already using FormAI to fix their form, prevent injuries, and hit new PRs.
                        </p>
                        <div className="mt-9 flex w-full flex-wrap items-center justify-center gap-3.5">
                            <Link
                                href="/signup"
                                className="w-full rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_28px_rgba(129,140,248,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(129,140,248,0.5)] sm:w-auto sm:px-8 sm:text-base"
                            >
                                Start for Free – No Card Needed
                            </Link>
                            <Link
                                href="/login"
                                className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/35 hover:bg-white/15 sm:w-auto sm:px-8 sm:text-base"
                            >
                                Sign In to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
