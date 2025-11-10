import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'sonner';
// 👇 1. IMPORTE O PROVEDOR
import { MotoristaProvider } from "@/context/MotoristaContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "EstacioneJá - Sistema de Estacionamento Universitário",
  description: "Gerencie vagas de estacionamento em sua universidade de forma simples e eficiente",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* 👇 2. ENVELOPE SEU APLICATIVO COM O PROVEDOR */}
          <MotoristaProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </MotoristaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}