"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 lg:px-10 ${scrolled
                ? "border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl"
                : "bg-transparent"
                }`}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 no-underline">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <span className="text-xl font-extrabold tracking-[-0.04em] text-white">
                    Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
                <a href="#features" className="transition hover:text-white">Features</a>
                <a href="#how-it-works" className="transition hover:text-white">How it works</a>
                <a href="#pricing" className="transition hover:text-white">Pricing</a>
            </div>

            {/* Auth buttons */}
            <div className="hidden items-center gap-3 md:flex">
                {session ? (
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.45)]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.45)]"
                        >
                            Get Started Free
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu toggle */}
            <button
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round">
                    {menuOpen ? (
                        <>
                            <line x1="4" y1="4" x2="14" y2="14" />
                            <line x1="14" y1="4" x2="4" y2="14" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="5" x2="15" y2="5" />
                            <line x1="3" y1="9" x2="15" y2="9" />
                            <line x1="3" y1="13" x2="15" y2="13" />
                        </>
                    )}
                </svg>
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-zinc-900/95 px-6 py-5 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col gap-3">
                        <a href="#features" className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>How it works</a>
                        <a href="#pricing" className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>Pricing</a>
                        <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                            {session ? (
                                <Link href="/dashboard" className="rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-5 py-2.5 text-center text-sm font-bold text-white">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-center text-sm font-semibold text-zinc-400">Log in</Link>
                                    <Link href="/signup" className="rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 px-5 py-2.5 text-center text-sm font-bold text-white">Get Started Free</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
