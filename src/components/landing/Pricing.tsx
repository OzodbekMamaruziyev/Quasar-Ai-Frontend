"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BILLING_PLANS } from "@/lib/mock-data";

export default function Pricing() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    const getPrice = (price: number) => billing === "yearly" ? Math.round(price * 0.8) : price;

    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
                    >
                        <Zap className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Pricing</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4"
                    >
                        Simple, transparent pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-base sm:text-lg mb-8"
                    >
                        Start for free. Upgrade when you need more power.
                    </motion.p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5">
                        <button
                            onClick={() => setBilling("monthly")}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${billing === "monthly" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling("yearly")}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${billing === "yearly" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
                        >
                            Yearly
                            <span className="rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold px-1.5 py-0.5">-20%</span>
                        </button>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid gap-5 sm:grid-cols-3">
                    {BILLING_PLANS.map((plan, i) => {
                        const price = getPrice(plan.price);
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex flex-col rounded-2xl border p-6 ${plan.popular
                                        ? "border-accent/40 bg-gradient-to-b from-accent/10 to-transparent shadow-xl shadow-accent/10"
                                        : "border-white/8 bg-zinc-900/30 hover:border-white/15 transition-colors"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-lg shadow-accent/30">
                                            <Star size={10} className="fill-white" /> Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-5">
                                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                    <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-extrabold text-white">${price}</span>
                                        <span className="text-zinc-500 text-sm mb-1.5">/{plan.period === "forever" ? "forever" : "mo"}</span>
                                    </div>
                                    {billing === "yearly" && plan.price > 0 && (
                                        <p className="text-xs text-green-400 mt-1">Save ${(plan.price - price) * 12}/year</p>
                                    )}
                                </div>

                                <ul className="space-y-2.5 mb-6 flex-1">
                                    {plan.features.map((feature, fi) => (
                                        <li key={fi} className={`flex items-start gap-2 text-sm ${feature.included ? "text-zinc-300" : "text-zinc-600"}`}>
                                            <Check size={14} className={`shrink-0 mt-0.5 ${feature.included ? "text-green-400" : "text-zinc-700"}`} />
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/signup"
                                    className={`flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-bold transition-all ${plan.popular
                                            ? "bg-accent text-white hover:bg-blue-600 hover:scale-[1.02] neon-glow"
                                            : "bg-white/8 text-white hover:bg-white/15 border border-white/10"
                                        }`}
                                >
                                    {plan.price === 0 ? "Get Started Free" : "Start Free Trial"}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center text-xs text-zinc-600"
                >
                    All plans include a 14-day free trial. No credit card required.
                </motion.p>
            </div>
        </section>
    );
}
