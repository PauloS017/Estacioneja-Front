"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import UserProfile from "@/components/motorista/user-profile"
import ParkingCard from "@/components/motorista/parking-card"

import { useUser } from "@/features/usuarios"
import { useMeusVeiculos } from "@/features/veiculos"
import { useMeusEstacionamentosVinculados } from "@/features/vinculos"
import { usePublicEstacionamentos } from "@/features/estacionamentos"

export default function MotoristaHomePage() {
  const router = useRouter()

  const { data: user } = useUser()
  const { data: veiculos } = useMeusVeiculos()
  const { data: estacionamentosVinculados } = useMeusEstacionamentosVinculados()
  const { data: estacionamentosPublicos } = usePublicEstacionamentos()

  const [connectedSearch, setConnectedSearch] = useState("")
  const [publicSearch, setPublicSearch] = useState("")

  const filteredConnected = estacionamentosVinculados?.filter((p) =>
    p.empresa.nome.toLowerCase().includes(connectedSearch.toLowerCase())
  )

  const filteredPublicos = estacionamentosPublicos?.filter((p) =>
    p.empresa.nome.toLowerCase().includes(publicSearch.toLowerCase())
  )

  const handleSelectParking = (parkingId: string) => {
    router.push(`/usuario/motorista/estacionamento/${parkingId}`)
  }

  const handleNavigate = (screen: "config" | "home" | "veiculo-novo") => {
    if (screen === "home") {
      router.push("/usuario/motorista")
    } else {
      router.push(`/usuario/motorista/${screen}`)
    }
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
        connectedParkingsCount={estacionamentosVinculados?.length}
        vehiclesCount={veiculos?.length}
      />

      <section className="mt-12 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Estacionamentos Conectados</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={connectedSearch}
              onChange={(e) => setConnectedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
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
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded hover:bg-destructive/90 transition opacity-0 group-hover:opacity-100"
                >
                  Desconectar
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="border-t-2 border-border my-8" />

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Quem mais está no <span className="text-primary">EstacioneJá</span>?
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={publicSearch}
              onChange={(e) => setPublicSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {filteredPublicos && filteredPublicos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPublicos.map((parking) => (
              <div key={parking.id} className="relative group">
                <ParkingCard {...parking} />
                <button
                  disabled
                  className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded hover:bg-orange-600 transition opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                >
                  + Conectar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
