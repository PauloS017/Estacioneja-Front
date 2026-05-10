"use client"

import type { ReactNode } from "react"
import { TenantAbilityProvider } from "@/features/acesso"

export default function TenantLayout({ children }: { children: ReactNode }) {
  return <TenantAbilityProvider>{children}</TenantAbilityProvider>
}
