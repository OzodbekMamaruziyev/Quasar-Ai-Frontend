"use client";

import { useState } from "react";
import { Check, Zap, CreditCard, Download, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BILLING_PLANS, MOCK_INVOICES } from "@/lib/mock-data";

export default function BillingPage() {
    const [currentPlan, setCurrentPlan] = useState("pro");
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [toast, setToast] = useState("");

    const handleUpgrade = async (planId: string) => {
        if (planId === currentPlan) return;
        setUpgrading(planId);
        await new Promise((r) => setTimeout(r, 1500));
        setCurrentPlan(planId);
        setUpgrading(null);
        setToast(`Successfully switched to ${BILLING_PLANS.find(p => p.id === planId)?.name} plan!`);
        setTimeout(() => setToast(""), 3000);
    };

    const getPrice = (price: number) => {
        if (billing === "yearly") return Math.round(price * 0.8);
        return price;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Billing & Plans</h1>
                    <p className="mt-1 text-sm text-zinc-500">Manage your subscription and payment details.</p>
                </div>

                {/* Current Plan Banner */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                            <Zap size={20} className="text-accent" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                Current Plan: <span className="text-accent">{BILLING_PLANS.find(p => p.id === currentPlan)?.name}</span>
                            </p>
                            <p className="text-xs text-zinc-500">
                                ${getPrice(BILLING_PLANS.find(p => p.id === currentPlan)?.price || 0)}/{billing === "yearly" ? "mo (billed yearly)" : "month"} · Renews Mar 1, 2026
                            </p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
                        Cancel subscription
                    </button>
                </div>

                {/* Billing Toggle */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    <span className={`text-sm font-medium ${billing === "monthly" ? "text-white" : "text-zinc-500"}`}>Monthly</span>
                    <button
                        onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                        className={`relative h-6 w-12 rounded-full transition-colors ${billing === "yearly" ? "bg-accent" : "bg-white/10"}`}
                    >
                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${billing === "yearly" ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button>
                    <span className={`text-sm font-medium ${billing === "yearly" ? "text-white" : "text-zinc-500"}`}>
                        Yearly
                        <span className="ml-1.5 rounded-full bg-green-500/15 text-green-400 text-xs font-bold px-2 py-0.5">Save 20%</span>
                    </span>
                </div>

                {/* Plans Grid */}
                <div className="grid gap-4 sm:grid-cols-3 mb-12">
                    {BILLING_PLANS.map((plan, i) => {
                        const isCurrentPlan = plan.id === currentPlan;
                        const price = getPrice(plan.price);

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${plan.popular
                                        ? "border-accent/40 bg-accent/5 shadow-lg shadow-accent/10"
                                        : isCurrentPlan
                                            ? "border-white/20 bg-white/5"
                                            : "border-white/8 bg-zinc-900/30 hover:border-white/15"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-lg shadow-accent/30">
                                            <Star size={10} className="fill-white" /> Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                    <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-extrabold text-white">${price}</span>
                                        <span className="text-zinc-500 text-sm mb-1">/{plan.period === "forever" ? "forever" : "mo"}</span>
                                    </div>
                                    {billing === "yearly" && plan.price > 0 && (
                                        <p className="text-xs text-green-400 mt-1">Save ${(plan.price - price) * 12}/year</p>
                                    )}
                                </div>

                                <ul className="space-y-2.5 mb-6 flex-1">
                                    {plan.features.map((feature, fi) => (
                                        <li key={fi} className={`flex items-start gap-2.5 text-sm ${feature.included ? "text-zinc-300" : "text-zinc-600"}`}>
                                            <Check size={15} className={`shrink-0 mt-0.5 ${feature.included ? "text-green-400" : "text-zinc-700"}`} />
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrentPlan || upgrading === plan.id}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${isCurrentPlan
                                            ? "bg-white/5 text-zinc-500 cursor-default border border-white/10"
                                            : plan.popular
                                                ? "bg-accent text-white hover:bg-blue-600 hover:scale-[1.02] neon-glow"
                                                : "bg-white/8 text-white hover:bg-white/15 border border-white/10"
                                        }`}
                                >
                                    {upgrading === plan.id ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Switching...
                                        </>
                                    ) : isCurrentPlan ? (
                                        "Current Plan"
                                    ) : plan.price > (BILLING_PLANS.find(p => p.id === currentPlan)?.price || 0) ? (
                                        "Upgrade"
                                    ) : (
                                        "Downgrade"
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Payment Method */}
                <div className="mb-8 rounded-2xl border border-white/8 bg-zinc-900/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white">Payment Method</h2>
                        <button className="text-sm font-semibold text-accent hover:text-blue-400 transition-colors">Update</button>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs font-bold">
                            VISA
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">•••• •••• •••• 4242</p>
                            <p className="text-xs text-zinc-500">Expires 12/2027</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            Active
                        </div>
                    </div>
                </div>

                {/* Invoices */}
                <div className="rounded-2xl border border-white/8 bg-zinc-900/30 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                        <h2 className="text-base font-bold text-white">Invoice History</h2>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-white transition-colors">
                            <Download size={14} /> Export all
                        </button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {MOCK_INVOICES.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                                        <CreditCard size={16} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{invoice.id}</p>
                                        <p className="text-xs text-zinc-500">{invoice.date} · {invoice.plan} Plan</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${invoice.status === "paid" ? "bg-green-500/15 text-green-400" :
                                            invoice.status === "pending" ? "bg-yellow-500/15 text-yellow-400" :
                                                "bg-red-500/15 text-red-400"
                                        }`}>
                                        {invoice.status}
                                    </span>
                                    <span className="text-sm font-bold text-white">{invoice.amount}</span>
                                    <button className="text-zinc-500 hover:text-white transition-colors">
                                        <Download size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-xl z-50"
                    >
                        <Check size={16} />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
