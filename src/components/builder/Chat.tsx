"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Paperclip, Mic, User, Zap } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MOCK_CHAT_MESSAGES, AI_RESPONSES, Message } from "@/lib/mock-data";

const QUICK_PROMPTS = [
    "Add a dark mode toggle",
    "Create a login screen",
    "Add bottom navigation",
    "Make it more colorful",
];

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>(MOCK_CHAT_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingText]);

    const simulateAIResponse = useCallback(async () => {
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, 800));
        setIsTyping(false);

        const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        setIsStreaming(true);
        setStreamingText("");

        // Stream character by character
        for (let i = 0; i <= response.length; i++) {
            await new Promise((r) => setTimeout(r, 18));
            setStreamingText(response.slice(0, i));
        }

        setIsStreaming(false);
        setStreamingText("");
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                role: "assistant",
                content: response,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ]);
    }, []);

    const handleSend = useCallback(async (text?: string) => {
        const content = text || inputValue.trim();
        if (!content || isStreaming || isTyping) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");
        await simulateAIResponse();
    }, [inputValue, isStreaming, isTyping, simulateAIResponse]);

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent neon-glow">
                        <Zap size={16} className="text-white fill-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Quasar</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                            GPT-4o · Ready
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-white/3 border border-white/5 px-3 py-1.5 rounded-full">
                    <Sparkles size={11} className="text-accent" />
                    {messages.length} messages
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-none">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-3 max-w-full",
                                msg.role === "assistant" ? "items-start" : "items-start flex-row-reverse self-end ml-auto"
                            )}
                        >
                            <div className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-lg mt-0.5",
                                msg.role === "assistant" ? "bg-accent neon-glow" : "bg-white/10"
                            )}>
                                {msg.role === "assistant"
                                    ? <Zap size={14} className="text-white fill-white" />
                                    : <User size={14} className="text-zinc-400" />
                                }
                            </div>

                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className={cn(
                                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                    msg.role === "assistant"
                                        ? "bg-white/5 text-zinc-300 border border-white/5 rounded-tl-sm"
                                        : "bg-accent/10 text-accent border border-accent/20 rounded-tr-sm"
                                )}>
                                    {msg.content}
                                </div>
                                <span className={cn("text-[10px] text-zinc-700", msg.role === "user" ? "text-right" : "")}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent neon-glow">
                            <Zap size={14} className="text-white fill-white" />
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/5 px-4 py-3">
                            <div className="flex gap-1.5 items-center h-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                        className="h-1.5 w-1.5 rounded-full bg-zinc-500"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Streaming Response */}
                {isStreaming && streamingText && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent neon-glow">
                            <Zap size={14} className="text-white fill-white" />
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/5 px-4 py-3 text-sm text-zinc-300 leading-relaxed max-w-[85%]">
                            {streamingText}
                            <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-pulse" />
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
                {QUICK_PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        disabled={isTyping || isStreaming}
                        className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all disabled:opacity-40"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="relative group">
                    <div className="absolute inset-0 -z-10 bg-accent/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
                    <div className="relative flex items-center rounded-2xl bg-white/5 border border-white/10 p-2 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/40 transition-all">
                        <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                            <Paperclip size={18} />
                        </button>
                        <input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                            placeholder="Describe what to build or change..."
                            disabled={isTyping || isStreaming}
                            className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        />
                        <div className="flex items-center gap-1.5 pr-1">
                            <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                <Mic size={18} />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim() || isTyping || isStreaming}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
                    <span className="flex items-center gap-1"><Sparkles size={9} className="text-accent" /> Powered by GPT-4o</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span>React Native</span>
                </div>
            </div>
        </div>
    );
}
