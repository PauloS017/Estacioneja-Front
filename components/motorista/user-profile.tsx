"use client"

import { useState } from "react"
import { Settings, QrCode, Copy } from "lucide-react"

import { UserAvatar } from "@/components/user-avatar"
import type { Usuario } from "@/features/usuarios"

interface UserProfileProps {
  onNavigate: (screen: "home" | "config" | "veiculo-novo") => void
  userProfile: Usuario
  connectedParkingsCount?: number
  vehiclesCount?: number
}

export default function UserProfile({
  onNavigate,
  userProfile,
  connectedParkingsCount,
  vehiclesCount,
}: UserProfileProps) {
  const [copied, setCopied] = useState(false)
  const userCode = "48925"

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0">
          <UserAvatar
            userId={userProfile.id}
            temFotoPerfil={userProfile.temFotoPerfil}
            name={userProfile.name}
            className="w-32 h-32 border-4 border-primary"
            fallbackClassName="text-2xl"
          />
        </div>

        <div className="flex-1 mx-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
            <button
              onClick={() => onNavigate("config")}
              className="p-2 hover:bg-accent rounded-lg transition"
              title="Configurações do perfil"
            >
              <Settings className="w-6 h-6 text-primary" />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>📧</span>
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>📞</span>
              <span>{userProfile.telefone}</span>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Estacionamentos vinculados:</p>
              <p className="text-2xl font-bold text-primary">{connectedParkingsCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Veículos Cadastrados:</p>
              <p className="text-2xl font-bold text-primary">{vehiclesCount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-primary">
            <QrCode className="w-16 h-16 text-muted-foreground" />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Código do Usuário</p>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-3 py-1 bg-muted hover:bg-accent rounded font-semibold text-primary transition"
            >
              <span className="font-bold">{userCode}</span>
              <Copy className="w-4 h-4" />
            </button>
            {copied && <p className="text-xs text-primary mt-1">Copiado!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
