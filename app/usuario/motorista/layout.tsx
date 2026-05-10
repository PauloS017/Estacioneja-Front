import type React from "react"
import Header from "@/components/motorista/header"

export default function MotoristaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}