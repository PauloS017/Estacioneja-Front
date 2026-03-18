"use client"

import type React from "react"
import { MotoristaProvider } from "@/context/MotoristaContext"
import Header from "@/components/motorista/header"
import { signOut } from "next-auth/react"

export default function MotoristaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotoristaProvider>
      <Header onLogout={signOut} />
      {children}
    </MotoristaProvider>
  )
}