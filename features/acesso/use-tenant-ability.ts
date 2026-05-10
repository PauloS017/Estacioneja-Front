"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { defineAbilityFor } from "@/lib/casl/ability"
import { useMyAccessInTenant } from "./use-acessos"

export function useTenantAbility() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId

  const { data: meuAcesso, isLoading } = useMyAccessInTenant(tenantId)

  const ability = useMemo(
    () => defineAbilityFor(meuAcesso?.tipoAcesso ?? "NONE"),
    [meuAcesso?.tipoAcesso]
  )

  return {
    ability,
    isLoading,
    tipoAcesso: meuAcesso?.tipoAcesso,
    tenantId,
    meuAcesso,
  }
}
