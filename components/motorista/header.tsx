"use client"

import ProfileMenu from "@/components/motorista/profile-menu"
import NotificationsMenu from "@/components/motorista/notifications-menu"

interface HeaderProps {
  currentScreen: string
  onNavigate: (
    screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history" | "parking-history",
  ) => void
  onLogout: () => void
  notifications: any[]
  userProfile: any
}

export default function Header({ onNavigate, currentScreen, onLogout, notifications, userProfile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="text-2xl font-bold">
            <span className="text-emerald-600">Estacione</span>
            <span className="text-yellow-500">Já</span>
          </div>
          <span className="text-xs text-gray-500">SUA VAGA GARANTIDA</span>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => onNavigate("home")}
            className={`font-medium transition-colors ${currentScreen === "home" ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
              }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("history")}
            className={`font-medium transition-colors ${currentScreen === "history" ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
              }`}
          >
            Histórico
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <NotificationsMenu notifications={notifications} />
          <ProfileMenu onNavigate={onNavigate} onLogout={onLogout} userProfile={userProfile} />
        </div>
      </div>
    </header>
  )
}
