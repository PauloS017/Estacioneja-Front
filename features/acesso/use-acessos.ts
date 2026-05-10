"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { Acesso, CriarAcessoPayload } from "./types"

export const acessoKeys = {
  workspaces: ["workspaces", "meus-workspaces"] as const,
  meuAcessoNoTenant: (tenantId?: string) => ["acesso", "tenant", tenantId ?? ""] as const,
  acessosDaEmpresa: (empresaId?: string) => ["acessos", "empresa", empresaId ?? ""] as const,
}

export function useMyWorkspaces() {
  return useApiQuery<Acesso[]>({
    queryKey: acessoKeys.workspaces,
    endpoint: "/api/v1/usuarios/my-workspaces",
  })
}

export function useMyAccessInTenant(tenantId?: string) {
  return useApiQuery<Acesso>({
    queryKey: acessoKeys.meuAcessoNoTenant(tenantId),
    endpoint: `/api/v1/empresas/${tenantId ?? ""}/acessos/me`,
    enabled: !!tenantId,
  })
}

export function useAcessosDaEmpresa(empresaId?: string) {
  return useApiQuery<Acesso[]>({
    queryKey: acessoKeys.acessosDaEmpresa(empresaId),
    endpoint: `/api/v1/empresas/${empresaId ?? ""}/acessos`,
    enabled: !!empresaId,
  })
}

export function useCreateAcesso(empresaId?: string) {
  return useApiMutation<CriarAcessoPayload, Acesso>({
    method: "POST",
    endpoint: `/api/v1/empresas/${empresaId ?? ""}/acessos`,
    invalidateQueries: [acessoKeys.acessosDaEmpresa(empresaId)],
  })
}

export function useDeleteAcesso(empresaId?: string) {
  return useApiMutation<void>({
    method: "DELETE",
    endpoint: (id) => `/api/v1/empresas/${empresaId ?? ""}/acessos/${id}`,
    invalidateQueries: [acessoKeys.acessosDaEmpresa(empresaId)],
  })
}
