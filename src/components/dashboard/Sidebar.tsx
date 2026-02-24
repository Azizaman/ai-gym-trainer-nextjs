"use client";

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
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analyze", label: "Analyze Video", icon: Video },
    { href: "/dashboard/history", label: "History", icon: History },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : session?.user?.email?.[0]?.toUpperCase() || "U";

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2.5 border-b border-slate-800/80 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                    <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-[-0.03em] text-white">
                    Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                </span>
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
                        <p className="truncate text-sm font-semibold text-white">{session?.user?.name || "User"}</p>
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
        </aside>
    );
}
