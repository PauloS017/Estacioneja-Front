"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, LogIn } from "lucide-react"

import { defaultAlert } from "@/lib/utils"
import { useHistoricoUsuario } from "@/features/registros"

export default function HistoryPage() {
  const router = useRouter()
  const { data: historico } = useHistoricoUsuario()

  useEffect(() => {
    if (historico && historico.length === 0) {
      defaultAlert.info({ title: "Sem Histórico Encontrado" })
      router.push("/")
    }
  }, [historico, router])

  if (!historico) {
    return <p>Carregando...</p>
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Histórico de Entrada e Saída</h1>

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
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
