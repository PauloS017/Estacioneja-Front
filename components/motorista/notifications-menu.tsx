"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotificationsMenuProps {
    notifications: any[]
}

export default function NotificationsMenu({ notifications }: NotificationsMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notificationsList, setNotificationsList] = useState(notifications)

    useEffect(() => {
        setNotificationsList(notifications)
    }, [notifications])

    const unreadCount = notificationsList.filter((n) => !n.read).length

    const markAsRead = (id: number) => {
        setNotificationsList(notificationsList.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    const dismissNotification = (id: number) => {
        setNotificationsList(notificationsList.filter((n) => n.id !== id))
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                    <Bell className="w-6 h-6 text-gray-600 hover:text-emerald-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="p-4 border-b sticky top-0 bg-white">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div>
                    {notificationsList.length > 0 ? (
                        notificationsList.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition group ${!notification.read ? "bg-blue-50" : ""
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dismissNotification(notification.id)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">Nenhuma notificação</p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
