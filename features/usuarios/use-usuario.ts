"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { Usuario } from "./types"

const QUERY_KEY = ["usuario", "me"] as const

export function useUser() {
  return useApiQuery<Usuario>({
    queryKey: QUERY_KEY,
    endpoint: "/api/v1/usuarios/me",
  })
}

export function useUpdateUser() {
  return useApiMutation<Partial<Usuario>, Usuario>({
    method: "PUT",
    endpoint: (id) => `/api/v1/usuarios/${id}`,
    invalidateQueries: [QUERY_KEY],
  })
}
