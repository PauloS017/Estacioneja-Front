"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Lista de links que vamos manter.
const navLinks = [
  { label: "Página Inicial", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "FAQ", href: "/faq" },
  { label: "Avaliação", href: "/avaliacao" },
]

interface NavbarProps {
  variant?: "default" | "guarita"
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (variant === "guarita") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo à esquerda */}
          <Link href="/usuario/guarita" className="flex items-center gap-2">
            <img src="/Logo1.svg" alt="EstacioneJá" className="h-10 w-auto" />
          </Link>

          {/* Título centralizado */}
          <div className="hidden md:block text-black">
            <h1 className="text-lg font-bold text-foreground">Painel de Operador</h1>
            <p className="text-xs text-muted-foreground">Sistema de Controle de Acesso</p>
          </div>

          {/* Ações à direita */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-[#ff6b00]" />
              <span className="sr-only">Notificações</span>
            </Button>
            <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full">
              <User className="h-5 w-5 text-white" />
              <span className="sr-only">Perfil</span>
            </Button>
          </div>
        </div>
      </header>
    )
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo1.svg" alt="Logo" className="block dark:hidden h-12 w-auto" />
          <img src="/Logo2.svg" alt="Logo" className="hidden dark:block h-12 w-auto" />
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
                <div className="flex items-center gap-2 pb-4 border-b mb-4">
                  {/* Logo para o menu mobile - Também restaurada */}
                  <img src="/Logo1.svg" alt="Logo" className="block dark:hidden h-10 w-auto" />
                  <img src="/Logo2.svg" alt="Logo" className="hidden dark:block h-10 w-auto" />
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
