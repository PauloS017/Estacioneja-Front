"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    loadCurrentUser,
    clearCurrentUser,
    saveCurrentUser,
    type AuthUser
} from '@/lib/storage'

// ... (Array 'allUsers' continua o mesmo) ...
const allUsers = [
    { email: "larissa.nagoia@gmail.com.br", password: "123", name: "Larissa Nagoia", role: "motorista" },
    { email: "jose.antonio@estacioneja.com.br", password: "1234", name: "José Antonio", role: "operator" },
    { email: "joao.odilon@estacioneja.com.br", password: "1234", name: "João Odilon", role: "operator" },
    { email: "luan.Silva@gmail.com.br", password: "123", name: "Luan Silva", role: "motorista" },
];

// --- Interface do Contexto ---
interface IAuthContext {
    isLoggedIn: boolean
    isLoading: boolean
    currentUser: AuthUser | null
    login: (email: string, pass: string) => AuthUser | null
    logout: () => void
    loginWithGoogle: () => AuthUser | null // <--- 1. ADICIONE A NOVA FUNÇÃO AQUI
}

const AuthContext = createContext<IAuthContext | null>(null)

// --- O Provedor ---
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const user = loadCurrentUser()
        if (user) { setCurrentUser(user) }
        setIsLoading(false)
    }, [])

    // Função de Login (Email/Senha)
    const login = (email: string, pass: string): AuthUser | null => {
        const foundUser = allUsers.find(
            (user) => user.email === email && user.password === pass
        );

        if (foundUser) {
            const authUser: AuthUser = {
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role as "operator" | "motorista"
            }
            saveCurrentUser(authUser)
            setCurrentUser(authUser)
            return authUser
        }
        return null
    }

    const loginWithGoogle = (): AuthUser | null => {
        // --- SIMULAÇÃO (PARA O TÓPICO 1) ---
        // No futuro, aqui você fará a chamada da API do Google
        // (ex: usando NextAuth, faria: signIn('google'))

        // Por agora, vamos simular que o Google retornou o usuário "larissa"
        console.log("Simulando login com Google...");

        // Reutilizamos nossa função de login principal com os dados simulados
        const googleUser = login("larissa.nagoia@gmail.com.br", "123");

        return googleUser; // Retorna o usuário logado (ou nulo se falhar)
    }

    // Função de Logout
    const logout = () => {
        clearCurrentUser()
        setCurrentUser(null)
        router.push("/login")
    }

    const value = {
        isLoggedIn: !!currentUser,
        isLoading,
        currentUser,
        login,
        logout,
        loginWithGoogle // <--- 3. ADICIONE A FUNÇÃO AO "VALUE"
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// --- O Hook de Acesso ---
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider")
    }
    return context
}