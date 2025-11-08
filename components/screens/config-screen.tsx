"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Star, Trash2, Check } from "lucide-react"
import { getGravatarUrl } from "@/lib/gravatar"
import { formatCPF, formatPhone } from "@/lib/formatting"

interface ConfigScreenProps {
  onNavigate: (screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history") => void
  userProfile: any
  vehicles: any[]
  onSaveProfile: (profile: any) => void
  onSetPrimaryVehicle: (vehicleId: number) => void
  onDeleteVehicle: (vehicleId: number) => void
  onChangeAvatar: () => void
}

export default function ConfigScreen({
  onNavigate,
  userProfile,
  vehicles,
  onSaveProfile,
  onSetPrimaryVehicle,
  onDeleteVehicle,
  onChangeAvatar,
}: ConfigScreenProps) {
  const [formData, setFormData] = useState(userProfile)
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatCPF(value)
    } else if (field === "phone") {
      formattedValue = formatPhone(value)
    }

    setFormData({ ...formData, [field]: formattedValue })
  }

  const handleChangeAvatar = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const [emailBase] = formData.email.split("@")
    const newEmail = `${emailBase}+${randomSuffix}@gmail.com`
    setFormData({ ...formData, email: newEmail })
    onChangeAvatar()
  }

  const handleSaveProfile = () => {
    onSaveProfile(formData)
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <h1 className="text-3xl font-bold text-center mb-8">Configurações do Perfil</h1>

      {/* Personal Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-xl font-bold text-orange-500 mb-6">Informações Pessoais</h2>

        <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <img
            src={getGravatarUrl(formData.email) || "/placeholder.svg"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-2 border-emerald-600 object-cover"
          />
          <button
            onClick={handleChangeAvatar}
            className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            📷 Alterar Foto
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => handleInputChange("cpf", e.target.value)}
              placeholder="###.###.###-##"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(##) #####-####"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <button
              onClick={handleSaveProfile}
              className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              Salvar Alterações
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
      </div>

      {/* My Vehicles Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-orange-500">Meus Veículos</h2>
          <button
            onClick={() => onNavigate("register-vehicle")}
            className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Veículo
          </button>
        </div>

        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{vehicle.type === "car" ? "🚗" : "🏍️"}</span>
                <div>
                  <p className="font-bold text-gray-900">{vehicle.plate}</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.model} - {vehicle.color}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {vehicle.isPrincipal ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    Principal
                  </span>
                ) : (
                  <button
                    onClick={() => onSetPrimaryVehicle(vehicle.id)}
                    className="px-3 py-1 border border-emerald-600 text-emerald-600 rounded-full text-sm font-semibold hover:bg-emerald-50 transition flex items-center gap-1"
                  >
                    <Star className="w-4 h-4" />
                    Definir como Principal
                  </button>
                )}
                <button
                  onClick={() => onDeleteVehicle(vehicle.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
