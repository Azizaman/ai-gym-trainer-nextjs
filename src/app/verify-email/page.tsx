"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, XCircle, ArrowRight, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const error = searchParams.get("error");
    const email = searchParams.get("email") || "";

    const [resendEmail, setResendEmail] = useState(email);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [resendError, setResendError] = useState("");

    const errorMessages: Record<string, string> = {
        "missing-token": "Verification link is invalid. Please request a new one.",
        "invalid-token": "This verification link is invalid or has already been used.",
        "expired-token": "This verification link has expired. Please request a new one.",
        "user-not-found": "No account found for this verification link.",
        "server-error": "Something went wrong. Please try again.",
    };

    // If the user came from signup, auto-show the email field pre-filled
    useEffect(() => {
        if (email) setResendEmail(email);
    }, [email]);

    const handleResend = async () => {
        if (!resendEmail) {
            setResendError("Please enter your email address.");
            return;
        }
        setSending(true);
        setResendError("");
        setSent(false);

        try {
            const res = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resendEmail }),
            });
            const data = await res.json();

            if (data.alreadyVerified) {
                router.push("/login?verified=true");
                return;
            }

            if (!res.ok) {
                setResendError(data.error || "Failed to send email.");
            } else {
                setSent(true);
            }
        } catch {
            setResendError("Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
            <div className="pointer-events-none absolute -left-32 top-[20%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-32 bottom-[10%] h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,_#334155_1px,_transparent_1px)] [background-size:32px_32px]" />

            <div className="animate-fade-up relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_16px_rgba(99,102,241,0.4)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold tracking-[-0.04em] text-white">
                            Form<span className="bg-gradient-to-br from-indigo-400 to-sky-400 bg-clip-text text-transparent">AI</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_32px_96px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10">
                    {error ? (
                        /* Error State */
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="inline-flex rounded-2xl bg-red-500/10 p-4">
                                    <XCircle className="h-10 w-10 text-red-400" />
                                </div>
                            </div>
                            <h1 className="mb-2 text-center text-2xl font-extrabold tracking-[-0.03em] text-white">
                                Verification Failed
                            </h1>
                            <p className="mb-8 text-center text-sm text-slate-400">
                                {errorMessages[error] || "Something went wrong."}
                            </p>
                        </>
                    ) : (
                        /* Default: Check your email */
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="inline-flex rounded-2xl bg-indigo-500/10 p-4">
                                    <Mail className="h-10 w-10 text-indigo-400" />
                                </div>
                            </div>
                            <h1 className="mb-2 text-center text-2xl font-extrabold tracking-[-0.03em] text-white">
                                Check your email
                            </h1>
                            <p className="mb-8 text-center text-sm text-slate-400">
                                We&apos;ve sent a verification link to your email. Click the link to verify your account and get started.
                            </p>
                        </>
                    )}

                    {/* Success banner */}
                    {sent && (
                        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-400">
                            <CheckCircle2 className="mr-1.5 inline h-4 w-4" />
                            Verification email sent! Check your inbox.
                        </div>
                    )}

                    {/* Error banner */}
                    {resendError && (
                        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400">
                            {resendError}
                        </div>
                    )}

                    {/* Resend form */}
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleResend}
                            disabled={sending}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(99,102,241,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {sending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw className="h-4 w-4" />
                                    Resend Verification Email
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs font-medium text-slate-500">or</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <Link
                        href="/login"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                    >
                        Back to Sign In <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Didn&apos;t receive the email? Check your spam folder or try resending.
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-slate-950">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
