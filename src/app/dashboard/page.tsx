"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers, Zap, CreditCard, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    const quickLinks = [
        {
            title: "Projects",
            description: "View and manage your projects",
            href: "/dashboard/projects",
            icon: Layers,
            color: "bg-blue-500/20 text-blue-400",
        },
        {
            title: "New Build",
            description: "Start a new AI-powered build",
            href: "/builder",
            icon: Zap,
            color: "bg-purple-500/20 text-purple-400",
        },
        {
            title: "Billing",
            description: "Manage your subscription",
            href: "/dashboard/billing",
            icon: CreditCard,
            color: "bg-green-500/20 text-green-400",
        },
        {
            title: "Settings",
            description: "Account preferences",
            href: "/dashboard/settings",
            icon: Settings,
            color: "bg-zinc-500/20 text-zinc-400",
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Welcome back{user?.name ? `, ${user.name}` : ""}!
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        What would you like to do today?
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:border-white/10 hover:bg-white/10"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`rounded-xl p-3 ${link.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <ArrowRight
                                        size={20}
                                        className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white"
                                    />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-bold text-white">{link.title}</h3>
                                    <p className="mt-1 text-sm text-zinc-500">{link.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* User Info Card */}
                <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">Account Info</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                                Plan: <span className="text-accent font-semibold">{user?.plan || "FREE"}</span>
                            </p>
                        </div>
                        <Link
                            href="/dashboard/billing"
                            className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-600"
                        >
                            Upgrade Plan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
