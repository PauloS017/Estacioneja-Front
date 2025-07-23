"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Menu, type LucideIcon } from "lucide-react" // Importe LucideIcon para tipagem
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Building2, User, Settings, LogOut, Calendar, BarChart3, FileText, Star } from "lucide-react"
import { cn } from "@/lib/utils" // Importar cn para classes condicionais

// Definição de tipo para os itens de navegação
interface NavItem {
  href: string
  label: string
  icon?: LucideIcon // O ícone é opcional e do tipo LucideIcon
}

const navLinks = [
  { label: "Página Inicial", href: "/" },
  { label: "Planos", href: "/#planos" }, // Alterado para âncora
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Avaliação", href: "/avaliacao" },
  { label: "FAQ", href: "/faq" },

]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("/")

  // Detectar tipo de usuário baseado na rota
  const isAdmin = pathname.startsWith("/admin")
  const isMotorista = pathname.startsWith("/motorista")
  const isLoggedIn = isAdmin || isMotorista
  // A Navbar da página inicial e das páginas públicas terão o mesmo layout
  const shouldUsePublicLayout = navLinks.some((link) => {
    if (link.href === "/") return pathname === "/"
    if (link.href.startsWith("/#")) return pathname === "/" // Anchor links are on homepage
    return pathname.startsWith(link.href)
  })

  const adminNavItems: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/cadastrar-estacionamento", label: "Cadastrar Estacionamento", icon: Building2 },
    { href: "/admin/relatorios", label: "Relatórios", icon: FileText },
  ]

  const motoristaNavItems: NavItem[] = [
    { href: "/motorista/dashboard", label: "Meu Painel", icon: User },
    { href: "/motorista/agendar-vaga", label: "Agendar Vaga", icon: Calendar },
    { href: "/motorista/cadastrar-veiculo", label: "Cadastrar Veículo", icon: Car },
    { href: "/avaliacao", label: "Avaliações", icon: Star },

  ]

  // currentNavItems agora usa navLinks para o layout público
  const currentNavItems: NavItem[] = isAdmin ? adminNavItems : isMotorista ? motoristaNavItems : navLinks

  const getUserInfo = () => {
    if (isAdmin) {
      return {
        name: "Admin Sistema",
        email: "admin@estacioneja.com",
        role: "Administrador",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else if (isMotorista) {
      return {
        name: "João Silva",
        email: "joao@email.com",
        role: "Motorista",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    }
    return null
  }

  const userInfo = getUserInfo()

  // Atualiza o link ativo com base no pathname atual
  useEffect(() => {
    const matchingLink = navLinks.find((link) => {
      if (link.href === "/") {
        return pathname === "/"
      }
      if (link.href.startsWith("/#")) {
        return pathname === "/" && window.location.hash === link.href.substring(1)
      }
      return pathname.startsWith(link.href)
    })
    if (matchingLink) {
      setActiveLink(matchingLink.href)
    } else {
      setActiveLink("")
    }
  }, [pathname])

  // Layout especial para páginas públicas
  if (shouldUsePublicLayout) {
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
              <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-background text-foreground">
                <div className="flex items-center gap-2 pb-4">
                  <Car className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg text-foreground">EstacioneJá</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                        activeLink === link.href
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden md:inline-block text-foreground">EstacioneJá</span>
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
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/cadastrar">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  // Layout padrão para outras páginas (admin/motorista)
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={isLoggedIn ? (isAdmin ? "/admin/dashboard" : "/motorista/dashboard") : "/"}
          className="flex items-center space-x-2"
        >
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">EstacioneJá</span>
        </Link>

        {/* Desktop Navigation (centralizada) */}
        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          {currentNavItems.map((item) => {
            const IconComponent = item.icon // Renomeado para evitar conflito e clareza
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Botões e Mobile Menu (à direita) */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo?.avatar || "/placeholder.svg"} alt={userInfo?.name} />
                      <AvatarFallback>{userInfo?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userInfo?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{userInfo?.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {userInfo?.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={isAdmin ? "/admin/configuracoes" : "/motorista/configuracoes"}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                    className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isLoggedIn &&
            !shouldUsePublicLayout && ( // Ajustado para não mostrar botões de login/cadastro se for layout público
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/cadastrar">
                  <Button>Cadastrar</Button>
                </Link>
              </div>
            )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {isLoggedIn && userInfo && (
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
                      <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-medium">{userInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {userInfo.role}
                      </Badge>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-2">
                  {currentNavItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {!isLoggedIn &&
                  !shouldUsePublicLayout && ( // Ajustado para não mostrar botões de login/cadastro se for layout público
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Entrar
                        </Button>
                      </Link>
                      <Link href="/cadastrar" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Cadastrar</Button>
                      </Link>
                    </div>
                  )}

                {isLoggedIn && (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Link
                      href={isAdmin ? "/admin/configuracoes" : "/motorista/perfil"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
