"use client";

import { useState, useCallback, Suspense } from "react";
import Sidebar from "@/components/builder/Sidebar";
import Chat from "@/components/builder/Chat";
import Preview from "@/components/builder/Preview";
import { Eye, MessageSquare, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

type MobileTab = "chat" | "preview";

function BuilderContent() {
    const { isLoading, isAuthenticated } = useRequireAuth('/login');
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId') || undefined;

    const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentCode, setCurrentCode] = useState<string>("");
    const [chatKey, setChatKey] = useState(0);
    const [historyProjectId, setHistoryProjectId] = useState<string | undefined>(undefined);

    const handleNewSession = useCallback(() => {
        setChatKey(prev => prev + 1);
        setCurrentCode("");
        setHistoryProjectId(undefined);
    }, []);

    const handleHistoryItemClick = useCallback((code: string) => {
        setCurrentCode(code);
    }, []);

    const handleHistorySelect = useCallback((item: any) => {
        // History tanlanganda Chat componentni qayta yuklash
        setChatKey(prev => prev + 1);
        // Agar history itemda projectId bo'lsa, uni ham o'rnatamiz
        if (item.projectId) {
            setHistoryProjectId(item.projectId);
        }
    }, []);

    // Show loading state while checking authentication
    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Desktop Layout */}
            <div className="hidden lg:flex w-full divide-x divide-white/5">
                <Sidebar
                    onNewSession={handleNewSession}
                    onHistoryItemClick={handleHistoryItemClick}
                    onHistorySelect={handleHistorySelect}
                />
                <div className="flex-1 min-w-95">
                    <Chat key={chatKey} onCodeGenerated={setCurrentCode} projectId={historyProjectId || projectId} />
                </div>
                <div className="flex-[1.4] min-w-115">
                    <Preview code={currentCode} projectId={projectId} />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden flex-col w-full h-full">
                {/* Mobile Header */}
                <div className="flex h-12 items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm px-4 shrink-0">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <PanelLeft size={17} />
                    </button>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
                        <button
                            onClick={() => setMobileTab("chat")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                mobileTab === "chat" ? "bg-accent text-white" : "text-zinc-500"
                            )}
                        >
                            <MessageSquare size={13} /> Chat
                        </button>
                        <button
                            onClick={() => setMobileTab("preview")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                mobileTab === "preview" ? "bg-accent text-white" : "text-zinc-500"
                            )}
                        >
                            <Eye size={13} /> Preview
                        </button>
                    </div>
                    <div className="w-8" />
                </div>

                {/* Mobile Sidebar Overlay */}
                {showSidebar && (
                    <div
                        className="absolute inset-0 z-20 bg-black/60"
                        onClick={() => setShowSidebar(false)}
                    >
                        <div
                            className="absolute left-0 top-0 h-full w-72"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Sidebar
                                onNewSession={handleNewSession}
                                onHistoryItemClick={handleHistoryItemClick}
                                onHistorySelect={handleHistorySelect}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Content */}
                <div className="flex-1 overflow-hidden">
                    {mobileTab === "chat" ? (
                        <Chat key={chatKey} onCodeGenerated={setCurrentCode} projectId={historyProjectId || projectId} />
                    ) : (
                        <Preview code={currentCode} projectId={historyProjectId || projectId} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        }>
            <BuilderContent />
        </Suspense>
    );
}
