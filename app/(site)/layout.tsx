import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import React from "react"

// Este layout envolve Home, Sobre, FAQ, etc.
// A div com style inline garante que o site SEMPRE use as cores do tema claro,
// mesmo que o usuário tenha dark mode ativo no painel do sistema.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        colorScheme: "light",
        ["--background" as string]: "0 0% 100%",
        ["--foreground" as string]: "240 10% 3.9%",
        ["--card" as string]: "0 0% 100%",
        ["--card-foreground" as string]: "240 10% 3.9%",
        ["--muted" as string]: "240 4.8% 95.9%",
        ["--muted-foreground" as string]: "240 3.8% 46.1%",
        ["--border" as string]: "240 5.9% 90%",
        ["--input" as string]: "240 5.9% 90%",
        ["--primary" as string]: "152 76% 36%",
        ["--primary-foreground" as string]: "355.7 100% 97.3%",
        // --secondary é o laranja da marca usado em CTAs e ícones da landing page.
        ["--secondary" as string]: "24 100% 50%",
        ["--secondary-foreground" as string]: "0 0% 98%",
        ["--accent" as string]: "240 4.8% 95.9%",
        ["--accent-foreground" as string]: "240 5.9% 10%",
        ["--popover" as string]: "0 0% 100%",
        ["--popover-foreground" as string]: "240 10% 3.9%",
        ["--destructive" as string]: "0 84.2% 60.2%",
        ["--ring" as string]: "152 76% 36%",
      }}
      className="bg-white text-gray-900"
    >
      <Navbar />
      {children}
      <SiteFooter />
    </div>
  )
}