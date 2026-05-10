"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import type { FotoPerfilResponse, Usuario } from "./types"

const ME_KEY = ["usuario", "me"] as const

export const fotoPerfilKey = (userId: string) => ["usuario", userId, "foto-perfil"] as const

const URL_STALE_MS = 9 * 60 * 1000
const URL_GC_MS = 10 * 60 * 1000

export function useFotoPerfilUrl(userId: string | undefined, temFotoPerfil: boolean) {
  const { status } = useSession()

  return useQuery<FotoPerfilResponse>({
    queryKey: fotoPerfilKey(userId ?? "_anon"),
    queryFn: async () => {
      const { data } = await api.get<FotoPerfilResponse>(`/api/v1/usuarios/${userId}/foto-perfil`)
      return data
    },
    enabled: !!userId && temFotoPerfil && status === "authenticated",
    staleTime: URL_STALE_MS,
    gcTime: URL_GC_MS,
  })
}

export function useUploadFotoPerfil() {
  const queryClient = useQueryClient()

  return useMutation<FotoPerfilResponse, Error, { userId: string; file: File }>({
    mutationFn: async ({ userId, file }) => {
      const fd = new FormData()
      fd.append("file", file)
      const { data } = await api.post<FotoPerfilResponse>(
        `/api/v1/usuarios/${userId}/foto-perfil`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      return data
    },
    onSuccess: (data, { userId }) => {
      queryClient.setQueryData<FotoPerfilResponse>(fotoPerfilKey(userId), data)
      patchUsuarioFlag(queryClient, userId, true)
    },
  })
}

export function useDeleteFotoPerfil() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string }>({
    mutationFn: async ({ userId }) => {
      await api.delete(`/api/v1/usuarios/${userId}/foto-perfil`)
    },
    onSuccess: (_data, { userId }) => {
      queryClient.removeQueries({ queryKey: fotoPerfilKey(userId) })
      patchUsuarioFlag(queryClient, userId, false)
    },
  })
}

// Atualiza o cache do usuário ("me") quando a foto do próprio usuário muda,
// evitando uma requisição extra só pra refletir a flag temFotoPerfil.
function patchUsuarioFlag(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  temFotoPerfil: boolean,
) {
  const me = queryClient.getQueryData<Usuario>(ME_KEY)
  if (me?.id === userId) {
    queryClient.setQueryData<Usuario>(ME_KEY, { ...me, temFotoPerfil })
  } else {
    queryClient.invalidateQueries({ queryKey: ["usuario"] })
  }
}
