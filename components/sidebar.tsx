"use client"

import { Menu, User, Calendar } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
    activeScreen: "validation" | "history"
    setActiveScreen: (screen: "validation" | "history") => void
}

export default function Sidebar({ activeScreen, setActiveScreen }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true)

    const menuItems = [
        {
            id: "validation",
            label: "Validação de credenciais",
            icon: User,
        },
        {
            id: "history",
            label: "Histórico de Acessos",
            icon: Calendar,
        },
    ]

    return (
        <aside className={`${isOpen ? "w-72" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300`}>
            <div className="p-4 border-b border-gray-200">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Menu className="w-6 h-6 text-gray-800" />
                </button>
            </div>

            <nav className="pt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeScreen === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveScreen(item.id as "validation" | "history")}
                            className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${isActive ? "bg-gray-100 text-gray-900 border-l-4 border-emerald-500" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}
