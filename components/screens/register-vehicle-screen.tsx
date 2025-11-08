"use client"

import type React from "react"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

interface RegisterVehicleScreenProps {
  onNavigate: (screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history") => void
  onAddVehicle: (vehicle: any) => void
}

export default function RegisterVehicleScreen({ onNavigate, onAddVehicle }: RegisterVehicleScreenProps) {
  const [formData, setFormData] = useState({
    plate: "",
    type: "",
    model: "",
    color: "",
    observations: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVehicle = {
      id: Date.now(),
      plate: formData.plate,
      type: formData.type as "car" | "bike",
      model: formData.model,
      color: formData.color,
      isPrincipal: false,
    }
    onAddVehicle(newVehicle)
    onNavigate("config")
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => onNavigate("config")}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <h1 className="text-3xl font-bold text-center mb-8">Cadastrar veículo</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <p className="text-gray-600 text-center mb-8">Preencha os dados do seu veículo para cadastrá-lo no sistema</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Placa do Veículo</label>
              <input
                type="text"
                name="plate"
                placeholder="ABC-1234"
                value={formData.plate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Veículo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                <option value="car">Carro</option>
                <option value="bike">Moto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
              <input
                type="text"
                name="model"
                placeholder="Ex: Honda Civic"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cor</label>
              <input
                type="text"
                name="color"
                placeholder="Ex: Preto"
                value={formData.color}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observações (opcional)</label>
            <textarea
              name="observations"
              placeholder="Adicione observações sobre seu veículo..."
              value={formData.observations}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Cadastrar Veículo
          </button>
        </form>
      </div>
    </main>
  )
}
