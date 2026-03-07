"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, LayoutDashboard, FolderKanban, CreditCard, Settings, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Projects", icon: FolderKanban, href: "/dashboard/projects" },
    { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function NavContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        if (onClose) onClose();
    };

    // Get initials from user name
    const getInitials = (name: string | undefined) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex h-full flex-col p-4">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
                    <Image src="/quasar-logo.svg" width={160} height={40} alt="Quasar" />
                </Link>
                {onClose && (
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors lg:hidden">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-accent/10 text-accent border border-accent/15"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                            )}
                        >
                            <item.icon size={17} className="shrink-0" />
                            {item.name}
                            {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                        </Link>
                    );
                })}

                <div className="mt-4 pt-4 border-t border-white/5">
                    <Link
                        href="/builder"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/15 px-3 py-2.5 text-sm font-bold text-accent hover:bg-accent/20 transition-all"
                    >
                        <Zap size={17} className="fill-accent shrink-0" />
                        Open Builder
                    </Link>
                </div>
            </nav>

            {/* User + Sign Out */}
            <div className="border-t border-white/5 pt-4 space-y-2">
                <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 bg-white/3 hover:bg-white/8 transition-all"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-accent to-indigo-600 text-xs font-bold text-white shrink-0">
                        {user ? getInitials(user.name) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'Loading...'}</p>
                        <p className="text-[10px] text-zinc-600 truncate">{user?.plan || 'FREE'} Plan</p>
                    </div>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut size={17} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default function DashboardNav() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex h-screen w-60 flex-col border-r border-white/5 bg-zinc-950 shrink-0">
                <NavContent />
            </div>

            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-zinc-950/95 backdrop-blur-xl px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/quasar-logo.svg" width={140} height={40} alt="Quasar" />
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-zinc-950 border-r border-white/5 lg:hidden"
                        >
                            <NavContent onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
