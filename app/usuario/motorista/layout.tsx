"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/AuthContext" // 1. Use o AuthContext
import Header from "@/components/motorista/header"

function AuthGuard({ children }: { children: React.ReactNode }) {
    
    const {  logout } = useAuth();

    // 4. Se passou em tudo, mostre o layout
    return (
        <>
            <Header onLogout={logout} />
            <div className="min-h-screen bg-white">
                {children}
            </div>
        </>
    )
}

export default function MotoristaLayout({
    children
}: {
    children: React.ReactNode
}) {
    // O Provider NÃO fica mais aqui
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    )
}