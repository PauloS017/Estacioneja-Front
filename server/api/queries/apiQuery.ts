import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

interface UseApiQueryProps<TQueryFnData, TData> {
  queryKey: string[];
  endpoint: string;
  select?: (data: TQueryFnData) => TData;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useApiQuery<TQueryFnData, TData = TQueryFnData>({
  queryKey,
  endpoint,
  select,
  enabled = true,
  staleTime = 1000 * 60 * 5,
  gcTime,
}: UseApiQueryProps<TQueryFnData, TData>) {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  const query = useQuery<TQueryFnData, Error, TData>({
    queryKey,
    queryFn: async () => {
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    enabled: status === "authenticated" && !!accessToken && enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    select,
  });

  return {
    ...query,
    isLoading: status === "loading" || query.isLoading,
  };
}
