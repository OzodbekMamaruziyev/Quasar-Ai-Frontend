import Link from "next/link";
import { Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import Image from "next/image";

const navigation = {
    product: [
        { name: "Features", href: "/#features" },
        { name: "Showcase", href: "/#showcase" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Templates", href: "/builder" },
    ],
    platform: [
        { name: "Builder", href: "/builder" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Projects", href: "/dashboard/projects" },
        { name: "Billing", href: "/dashboard/billing" },
    ],
    company: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>

            {/* CTA Banner */}
            <div className="border-b border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-white/10 p-8 sm:p-12 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
                        <div className="relative">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                Ready to build your app?
                            </h2>
                            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                                Join 10,000+ developers building mobile apps with AI. Start for free, no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-bold text-white hover:bg-blue-600 hover:scale-105 transition-all neon-glow"
                                >
                                    Start Building Free <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 pt-12 sm:pt-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/quasar-logo.svg" width={200} height={50} alt="Quasar" />
                        </Link>
                        <p className="text-sm leading-6 text-zinc-400 max-w-xs">
                            Build production-ready React Native applications instantly through conversational AI. No code required.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-12 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {navigation.product.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
                            <ul className="space-y-3">
                                {navigation.platform.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {navigation.company.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">
                        &copy; 2026 Quasar, Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
