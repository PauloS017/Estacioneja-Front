"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navLinks = [
  { name: "Página Inicial", href: "/" },
  { name: "Planos", href: "/#planos" },
  { name: "Sobre Nós", href: "/sobre" },
  { name: "Avaliação", href: "/avaliacao" },
  { name: "FAQ", href: "/faq" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("/")

  // Atualiza o link ativo com base no pathname atual
  useEffect(() => {
    // Verifica se o pathname atual corresponde a algum dos links
    const matchingLink = navLinks.find((link) => {
      if (link.href === "/") {
        return pathname === "/"
      }
      return pathname.startsWith(link.href)
    })

    if (matchingLink) {
      setActiveLink(matchingLink.href)
    } else {
      setActiveLink("")
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex items-center gap-2 pb-4">
                <Car className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">EstacioneJá</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                      activeLink === link.href ? "bg-accent font-medium" : "text-muted-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block">EstacioneJá</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                activeLink === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-white"
            >
              Entrar
            </Button>
          </Link>
          <Link href="/cadastrar">
            <Button size="sm" className="bg-secondary hover:bg-secondary-600">
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
