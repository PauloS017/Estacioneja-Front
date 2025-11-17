"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Importe o hook de roteamento
import { Search } from "lucide-react"
import UserProfile from "@/components/motorista/user-profile"
import ParkingCard from "@/components/motorista/parking-card"
import { useMotorista } from "@/context/MotoristaContext" // Importe o "cérebro"

// Não precisamos mais de props como 'onNavigate', 'userProfile', etc.

export default function MotoristaHomePage() {
    const router = useRouter() // Hook para navegação

    // 1. Buscamos todos os dados e funções direto do "cérebro" (Context)
    const {
        userProfile,
        vehicles,
        connectedParkings,
        publicParkings,
        handleConnectParking,
        handleDisconnectParking,
    } = useMotorista()

    // 2. O estado do campo de busca é local, o que está correto.
    const [connectedSearch, setConnectedSearch] = useState("")
    const [publicSearch, setPublicSearch] = useState("")

    const filteredConnected = connectedParkings.filter((p) =>
        p.name.toLowerCase().includes(connectedSearch.toLowerCase()),
    )

    const filteredPublic = publicParkings.filter((p) =>
        p.name.toLowerCase().includes(publicSearch.toLowerCase())
    )

    // 3. Funções de navegação agora usam o router
    const handleSelectParking = (parkingId: number) => {
        // Navega para a URL: /usuario/motorista/estacionamento/[id]
        router.push(`/usuario/motorista/estacionamento/${parkingId}`)
    }

    const handleNavigate = (screen: "config" | "home" | "register-vehicle") => {
        // Navega para a URL: /usuario/motorista/config, /home ou /register-vehicle
        router.push(`/usuario/motorista/${screen}`)
    }

    // 4. Lidamos com o estado de carregamento
    if (!userProfile) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div>Carregando perfil...</div>
            </main>
        )
    }

    // 5. O JSX é copiado de 'home-screen.tsx'
    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* O UserProfile agora recebe os dados do contexto.
              Passamos as funções de navegação atualizadas.
            */}
            <UserProfile
                onNavigate={handleNavigate}
                userProfile={userProfile}
                connectedParkingsCount={connectedParkings.length}
                vehiclesCount={vehicles.length}
            />

            {/* Seção de Estacionamentos Conectados */}
            <section className="mt-12 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Estacionamentos Conectados</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={connectedSearch}
                            onChange={(e) => setConnectedSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredConnected.map((parking) => (
                        <div
                            key={parking.id}
                            className="cursor-pointer transition-transform hover:scale-105 relative group"
                            onClick={() => handleSelectParking(parking.id)} // Função atualizada
                        >
                            <ParkingCard {...parking} />
                            {parking.category === "public" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDisconnectParking(parking.id) // Função do contexto
                                    }}
                                    className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                >
                                    Desconectar
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <div className="border-t-2 border-gray-300 my-8" />

            {/* Seção de Estacionamentos Públicos */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        Quem mais está no <span className="text-emerald-600">EstacioneJá</span>?
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={publicSearch}
                            onChange={(e) => setPublicSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredPublic.map((parking) => (
                        <div key={parking.id} className="relative group">
                            <ParkingCard {...parking} />
                            <button
                                onClick={() => handleConnectParking(parking.id)} // Função do contexto
                                className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded hover:bg-orange-600 transition opacity-0 group-hover:opacity-100"
                            >
                                + Conectar
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}