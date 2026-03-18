"use client"

import Header from "@/components/operador/header"
import { OperadorProvider } from "@/context/OperadorContext"

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <OperadorProvider>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1">{children}</main>
            </div>
        </OperadorProvider>
  )
}