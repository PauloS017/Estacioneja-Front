"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ProfileMenu from "@/components/motorista/profile-menu"
import NotificationsMenu from "@/components/motorista/notifications-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/usuario/motorista" className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center h-12 w-36 sm:h-16 sm:w-48">
            <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-full w-full object-contain dark:hidden" />
            <img src="/logodarkmode.svg" alt="EstacioneJá" className="h-full w-full object-contain hidden dark:block" />
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/usuario/motorista"
            className={`font-medium transition-colors ${pathname === "/usuario/motorista"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
              }`}
          >
            Home
          </Link>
          <Link
            href="/usuario/motorista/historico"
            className={`font-medium transition-colors ${pathname === "/usuario/motorista/historico"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
              }`}
          >
            Histórico
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}