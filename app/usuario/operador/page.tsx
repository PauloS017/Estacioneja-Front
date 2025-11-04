"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import ValidationScreen from "@/components/validation-screen"
import HistoryScreen from "@/components/history-screen"
import LoginScreen from "@/components/login-screen"
import { loadAccessRecords, loadCurrentUser, clearCurrentUser, type AccessRecord } from "@/lib/storage"

export default function Home() {
    const [activeScreen, setActiveScreen] = useState<"validation" | "history">("history")
    const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const user = loadCurrentUser()
        setIsAuthenticated(!!user)
        setIsLoading(false)

        const records = loadAccessRecords()
        setAccessRecords(records)
    }, [])

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        clearCurrentUser()
        setIsAuthenticated(false)
        setActiveScreen("history")
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="text-gray-500">Carregando...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            <div className="flex-1 flex flex-col">
                {activeScreen === "validation" && (
                    <ValidationScreen onAccessRecorded={setAccessRecords} accessRecords={accessRecords} onLogout={handleLogout} />
                )}
                {activeScreen === "history" && <HistoryScreen accessRecords={accessRecords} onLogout={handleLogout} />}
            </div>
        </div>
    )
}
