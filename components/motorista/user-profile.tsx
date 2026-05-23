"use client"

import { useRouter } from "next/navigation"
import { Car, Mail, ParkingSquare, Phone, Settings } from "lucide-react"

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
  connectedParkingsCount = 0,
  vehiclesCount = 0,
}: UserProfileProps) {
  const router = useRouter()

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 p-5 sm:p-6">
        <div className="relative flex-shrink-0">
          <UserAvatar
            userId={userProfile.id}
            temFotoPerfil={userProfile.temFotoPerfil}
            name={userProfile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-primary/20"
            fallbackClassName="text-xl"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-card" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight truncate">
              {userProfile.name}
            </h1>
          </div>

          <div className="mt-1.5 flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{userProfile.email}</span>
            </div>
            {userProfile.telefone && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{userProfile.telefone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border">
        <Stat
          icon={<ParkingSquare className="w-4 h-4" />}
          tone="primary"
          label="Estacionamentos vinculados"
          value={connectedParkingsCount}
        />
        <Stat
          icon={<Car className="w-4 h-4" />}
          tone="orange"
          label="Veículos cadastrados"
          value={vehiclesCount}
          divider
          actionLabel="Gerenciar"
          onAction={() => router.push("/usuario/motorista/veiculos")}
        />
      </div>
    </section>
  )
}

function Stat({
  icon,
  tone,
  label,
  value,
  divider,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode
  tone: "primary" | "orange"
  label: string
  value: number
  divider?: boolean
  actionLabel?: string
  onAction?: () => void
}) {
  const isOrange = tone === "orange"
  return (
    <div className={`p-5 sm:p-6 ${divider ? "border-l border-border" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`
              inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0
              ${isOrange
                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                : "bg-primary/10 text-primary"}
            `}
          >
            {icon}
          </span>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </p>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`
              text-xs font-semibold hover:underline whitespace-nowrap cursor-pointer
              ${isOrange
                ? "text-orange-600 dark:text-orange-400"
                : "text-primary"}
            `}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold text-foreground tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  )
}
