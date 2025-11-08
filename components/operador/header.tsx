"use client"

import { Bell, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { loadCurrentUser, loadNotifications, type Notification } from "../../lib/storage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

export default function Header({ onLogout }: { onLogout?: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = loadCurrentUser()
    setCurrentUser(user)

    // Load notifications initially
    setNotifications(loadNotifications())

    // Refresh notifications every 2 seconds
    const interval = setInterval(() => {
      setNotifications(loadNotifications())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">EJ</span>
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">Painel de Operador</h1>
          <p className="text-sm text-gray-600">Sistema de Controle de Acesso</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button className="relative focus:outline-none">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="end" className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Notificações</h4>
              <div className="border-t pt-2 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Nenhuma notificação</p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="py-2 border-b last:border-b-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser?.name || "Operador"} />
                <AvatarFallback className="bg-emerald-500 text-white text-sm font-bold">
                  {currentUser?.name?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt={currentUser?.name || "Operador"} />
                  <AvatarFallback className="bg-emerald-500 text-white font-bold">
                    {currentUser?.name?.charAt(0) || "O"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-gray-900">Operador:</p>
                  <p className="font-semibold text-gray-900">{currentUser?.name || "Operador"}</p>
                  <p className="text-xs text-gray-600">{currentUser?.email || ""}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Desconectar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
