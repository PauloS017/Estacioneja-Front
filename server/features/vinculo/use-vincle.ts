import { useApiQuery } from "@/server/api/queries/apiQuery";

export function useCheckVincle(placa?: string, estacionamentoId?: string) {
  return useApiQuery<boolean>({
    queryKey: ["checar-vinculo", placa, estacionamentoId],
    endpoint:
      placa && estacionamentoId
        ? `/api/v1/vinculos/estacionamento/${estacionamentoId}?placa=${placa}`
        : "",
    enabled: !!placa && !!estacionamentoId,
    staleTime: 0,
    gcTime: 0,
  });
}
