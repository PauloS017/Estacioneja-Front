"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bike,
  Bus,
  Car,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tractor,
  Truck,
} from "lucide-react"

import { useMeusVeiculos, type TipoVeiculo, type Veiculo } from "@/features/veiculos"

const VEHICLE_META: Record<
  TipoVeiculo,
  { icon: typeof Car; label: string }
> = {
  CARRO: { icon: Car, label: "Carro" },
  MOTO: { icon: Bike, label: "Moto" },
  ONIBUS: { icon: Bus, label: "Ônibus" },
  CAMINHAO: { icon: Truck, label: "Caminhão" },
  TRATOR: { icon: Tractor, label: "Trator" },
}

export default function VeiculosPage() {
  const { data: veiculos, isLoading } = useMeusVeiculos()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const total = veiculos?.length ?? 0

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: "smooth" })
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link
        href="/usuario/motorista"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
            Sua garagem
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            Meus veículos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total === 0
              ? "Cadastre seu primeiro veículo para liberar o acesso aos estacionamentos."
              : total === 1
                ? "1 veículo cadastrado"
                : `${total} veículos cadastrados`}
          </p>
        </div>
      </header>

      <div className="relative">
        {total > 0 && (
          <>
            <ScrollButton dir="left" onClick={() => scrollBy(-1)} />
            <ScrollButton dir="right" onClick={() => scrollBy(1)} />
          </>
        )}

        <div
          ref={scrollerRef}
          className="
            flex gap-4 overflow-x-auto
            snap-x snap-mandatory
            pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0
          "
          style={{ scrollbarWidth: "thin" }}
        >
          {isLoading && total === 0 ? (
            <>
              <VehicleSkeleton />
              <VehicleSkeleton />
              <VehicleSkeleton />
            </>
          ) : (
            <>
              {veiculos?.map((v, i) => (
                <VehicleCard key={v.id ?? v.placa} vehicle={v} index={i} />
              ))}
              <AddVehicleCard isFirst={total === 0} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: Veiculo; index: number }) {
  const meta = VEHICLE_META[vehicle.tipoVeiculo] ?? VEHICLE_META.CARRO
  const Icon = meta.icon

  return (
    <article
      data-card
      className="
        group relative
        snap-start flex-shrink-0
        w-[280px] sm:w-[320px] min-h-[240px]
        bg-card border border-border rounded-2xl
        overflow-hidden
        transition-all duration-200
        hover:border-foreground/20
      "
    >
      <div className="relative p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="self-start mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl border border-border bg-muted/40 text-foreground">
          <Icon className="w-6 h-6" strokeWidth={1.75} />
        </div>

        <div className="mt-auto space-y-3">
          <div className="inline-block px-3 py-1.5 rounded-md bg-foreground">
            <span className="font-mono text-base font-bold tracking-[0.2em] text-background">
              {formatPlate(vehicle.placa)}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground truncate">
              {vehicle.modelo || "Sem modelo"}
            </p>
            <p className="text-xs text-muted-foreground">
              {vehicle.cor || "Cor não informada"}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

function AddVehicleCard({ isFirst }: { isFirst: boolean }) {
  return (
    <Link
      href="/usuario/motorista/veiculo-novo"
      data-card
      className="
        group relative
        snap-start flex-shrink-0
        w-[280px] sm:w-[320px] min-h-[240px]
        rounded-2xl border-2 border-dashed border-border
        hover:border-primary/50 hover:bg-primary/5
        flex flex-col items-center justify-center gap-3
        p-6 text-center
        transition-colors
      "
    >
      <span
        className="
          inline-flex items-center justify-center w-12 h-12 rounded-xl
          border border-border bg-muted/40 text-muted-foreground
          group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary
          transition-colors
        "
      >
        <Plus className="w-6 h-6" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {isFirst ? "Adicionar primeiro veículo" : "Adicionar veículo"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Placa, modelo e cor — em menos de um minuto.
        </p>
      </div>
    </Link>
  )
}

function VehicleSkeleton() {
  return (
    <div
      data-card
      className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] min-h-[240px] rounded-2xl border border-border bg-card animate-pulse"
    >
      <div className="p-5 space-y-5">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-8 bg-muted rounded" />
        </div>
        <div className="h-12 w-12 bg-muted rounded-xl" />
        <div className="space-y-2 pt-6">
          <div className="h-7 w-32 bg-muted rounded-md" />
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

function ScrollButton({
  dir,
  onClick,
}: {
  dir: "left" | "right"
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Anterior" : "Próximo"}
      className={`
        hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10
        ${dir === "left" ? "-left-4" : "-right-4"}
        w-9 h-9 items-center justify-center
        rounded-full bg-background
        border border-border shadow-sm
        text-foreground
        hover:bg-muted hover:border-foreground/30
        cursor-pointer
        transition
      `}
    >
      {dir === "left" ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  )
}

function formatPlate(raw: string): string {
  const clean = (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (clean.length <= 3) return clean
  return `${clean.slice(0, 3)}-${clean.slice(3)}`
}
