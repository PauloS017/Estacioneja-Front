"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/AuthContext" // 1. Use o AuthContext
import Header from "@/components/motorista/header"
import { Spinner } from '@/components/ui/spinner'

function AuthGuard({ children }: { children: React.ReactNode }) {
    // 2. Pegue os dados do AuthContext
    const { isLoggedIn, isLoading, currentUser, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.replace("/login"); // Se não tá logado, vá pro login
        }

        // 3. VERIFICAÇÃO DE PAPEL (ROLE)
        if (!isLoading && isLoggedIn && currentUser?.role !== "motorista") {
            // Se está logado mas NÃO É motorista, expulse.
            logout(); // Desloga e redireciona
        }
    }, [isLoggedIn, isLoading, currentUser, router, logout]);

    if (isLoading || !isLoggedIn || currentUser?.role !== "motorista") {
        // Se estiver carregando ou se não for motorista, mostre o loader
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

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