"use client";

import Link from "next/link";
import { Github, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthBackground from "@/components/visuals/AuthBackground";
import { useAuth } from "@/context/AuthContext";

// 3D Tilt Effect Hook
const useTiltEffect = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  return {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered 
        ? `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg) scale3d(1.02, 1.02, 1.02)`
        : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.1s ease-out'
    }
  };
};

// Particle burst effect
const createParticleBurst = (x: number, y: number) => {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#3b82f6';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    const angle = (i / 8) * Math.PI * 2;
    const velocity = Math.random() * 60 + 40;
    const lifetime = Math.random() * 600 + 400;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
    ], {
      duration: lifetime,
      easing: 'ease-out'
    }).onfinish = () => particle.remove();
  }
};

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const tiltEffect = useTiltEffect();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    // Show loading while checking auth
    if (authLoading || isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    const validate = () => {
        if (!email) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
        if (!password) return "Password is required.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError("");
        setLoading(true);
        
        try {
            await login(email, password);
            // Success - particle burst
            const rect = e.currentTarget.getBoundingClientRect();
            createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        } catch (error: any) {
            setError(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocial = (provider: 'google' | 'github') => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        window.location.href = `${apiUrl}/auth/${provider}`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 -z-20">
                <AuthBackground />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
                {...tiltEffect}
            >
                {/* Card */}
                <div className="rounded-3xl border border-white/8 bg-zinc-900/50 p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/40 relative">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="absolute top-6 left-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    {/* Logo */}
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <Image src="/quasar-logo.svg" width={200} height={50} alt="Quasar" />
                        </Link>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-zinc-500">Sign in to start building your next app</p>
                    </div>

                    {/* Social Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => handleSocial('github')}
                            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white text-black text-sm font-bold transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-95"
                        >
                            <Github size={20} />
                            Continue with GitHub
                        </button>
                        <button
                            onClick={() => handleSocial('google')}
                            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-95"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                        By continuing, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
