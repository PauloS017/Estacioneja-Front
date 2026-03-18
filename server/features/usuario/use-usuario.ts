"use client"

import { useApiQuery } from "@/server/api/queries/apiQuery"
import { IUsuario } from "@/interfaces/iusuario"
import { api } from "@/lib/api"
import { useApiMutation } from "@/server/api/queries/apiMutation"

export function useUser() {
  const { data, isLoading, isError } = useApiQuery<IUsuario>({
    queryKey: ["user"],
    endpoint: "/api/v1/usuarios/me",
  })

  return {
    user: data,
    isLoading,
    isError,
  }
}


export function useEditableUser() {
  const mutation = useApiMutation<IUsuario>({
    method: "PUT",
    endpoint: (id: string) => `/api/v1/usuarios/${id}`,
    invalidateQueries: [["user"]],
  })

  function updateUser(id: string, payload: IUsuario) {
    return mutation.mutateAsync({ id, data: payload })
  }

  return {
    updateUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  }
}