"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Check } from "lucide-react"

import { formatCPF, formatPhone, defaultAlert } from "@/lib/utils"
import { useUser, useUpdateUser, type Usuario } from "@/features/usuarios"
import { useMeusVeiculos } from "@/features/veiculos"
import { ProfilePhotoEditor } from "@/components/profile-photo-editor"

type FormState = {
  name: string
  email: string
  telefone: string
  cpf: string
}

export default function ConfigPage() {
  const { data: user } = useUser()
  const { mutateAsync: updateUser, isPending: isSaving } = useUpdateUser()
  const { data: veiculos } = useMeusVeiculos()

  const [formData, setFormData] = useState<FormState | null>(null)
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  useEffect(() => {
    if (user && !formData) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        telefone: user.telefone ?? "",
        cpf: user.cpf ?? "",
      })
    }
  }, [user, formData])

  function handleInputChange<K extends keyof FormState>(field: K, value: string) {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const hasChanges = useMemo(() => {
    if (!user || !formData) return false
    return (
      formData.name !== (user.name ?? "") ||
      formData.email !== (user.email ?? "") ||
      formData.telefone !== (user.telefone ?? "") ||
      formData.cpf !== (user.cpf ?? "")
    )
  }, [user, formData])

  async function handleSaveProfileClick() {
    if (!user || !formData || !hasChanges || isSaving) return

    const payload: Partial<Usuario> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      cpf: formData.cpf.trim(),
    }

    try {
      await updateUser({ id: user.id, data: payload })
      defaultAlert.success({ title: "Usuário atualizado com sucesso" })
      setTimeout(() => setShowSaveMessage(false), 3000)
    } catch (error) {
      console.error("Erro ao atualizar perfil", error)
    }
  }
  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/usuario/motorista"
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold text-center text-foreground mb-8">Configurações do Perfil</h1>

      <div className="bg-card border border-border rounded-lg p-8 mb-8">
        <h2 className="text-xl font-bold text-orange-500 mb-6">Informações Pessoais</h2>

        {!formData ? (
          <SkeletonProfile />
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-border">
              {user && (
                <ProfilePhotoEditor
                  userId={user.id}
                  temFotoPerfil={user.temFotoPerfil}
                  name={user.name}
                />
              )}
            </div>

            <div className="space-y-4">
              <Input label="Nome Completo" value={formData.name} onChange={(v) => handleInputChange("name", v)} />
              <Input
                label="CPF"
                value={formatCPF(formData.cpf) ?? ""}
                onChange={(v) => handleInputChange("cpf", v)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleInputChange("email", v)}
                />
                <Input
                  label="Telefone"
                  value={formatPhone(formData.telefone)}
                  onChange={(v) => handleInputChange("telefone", v)}
                  placeholder="(##) #####-####"
                />
              </div>

              <div className="relative">
                <button
                  onClick={handleSaveProfileClick}
                  disabled={!hasChanges || isSaving}
                  className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>

                {showSaveMessage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Check className="w-6 h-6" />
                      Perfil Atualizado
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-orange-500">Meus Veículos</h2>

          <Link
            href="/usuario/motorista/veiculo-novo"
            className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Veículo
          </Link>
        </div>

        <div className="space-y-4">
          {veiculos?.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{vehicle.tipoVeiculo === "CARRO" ? "🚗" : "🏉️"}</span>
                <div>
                  <p className="font-bold text-foreground">{vehicle.placa}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.modelo} - {vehicle.cor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}


function SkeletonProfile() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 w-32 bg-muted rounded-full mx-auto" />
      <div className="h-10 bg-muted rounded" />
      <div className="h-10 bg-muted rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}

type InputProps = {
  label: string
  value: string
  onChange?: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
}

function Input({ label, value, onChange, type = "text", placeholder, disabled }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:opacity-70 disabled:cursor-not-allowed"
      />
    </div>
  )
}
