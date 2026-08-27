"use client"
import Sidebar from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const activeTab = pathname.split('/').pop() || 'conciliacion';
    const setActiveTab = (tab: any) => {
        // console.log("Llego: ", tab);
        router.push(`/${tab}`)
    }
    return(
        <div className="flex min-h-screen">
            <Sidebar
                currentPath={activeTab}
                setPath={setActiveTab}
            />
            <main className="flex-1 bg-gray-100 p-6 text-black">
                {children}
            </main>
        </div>
    )
}