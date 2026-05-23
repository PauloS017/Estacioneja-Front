"use client"

import { useState } from "react"
import { Car, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { UserAvatar } from "@/components/user-avatar"
import { useUser } from "@/features/usuarios"

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { data: user } = useUser()

  if (!user) {
    return <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menu do usuário"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition cursor-pointer"
        >
          <UserAvatar
            userId={user.id}
            temFotoPerfil={user.temFotoPerfil}
            name={user.name}
            className="w-10 h-10"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="font-semibold text-sm text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("/usuario/motorista/config")
            setIsOpen(false)
          }}
          className="gap-2 cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Meu perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/usuario/motorista/veiculos")
            setIsOpen(false)
          }}
          className="gap-2 cursor-pointer"
        >
          <Car className="w-4 h-4" />
          <span>Meus veículos</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          <span>Desconectar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
