"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    Video,
    History,
    LogOut,
    ChevronRight,
    Zap,
    Menu,
    X,
    Crown,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analyze", label: "Analyze Video", icon: Video },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/subscription", label: "Subscription", icon: Crown },
];

const PLAN_BADGE_STYLES: Record<string, string> = {
    starter: "bg-zinc-700 text-zinc-300",
    pro: "bg-indigo-500/20 text-indigo-400",
    team: "bg-sky-500/20 text-sky-400",
};

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [plan, setPlan] = useState<string>("starter");

    useEffect(() => {
        fetch("/api/subscription")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setPlan(data.data.plan);
            })
            .catch(() => { });
    }, []);

    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : session?.user?.email?.[0]?.toUpperCase() || "U";

    const navContent = (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-extrabold tracking-[-0.03em] text-white">
                        Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                    </span>
                </Link>
                {/* Close button — mobile only */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                                ? "bg-gradient-to-r from-indigo-500/15 to-sky-500/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon
                                className={`h-[18px] w-[18px] ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                    }`}
                            />
                            {item.label}
                            {isActive && <ChevronRight className="ml-auto h-4 w-4 text-indigo-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="border-t border-slate-800/80 p-3">
                <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-bold text-white">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-white">{session?.user?.name || "User"}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PLAN_BADGE_STYLES[plan] || PLAN_BADGE_STYLES.starter}`}>
                                {plan}
                            </span>
                        </div>
                        <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    Sign out
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile header bar */}
            <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-4 backdrop-blur-lg lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-base font-extrabold text-white">
                        Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar — mobile: slide-in drawer, desktop: fixed sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {navContent}
            </aside>
        </>
    );
}

