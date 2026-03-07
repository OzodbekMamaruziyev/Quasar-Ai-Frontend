"use client";

import { useState, useEffect } from "react";
import { Check, Zap, CreditCard, Download, Star, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { billingApi, type Plan, type Invoice } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const FALLBACK_PLANS: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        period: "forever",
        description: "Perfect for getting started",
        popular: false,
        features: [
            { text: "5 AI generations/month", included: true },
            { text: "3 projects", included: true },
            { text: "Basic templates", included: true },
            { text: "Community support", included: true },
            { text: "Custom domains", included: false },
            { text: "Advanced AI models", included: false },
            { text: "Priority support", included: false },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 29,
        period: "month",
        description: "For professionals and teams",
        popular: true,
        features: [
            { text: "Unlimited AI generations", included: true },
            { text: "Unlimited projects", included: true },
            { text: "All templates", included: true },
            { text: "Priority support", included: true },
            { text: "Custom domains", included: true },
            { text: "Advanced AI models", included: true },
            { text: "Team collaboration", included: false },
        ],
    },
    {
        id: "team",
        name: "Team",
        price: 79,
        period: "month",
        description: "For growing teams",
        popular: false,
        features: [
            { text: "Unlimited AI generations", included: true },
            { text: "Unlimited projects", included: true },
            { text: "All templates", included: true },
            { text: "Priority support", included: true },
            { text: "Custom domains", included: true },
            { text: "Advanced AI models", included: true },
            { text: "Team collaboration", included: true },
        ],
    },
];

export default function BillingPage() {
    const { user } = useAuth();
    const [currentPlan, setCurrentPlan] = useState(user?.plan?.toLowerCase() || "free");
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [toast, setToast] = useState({ msg: "", type: "success" as "success" | "error" });
    const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBillingData();
    }, []);

    useEffect(() => {
        if (user?.plan) {
            setCurrentPlan(user.plan.toLowerCase());
        }
    }, [user?.plan]);

    const fetchBillingData = async () => {
        try {
            setLoading(true);
            const [plansRes, invoicesRes] = await Promise.allSettled([
                billingApi.getPlans(),
                billingApi.getInvoices(),
            ]);

            if (plansRes.status === "fulfilled") {
                const plansData = plansRes.value.data;
                if (Array.isArray(plansData) && plansData.length > 0) {
                    setPlans(plansData);
                }
                // else keep fallback plans
            }

            if (invoicesRes.status === "fulfilled") {
                const invData = invoicesRes.value.data;
                setInvoices(Array.isArray(invData) ? invData : []);
            }
        } catch (error) {
            console.error("Failed to fetch billing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
    };

    const handleUpgrade = async (planId: string) => {
        if (planId === currentPlan || upgrading) return;

        if (planId === "free") {
            showToast("To downgrade to Free, please contact support.", "error");
            return;
        }

        setUpgrading(planId);
        try {
            const response = await billingApi.createCheckoutSession(planId);
            if (response.data?.url) {
                window.location.assign(response.data.url);
            } else {
                showToast("Payment session created! Redirecting...", "success");
            }
        } catch (error: any) {
            console.error("Failed to initiate checkout:", error);
            showToast(error?.message || "Failed to start payment. Please try again.", "error");
            setUpgrading(null);
        }
    };

    const getPrice = (price: number) => {
        if (billing === "yearly") return Math.round(price * 0.8);
        return price;
    };

    const currentPlanData = plans.find((p: Plan) => p.id === currentPlan) || plans[0];

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
                                Current Plan: <span className="text-accent capitalize">{currentPlanData?.name || currentPlan}</span>
                            </p>
                            <p className="text-xs text-zinc-500">
                                {currentPlan === "free"
                                    ? "Free forever"
                                    : `$${getPrice(currentPlanData?.price || 0)}/${billing === "yearly" ? "mo (billed yearly)" : "month"}`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            Active
                        </span>
                    </div>
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
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 h-80 animate-pulse" />
                        ))
                    ) : (
                        plans.map((plan: Plan, i: number) => {
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
                                            <span className="text-zinc-500 text-sm mb-1">/{plan.id === "free" ? "forever" : "mo"}</span>
                                        </div>
                                        {billing === "yearly" && plan.price > 0 && (
                                            <p className="text-xs text-green-400 mt-1">Save ${(plan.price - price) * 12}/year</p>
                                        )}
                                    </div>

                                    <ul className="space-y-2.5 mb-6 flex-1">
                                        {plan.features.map((feature: { text: string; included: boolean }, fi: number) => (
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
                                                ? "bg-accent text-white hover:bg-blue-600 hover:scale-[1.02]"
                                                : "bg-white/8 text-white hover:bg-white/15 border border-white/10"
                                            } disabled:opacity-70`}
                                    >
                                        {upgrading === plan.id ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : isCurrentPlan ? (
                                            "Current Plan"
                                        ) : plan.price > (currentPlanData?.price || 0) ? (
                                            "Upgrade"
                                        ) : (
                                            "Downgrade"
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
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
                        {loading ? (
                            <div className="px-6 py-8 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto" />
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <CreditCard size={32} className="text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-white mb-1">No invoices yet</p>
                                <p className="text-xs text-zinc-500">Your billing history will appear here after upgrading</p>
                            </div>
                        ) : (
                            invoices.map((invoice: Invoice) => (
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
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${invoice.status === "paid"
                                            ? "bg-green-500/15 text-green-400"
                                            : invoice.status === "pending"
                                                ? "bg-yellow-500/15 text-yellow-400"
                                                : "bg-red-500/15 text-red-400"
                                            }`}>
                                            {invoice.status}
                                        </span>
                                        <span className="text-sm font-bold text-white">{invoice.amount}</span>
                                        <button className="text-zinc-500 hover:text-white transition-colors">
                                            <Download size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Cancel Subscription */}
                {currentPlan !== "free" && (
                    <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <h3 className="text-sm font-bold text-red-400 mb-1">Cancel Subscription</h3>
                        <p className="text-xs text-zinc-500 mb-3">You will lose access to Pro features at the end of your billing period.</p>
                        <button
                            onClick={() => showToast("Please contact support to cancel your subscription.", "error")}
                            className="text-xs font-semibold text-red-400 hover:text-red-300 underline transition-colors"
                        >
                            Cancel subscription
                        </button>
                    </div>
                )}
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast.msg && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-xl z-50 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
                    >
                        {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
