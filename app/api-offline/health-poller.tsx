"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const POLL_INTERVAL_MS = 5_000

export function HealthPoller() {
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { healthy?: boolean }
        if (!cancelled && data.healthy) {
          window.location.href = "/"
        }
      } catch {
        // silencioso: continua tentando
      }
    }

    const interval = setInterval(check, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  async function handleRetry() {
    setChecking(true)
    try {
      const res = await fetch("/api/health", { cache: "no-store" })
      const data = (await res.json()) as { healthy?: boolean }
      if (data.healthy) {
        window.location.href = "/"
        return
      }
    } catch {
      // ignora
    } finally {
      setChecking(false)
    }
  }

  return (
    <Button
      onClick={handleRetry}
      disabled={checking}
      size="lg"
      className="rounded-full px-6"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${checking ? "animate-spin" : ""}`} />
      {checking ? "Verificando..." : "Tentar novamente"}
    </Button>
  )
}
