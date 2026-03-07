"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Grid3X3, List, Trash2, ExternalLink, Layers, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsApi, type Project } from "@/lib/api";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { SkeletonCard } from "@/components/dashboard/SkeletonCard";

type ProjectStatus = "ACTIVE" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type StatusFilter = "active" | "draft" | "published" | "archived" | "all";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
    ACTIVE: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    DRAFT: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
    PUBLISHED: "bg-green-500/15 text-green-400 border-green-500/20",
    ARCHIVED: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    
    // Create new project state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchProjects = async (currentSearch?: string, currentStatus?: StatusFilter) => {
        try {
            setLoading(true);
            const activeStatus = currentStatus ?? statusFilter;
            const response = await projectsApi.getAll({
                status: activeStatus === "all" ? undefined : activeStatus,
                search: (currentSearch ?? search) || undefined,
            });
            // Handle both array and { data: [...], meta: {...} } response formats
            const responseData = response.data as any;
            const projectsData: Project[] = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : [];
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProjects(search, statusFilter);
        }, 400);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        try {
            setCreating(true);
            const response = await projectsApi.create({
                name: projectName,
                description: projectDesc,
            });
            const newProject = (response as any).data;
            setIsCreateOpen(false);
            setProjectName("");
            setProjectDesc("");
            // Redirect to builder with new projectId
            router.push(`/builder?projectId=${newProject.id}`);
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setDeleting(true);
            await projectsApi.delete(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete project:", error);
        } finally {
            setDeleting(false);
        }
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays}d ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

    const filteredProjects = projects; // Already filtered by backend

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
                        onClick={() => setIsCreateOpen(true)}
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

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1 shrink-0">
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
                        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1 shrink-0">
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
                {(search || statusFilter !== "all") && !loading && (
                    <p className="text-xs text-zinc-600 mb-4">{filteredProjects.length} result{filteredProjects.length !== 1 ? "s" : ""} found</p>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/8 mb-4">
                            {search || statusFilter !== "all" ? (
                                <Filter size={28} className="text-zinc-600" />
                            ) : (
                                <Plus size={28} className="text-zinc-600" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {search || statusFilter !== "all" ? "No projects found" : "No projects yet"}
                        </h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            {search || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Create your first app with AI"
                            }
                        </p>
                        {search || statusFilter !== "all" ? (
                            <button
                                onClick={() => { setSearch(""); setStatusFilter("all"); }}
                                className="text-sm text-accent hover:text-blue-400 transition-colors"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push("/builder")}
                                className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-600 neon-glow"
                            >
                                <Plus size={16} /> Create Project
                            </button>
                        )}
                    </div>
                )}

                {/* Grid View */}
                {!loading && viewMode === "grid" && filteredProjects.length > 0 && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {filteredProjects.map((project, i) => (
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
                                        updatedAt={getRelativeTime(project.updatedAt)}
                                        status={project.status.toUpperCase() as ProjectStatus}
                                        gradient={project.gradient || "from-blue-600 via-blue-500 to-cyan-400"}
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
                {!loading && viewMode === "list" && filteredProjects.length > 0 && (
                    <div className="space-y-2">
                        <AnimatePresence>
                            {filteredProjects.map((project: Project, i: number) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/60 hover:border-white/10 transition-all"
                                >
                                    <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${project.gradient || "from-blue-600 to-cyan-400"}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
                                            <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[project.status.toUpperCase() as ProjectStatus]}`}>
                                                {project.status.toLowerCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">{project.description || "No description"}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-600">
                                        <Layers size={11} />
                                        {project.screens} screens
                                    </div>
                                    <p className="hidden sm:block text-xs text-zinc-600 whitespace-nowrap">{getRelativeTime(project.updatedAt)}</p>
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
                                    disabled={deleting}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteId)}
                                    disabled={deleting}
                                    className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : null}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Project Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setIsCreateOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">New Project</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Project Name</label>
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        placeholder="e.g. My Awesome Fitness App"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="What will this app do?"
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-zinc-600 resize-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || !projectName.trim()}
                                        className="flex-[2] rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating ? "Creating..." : "Create Project"}
                                        {!creating && <Sparkles size={16} />}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
