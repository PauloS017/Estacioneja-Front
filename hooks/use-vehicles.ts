"use client"

import { useApiQuery } from "@/server/api/queries/apiQuery"
import { IVeiculo } from "@/interfaces/iveiculo"

export function useVehicles() {
  const { data, isLoading, isError } = useApiQuery<IVeiculo[]>({
    queryKey: ["veiculos"],
    endpoint: "/api/v1/veiculos/me",
  })

  return {
    veiculos: data,
    isLoading,
    isError,
  }
}