"use client"

import React, { useEffect, useState } from 'react' // 1. Importe o useState
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/operador/header"
import Sidebar from "@/components/operador/sidebar"
import { Spinner } from '@/components/ui/spinner'
import { getUser } from '@/utils/api/http/get/user'

/**
 * Guarda de Segurança
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading, logout, currentUser } = useAuth();
    const router = useRouter();

    // 2. O ESTADO DA SIDEBAR AGORA VIVE AQUI, NO LAYOUT
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 3. O LAYOUT FOI REFEITO PARA CORRIGIR O BUG
    return (
        // O 'flex' no 'html/body' (implícito) cuida da altura
        <div className="relative flex h-screen bg-white">
            {/* A Sidebar agora é 'fixed' e recebe o estado
              do "pai" (este arquivo)
            */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Este é o contêiner de conteúdo principal.
              Usamos 'margin-left' em vez de 'flex-1' para evitar o bug.
              A 'transition-all' aqui garante que o conteúdo deslize 
              suavemente quando a sidebar encolher.
            */}
            <div
                className={`
                  flex-1 flex flex-col transition-all duration-300
                  ${isSidebarOpen ? 'ml-72' : 'ml-20'}
                `}
            >
                <Header />
                {children}
            </div>
        </div>
    )
}

/**
 * Layout principal do Operador
 */
export default function OperadorLayout({
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