"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Star, ShoppingBag, Activity, TrendingUp, User, BarChart2, Target } from "lucide-react";

// Local templates data - static landing page content
const APP_TEMPLATES = [
  { id: "1", name: "E-Commerce", emoji: "🛍️", description: "Full shopping app with cart & checkout", screens: 12 },
  { id: "2", name: "Social Network", emoji: "👥", description: "Feed, stories, messaging & profiles", screens: 18 },
  { id: "3", name: "Food Delivery", emoji: "🍕", description: "Restaurant listing, ordering & tracking", screens: 14 },
  { id: "4", name: "Fitness App", emoji: "💪", description: "Workouts, nutrition & progress tracking", screens: 10 },
  { id: "5", name: "Finance App", emoji: "💳", description: "Banking, budgeting & investments", screens: 16 },
  { id: "6", name: "Travel App", emoji: "✈️", description: "Booking, itineraries & local guides", screens: 20 },
  { id: "7", name: "Education", emoji: "📚", description: "Courses, quizzes & progress tracking", screens: 15 },
  { id: "8", name: "Healthcare", emoji: "🏥", description: "Appointments, records & telemedicine", screens: 13 },
];

const SHOWCASE_ITEMS = [
  {
    title: "E-Commerce App",
    prompt: '"Build a modern e-commerce app with product listings, cart, and checkout"',
    time: "4 min",
    rating: "4.9",
    gradient: "from-blue-600 to-cyan-500",
    bgGradient: "from-blue-900/40 to-cyan-900/20",
    screenIcons: [ShoppingBag, User, ShoppingBag, User],
    screenLabels: ["Products", "Cart", "Checkout", "Profile"],
    accentColor: "bg-blue-500",
  },
  {
    title: "Fitness Tracker",
    prompt: '"Create a fitness tracker with workout plans, calorie counter, and progress charts"',
    time: "2 min",
    rating: "5.0",
    gradient: "from-purple-600 to-pink-500",
    bgGradient: "from-purple-900/40 to-pink-900/20",
    screenIcons: [Activity, BarChart2, Activity, Target],
    screenLabels: ["Dashboard", "Workouts", "Progress", "Nutrition"],
    accentColor: "bg-purple-500",
  },
  {
    title: "Finance Dashboard",
    prompt: '"Design a personal finance app with budget tracking and investment portfolio"',
    time: "5 min",
    rating: "4.8",
    gradient: "from-emerald-600 to-teal-500",
    bgGradient: "from-emerald-900/40 to-teal-900/20",
    screenIcons: [TrendingUp, BarChart2, Target, User],
    screenLabels: ["Overview", "Portfolio", "Expenses", "Goals"],
    accentColor: "bg-emerald-500",
  },
];

export default function Showcase() {
    return (
        <section id="showcase" className="py-20 px-4 sm:px-6 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
                        >
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Showcase</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                        >
                            Built with Quasar
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 max-w-xl text-base text-zinc-400 sm:text-lg"
                        >
                            Stunning mobile apps generated entirely from simple text descriptions. No code required.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/builder"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-blue-400 transition-colors"
                        >
                            Browse all templates <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Showcase Cards */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {SHOWCASE_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 hover:border-white/10 transition-all hover:-translate-y-1"
                        >
                            {/* Phone Preview Area */}
                            <div className={`relative h-72 sm:h-80 overflow-hidden bg-linear-to-br ${item.gradient} bg-opacity-10`}>
                                <div className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                                {/* Centered Phone */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                      animate={{ y: [0, -8, 0] }}
                                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                                      className="w-40 rounded-4xl border-[7px] border-zinc-900 bg-zinc-950 shadow-2xl ring-1 ring-white/10"
                                    >
                                      <div className="relative aspect-9/19 overflow-hidden rounded-3xl">
                                        {/* Screen content */}
                                        <div className={`absolute inset-0 bg-linear-to-b ${item.bgGradient}`} />
                                        <div className="relative flex h-full flex-col gap-2 p-3">
                                          <div className={`h-8 w-full rounded-lg bg-linear-to-r ${item.gradient} opacity-70`} />
                                          <div className="grid grid-cols-2 gap-1.5 flex-1">
                                            {item.screenIcons.map((Icon, i) => (
                                              <div key={i} className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-1.5 gap-1 border border-white/5">
                                                <Icon size={14} className="text-white/60" />
                                                <span className="text-[8px] text-zinc-500 text-center leading-tight">{item.screenLabels[i]}</span>
                                              </div>
                                            ))}
                                          </div>
                                          <div className={`h-6 w-full rounded-lg bg-linear-to-r ${item.gradient} opacity-50`} />
                                        </div>
                                        {/* Dynamic Island */}
                                        <div className="absolute top-1.5 left-1/2 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black" />
                                      </div>
                                    </motion.div>
                                  </div>

                                {/* Stats overlay */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
                                        <Clock className="h-3 w-3 text-zinc-400" />
                                        {item.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                        {item.rating}
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-xs text-zinc-500 italic leading-relaxed mb-4">{item.prompt}</p>
                                <Link
                                    href="/builder"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-blue-400 transition-colors"
                                >
                                    Build something similar <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Templates Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20"
                >
                    <h3 className="text-xl font-bold text-white mb-2">Start from a template</h3>
                    <p className="text-zinc-500 text-sm mb-8">Pick a template and customize it with AI in seconds.</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                      {APP_TEMPLATES.map((template, i) => {
                        const gradients = [
                          "from-blue-600 to-cyan-500",
                          "from-purple-600 to-pink-500",
                          "from-emerald-600 to-teal-500",
                          "from-orange-600 to-yellow-500",
                          "from-rose-600 to-red-500",
                          "from-indigo-600 to-violet-500",
                          "from-amber-600 to-orange-500",
                          "from-teal-600 to-green-500",
                        ];
                        return (
                          <Link
                            key={template.id}
                            href="/builder"
                            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/3 p-4 text-center hover:bg-white/8 hover:border-white/10 transition-all overflow-hidden"
                          >
                            <div className={`h-8 w-8 rounded-xl bg-linear-to-br ${gradients[i % gradients.length]} group-hover:scale-110 transition-transform shadow-lg`} />
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors leading-tight">{template.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
