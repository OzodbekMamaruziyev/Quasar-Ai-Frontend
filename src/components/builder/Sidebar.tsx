"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    History,
    Plus,
    Settings,
    FolderOpen,
    Zap,
    LayoutDashboard,
    MessageSquare,
    Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { projectsApi, type Project, aiApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
    onNewSession?: () => void;
    onHistoryItemClick?: (code: string) => void;
    onHistorySelect?: (item: HistoryItem) => void;
}

interface HistoryItem {
    id: string;
    type: string;
    prompt: string;
    result?: string;
    tokensUsed?: number;
    projectId?: string;
    projectName?: string;
    createdAt: string;
}

export default function Sidebar({ onNewSession, onHistoryItemClick, onHistorySelect }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeProject, setActiveProject] = useState<string>("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    // Fetch real projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectsApi.getAll();
                const responseData = response.data as any;
                const projectsData: Project[] = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : [];
                setProjects(projectsData);
                if (projectsData.length > 0 && !activeProject) {
                    setActiveProject(projectsData[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch AI generation history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setHistoryLoading(true);
                const response = await aiApi.getHistory();
                const responseData = response.data as any;

                let historyData: HistoryItem[] = [];
                if (Array.isArray(responseData)) {
                    historyData = responseData;
                } else if (responseData?.data && Array.isArray(responseData.data)) {
                    historyData = responseData.data;
                } else if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
                    historyData = responseData.data.data;
                }
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistory([]);
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const currentProject = projects.find((p) => p.id === activeProject);

    const handleHistoryClick = (item: HistoryItem) => {
        if (item.result && onHistoryItemClick) {
            onHistoryItemClick(item.result);
        }
        // Call the callback to load messages in Chat
        if (onHistorySelect) {
            onHistorySelect(item);
        }
    };

    const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Click eventni parent (button-click) ga yubormaslik
        try {
            setDeletingId(id);
            await aiApi.deleteHistory(id);
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("Failed to delete history:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch {
            return "Unknown date";
        }
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 56 : 240 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-full flex-col border-r border-white/5 bg-zinc-950 overflow-hidden shrink-0"
        >
            {/* Header */}
            <div className={cn(
                "flex h-14 items-center border-b border-white/5 px-3 shrink-0",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
                            <Zap size={13} className="text-white fill-white" />
                        </div>
                        <span className="text-sm font-bold text-white">Builder</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="rounded-lg p-1.5 transition-colors hover:bg-white/5 text-zinc-500 hover:text-white"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* New Session Button */}
            <div className="p-2 shrink-0">
                <button
                    onClick={onNewSession}
                    className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl bg-white/5 p-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/5",
                        isCollapsed && "justify-center"
                    )}
                >
                    <Plus size={16} className="text-accent shrink-0" />
                    {!isCollapsed && <span className="text-xs">New Session</span>}
                </button>
            </div>

            {/* Project Selector */}
            {!isCollapsed && (
                <div className="px-2 pb-2 shrink-0">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Projects</p>
                    <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-none">
                        {loading ? (
                            <div className="px-2 py-4 text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mx-auto"></div>
                            </div>
                        ) : projects.length === 0 ? (
                            <p className="text-xs text-zinc-600 px-2 py-2">No projects yet</p>
                        ) : (
                            projects.slice(0, 4).map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => setActiveProject(project.id)}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-all",
                                        activeProject === project.id
                                            ? "bg-accent/10 text-accent"
                                            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                    )}
                                >
                                    <span className="text-base shrink-0">📱</span>
                                    <span className="text-xs font-medium truncate">{project.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Version History */}
            <div className="flex-1 overflow-y-auto px-2 scrollbar-none min-h-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-1.5 px-2 py-1">
                        <MessageSquare size={10} className="text-zinc-600" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            {currentProject?.name || "History"}
                        </p>
                    </div>
                )}
                <div className="space-y-1">
                    {historyLoading ? (
                        !isCollapsed ? (
                            <div className="px-2 py-4 text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mx-auto"></div>
                            </div>
                        ) : null
                    ) : history.length === 0 ? (
                        !isCollapsed ? (
                            <div className="px-2 py-6 text-center">
                                <History size={20} className="text-zinc-700 mx-auto mb-2" />
                                <p className="text-xs text-zinc-600">No history yet</p>
                                <p className="text-[10px] text-zinc-700 mt-0.5">Start a new session to begin</p>
                            </div>
                        ) : null
                    ) : isCollapsed ? null : (
                        history.map((item, index) => (
                            <button
                                key={item.id || index}
                                onClick={() => handleHistoryClick(item)}
                                className={cn(
                                    "group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left",
                                    "bg-white/5 border border-white/8",
                                    "text-white hover:bg-white/10",
                                    "transition-all cursor-pointer",
                                    !item.result && "opacity-60 cursor-default"
                                )}
                            >
                                <History size={13} className="shrink-0 text-zinc-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-xs font-medium text-white leading-tight">
                                        {item.prompt ? item.prompt.slice(0, 32) : "No prompt"}
                                        {item.prompt && item.prompt.length > 32 ? "..." : ""}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">
                                        {item.createdAt ? formatDate(item.createdAt) : "Unknown"}
                                    </p>
                                </div>
                                <span
                                    onClick={(e) => handleDeleteHistory(e, item.id)}
                                    role="button"
                                    tabIndex={0}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all shrink-0 cursor-pointer"
                                >
                                    {deletingId === item.id ? (
                                        <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 size={12} />
                                    )}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className={cn("flex flex-col gap-0.5 border-t border-white/5 p-2 shrink-0")}>
                <Link
                    href="/dashboard/projects"
                    className={cn(
                        "flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-white",
                        isCollapsed && "justify-center"
                    )}
                >
                    <FolderOpen size={15} className="shrink-0" />
                    {!isCollapsed && <span>All Projects</span>}
                </Link>
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-white",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LayoutDashboard size={15} className="shrink-0" />
                    {!isCollapsed && <span>Dashboard</span>}
                </Link>
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-white",
                        isCollapsed && "justify-center"
                    )}
                >
                    <Settings size={15} className="shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
            </div>
        </motion.div>
    );
}
