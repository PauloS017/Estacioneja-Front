"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"


const navLinks = [
  { label: "Página Inicial", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "FAQ", href: "/faq" },
  { label: "Avaliação", href: "/avaliacao" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

 
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* Landing page é sempre light, logo usa sempre a versão white theme */}
          <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-12 w-auto" />
        </Link>

        {/* Navegação para Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botões de Ação e Menu Mobile */}
        <div className="flex items-center gap-2">
          {/* Botões de Login/Cadastro para Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastrar">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Cadastrar
              </Button>
            </Link>
          </div>

          {/* Gatilho do Menu Mobile */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="flex items-center gap-2 pb-4 border-b mb-4">
                  {/* Logo no menu mobile - sempre light pois o site é sempre claro */}
                  <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-10 w-auto" />
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                        pathname === link.href
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                {/* Botões de Login/Cadastro para Mobile */}
                <div className="mt-6 pt-6 border-t flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastrar" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Cadastrar</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
