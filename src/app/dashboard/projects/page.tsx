"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Grid3X3, List, Trash2, ExternalLink, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_PROJECTS, Project, ProjectStatus } from "@/lib/mock-data";
import ProjectCard from "@/components/dashboard/ProjectCard";

const STATUS_FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
    active: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
    published: "bg-green-500/15 text-green-400 border-green-500/20",
    archived: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = projects.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: string) => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteId(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Projects</h1>
                        <p className="mt-1 text-sm text-zinc-500">{projects.length} total projects</p>
                    </div>
                    <button
                        onClick={() => router.push("/builder")}
                        className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-600 neon-glow w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1 overflow-x-auto">
                            {STATUS_FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setStatusFilter(f.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === f.value
                                            ? "bg-accent text-white shadow-sm"
                                            : "text-zinc-500 hover:text-white"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {search || statusFilter !== "all" ? (
                    <p className="text-xs text-zinc-600 mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
                ) : null}

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/8 mb-4">
                          <Search size={28} className="text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
                        <p className="text-sm text-zinc-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearch(""); setStatusFilter("all"); }}
                            className="text-sm text-accent hover:text-blue-400 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Grid View */}
                {viewMode === "grid" && filtered.length > 0 && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {filtered.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ProjectCard
                                        id={project.id}
                                        name={project.name}
                                        updatedAt={project.updatedAt}
                                        status={project.status}
                                        gradient={project.gradient}
                                        screens={project.screens}
                                        onDelete={(id) => setDeleteId(id)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* New Project Card */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => router.push("/builder")}
                            className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-transparent transition-all hover:border-accent/30 hover:bg-white/3 group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/10 transition-colors">
                                    <Plus size={20} className="text-zinc-500 group-hover:text-accent" />
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-300">New Project</span>
                            </div>
                        </motion.button>
                    </div>
                )}

                {/* List View */}
                {viewMode === "list" && filtered.length > 0 && (
                    <div className="space-y-2">
                        <AnimatePresence>
                            {filtered.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/60 hover:border-white/10 transition-all"
                                >
                                    <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${project.gradient}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
                                            <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[project.status]}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">{project.description}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-600">
                                        <Layers size={11} />
                                        {project.screens} screens
                                    </div>
                                    <p className="hidden sm:block text-xs text-zinc-600 whitespace-nowrap">{project.updatedAt}</p>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => router.push(`/builder?id=${project.id}`)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(project.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setDeleteId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                                <Trash2 size={22} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Project?</h3>
                            <p className="text-sm text-zinc-400 mb-6">
                                This action cannot be undone. The project and all its data will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteId)}
                                    className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
