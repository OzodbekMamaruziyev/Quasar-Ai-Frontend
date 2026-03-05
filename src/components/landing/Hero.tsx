"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import GalaxyBackground from "@/components/visuals/GalaxyBackground";

// Particle burst effect
const createParticleBurst = (x: number, y: number) => {
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = '#3b82f6';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    const angle = (i / 12) * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const lifetime = Math.random() * 800 + 600;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
    ], {
      duration: lifetime,
      easing: 'ease-out'
    }).onfinish = () => particle.remove();
  }
};

// 3D Tilt Hook
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
        ? `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg) scale3d(1.05, 1.05, 1.05)`
        : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.1s ease-out'
    }
  };
};

// Typing Animation Hook
const useTypingEffect = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

export default function Hero() {
    const [showDemo, setShowDemo] = useState(false);
    const tiltEffect = useTiltEffect();
    const typingText = useTypingEffect("Think It. Type It. Ship It", 100);

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-20">
            <div className="absolute inset-0 -z-10">
                <GalaxyBackground />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
                >
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium tracking-wide text-zinc-300 uppercase">
                        The future of mobile development is here
                    </span>
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">New</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                    {...tiltEffect}
                >
                    <motion.span
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent"
                    >
                        Think
                    </motion.span>
                    {" "}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="text-white"
                    >
                        It.
                    </motion.span>
                    {" "}
                    <motion.span
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent"
                    >
                        Type
                    </motion.span>
                    {" "}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.75, duration: 0.4 }}
                        className="text-white"
                    >
                        It.
                    </motion.span>
                    {" "}
                    <motion.span
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent"
                    >
                        Ship
                    </motion.span>
                    {" "}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.25, duration: 0.4 }}
                        className="text-white"
                    >
                        It.
                    </motion.span>
                </motion.h1>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mx-auto mb-10 max-w-3xl"
                >
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-x-10 -top-2 -bottom-2 -z-10 mx-auto h-24 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 blur-2xl"
                    />
                    <p className="text-center text-[17px] leading-relaxed text-zinc-300 sm:text-lg md:text-xl">
                        <span className="text-white font-semibold">Generate</span>{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent font-bold">
                            production-ready React Native
                        </span>{" "}
                        code <span className="text-accent font-semibold">instantly</span>.
                        {" "}
                        <span className="text-zinc-300">
                            Build, preview, and deploy high-end mobile experiences
                        </span>{" "}
                        without <span className="text-accent/90 font-semibold">boilerplate</span>.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Link
                        href="/builder"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                        }}
                        className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent px-8 text-base font-bold text-white transition-all hover:scale-105 hover:bg-blue-600 neon-glow sm:w-auto sm:text-lg"
                    >
                        Start Building Free
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button
                        onClick={() => setShowDemo(true)}
                        aria-label="Watch demo video"
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto sm:text-lg"
                    >
                        <Play className="h-4 w-4 fill-white" />
                        Watch Demo
                    </button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-24 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500"
                >
                    <span className="flex items-center gap-1.5">
                        <span className="text-yellow-400">★★★★★</span> 4.9/5 rating
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700 hidden sm:block" />
                    <span>10,000+ apps built</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700 hidden sm:block" />
                    <span>No credit card required</span>
                </motion.div>
            </div>

            {/* Demo Modal */}
            <AnimatePresence>
                {showDemo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowDemo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <h3 className="text-lg font-bold text-white">Quasar Demo</h3>
                                <button
                                    onClick={() => setShowDemo(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="aspect-video bg-zinc-950 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
                                        <Play className="h-10 w-10 fill-accent text-accent ml-1" />
                                    </div>
                                    <p className="text-zinc-400 text-sm">Demo video coming soon</p>
                                    <Link
                                        href="/builder"
                                        onClick={() => setShowDemo(false)}
                                        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-all"
                                    >
                                        Try it live instead <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
