"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import UserProfile from "@/components/motorista/user-profile"
import ParkingCard from "@/components/motorista/parking-card"

import { useUser } from "@/features/usuarios"
import { useMeusVeiculos } from "@/features/veiculos"
import { useMeusEstacionamentosVinculados, Vinculo } from "@/features/vinculos"
import { VeiculoVinculo } from "@/features/vinculos/types"
import { EstacionamentoHeader } from "@/features/estacionamentos/types"

type EstacionamentoComVeiculos = EstacionamentoHeader & {
  veiculos: VeiculoVinculo[]
}

export default function MotoristaHomePage() {
  const router = useRouter()

  const { data: user } = useUser()
  const { data: veiculos } = useMeusVeiculos()
  const { data: vinculos } = useMeusEstacionamentosVinculados()

  const [connectedSearch, setConnectedSearch] = useState("")

  const estacionamentosVinculados: EstacionamentoComVeiculos[] = useMemo(() => {
    if (!vinculos) return []

    return Array.from(
      new Map(
        vinculos.map((vinculo: Vinculo) => [
          vinculo.estacionamento.id,
          {
            ...vinculo.estacionamento,
            veiculos: vinculos
              .filter((x) => x.estacionamento.id === vinculo.estacionamento.id)
              .map((x) => x.veiculo),
          },
        ])
      ).values()
    )
  }, [vinculos])

  const filteredConnected = estacionamentosVinculados.filter((p) =>
    p.nomeEmpresa.toLowerCase().includes(connectedSearch.toLowerCase())
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse rounded-xl border border-border bg-card h-44" />
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">
      <UserProfile
        onNavigate={handleNavigate}
        userProfile={user}
        connectedParkingsCount={estacionamentosVinculados.length}
        vehiclesCount={veiculos?.length}
      />

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Estacionamentos conectados
              </h2>
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold tabular-nums bg-primary/10 text-primary">
                {estacionamentosVinculados.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Locais onde você já tem vínculo ativo
            </p>
          </div>

          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar conectados"
              value={connectedSearch}
              onChange={(e) => setConnectedSearch(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2
                bg-background text-foreground
                border border-border rounded-md
                text-sm
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                placeholder:text-muted-foreground
                transition
              "
            />
          </div>
        </div>

        {filteredConnected.length === 0 ? (
          <EmptyConnected />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredConnected.map((parking) => (
              <div
                key={parking.id}
                className="cursor-pointer relative group"
                onClick={() => handleSelectParking(parking.id)}
              >
                <ParkingCard {...parking} veiculos={parking.veiculos} />

                {parking.privacidade === "PUBLICO" && (
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="
                      absolute top-3 right-3 z-10
                      px-2.5 py-1 rounded
                      bg-background text-foreground
                      border border-border
                      text-[11px] font-medium
                      opacity-0 group-hover:opacity-100
                      hover:bg-muted hover:border-destructive/40 hover:text-destructive
                      cursor-pointer
                      transition
                    "
                  >
                    Desconectar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function EmptyConnected() {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-semibold text-foreground">
        Você ainda não está vinculado a nenhum estacionamento
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        Descubra estacionamentos abertos na aba{" "}
        <span className="font-medium text-orange-600 dark:text-orange-400">
          Comunidade
        </span>{" "}
        e conecte-se ao que faz sentido para você.
      </p>
      <Link
        href="/usuario/motorista/comunidade"
        className="
          mt-4 inline-flex items-center gap-1.5
          text-xs font-semibold text-orange-600 dark:text-orange-400
          hover:underline
        "
      >
        Explorar comunidade
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
