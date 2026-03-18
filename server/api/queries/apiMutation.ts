import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE"

interface UseApiMutationProps<TPayload, TResponse = unknown> {
  method: MutationMethod
  endpoint: string | ((id: string) => string)
  invalidateQueries?: string[][]
}

export function useApiMutation<TPayload, TResponse = unknown>({
  method,
  endpoint,
  invalidateQueries = [],
}: UseApiMutationProps<TPayload, TResponse>) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload: { id?: string; data: TPayload }) => {
      const url =
        typeof endpoint === "function"
          ? endpoint(payload.id!)
          : endpoint

      const response = await api.request<TResponse>({
        url,
        method,
        data: payload.data,
      })

      return response.data
    },

    onSuccess: () => {
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })

  return mutation
}