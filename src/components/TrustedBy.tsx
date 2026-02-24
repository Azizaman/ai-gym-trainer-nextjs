export function TrustedBy() {
    const brands = ["CrossFit", "F45 Training", "Anytime Fitness", "Orange Theory", "Barry's", "Planet Fitness"];

    return (
        <section className="overflow-hidden border-y border-white/5 bg-zinc-900/40 px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.12em] text-zinc-600 sm:text-[11px]">
                    TRUSTED BY TEAMS AT
                </span>
                {brands.map((brand) => (
                    <span key={brand} className="text-sm font-extrabold tracking-[-0.02em] text-zinc-600 sm:text-[15px]">
                        {brand}
                    </span>
                ))}
            </div>
        </section>
    );
}
