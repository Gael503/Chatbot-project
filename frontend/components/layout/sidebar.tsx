"use client";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useState } from "react";
import { SidebarProps } from "../ui/interfaces";
import { useTranslations } from "next-intl";
import { authService } from "@/services/auth/auth.service";
import { House, Menu, Smartphone, UsersRound, MessageCircle, LogOut, Bot, X } from "lucide-react"

export default function Sidebar(props: SidebarProps) {
  const {
    currentPath,
    setPath,
    isMobileOpen,
    onMobileClose
  } = props;
  const t = useTranslations();
  const handleLogout = async () =>{
    await authService.logout();
    setPath("login")
  }
  const [isOpen, setIsOpen] = useState(true);

  const handleNavigate = (tab: string) => {
    setPath(tab);
    onMobileClose();
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex h-screen w-64 flex-col bg-gray-100 p-4 transition-all duration-300 shadow-xl/30 rounded-r-2xl md:static md:rounded-2xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          isOpen ? "md:w-64" : "md:w-20"
        }`}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className={`flex items-center ${isOpen ? "" : "md:hidden"}`}>
            <Bot />
            <p className="font-bold ml-2 mr-auto">Chatbot project</p>
          </div>
          <Button
            className="w-1 border-2 hover:bg-gray-300 p-4 cursor-pointer text-star hidden md:inline-flex"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </Button>
          <Button
            className="w-1 border-2 hover:bg-gray-300 p-4 cursor-pointer text-star md:hidden"
            onClick={onMobileClose}
          >
            <X />
          </Button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-2 text-black">
          <Button
            className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer"
            onClick={() => handleNavigate("home")}
          >
            <House />
            <p className={`ml-0 mr-auto font-bold ${isOpen ? "" : "md:hidden"}`}>{t("menu.home.title")}</p>
          </Button>

          <Button
            className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer"
            onClick={() => handleNavigate("messages")}
          >
            <MessageCircle />
            <p className={`ml-0 mr-auto font-bold ${isOpen ? "" : "md:hidden"}`}>{t("menu.messages.title")}</p>
          </Button>

          <Button
            className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer text-star"
            onClick={() => handleNavigate("users")}
          >
            <UsersRound />
            <p className={`ml-0 mr-auto font-bold ${isOpen ? "" : "md:hidden"}`}>{t("menu.users.title")}</p>
          </Button>

          <Button
            className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer text-star"
            onClick={() => handleNavigate("whatsapp")}
          >
            <Smartphone />
            <p className={`ml-0 mr-auto font-bold ${isOpen ? "" : "md:hidden"}`}>{t("menu.whatsapp.title")}</p>
          </Button>

        </nav>

        {/* Cerrar sesión */}
        <div className="mt-auto">
          <Button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut />
            <p className={`ml-0 mr-auto font-bold ${isOpen ? "" : "md:hidden"}`}>{t("menu.close_session")}</p>
          </Button>
        </div>
      </aside>
    </>
  );
}