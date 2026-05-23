"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import ProfileMenu from "@/components/motorista/profile-menu"
import NotificationsMenu from "@/components/motorista/notifications-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const NAV_ITEMS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/usuario/motorista", label: "Home", exact: true },
  { href: "/usuario/motorista/comunidade", label: "Comunidade" },
  { href: "/usuario/motorista/historico", label: "Histórico" },
]

function isActive(pathname: string | null, item: (typeof NAV_ITEMS)[number]) {
  if (!pathname) return false
  return item.exact ? pathname === item.href : pathname.startsWith(item.href)
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
        <Link
          href="/usuario/motorista"
          className="flex items-center flex-shrink-0"
          aria-label="EstacioneJá · Home"
        >
          <div className="flex items-center h-10 w-32 sm:h-14 sm:w-44">
            <img
              src="/logowhitetheme.svg"
              alt="EstacioneJá"
              className="h-full w-full object-contain dark:hidden"
            />
            <img
              src="/logodarkmode.svg"
              alt="EstacioneJá"
              className="h-full w-full object-contain hidden dark:block"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <NotificationsMenu />
          </div>

          <ProfileMenu />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="
                  md:hidden inline-flex items-center justify-center
                  w-10 h-10 rounded-lg
                  text-foreground hover:bg-accent
                  cursor-pointer transition
                "
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[340px] p-0 flex flex-col gap-0"
            >
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                <SheetTitle className="text-base font-semibold">
                  Menu
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Navegue pelas áreas do seu painel.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="px-3 py-4">
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Navegação
                  </p>
                  <ul className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                      const active = isActive(pathname, item)
                      return (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className={`
                                flex items-center justify-between
                                px-3 py-2.5 rounded-md
                                text-sm font-medium
                                transition-colors
                                ${active
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}
                              `}
                            >
                              <span>{item.label}</span>
                              {active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                              )}
                            </Link>
                          </SheetClose>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="border-t border-border" />

                <div className="px-3 py-4">
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Preferências
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 rounded-md">
                      <span className="text-sm font-medium text-foreground">
                        Tema
                      </span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-md">
                      <span className="text-sm font-medium text-foreground">
                        Notificações
                      </span>
                      <NotificationsMenu />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
