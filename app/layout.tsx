import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

import { Providers } from "./providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "EstacioneJá - Sistema de Estacionamento Universitário",
  description: "Gerencie vagas de estacionamento em sua universidade de forma simples e eficiente",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
           <Providers>{children}</Providers>
      </body>
    </html>
  )
}