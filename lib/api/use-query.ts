import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { api } from "./client"

interface UseApiQueryProps<TQueryFnData, TData> {
  queryKey: readonly unknown[]
  endpoint: string
  select?: (data: TQueryFnData) => TData
  enabled?: boolean
  requireAuth?: boolean
  staleTime?: number
  gcTime?: number
}

export function useApiQuery<TQueryFnData, TData = TQueryFnData>({
  queryKey,
  endpoint,
  select,
  enabled = true,
  requireAuth = true,
  staleTime,
  gcTime,
}: UseApiQueryProps<TQueryFnData, TData>): UseQueryResult<TData, Error> {
  const { status } = useSession()

  return useQuery<TQueryFnData, Error, TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<TQueryFnData>(endpoint)
      return data
    },
    enabled: (requireAuth ? status === "authenticated" : true) && enabled,
    staleTime,
    gcTime,
    select,
  })
}