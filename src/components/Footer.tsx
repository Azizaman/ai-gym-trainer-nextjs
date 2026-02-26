const COLUMNS = [
    { title: "Product", links: [{ label: "Features", href: "#" }, { label: "How It Works", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }, { label: "Roadmap", href: "#" }] },
    { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "mailto:support@formai.example.com" }] },
    { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "API Reference", href: "#" }, { label: "Status", href: "#" }, { label: "Security", href: "#" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }, { label: "Cookie Policy", href: "#" }] },
];

export function Footer() {
    return (
        <footer className="bg-[#07070a] px-4 pb-10 pt-16 sm:px-6 lg:px-10 lg:pt-20">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-12 grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[2fr_repeat(4,1fr)] lg:gap-8 lg:pb-14">
                    <div>
                        <div className="mb-5 flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </div>
                            <span className="text-xl font-extrabold tracking-[-0.04em] text-white">
                                Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                            </span>
                        </div>
                        <p className="max-w-sm text-sm leading-7 text-zinc-500">
                            AI-powered workout analysis giving every athlete access to elite biomechanical coaching at a fraction of the cost.
                        </p>
                        <div className="mt-6 flex items-center gap-2.5">
                            {["X", "in", "YT", "IG"].map((icon) => (
                                <button
                                    key={icon}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-500 transition hover:bg-indigo-500 hover:text-white"
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {COLUMNS.map((column) => (
                        <div key={column.title}>
                            <p className="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-500">{column.title.toUpperCase()}</p>
                            <ul className="flex list-none flex-col gap-2.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-zinc-600 transition hover:text-white">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-center text-sm text-zinc-600 sm:justify-between sm:text-left">
                    <p>© 2025 FormAI, Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        <span>All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
