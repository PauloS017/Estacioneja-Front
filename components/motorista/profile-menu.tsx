"use client"

import { useState } from "react"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const getGravatarUrl = (email: string) => {
  const hash = email ? require('crypto').createHash('md5').update(email.trim().toLowerCase()).digest('hex') : '';
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

interface ProfileMenuProps {
  onNavigate: (screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history") => void
  onLogout: () => void
  userProfile: any
}

export default function ProfileMenu({ onNavigate, onLogout, userProfile }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
          <Avatar className="w-10 h-10">
            <AvatarImage src={getGravatarUrl(userProfile.email) || "/placeholder.svg"} />
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{userProfile.name}</p>
            <p className="text-xs text-gray-500">{userProfile.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="font-semibold text-sm text-gray-900">{userProfile.name}</p>
          <p className="text-xs text-gray-500">{userProfile.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onNavigate("config")
            setIsOpen(false)
          }}
          className="gap-2 cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Meu perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4" />
          <span>Desconectar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
