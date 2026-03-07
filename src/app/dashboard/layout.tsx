"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { useNotifications } from "@/hooks/useNotifications";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardLayoutInner({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Handle OAuth callback tokens BEFORE auth check
    useEffect(() => {
        const token = searchParams.get('token');
        const refresh = searchParams.get('refresh');

        if (token && refresh) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refresh);
            window.location.href = '/dashboard';
        }
    }, [searchParams]);

    // Redirect if not authenticated (and not processing OAuth tokens)
    useEffect(() => {
        const token = searchParams.get('token');
        const refresh = searchParams.get('refresh');
        const hasOAuthTokens = !!(token && refresh);

        if (!isLoading && !isAuthenticated && !hasOAuthTokens) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router, searchParams]);

    const { notifications } = useNotifications(user?.id);
    const [activeToast, setActiveToast] = useState<any>(null);

    useEffect(() => {
        if (notifications.length > 0) {
            setActiveToast(notifications[0]);
            const timer = setTimeout(() => setActiveToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notifications]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex h-screen bg-background items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    // Show loading if OAuth tokens in URL being processed
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    if (!isAuthenticated && token && refresh) {
        return (
            <div className="flex h-screen bg-background items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardNav />
            <main className="flex-1 overflow-y-auto scrollbar-none pt-14 lg:pt-0">
                {children}
            </main>

            {/* Global Notification Toast */}
            <AnimatePresence>
                {activeToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed bottom-6 right-6 z-[999] max-w-sm rounded-2xl border border-white/10 bg-zinc-900/90 p-4 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                                <Bell size={20} />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                                <p className="text-sm font-bold text-white truncate">{activeToast.title}</p>
                                <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{activeToast.message}</p>
                            </div>
                            <button
                                onClick={() => setActiveToast(null)}
                                className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={
            <div className="flex h-screen bg-background items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        }>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </Suspense>
    );
}
