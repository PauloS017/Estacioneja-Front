"use client"

import type { ReactNode } from "react"
import { AbilityContext } from "@/lib/casl/context"
import { useTenantAbility } from "./use-tenant-ability"

export function TenantAbilityProvider({ children }: { children: ReactNode }) {
  const { ability } = useTenantAbility()

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
