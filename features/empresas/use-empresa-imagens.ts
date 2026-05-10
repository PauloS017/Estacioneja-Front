"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import { acessoKeys } from "@/features/acesso"
import type { URLImagemResponse } from "./types"

export const empresaLogoKey = (empresaId: string) => ["empresas", empresaId, "logo"] as const
export const empresaBannerKey = (empresaId: string) => ["empresas", empresaId, "banner"] as const

// O backend emite URL assinada com TTL de 10 min — renovamos antes (9 min).
const URL_STALE_MS = 9 * 60 * 1000
const URL_GC_MS = 10 * 60 * 1000

function useEmpresaImagem(
  empresaId: string | undefined,
  kind: "logo" | "banner",
  requireAuth: boolean,
) {
  const { status } = useSession()
  const key = kind === "logo" ? empresaLogoKey(empresaId ?? "_anon") : empresaBannerKey(empresaId ?? "_anon")

  return useQuery<URLImagemResponse>({
    queryKey: key,
    queryFn: async () => {
      try {
        const { data } = await api.get<URLImagemResponse>(`/api/v1/empresas/${empresaId}/${kind}`)
        return data
      } catch {
        return { url: null, expiresAt: null }
      }
    },
    enabled: !!empresaId && (requireAuth ? status === "authenticated" : true),
    staleTime: URL_STALE_MS,
    gcTime: URL_GC_MS,
  })
}

export function useEmpresaLogo(empresaId: string | undefined, requireAuth = false) {
  return useEmpresaImagem(empresaId, "logo", requireAuth)
}

export function useEmpresaBanner(empresaId: string | undefined, requireAuth = false) {
  return useEmpresaImagem(empresaId, "banner", requireAuth)
}

function useUploadEmpresaImagem(kind: "logo" | "banner") {
  const queryClient = useQueryClient()
  return useMutation<URLImagemResponse, Error, { empresaId: string; file: File }>({
    mutationFn: async ({ empresaId, file }) => {
      const fd = new FormData()
      fd.append("file", file)
      const { data } = await api.post<URLImagemResponse>(
        `/api/v1/empresas/${empresaId}/${kind}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      return data
    },
    onSuccess: (data, { empresaId }) => {
      const key = kind === "logo" ? empresaLogoKey(empresaId) : empresaBannerKey(empresaId)
      queryClient.setQueryData<URLImagemResponse>(key, data)
      queryClient.invalidateQueries({ queryKey: acessoKeys.workspaces })
    },
  })
}

function useDeleteEmpresaImagem(kind: "logo" | "banner") {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { empresaId: string }>({
    mutationFn: async ({ empresaId }) => {
      await api.delete(`/api/v1/empresas/${empresaId}/${kind}`)
    },
    onSuccess: (_data, { empresaId }) => {
      const key = kind === "logo" ? empresaLogoKey(empresaId) : empresaBannerKey(empresaId)
      queryClient.setQueryData<URLImagemResponse>(key, { url: null, expiresAt: null })
      queryClient.invalidateQueries({ queryKey: acessoKeys.workspaces })
    },
  })
}

export const useUploadEmpresaLogo = () => useUploadEmpresaImagem("logo")
export const useUploadEmpresaBanner = () => useUploadEmpresaImagem("banner")
export const useDeleteEmpresaLogo = () => useDeleteEmpresaImagem("logo")
export const useDeleteEmpresaBanner = () => useDeleteEmpresaImagem("banner")
