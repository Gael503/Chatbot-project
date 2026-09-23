"use client";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useState } from "react";
import { SidebarProps } from "../ui/interfaces";
import { useTranslations } from "next-intl";
import { authService } from "@/services/auth/auth.service";
import { House, Menu, Smartphone, UsersRound, MessageCircle, LogOut, Bot } from "lucide-react"

export default function Sidebar(props: SidebarProps) {
  const {
    currentPath,
    setPath
  } = props;
  const t = useTranslations();
  const handleLogout = async () =>{
    await authService.logout();
    setPath("login")
  }
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`flex h-screen flex-col bg-gray-100 p-4 transition-all duration-300 shadow-xl/30 z-20 rounded-2xl ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        {isOpen && (
          <>
          <Bot />
          <p className="font-bold ml-2 mr-auto">Chatbot project</p>
          </>
        )}
        <Button
          className="w-1 border-2 hover:bg-gray-300 p-4 cursor-pointer text-star"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 text-black">
        <Button
          className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer"
          onClick={() => setPath("home")}
        >
          <House />
          {isOpen && <p className="ml-0 mr-auto font-bold">{t("menu.home.title")}</p>}
        </Button>

        <Button
          className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer"
          onClick={() => setPath("messages")}
        >
          <MessageCircle />
          {isOpen && <p className="ml-0 mr-auto font-bold">{t("menu.messages.title")}</p>}
        </Button>

        <Button
          className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer text-star"
          onClick={() => setPath("users")}
        >
          <UsersRound />
          {isOpen && <p className="ml-0 mr-auto font-bold">{t("menu.users.title")}</p>}
        </Button>

        <Button
          className="w-full border-2 hover:bg-gray-300 p-4 cursor-pointer text-star"
          onClick={() => setPath("whatsapp")}
        >
          <Smartphone />
          {isOpen && <p className="ml-0 mr-auto font-bold">{t("menu.whatsapp.title")}</p>}
        </Button>

      </nav>

      {/* Cerrar sesión */}
      <div className="mt-auto">
        <Button
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
        >
          <LogOut />
          {isOpen && <p className="ml-0 mr-auto font-bold">{t("menu.close_session")}</p>}
        </Button>
      </div>
    </aside>
  );
}