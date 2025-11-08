"use client"

import { Settings, QrCode, Copy } from "lucide-react"
import { getGravatarUrl } from "../../lib/gravatar"
import { useState } from "react"

interface UserProfileProps {
  onNavigate: (screen: "home" | "config" | "register-vehicle") => void
  userProfile: any
  connectedParkingsCount: number
  vehiclesCount: number
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
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <div className="flex items-start justify-between">
        {/* Avatar on the left */}
        <div className="flex-shrink-0">
          <img
            src={getGravatarUrl(userProfile.email) || "/placeholder.svg"}
            alt={userProfile.name}
            className="w-32 h-32 rounded-full border-4 border-emerald-600 object-cover"
          />
        </div>

        {/* User Info in the middle */}
        <div className="flex-1 mx-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
            <button
              onClick={() => onNavigate("config")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Configurações do perfil"
            >
              <Settings className="w-6 h-6 text-emerald-600" />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <span>📧</span>
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span>📞</span>
              <span>{userProfile.phone}</span>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-600">Estacionamentos vinculados:</p>
              <p className="text-2xl font-bold text-emerald-600">{connectedParkingsCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Veículos Cadastrados:</p>
              <p className="text-2xl font-bold text-emerald-600">{vehiclesCount}</p>
            </div>
          </div>
        </div>

        {/* QR Code on the right */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-emerald-600">
            <QrCode className="w-16 h-16 text-gray-400" />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">Código do Usuário</p>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-emerald-600 transition"
            >
              <span className="font-bold">{userCode}</span>
              <Copy className="w-4 h-4" />
            </button>
            {copied && <p className="text-xs text-emerald-600 mt-1">Copiado!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
