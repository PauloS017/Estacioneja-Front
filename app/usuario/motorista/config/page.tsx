"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Check } from "lucide-react"

import { getGravatarUrl } from "@/lib/gravatar"
import { useUser, useEditableUser } from "@/server/features/usuario/use-usuario"
import { useVehicles } from "@/hooks/use-vehicles"
import { useVincles } from "@/hooks/use-vincles"

import { formatCPF, formatPhone } from "@/lib/formatting"

type FormState = {
  name: string
  email: string
  telefone: string
  cpf: string
}

export default function ConfigPage() {
  const { user } = useUser()
  const { updateUser, isLoading: isSaving } = useEditableUser()

  const { veiculos } = useVehicles()
  useVincles()

  const [formData, setFormData] = useState<FormState | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  useEffect(() => {
    if (user && !initialized) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        telefone: user.telefone ?? "",
        cpf: user.cpf ?? ""
      })
      setInitialized(true)
    }
  }, [user, initialized])

  function handleInputChange<K extends keyof FormState>(
    field: K,
    value: string
  ) {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev
    )
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

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      cpf: formData.cpf.trim(), 
    }

    try {
      console.log(user.id);
      await updateUser(user.id, payload as any)

      setShowSaveMessage(true)
      setTimeout(() => setShowSaveMessage(false), 3000)
    } catch (error) {
      console.error("Erro ao atualizar perfil", error)
    }
  }

  const isFormReady = !!formData

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/usuario/motorista"
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8">
        Configurações do Perfil
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-xl font-bold text-orange-500 mb-6">
          Informações Pessoais
        </h2>

        {!isFormReady ? (
          <SkeletonProfile />
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <img
                src={getGravatarUrl(formData.email) || "/placeholder.svg"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-2 border-emerald-600 object-cover"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Nome Completo"
                value={formData.name}
                onChange={(v) => handleInputChange("name", v)}
              />

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
                  className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>

                {showSaveMessage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
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

      {/* VEÍCULOS */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-orange-500">
            Meus Veículos
          </h2>

          <Link
            href="/usuario/motorista/veiculo-novo"
            className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Veículo
          </Link>
        </div>

        <div className="space-y-4">
          {veiculos?.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">
                  {vehicle.tipoVeiculo === "CARRO" ? "🚗" : "🏍️"}
                </span>
                <div>
                  <p className="font-bold text-gray-900">
                    {vehicle.placa}
                  </p>
                  <p className="text-sm text-gray-600">
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
      <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
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

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
      />
    </div>
  )
}
