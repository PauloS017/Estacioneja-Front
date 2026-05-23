"use client"

import { useState } from "react"
import { Compass, Plus, Search } from "lucide-react"

import ParkingCard from "@/components/motorista/parking-card"
import { usePublicEstacionamentos } from "@/features/estacionamentos"

export default function ComunidadePage() {
  const { data: estacionamentosPublicos, isLoading } = usePublicEstacionamentos()
  const [search, setSearch] = useState("")

  const filtered = estacionamentosPublicos?.filter((p) =>
    p.nomeEmpresa.toLowerCase().includes(search.toLowerCase())
  )

  const total = filtered?.length ?? 0

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
            Comunidade
          </p>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Descubra estacionamentos
            </h1>
            {total > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold tabular-nums bg-orange-500/10 text-orange-600 dark:text-orange-400">
                {total}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Estacionamentos públicos disponíveis na comunidade EstacioneJá
          </p>
        </div>

        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar estacionamentos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      </header>

      {isLoading && total === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((parking) => (
            <div key={parking.id} className="relative group">
              <ParkingCard {...parking} variant="public" />

              <button
                disabled
                title="Em breve"
                className="
                  absolute top-3 right-3 z-10
                  inline-flex items-center gap-1
                  px-2.5 py-1 rounded
                  bg-background text-foreground
                  border border-border
                  text-[11px] font-medium
                  opacity-0 group-hover:opacity-100
                  hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400
                  transition
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <Plus className="w-3 h-3" />
                Conectar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState searching={!!search} />
      )}
    </main>
  )
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <span className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground">
        <Compass className="w-5 h-5" />
      </span>
      <p className="text-sm font-semibold text-foreground">
        {searching ? "Nada encontrado" : "Nenhum estacionamento na comunidade"}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        {searching
          ? "Tente ajustar o termo de busca."
          : "Volte em breve — novos estacionamentos públicos aparecem aqui assim que entram na rede."}
      </p>
    </div>
  )
}
