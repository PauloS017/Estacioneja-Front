import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "./client"

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE"

interface UseApiMutationProps {
  method: MutationMethod
  endpoint: string | ((id: string) => string)
  invalidateQueries?: readonly (readonly unknown[])[]
}

interface MutationPayload<TPayload> {
  id?: string
  data?: TPayload
}

export function useApiMutation<TPayload, TResponse = unknown>({
  method,
  endpoint,
  invalidateQueries = [],
}: UseApiMutationProps) {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, MutationPayload<TPayload>>({
    mutationFn: async ({ id, data }) => {
      const url = typeof endpoint === "function" ? endpoint(id!) : endpoint
      const response = await api.request<TResponse>({ url, method, data })
      return response.data
    },

    onSuccess: () => {
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as unknown[] })
      })
    },
  })
}
