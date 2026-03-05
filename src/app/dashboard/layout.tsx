"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardNav />
            <main className="flex-1 overflow-y-auto scrollbar-none pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
