"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    loadAccessRecords,
    saveAccessRecords,
    loadCurrentUser,
    clearCurrentUser,
    saveCurrentUser,
    loadNotifications,
    saveNotifications,
    addNotification as addStorageNotification,
    type AccessRecord,
    type AuthUser,
    type Notification
} from '@/lib/storage' // Usamos o storage como "banco de dados"

// --- 1. INTERFACES ---

// Lógica de login (do login-screen.tsx)
const operators = [
    { email: "jose.antonio@estacioneja.com.br", password: "1234", name: "José Antonio" },
    { email: "maria.fernanda@estacioneja.com.br", password: "1234", name: "Maria Fernanda" },
]

// --- 2. INTERFACE DO CONTEXTO ---
interface IOperadorContext {
    isLoggedIn: boolean
    isLoading: boolean
    currentUser: AuthUser | null
    accessRecords: AccessRecord[]
    notifications: Notification[]
    login: (email: string, pass: string) => boolean
    logout: () => void
    addAccessRecord: (newRecord: AccessRecord) => void
    addNotification: (message: string) => void
}

// --- 3. CRIAÇÃO DO CONTEXTO ---
const OperadorContext = createContext<IOperadorContext | null>(null)

// --- 4. O PROVEDOR ---
export function OperadorProvider({ children }: { children: ReactNode }) {
    const router = useRouter()

    // --- ESTADO ---
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
    const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true) // Para verificar o login inicial

    // --- EFEITO INICIAL ---
    // Verifica se o usuário já está logado (no localStorage)
    useEffect(() => {
        const user = loadCurrentUser()
        if (user && user.role === 'ROLE_ADMIN') {
            setCurrentUser(user)
            setIsLoggedIn(true)
        }
        setAccessRecords(loadAccessRecords())
        setNotifications(loadNotifications())
        setIsLoading(false)
    }, [])

    // --- FUNÇÕES (AÇÕES) ---

    const login = (email: string, pass: string): boolean => {
        const operator = operators.find((op) => op.email === email && op.password === pass)

        if (operator) {
            const authUser: AuthUser = { email: operator.email, name: operator.name, role: "ROLE_ADMIN" }
            saveCurrentUser(authUser) // Salva no "banco de dados"
            setCurrentUser(authUser)
            setIsLoggedIn(true)
            return true
        }
        return false
    }

    const logout = () => {
        clearCurrentUser() // Limpa o "banco de dados"
        setCurrentUser(null)
        setIsLoggedIn(false)
        router.push("/usuario/operador/login")
    }

    // Adiciona uma notificação (no estado E no "banco de dados")
    const addNotification = (message: string) => {
        addStorageNotification(message) // Salva no localStorage
        setNotifications(loadNotifications()) // Recarrega do "banco"
    }

    // Adiciona um registro (no estado E no "banco de dados")
    const addAccessRecord = (newRecord: AccessRecord) => {
        const updatedRecords = [...accessRecords, newRecord]
        saveAccessRecords(updatedRecords) // Salva no localStorage
        setAccessRecords(updatedRecords)
    }

    // --- 5. O VALOR FORNECIDO ---
    const value = {
        isLoggedIn,
        isLoading,
        currentUser,
        accessRecords,
        notifications,
        login,
        logout,
        addAccessRecord,
        addNotification
    }

    return (
        <OperadorContext.Provider value={value}>
            {children}
        </OperadorContext.Provider>
    )
}

// --- 6. O HOOK DE ACESSO ---
export function useOperador() {
    const context = useContext(OperadorContext)
    if (!context) {
        throw new Error("useOperador deve ser usado dentro de um OperadorProvider")
    }
    return context
}