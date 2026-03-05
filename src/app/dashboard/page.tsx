"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Zap, Smartphone, Layout, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_PROJECTS, DASHBOARD_STATS } from "@/lib/mock-data";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { SkeletonCard, SkeletonStatCard } from "@/components/dashboard/SkeletonCard";
import { motion } from "framer-motion";

// 3D Tilt Effect Hook
const useTiltEffect = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  return {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered 
        ? `perspective(1000px) rotateX(${mousePosition.y * -8}deg) rotateY(${mousePosition.x * 8}deg) scale3d(1.05, 1.05, 1.05)`
        : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.2s ease-out'
    }
  };
};

function StatCard({ icon: Icon, label, value, color, trend }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string | number; color: string; trend?: string }) {
    const tiltEffect = useTiltEffect();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6 transition-all hover:bg-zinc-900/60 hover:border-white/10 cursor-pointer"
            {...tiltEffect}
        >
            <div className="flex items-start justify-between">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-white/5", color)}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        <TrendingUp size={10} /> {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">{label}</p>
            </div>
        </motion.div>
    );
}

export default function DashboardPage() {
  const router = useRouter();
  const recentProjects = MOCK_PROJECTS.slice(0, 4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="mt-1 text-sm text-zinc-500">Welcome back, Alex! Here&apos;s what&apos;s happening.</p>
                    </div>
                    <button
                        onClick={() => router.push("/builder")}
                        className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-600 neon-glow w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                  ) : (
                    <>
                      <StatCard icon={Zap} label="Apps Created" value={DASHBOARD_STATS.appsCreated} color="text-blue-500" trend="+3 this month" />
                      <StatCard icon={Sparkles} label="AI Generations" value={DASHBOARD_STATS.aiGenerations} color="text-purple-500" trend="+24 this week" />
                      <StatCard icon={Layout} label="Templates Used" value={DASHBOARD_STATS.templatesUsed} color="text-emerald-500" />
                      <StatCard icon={Smartphone} label="Devices Previewed" value={DASHBOARD_STATS.devicesPreviewed} color="text-indigo-500" />
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mb-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { gradient: "from-blue-600 to-indigo-600", icon: Zap, title: "Start from scratch", desc: "Describe your app idea", href: "/builder" },
                    { gradient: "from-purple-600 to-pink-600", icon: Layout, title: "Use a template", desc: "50+ ready-made templates", href: "/builder" },
                    { gradient: "from-emerald-600 to-teal-600", icon: Smartphone, title: "View all projects", desc: `${MOCK_PROJECTS.length} projects total`, href: "/dashboard/projects" },
                  ].map((action) => (
                    <button
                      key={action.title}
                      onClick={() => router.push(action.href)}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 text-left hover:bg-white/6 hover:border-white/10 transition-all group"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform shadow-lg`}>
                        <action.icon size={18} className="text-white" />
                      </div>
                      <div>
                                <p className="text-sm font-semibold text-white">{action.title}</p>
                                <p className="text-xs text-zinc-500">{action.desc}</p>
                            </div>
                            <ArrowRight size={16} className="ml-auto text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                        </button>
                    ))}
                </div>

                {/* Recent Projects */}
                <div>
                    <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-white">Recent Projects</h2>
                        <button
                            onClick={() => router.push("/dashboard/projects")}
                            className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                      ) : (
                        recentProjects.map((project, i) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                          >
                            <ProjectCard
                              id={project.id}
                              name={project.name}
                              updatedAt={project.updatedAt}
                              status={project.status}
                              gradient={project.gradient}
                              screens={project.screens}
                            />
                          </motion.div>
                        ))
                      )}

                        {/* New Project Card */}
                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => router.push("/builder")}
                            className="flex aspect-[4/5] items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-transparent p-6 transition-all hover:border-accent/30 hover:bg-white/3 group"
                        >
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/10 transition-colors">
                                    <Plus size={24} className="text-zinc-500 group-hover:text-accent" />
                                </div>
                                <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-200">Create New App</span>
                                <span className="text-xs text-zinc-600">Describe your idea</span>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="mt-10">
                    <h2 className="text-lg font-bold text-white mb-5">Recent Activity</h2>
                    <div className="space-y-2">
                        {[
                          { dot: "bg-purple-500", text: "AI generated 3 new screens for Fitness Tracker Pro", time: "2 hours ago" },
                          { dot: "bg-green-500", text: "Coffee Shop POS was published to App Store", time: "Yesterday" },
                          { dot: "bg-blue-500", text: "12 AI generations used in Social Media Feed", time: "3 days ago" },
                          { dot: "bg-yellow-500", text: "Recipe Finder exported as ZIP", time: "1 week ago" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3 hover:bg-white/4 transition-colors">
                            <div className={`h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                            <p className="flex-1 text-sm text-zinc-400">{item.text}</p>
                                <div className="flex items-center gap-1 text-xs text-zinc-600 shrink-0">
                                    <Clock size={11} />
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
