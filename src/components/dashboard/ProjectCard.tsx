"use client";

import { motion } from "framer-motion";
import { ExternalLink, Trash2, Layers } from "lucide-react";
import Link from "next/link";
import { ProjectStatus } from "@/lib/mock-data";
import { useState } from "react";

export interface ProjectCardProps {
  id: string;
  name: string;
  updatedAt: string;
  previewUrl?: string;
  status?: ProjectStatus;
  gradient?: string;
  screens?: number;
  onDelete?: (id: string) => void;
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  published: "bg-green-500/15 text-green-400 border-green-500/20",
  archived: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

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
        ? `perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg) scale3d(1.02, 1.02, 1.02)`
        : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.2s ease-out'
    }
  };
};

export default function ProjectCard({
  id,
  name,
  updatedAt,
  status = "draft",
  gradient = "from-blue-600 to-indigo-600",
  screens = 0,
  onDelete,
}: ProjectCardProps) {
  const tiltEffect = useTiltEffect();
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 transition-all hover:bg-zinc-900/60 hover:border-white/15 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
      {...tiltEffect}
    >
      <Link href={`/builder?id=${id}`} className="flex-1">
        {/* Gradient Preview Area */}
        <div className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${gradient}`}>
          {/* Simulated app UI overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            {/* Fake UI elements */}
            <div className="flex gap-2">
              <div className="h-2 w-16 rounded-full bg-white/30" />
              <div className="h-2 w-10 rounded-full bg-white/20" />
            </div>
            <div className="h-7 w-full rounded-lg bg-white/15 backdrop-blur-sm" />
          </div>
          {/* Top fake header */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-white/30" />
            <div className="h-5 w-5 rounded-full bg-white/20" />
          </div>
          {/* Middle content */}
          <div className="absolute top-10 left-3 right-3 space-y-2">
            <div className="h-16 w-full rounded-xl bg-white/10 backdrop-blur-sm" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 rounded-lg bg-white/10" />
              <div className="h-10 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors leading-tight line-clamp-1">
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-600">Updated {updatedAt}</p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-600">
              <Layers size={10} />
              {screens} screens
            </div>
          </div>

          {status && (
            <div className="mt-3">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
                {status}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Hover Actions */}
      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={`/builder?id=${id}`}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-zinc-400 backdrop-blur-md hover:text-white transition-colors border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={13} />
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); onDelete?.(id); }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500 backdrop-blur-md hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
