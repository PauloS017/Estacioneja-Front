"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    loadCurrentUser,
    clearCurrentUser,
    type AuthUser
} from '@/lib/storage'


interface IAuthContext {
    isLoggedIn: boolean
    isLoading: boolean
    currentUser: AuthUser | null
    login: (email: string, pass: string) => AuthUser | null
    logout: () => void
    loginWithGoogle: () => AuthUser | null 
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


    const loginWithGoogle = () => {
        const api = process.env.NEXT_PUBLIC_API_KEY;

        const redirect = `${window.location.origin}/auth/callback`;

        window.location.href =
            `${api}/oauth2/authorization/google?redirect_uri=${redirect}`;
    };

    const logout = () => {
        clearCurrentUser()
        setCurrentUser(null)
        router.push("/login")
    }

    const value = {
        isLoggedIn: true,
        isLoading,
        currentUser,
        logout,
        loginWithGoogle 
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