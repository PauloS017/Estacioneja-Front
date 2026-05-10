"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, LogOut, LogIn, ArrowLeft } from "lucide-react"

import { defaultAlert } from "@/lib/utils"
import { useHistoricoEstacionamento } from "@/features/registros"

export default function ParkingHistoryPage() {
  const params = useParams()
  const parkingId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""

  const { data: historico } = useHistoricoEstacionamento(parkingId)

  useEffect(() => {
    if (historico && historico.length === 0) {
      defaultAlert.info({ title: "Sem Histórico Encontrado" })
    }
  }, [historico])

  if (!parkingId) {
    return null
  }

  if (!historico) {
    return <p>Carregando...</p>
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href={`/usuario/motorista/estacionamento/${parkingId}`}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        Histórico de: {historico[0]?.estacionamento.descricao}
      </h1>

      <div className="space-y-4">
        {historico.map((entry) => {
          const isEntrada = entry.tipoRegistro === "ENTRADA"
          return (
            <div
              key={entry.id}
              className="bg-card text-card-foreground rounded-lg p-6 border border-border hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isEntrada ? "bg-primary/10" : "bg-destructive/10"}`}>
                  {isEntrada ? (
                    <LogIn className="w-6 h-6 text-primary" />
                  ) : (
                    <LogOut className="w-6 h-6 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{entry.estacionamento.descricao}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isEntrada ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isEntrada ? "Entrada" : "Saída"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.dataRegistro).toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
