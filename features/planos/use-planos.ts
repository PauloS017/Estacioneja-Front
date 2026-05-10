import { useApiQuery } from "@/lib/api";
import { Plano } from "./types";

export function usePlanos() {
  return useApiQuery<Plano[]>({
    queryKey: ["planos"],
    endpoint: "/api/v1/planos",
    requireAuth: false
  })
}