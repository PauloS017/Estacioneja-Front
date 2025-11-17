"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ProfileMenu from "@/components/motorista/profile-menu"
import NotificationsMenu from "@/components/motorista/notifications-menu"

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/usuario/motorista" className="flex items-center gap-2 cursor-pointer">
          <div className="text-2xl font-bold">
            <span className="text-emerald-600">Estacione</span>
            <span className="text-yellow-500">Já</span>
          </div>
          <span className="text-xs text-gray-500">SUA VAGA GARANTIDA</span>
          
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/usuario/motorista"
            className={`font-medium transition-colors ${pathname === "/usuario/motorista"
                ? "text-emerald-600"
                : "text-gray-700 hover:text-emerald-600"
              }`}
          >
            Home
          </Link>
          <Link
            href="/usuario/motorista/historico"
            className={`font-medium transition-colors ${pathname === "/usuario/motorista/historico"
                ? "text-emerald-600"
                : "text-gray-700 hover:text-emerald-600"
              }`}
          >
            Histórico
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* NotificationsMenu não recebe props */}
          <NotificationsMenu />

          {/* ProfileMenu recebe APENAS onLogout */}
          <ProfileMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}