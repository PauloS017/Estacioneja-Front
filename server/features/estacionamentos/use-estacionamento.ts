import { IEstacionamento } from "@/interfaces/iestacionamento";
import { useApiQuery } from "@/server/api/queries/apiQuery";

export function usePublicParks() {
  return useApiQuery<IEstacionamento[]>({
    queryKey: ["estacionamentos", "publicos"],
    endpoint: "/api/v1/estacionamentos/privacidade/PUBLICO",
  })
}

export function useParkById(id: string) {
  return useApiQuery<IEstacionamento>({
    queryKey: ["estacionamentos", id],
    endpoint: `/api/v1/estacionamentos/${id}`,
  })
}