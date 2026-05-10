"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useFotoPerfilUrl } from "@/features/usuarios"

interface UserAvatarProps {
  userId: string
  temFotoPerfil: boolean
  name?: string
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  userId,
  temFotoPerfil,
  name,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const { data, refetch } = useFotoPerfilUrl(userId, temFotoPerfil)

  return (
    <Avatar className={cn("size-8", className)}>
      {temFotoPerfil && data?.url ? (
        <AvatarImage
          src={data.url}
          alt={name ? `Foto de ${name}` : "Foto de perfil"}
          // object-cover evita que fotos não-quadradas fiquem esticadas;
          // a primitiva Radix só aplica aspect-square + size-full.
          className="object-cover"
          // Se a URL assinada expirou enquanto a aba estava aberta, refetch e o Radix
          // troca a imagem automaticamente quando o novo src carregar.
          onError={() => refetch()}
        />
      ) : null}
      <AvatarFallback className={cn("font-semibold", fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0][0]!.toUpperCase()
  return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase()
}
