"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEstacionamentoById } from "@/features/estacionamentos"

const CAROUSEL_IMAGES = ["/estacionamento1.jpg", "/parking-facility-2.jpg", "/estacionamento3.jpg"]

function getStatusColor(occupancy: number): string {
  if (occupancy > 75) return "bg-destructive/10 text-destructive border border-destructive/30"
  if (occupancy > 50) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
  return "bg-primary/10 text-primary border border-primary/30"
}

function getStatusLabel(occupancy: number): string {
  if (occupancy > 75) return "Quase Lotado"
  if (occupancy > 50) return "Moderado"
  return "Leve"
}

export default function ParkingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const parkingId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: parking, isLoading, isError } = useEstacionamentoById(parkingId)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Carregando detalhes...</p>
      </div>
    )
  }

  if (isError || !parking) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/usuario/motorista"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar
        </Link>
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
          O Sistema não encontrado ou erro ao carregar os dados.
        </div>
      </main>
    )
  }

  const endereco = parking.empresa.endereco
  const enderecoFormatado = `${endereco?.logradouro} - ${endereco?.bairro}, ${endereco?.cidade}-${endereco?.uf}`
  const regras = parking.regrasCapacidade ?? []
  const totalCapacidade = regras.reduce((acc, r) => acc + r.capacidade, 0)
  const totalDisponivel = regras.reduce((acc, r) => acc + r.capacidadeDisponivel, 0)
  const totalEmUso = totalCapacidade - totalDisponivel
  const ocupacao =
    totalCapacidade > 0 ? Math.round((totalEmUso / totalCapacidade) * 100) : 0

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/usuario/motorista"
        className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </Link>

      <div className="relative bg-muted rounded-lg overflow-hidden mb-8 aspect-video flex items-center justify-center group">
        <img
          src={CAROUSEL_IMAGES[currentImageIndex]}
          alt={parking.empresa.nome}
          className="w-full h-full object-cover"
        />

        {CAROUSEL_IMAGES.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{parking.empresa.nome}</h1>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <span>{enderecoFormatado}</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">{parking.descricao || "Sem descrição disponível."}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${getStatusColor(ocupacao)}`}>
          <p className="text-sm font-medium opacity-75 mb-2">Status de Ocupação</p>
          <p className="text-2xl font-bold">{getStatusLabel(ocupacao)}</p>
          <div className="mt-4 bg-foreground/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                ocupacao > 75 ? "bg-destructive" : ocupacao > 50 ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${ocupacao}%` }}
            />
          </div>
          <p className="text-xs opacity-75 mt-2">{ocupacao}% ocupado</p>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary mb-4">Vagas Disponíveis Agora</p>
          <p className="text-4xl font-bold text-primary mb-1">{totalDisponivel}</p>
          <p className="text-xs text-primary/80">de {totalCapacidade} vagas totais</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-muted-foreground text-sm font-medium mb-1">Capacidade total</p>
          <p className="text-2xl font-bold text-foreground">{totalCapacidade}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-muted-foreground text-sm font-medium mb-1">Em uso</p>
          <p className="text-2xl font-bold text-foreground">{totalEmUso}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Vagas por tipo de veículo
        </h2>
        {regras.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem regras de capacidade cadastradas.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regras.map((r) => {
              const ocupTipo =
                r.capacidade > 0
                  ? Math.round(((r.capacidade - r.capacidadeDisponivel) / r.capacidade) * 100)
                  : 0
              const barColor =
                ocupTipo > 75 ? "bg-destructive" : ocupTipo > 50 ? "bg-amber-500" : "bg-primary"
              return (
                <div
                  key={r.tipoVeiculo}
                  className="bg-card p-4 rounded-lg border border-border"
                >
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                    {r.tipoVeiculo}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {r.capacidadeDisponivel}
                    <span className="text-sm font-medium text-muted-foreground">
                      {" "}/ {r.capacidade}
                    </span>
                  </p>
                  <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-300`}
                      style={{ width: `${ocupTipo}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{ocupTipo}% ocupado</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => router.push(`/usuario/motorista/estacionamento/${parking.id}/historico`)}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Clock className="w-5 h-5" />
          Ver Histórico de Ocupação
        </Button>
      </div>
    </main>
  )
}
