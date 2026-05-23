"use client"

import { LogIn, LogOut, Clock } from "lucide-react"

import { useHistoricoUsuario } from "@/features/registros"

export default function HistoryPage() {
  const { data: historico, isLoading } = useHistoricoUsuario()

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
          Atividade
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Histórico de entrada e saída
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seus registros mais recentes nos estacionamentos vinculados
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : !historico || historico.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
          <span className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground">
            <Clock className="w-5 h-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            Nenhum registro ainda
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Assim que você passar por um estacionamento vinculado, o registro
            aparece aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((entry) => {
            const isEntrada = entry.tipoRegistro === "ENTRADA"
            return (
              <div
                key={entry.id}
                className="bg-card text-card-foreground rounded-lg p-4 sm:p-5 border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                      isEntrada
                        ? "bg-primary/10 text-primary"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {isEntrada ? (
                      <LogIn className="w-5 h-5" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-foreground truncate">
                        {entry.estacionamento.descricao}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 ${
                          isEntrada
                            ? "bg-primary/10 text-primary"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
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
      )}
    </main>
  )
}
