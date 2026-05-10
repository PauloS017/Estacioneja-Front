"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { CriarEmpresaPayload, Empresa } from "./types"

export const empresasKeys = {
  all: ["empresas"] as const,
  byId: (id?: string) => ["empresas", id ?? ""] as const,
  workspaces: ["workspaces", "meus-workspaces"] as const,
}

export function useEmpresaById(empresaId?: string) {
  return useApiQuery<Empresa>({
    queryKey: empresasKeys.byId(empresaId),
    endpoint: `/api/v1/empresas/${empresaId ?? ""}`,
    enabled: !!empresaId,
  })
}

export function useCreateEmpresa() {
  return useApiMutation<CriarEmpresaPayload, Empresa>({
    method: "POST",
    endpoint: "/api/v1/empresas",
    invalidateQueries: [empresasKeys.workspaces],
  })
}
