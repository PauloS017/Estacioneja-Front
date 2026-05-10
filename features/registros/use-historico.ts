"use client"

import { useApiQuery } from "@/lib/api"
import type { Registro } from "./types"

export const historicoKeys = {
  meu: ["historico", "me"] as const,
  byEstacionamento: (id: string) => ["historico", "estacionamento", id] as const,
}

export function useHistoricoUsuario() {
  return useApiQuery<Registro[]>({
    queryKey: historicoKeys.meu,
    endpoint: "/api/v1/registro/historico/usuario",
  })
}

export function useHistoricoEstacionamento(estacionamentoId: string) {
  return useApiQuery<Registro[]>({
    queryKey: historicoKeys.byEstacionamento(estacionamentoId),
    endpoint: `/api/v1/registro/historico/estacionamento/${estacionamentoId}`,
    enabled: !!estacionamentoId,
  })
}
