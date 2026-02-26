"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatBot } from "@/components/dashboard/ChatBot";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar />
            {/* pt-14 on mobile for the top header bar, lg:pt-0 lg:pl-64 for desktop sidebar */}
            <main className="pt-14 lg:pl-64 lg:pt-0">
                <div className="min-h-screen">{children}</div>
            </main>
            <ChatBot />
        </div>
    );
}
