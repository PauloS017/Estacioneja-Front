import type { Metadata } from "next"
import { HealthPoller } from "./health-poller"

export const metadata: Metadata = {
  title: "Serviço indisponível — EstacioneJá",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function ApiOfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-xl w-full flex flex-col items-center text-center gap-6">
        <img
          src="/api_esta_fora.svg"
          alt="Serviços temporariamente indisponíveis"
          className="w-full max-w-sm h-auto select-none"
          draggable="false"
        />
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Nossos serviços estão temporariamente indisponíveis
          </h1>
          <p className="text-muted-foreground md:text-lg leading-relaxed">
            Estamos trabalhando para restabelecer o sistema o mais rápido possível.
            A página será recarregada automaticamente assim que tudo voltar ao normal.
          </p>
        </div>
        <HealthPoller />
      </div>
    </main>
  )
}
