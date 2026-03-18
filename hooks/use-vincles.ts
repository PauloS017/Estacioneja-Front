"use client"

import { useApiQuery } from "@/server/api/queries/apiQuery"
import { IEstacionamento } from "@/interfaces/iestacionamento"
import { IVinculo } from "@/interfaces/ivinculo"

export function useVincles() {
  const { data, isLoading, isError } = useApiQuery<IVinculo[], IEstacionamento[]>({
    queryKey: ["vinculos"],
    endpoint: "/api/v1/vinculos",
    select: (data) => data.map((v) => v.estacionamento),
  })

  return {
    estacionamentos: data,
    isLoading,
    isError,
  }
}