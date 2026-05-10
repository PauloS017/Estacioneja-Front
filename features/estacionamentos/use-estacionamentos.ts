"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { Estacionamento, EstacionamentoPayload } from "./types"

export const estacionamentosKeys = {
  all: ["estacionamentos"] as const,
  publicos: ["estacionamentos", "publicos"] as const,
  byId: (id: string) => ["estacionamentos", id] as const,
  byEmpresa: (empresaId?: string) => ["estacionamentos", "empresa", empresaId ?? ""] as const,
}

const INVALIDATE_ON_WRITE = [estacionamentosKeys.all, ["estacionamentos", "empresa"]] as const

export function usePublicEstacionamentos() {
  return useApiQuery<Estacionamento[]>({
    queryKey: estacionamentosKeys.publicos,
    endpoint: "/api/v1/estacionamentos/privacidade/PUBLICO",
  })
}

export function useEstacionamentoById(id?: string) {
  return useApiQuery<Estacionamento>({
    queryKey: estacionamentosKeys.byId(id ?? ""),
    endpoint: `/api/v1/estacionamentos/${id ?? ""}`,
    enabled: !!id,
  })
}

export function useEstacionamentosByEmpresa(empresaId?: string, enabled = true) {
  return useApiQuery<Estacionamento[]>({
    queryKey: estacionamentosKeys.byEmpresa(empresaId),
    endpoint: `/api/v1/estacionamentos/empresa/${empresaId ?? ""}`,
    enabled: !!empresaId && enabled,
  })
}

export function useCreateEstacionamento() {
  return useApiMutation<EstacionamentoPayload, Estacionamento>({
    method: "POST",
    endpoint: "/api/v1/estacionamentos",
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}

export function useUpdateEstacionamento() {
  return useApiMutation<Partial<EstacionamentoPayload>, Estacionamento>({
    method: "PUT",
    endpoint: (id) => `/api/v1/estacionamentos/${id}`,
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}

export function useDeleteEstacionamento() {
  return useApiMutation<void>({
    method: "DELETE",
    endpoint: (id) => `/api/v1/estacionamentos/${id}`,
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}
