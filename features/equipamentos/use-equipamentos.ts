"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { Equipamento, EquipamentoPayload } from "./types"

export const equipamentosKeys = {
  all: ["equipamentos"] as const,
  byEmpresa: (empresaId?: string) => ["equipamentos", "empresa", empresaId ?? ""] as const,
  byId: (id: string) => ["equipamentos", id] as const,
}

const INVALIDATE_ON_WRITE = [equipamentosKeys.all, ["equipamentos", "empresa"]] as const

export function useEquipamentosByEmpresa(empresaId?: string) {
  return useApiQuery<Equipamento[]>({
    queryKey: equipamentosKeys.byEmpresa(empresaId),
    endpoint: `/api/v1/equipamentos/empresa/${empresaId ?? ""}`,
    enabled: !!empresaId,
  })
}

export function useEquipamento(id: string) {
  return useApiQuery<Equipamento>({
    queryKey: equipamentosKeys.byId(id),
    endpoint: `/api/v1/equipamentos/${id}`,
    enabled: !!id,
  })
}

export function useCreateEquipamento() {
  return useApiMutation<EquipamentoPayload, Equipamento>({
    method: "POST",
    endpoint: "/api/v1/equipamentos",
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}

export function useUpdateEquipamento() {
  return useApiMutation<Partial<EquipamentoPayload>, Equipamento>({
    method: "PUT",
    endpoint: (id) => `/api/v1/equipamentos/${id}`,
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}

export function useDeleteEquipamento() {
  return useApiMutation<void>({
    method: "DELETE",
    endpoint: (id) => `/api/v1/equipamentos/${id}`,
    invalidateQueries: INVALIDATE_ON_WRITE,
  })
}
