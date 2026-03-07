"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
    { label: "Features", href: "/#features" },
    { label: "Showcase", href: "/#showcase" },
    { label: "Pricing", href: "/#pricing" },
];

const AUTH_NAV_LINKS = [
    { label: "Features", href: "/#features" },
    { label: "Showcase", href: "/#showcase" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = isAuthenticated ? AUTH_NAV_LINKS : NAV_LINKS;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/8 bg-black/80 backdrop-blur-2xl shadow-xl shadow-black/20" : "bg-transparent"}`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                    <Image src="/quasar-logo.svg" width={200} height={50} alt="Quasar" priority />
                </Link>

                {/* Desktop Links */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                    ? "text-white bg-white/8"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {isAuthenticated && user ? (
                        <button
                            onClick={() => router.push('/dashboard/settings')}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:bg-white/10"
                        >
                            <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-white">{user.name}</span>
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white px-3 py-2">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="flex h-9 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-blue-600 neon-glow"
                            >
                                Start Building Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-all md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-b border-white/5 bg-black/95 backdrop-blur-2xl md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-4 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-4">
                                {isAuthenticated && user ? (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push('/dashboard/settings');
                                        }}
                                        className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-base font-semibold text-white"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span>{user.name}</span>
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base font-semibold text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="flex h-12 items-center justify-center rounded-xl bg-accent text-base font-bold text-white shadow-lg shadow-blue-500/20"
                                        >
                                            Start Building Free
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
