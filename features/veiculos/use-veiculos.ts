"use client"

import { useApiQuery, useApiMutation } from "@/lib/api"
import type { Veiculo } from "./types"

export const veiculosKeys = {
  all: ["veiculos"] as const,
  meus: ["veiculos", "me"] as const,
}

export function useMeusVeiculos() {
  return useApiQuery<Veiculo[]>({
    queryKey: veiculosKeys.meus,
    endpoint: "/api/v1/veiculos/me",
  })
}

export function useCreateVeiculo() {
  return useApiMutation<Veiculo, Veiculo>({
    method: "POST",
    endpoint: "/api/v1/veiculos",
    invalidateQueries: [veiculosKeys.all],
  })
}
