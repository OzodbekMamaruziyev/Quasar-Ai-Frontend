"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    History,
    Plus,
    Settings,
    FolderOpen,
    Trash2,
    Zap,
    LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import Link from "next/link";

interface Version {
    id: string;
    name: string;
    timestamp: string;
    projectId: string;
}

const MOCK_VERSIONS: Version[] = [
    { id: "1", name: "v1 - Initial Design", timestamp: "2m ago", projectId: "1" },
    { id: "2", name: "v2 - Changed Colors", timestamp: "1m ago", projectId: "1" },
    { id: "3", name: "v3 - Added Cards", timestamp: "Just now", projectId: "1" },
    { id: "4", name: "v1 - POS Layout", timestamp: "Yesterday", projectId: "2" },
    { id: "5", name: "v2 - Menu Screen", timestamp: "Yesterday", projectId: "2" },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeVersion, setActiveVersion] = useState("3");
    const [activeProject, setActiveProject] = useState("1");

    const projectVersions = MOCK_VERSIONS.filter((v) => v.projectId === activeProject);
    const currentProject = MOCK_PROJECTS.find((p) => p.id === activeProject);

    return (
        <motion.div
            animate={{ width: isCollapsed ? 56 : 240 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative flex h-full flex-col border-r border-white/5 bg-zinc-950 overflow-hidden",
            )}
        >
            {/* Header */}
            <div className={cn(
                "flex h-14 items-center border-b border-white/5 px-3",
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
            <div className="p-2">
                <button className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl bg-white/5 p-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/5",
                    isCollapsed && "justify-center"
                )}>
                    <Plus size={16} className="text-accent shrink-0" />
                    {!isCollapsed && <span className="text-xs">New Session</span>}
                </button>
            </div>

            {/* Project Selector */}
            {!isCollapsed && (
                <div className="px-2 pb-2">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Projects</p>
                    <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-none">
                        {MOCK_PROJECTS.slice(0, 4).map((project) => (
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
                        ))}
                    </div>
                </div>
            )}

            {/* Version History */}
            <div className="flex-1 overflow-y-auto px-2 scrollbar-none">
                {!isCollapsed && (
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        {currentProject?.name || "History"}
                    </p>
                )}
                <div className="space-y-0.5">
                    {(isCollapsed ? MOCK_VERSIONS : projectVersions).map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setActiveVersion(v.id)}
                            className={cn(
                                "group flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-all",
                                activeVersion === v.id
                                    ? "bg-accent/10 text-accent border border-accent/15"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <History size={15} className="shrink-0" />
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-xs font-medium">{v.name}</p>
                                    <p className="text-[10px] opacity-50">{v.timestamp}</p>
                                </div>
                            )}
                            {!isCollapsed && activeVersion !== v.id && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className={cn(
                "flex flex-col gap-0.5 border-t border-white/5 p-2",
            )}>
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
