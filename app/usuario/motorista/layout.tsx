"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// 👇 NÃO IMPORTAMOS MAIS O PROVIDER AQUI
import { useMotorista } from "@/context/MotoristaContext"
import Header from "@/components/motorista/header"
import { Spinner } from '@/components/ui/spinner'

/**
 * Este componente interno é o "Guarda de Segurança".
 * Ele funciona porque o <MotoristaProvider> já está no app/layout.tsx
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
    // 1. Pega o estado de login e a função logout do "cérebro"
    const { isLoggedIn, logout } = useMotorista();
    const router = useRouter();

    useEffect(() => {
        // 2. Se o usuário NÃO estiver logado, redirecione-o
        if (!isLoggedIn) {
            router.replace("/login");
        }
    }, [isLoggedIn, router]);

    // 3. Se estiver logado, mostre o Header e a página
    if (isLoggedIn) {
        return (
            <>
                {/* O Header agora recebe a função 'logout' correta do cérebro */}
                <Header onLogout={logout} />
                <div className="min-h-screen bg-white ">
                    {children}
                </div>
            </>
        )
    }

    // 4. Se não estiver logado (e estiver redirecionando), mostre um loader
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Spinner className="h-8 w-8" />
        </div>
    );
}

/**
 * Este é o Layout do Motorista.
 * Ele NÃO precisa mais do <MotoristaProvider>
 */
export default function MotoristaLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    )
}