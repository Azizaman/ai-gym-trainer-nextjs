"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Trash2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "model";
    text: string;
    timestamp: Date;
}

const SUGGESTIONS = [
    "🥗 Create a high-protein meal plan",
    "💪 Best exercises for beginners",
    "🔥 How to calculate my macros",
    "🏃 Tips for improving endurance",
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            text: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map((m) => ({
                role: m.role,
                text: m.text,
            }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText, history }),
            });

            const data = await res.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "model",
                text: data.success ? data.reply : "Sorry, something went wrong. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "model",
                    text: "Connection error. Please check your internet and try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    // Simple markdown-like rendering for bot messages
    const renderText = (text: string) => {
        return text.split("\n").map((line, i) => {
            // Bold
            const boldedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            // Bullet points
            if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                    <div key={i} className="ml-3 flex gap-2 py-0.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-indigo-400" />
                        <span dangerouslySetInnerHTML={{ __html: boldedLine.slice(2) }} />
                    </div>
                );
            }
            if (line.trim() === "") return <br key={i} />;
            return (
                <p key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: boldedLine }} />
            );
        });
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] ${isOpen
                        ? "rotate-0 bg-slate-800"
                        : "bg-gradient-to-br from-indigo-500 to-sky-500"
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-white" />
                )}
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-5 z-50 flex w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_32px_96px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 sm:w-[400px] ${isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                style={{ height: "min(600px, calc(100vh - 8rem))" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-sky-500/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">FormAI Coach</h3>
                            <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                Online · AI-powered
                            </p>
                        </div>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                            title="Clear chat"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-sky-500/10">
                                <Bot className="h-8 w-8 text-indigo-400" />
                            </div>
                            <h4 className="mb-1 text-base font-bold text-white">Hi! I&apos;m your AI Coach 👋</h4>
                            <p className="mb-5 text-xs text-slate-500">
                                Ask me anything about fitness, nutrition, or workout programming.
                            </p>
                            <div className="grid w-full gap-2">
                                {SUGGESTIONS.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => sendMessage(suggestion.replace(/^[^\s]+\s/, ""))}
                                        className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:border-indigo-500/20 hover:bg-indigo-500/5 hover:text-white"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "model" && (
                                    <div className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500">
                                        <Sparkles className="h-3.5 w-3.5 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                            ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-sky-500 text-white"
                                            : "rounded-bl-md border border-white/5 bg-white/[0.04] text-slate-200"
                                        }`}
                                >
                                    {msg.role === "model" ? renderText(msg.text) : msg.text}
                                </div>
                                {msg.role === "user" && (
                                    <div className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-800">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="rounded-2xl rounded-bl-md border border-white/5 bg-white/[0.04] px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0ms" }} />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "150ms" }} />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 bg-white/[0.02] p-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about diet, exercises, form..."
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] disabled:opacity-40"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                    </form>
                    <p className="mt-2 text-center text-[10px] text-slate-600">
                        Powered by Gemini AI · Not medical advice
                    </p>
                </div>
            </div>
        </>
    );
}
