"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SidebarProps } from "./interfaces";
import image from "../../public/image.jpeg"
import { useTranslations } from "next-intl";
import { authService } from "@/services/auth/auth.service";

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
      className={`flex h-screen flex-col border-r bg-white p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        {/* {isOpen && (
          <Image
            src={image}
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
        )} */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        <button
          className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          onClick={() => setPath("home")}
        >
          {isOpen ? t("menu.home") : "📊"}
        </button>

        <button
          className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          onClick={() => setPath("messages")}
        >
          {isOpen ? t("menu.messages") : "👤"}
        </button>

        <button
          className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          onClick={() => setPath("status")}
        >
          {isOpen ? t("menu.status") : "⚙️"}
        </button>
      </nav>

      {/* Cerrar sesión */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
        >
          {isOpen ? t("menu.close_session") : "🚪"}
        </button>
      </div>
    </aside>
  );
}