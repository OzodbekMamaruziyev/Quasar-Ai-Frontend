"use client";

import { useState } from "react";
import Sidebar from "@/components/builder/Sidebar";
import Chat from "@/components/builder/Chat";
import Preview from "@/components/builder/Preview";
import { Eye, MessageSquare, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileTab = "chat" | "preview";

export default function BuilderPage() {
    const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Desktop Layout */}
            <div className="hidden lg:flex w-full divide-x divide-white/5">
                <Sidebar />
                <div className="flex-1 min-w-[380px]">
                    <Chat />
                </div>
                <div className="flex-[1.4] min-w-[460px]">
                    <Preview />
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
                            <Sidebar />
                        </div>
                    </div>
                )}

                {/* Mobile Content */}
                <div className="flex-1 overflow-hidden">
                    {mobileTab === "chat" ? <Chat /> : <Preview />}
                </div>
            </div>
        </div>
    );
}
