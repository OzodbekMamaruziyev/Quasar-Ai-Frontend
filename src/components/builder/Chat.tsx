"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Paperclip, Mic, User, Zap, ChevronDown, Cpu } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { aiApi, projectsApi, type ChatMessage } from "@/lib/api";

const AI_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Groq - Eng kuchli (Bepul)" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", description: "Groq - Tez va bepul" },
  { id: "moonshot-v1-8k", name: "Moonshot 8K", description: "Kimi - 8k kontekst" },
  { id: "moonshot-v1-32k", name: "Moonshot 32K", description: "Kimi - 32k kontekst" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", description: "Anthropic - Eng aqlli" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", description: "Anthropic - Eng tez" },
];

const QUICK_PROMPTS = [
  "/build Add a dark mode toggle",
  "/build Create a login screen",
  "/build Add bottom navigation",
  "/build Make it more colorful",
];

interface ChatProps {
  onCodeGenerated?: (code: string) => void;
  projectId?: string;
}

export default function Chat({ onCodeGenerated, projectId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Auto scroll ───────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // ── Dropdown tashqarisiga bosish ──────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ════════════════════════════════════════════════════════
  //  CHAT TARIXINI YUKLASH
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const combined: ChatMessage[] = [];

        // ── AI generatsiya tarixi (barcha loyihalar) ────
        try {
          const historyRes = await aiApi.getHistory() as any;
          const hRaw = historyRes?.data;
          const historyArr: any[] = Array.isArray(hRaw) ? hRaw : (hRaw?.data ?? []);

          // Agar projectId bo'lsa, shu project bo'yicha filtrla
          // Agar projectId yo'q bo'lsa, barcha history ni ko'rsat
          const filteredHistory = projectId
            ? historyArr.filter((h: any) => String(h.projectId) === String(projectId))
            : historyArr;

          const projectGens = filteredHistory.reverse();

          projectGens.forEach((gen: any) => {
            const time = gen.createdAt
              ? new Date(gen.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";

            // User prompti
            if (gen.prompt) {
              combined.push({
                id: `${gen.id}-prompt`,
                role: "USER" as const,
                content: gen.prompt,
                timestamp: time,
              });
            }

            // AI javobi
            let explanation = "Loyiha muvaffaqiyatli yaratildi!";
            try {
              if (gen.result) {
                const parsed = JSON.parse(gen.result);
                explanation = parsed.explanation || explanation;
              }
            } catch {
              explanation = gen.result?.substring(0, 120) + "..." || explanation;
            }

            combined.push({
              id: `${gen.id}-result`,
              role: "ASSISTANT" as const,
              content: explanation,
              timestamp: time,
            });
          });
        } catch (e) {
          console.warn("AI history fetch error:", e);
        }

        // ── Chat messageslar (projectga bog'liq) ──────
        if (projectId) {
          try {
            const projectRes = await projectsApi.getById(projectId) as any;
            const pRaw = projectRes?.data || projectRes;
            const chatMsgs: any[] = pRaw?.chatMessages ?? [];

            const existingIds = new Set(combined.map(m => m.id));

            chatMsgs.forEach((m: any) => {
              if (existingIds.has(m.id)) return;
              combined.push({
                ...m,
                timestamp: m.timestamp
                  ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "",
              });
            });
          } catch (e) {
            console.warn("Project chat messages fetch error:", e);
          }
        }

        // ── Vaqt bo'yicha tartiblash ───────────────────
        combined.sort((a, b) => {
          const tA = (a as any).createdAt || (a as any).timestamp || "";
          const tB = (b as any).createdAt || (b as any).timestamp || "";
          return tA > tB ? 1 : -1;
        });

        setMessages(combined);
      } catch (err) {
        console.error("Critical error in loadHistory:", err);
      }
    };

    loadHistory();
  }, [projectId]);

  // ════════════════════════════════════════════════════════
  //  STREAMING TEXT ANIMATSIYASI
  //  ⚠️ FIX: safeText ni closure dan to'g'ri olish
  // ════════════════════════════════════════════════════════
  const streamMessage = useCallback(async (text: string | undefined | null) => {
    const safeText = (text ?? "").trim();
    if (!safeText) return;

    setIsStreaming(true);
    setStreamingText("");

    let displayed = "";
    for (let i = 0; i <= safeText.length; i++) {
      if (abortControllerRef.current?.signal.aborted) break;
      await new Promise((r) => setTimeout(r, 10));
      displayed = safeText.slice(0, i);
      setStreamingText(displayed);
    }

    setIsStreaming(false);
    setStreamingText("");

    // ⚠️ FIX: streamingText state dan EMAS, local `displayed` dan o'qiymiz
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "ASSISTANT",
        content: displayed || safeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []); // dependency yo'q — closure muammo yo'q

  // ════════════════════════════════════════════════════════
  //  GENERATSIYANI TO'XTATISH
  // ════════════════════════════════════════════════════════
  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsTyping(false);
    setIsStreaming(false);
    setStreamingText("");
  }, []);

  // ════════════════════════════════════════════════════════
  //  AI JAVOB OLISH
  //  AI faqat chat qiladi, code generatsiya alohidaamalga oshiriladi
  // ════════════════════════════════════════════════════════
  const getAIResponse = useCallback(async (prompt: string) => {
    setIsTyping(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Har doim chat rejimida ishlaydi - faqat chat qiladi
      // Code generatsiya /build yoki /generate buyrug'i orqali amalga oshiriladi

      // /build yoki /generate buyrug'i bormi?
      const isGenerateCommand = /^\/build\s+|\/generate\s+/i.test(prompt);

      // Buyruq matnini tozalash
      const cleanPrompt = prompt.replace(/^\/build\s+|^\/generate\s+/i, '').trim();

      if (isGenerateCommand && cleanPrompt) {
        // Code generatsiya rejimi
        let fullContent = "";
        let projectData: any = null;

        await aiApi.generateStream(
          { prompt: cleanPrompt, model: selectedModel, projectId },
          (chunk) => {
            const content = chunk.content || "";
            fullContent += content;
            setStreamingText(fullContent);
            setIsStreaming(true);
          },
        );

        setIsStreaming(false);
        setStreamingText("");

        // JSON parse
        try {
          const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) projectData = JSON.parse(jsonMatch[0]);
        } catch { /* plain text */ }

        // Preview ga uzatish
        if (projectData && onCodeGenerated) {
          onCodeGenerated(JSON.stringify(projectData));
        } else if (fullContent && onCodeGenerated) {
          onCodeGenerated(JSON.stringify({
            explanation: "Generated code",
            files: [{ path: "App.tsx", content: fullContent }],
            mainFile: "App.tsx",
          }));
        }

        const explanation = projectData?.explanation
          || fullContent.substring(0, 200)
          || "Loyiha muvaffaqiyatli yaratildi!";

        setIsTyping(false);
        await streamMessage(explanation);

      } else {
        // Oddiy chat rejimi - faqat chat qiladi, code generatsiya qilmaydi
        const response = await aiApi.chat(
          { message: prompt, model: selectedModel, projectId },
          signal as any,
        );
        const resData = (response as any)?.data;
        const message = resData?.message ?? "Javob olishda xatolik yuz berdi.";
        const project = resData?.project;

        // Project bo'lsa, code ni alohida qilib qo'yamiz (lekin chatda ko'rsatmaymiz)
        if (project && onCodeGenerated) {
          // Code ni preview ga uzatamiz, lekin chatda faqat xabar ko'rinadi
          onCodeGenerated(JSON.stringify(project));
        }

        setIsTyping(false);
        await streamMessage(message);
      }

    } catch (err: any) {
      if (err?.name === "AbortError") return;

      console.error("AI operation failed:", err);
      setIsTyping(false);
      setIsStreaming(false);
      setStreamingText("");

      const errMsg = err?.response?.data?.message || err?.message || "Xatolik yuz berdi.";
      setError(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ASSISTANT",
          content: `⚠️ ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      abortControllerRef.current = null;
    }
  }, [onCodeGenerated, selectedModel, projectId, streamMessage]);

  // ════════════════════════════════════════════════════════
  //  XABAR YUBORISH
  // ════════════════════════════════════════════════════════
  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || isStreaming || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "USER",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputValue("");
    await getAIResponse(content);
  }, [inputValue, isStreaming, isTyping, getAIResponse]);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent neon-glow">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Quasar</p>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {currentModel?.name} · Ready
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
            >
              <Cpu size={14} />
              <span className="hidden sm:inline">{currentModel?.name}</span>
              <ChevronDown size={14} className={cn("transition-transform", showModelDropdown && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showModelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold px-2 py-1.5">
                      Model tanlang
                    </p>
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all",
                          selectedModel === model.id
                            ? "bg-accent/10 border border-accent/20"
                            : "hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          selectedModel === model.id ? "bg-accent" : "bg-zinc-600"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-xs font-medium truncate",
                            selectedModel === model.id ? "text-white" : "text-zinc-300"
                          )}>
                            {model.name}
                          </p>
                          <p className="text-[10px] text-zinc-500">{model.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-white/3 border border-white/5 px-3 py-1.5 rounded-full">
            <Sparkles size={11} className="text-accent" />
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-full",
                msg.role === "USER"
                  ? "items-start flex-row-reverse self-end ml-auto"
                  : "items-start"
              )}
            >
              <div className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-lg mt-0.5",
                msg.role === "ASSISTANT" ? "bg-accent neon-glow" : "bg-white/10"
              )}>
                {msg.role === "ASSISTANT"
                  ? <Zap size={14} className="text-white fill-white" />
                  : <User size={14} className="text-zinc-400" />
                }
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "ASSISTANT"
                    ? "bg-white/5 text-zinc-300 border border-white/5 rounded-tl-sm"
                    : "bg-accent/10 text-accent border border-accent/20 rounded-tr-sm"
                )}>
                  {msg.content}
                </div>
                <span className={cn(
                  "text-[10px] text-zinc-700",
                  msg.role === "USER" && "text-right"
                )}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
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

        {/* Streaming response */}
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

      {/* ── Quick Prompts ───────────────────────────────── */}
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

      {/* ── Input ──────────────────────────────────────── */}
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
              placeholder="Type /build to create code, or chat normally..."
              disabled={isTyping || isStreaming}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder:text-zinc-600 disabled:opacity-50"
            />
            <div className="flex items-center gap-1.5 pr-1">
              <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                <Mic size={18} />
              </button>

              {(isTyping || isStreaming) ? (
                <button
                  onClick={stopGeneration}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 transition-all hover:bg-red-500/30 active:scale-95 shadow-lg shadow-red-500/10"
                  title="Stop generation"
                >
                  <div className="h-3 w-3 bg-red-500 rounded-sm" />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles size={9} className="text-accent" /> Powered by {currentModel?.name}
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-800" />
          <span>React Native</span>
        </div>
      </div>

    </div>
  );
}