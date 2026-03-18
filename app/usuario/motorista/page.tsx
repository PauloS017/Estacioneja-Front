"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Importe o hook de roteamento
import { Search } from "lucide-react"
import UserProfile from "@/components/motorista/user-profile"
import { useUser } from "@/server/features/usuario/use-usuario"
import { useVehicles } from "@/hooks/use-vehicles"
import { useVincles } from "@/hooks/use-vincles"
import ParkingCard from "@/components/motorista/parking-card"
import { IEstacionamento } from "@/interfaces/iestacionamento"
import { usePublicParks } from "@/server/features/estacionamentos/use-estacionamento"
export default function MotoristaHomePage() {
    const router = useRouter() 

    const { user } = useUser();
    const { veiculos } = useVehicles();
    const { estacionamentos } = useVincles();

    const { data: estacionamentosPublicos } = usePublicParks();

    console.log(estacionamentosPublicos)

    const [connectedSearch, setConnectedSearch] = useState("")
    const [publicSearch, setPublicSearch] = useState("")

    const filteredConnected = estacionamentos?.filter((p) =>
        p.empresa.nome.toLowerCase().includes(connectedSearch.toLowerCase()),
    )


    const handleSelectParking = (parkingId: string) => {
        router.push(`/usuario/motorista/estacionamento/${parkingId}`)
    }

    const handleNavigate = (screen: "config" | "home" | "register-vehicle") => {
        router.push(`/usuario/motorista/${screen}`)
    }

    if (!user) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div>Carregando perfil...</div>
            </main>
        )
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <UserProfile
                onNavigate={handleNavigate}
                userProfile={user}
                connectedParkingsCount={estacionamentos?.length}
                vehiclesCount={veiculos?.length }
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
                    {filteredConnected?.map((parking) => (
                        <div
                            key={parking.id}
                            className="cursor-pointer transition-transform hover:scale-105 relative group"
                            onClick={() => handleSelectParking(parking.id)} 
                        >
                            <ParkingCard {...parking} />
                            {parking.privacidade === "PUBLICO" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        
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
                    {estacionamentosPublicos?.map((parking: IEstacionamento) => (
                        <div key={parking.id} className="relative group">
                            <ParkingCard {...parking} />
                            <button
                                onClick={() => alert("Por enquanto nada")} 
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