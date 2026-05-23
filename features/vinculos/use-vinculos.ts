"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { CriarVinculoPayload, Vinculo } from "./types"

export const vinculosKeys = {
  all: ["vinculos"] as const,
  meusEstacionamentos: ["vinculos", "estacionamentos"] as const,
  check: (placa?: string, estacionamentoId?: string) =>
    ["vinculos", "check", placa ?? "", estacionamentoId ?? ""] as const,
  byEmpresa: (empresaId: string) => ["vinculos", "empresa", empresaId] as const,
}

export function useMeusEstacionamentosVinculados() {
  return useApiQuery<Vinculo[]>({
    queryKey: vinculosKeys.meusEstacionamentos,
    endpoint: "/api/v1/vinculos",
  })
}

export function useCheckVinculo(placa?: string, estacionamentoId?: string) {
  return useApiQuery<Vinculo>({
    queryKey: vinculosKeys.check(placa, estacionamentoId),
    endpoint:
      placa && estacionamentoId
        ? `/api/v1/vinculos/estacionamento/${estacionamentoId}?placa=${placa}`
        : "",
    enabled: !!placa && !!estacionamentoId,
    staleTime: 0,
    gcTime: 0,
  })
}

export function useCreateVinculo() {
  return useApiMutation<CriarVinculoPayload, Vinculo>({
    method: "POST",
    endpoint: "/api/v1/vinculos",
    invalidateQueries: [vinculosKeys.all],
  })
}

export function useVinculosDaEmpresa(empresaId?: string) {
  return useApiQuery<Vinculo[]>({
    queryKey: vinculosKeys.byEmpresa(empresaId ?? ""),
    endpoint: `/api/v1/vinculos/empresa/${empresaId ?? ""}`,
    enabled: !!empresaId,
  })
}

export function useDeleteVinculo(empresaId?: string) {
  return useApiMutation<void>({
    method: "DELETE",
    endpoint: (id) => `/api/v1/vinculos/${id}`,
    invalidateQueries: [vinculosKeys.byEmpresa(empresaId ?? ""), vinculosKeys.all],
  })
}
