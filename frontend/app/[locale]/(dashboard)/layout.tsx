"use client"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const activeTab = pathname.split('/').pop() || 'conciliacion';
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const setActiveTab = (tab: any) => {
        router.push(`/${tab}`)
    }
    return(
        <div className="flex min-h-screen">
            <Sidebar
                currentPath={activeTab}
                setPath={setActiveTab}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <main className="flex-1 p-4 m-2 rounded-2xl border border-gray-200 min-w-0">
                <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
                {children}
            </main>
        </div>
    )
}