"use client";

import { motion } from "framer-motion";
import { MessageSquareCode, Smartphone, Zap, Download, Layers, GitBranch, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

const FEATURES = [
    {
        icon: <MessageSquareCode className="h-6 w-6" />,
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
        title: "Text to Native Code",
        description: "Describe your app in plain English. Our AI instantly translates your ideas into clean, maintainable React Native components.",
        stat: "10x faster",
    },
    {
        icon: <Smartphone className="h-6 w-6" />,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10 border-indigo-500/20",
        title: "Live Mobile Preview",
        description: "See your changes in real-time. Our built-in mobile simulator reflects your code edits instantly with hot reload.",
        stat: "Real-time",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/20",
        title: "Lightning Fast Iteration",
        description: "Tweak colors, layouts, and logic just by chatting. Build the perfect UI in minutes, not days.",
        stat: "< 3 seconds",
    },
    {
        icon: <Download className="h-6 w-6" />,
        color: "text-green-400",
        bg: "bg-green-500/10 border-green-500/20",
        title: "Export & Deploy",
        description: "Download your full project as a ZIP or sync directly to GitHub. 100% yours, ready for the App Store.",
        stat: "One click",
    },
    {
        icon: <Layers className="h-6 w-6" />,
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/20",
        title: "Premium Templates",
        description: "Start from 50+ professionally designed templates. E-commerce, social, fitness, finance — all ready to customize.",
        stat: "50+ templates",
    },
    {
        icon: <GitBranch className="h-6 w-6" />,
        color: "text-pink-400",
        bg: "bg-pink-500/10 border-pink-500/20",
        title: "Version History",
        description: "Every generation is saved. Roll back to any previous version of your app with a single click.",
        stat: "Unlimited history",
    },
    {
        icon: <Shield className="h-6 w-6" />,
        color: "text-teal-400",
        bg: "bg-teal-500/10 border-teal-500/20",
        title: "Production Ready",
        description: "Generated code follows best practices — TypeScript, proper state management, accessibility, and performance optimized.",
        stat: "Best practices",
    },
    {
        icon: <Sparkles className="h-6 w-6" />,
        color: "text-orange-400",
        bg: "bg-orange-500/10 border-orange-500/20",
        title: "GPT-4o Powered",
        description: "Powered by the latest OpenAI models for the most accurate, context-aware code generation available.",
        stat: "GPT-4o",
    },
];

export default function Features() {
    return (
        <section id="features" className="relative py-20 px-4 sm:px-6 sm:py-32">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)]" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Features</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        Everything you need to build apps{" "}
                        <br className="hidden sm:block" />
                        <span className="text-zinc-500">faster than ever before.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-base text-zinc-500 sm:text-lg"
                    >
                        A complete suite of tools designed to take you from idea to deployable native app in record time.
                    </motion.p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.07 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/20 p-6 transition-all hover:bg-zinc-900/50 hover:border-white/10 hover:-translate-y-1"
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/3 to-transparent" />

                            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${feature.bg} ${feature.color}`}>
                                {feature.icon}
                            </div>

                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                                <span className="text-xs font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">{feature.stat}</span>
                            </div>

                            <p className="text-sm leading-relaxed text-zinc-500">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-600 hover:scale-105 transition-all neon-glow"
                    >
                        <Zap className="h-4 w-4 fill-white" />
                        Start Building for Free
                    </Link>
                    <p className="mt-3 text-xs text-zinc-600">No credit card required · Free forever plan available</p>
                </motion.div>
            </div>
        </section>
    );
}
