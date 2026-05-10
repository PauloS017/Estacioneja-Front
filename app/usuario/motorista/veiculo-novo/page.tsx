"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { defaultAlert } from "@/lib/utils"
import { useCreateVeiculo, type Veiculo, type TipoVeiculo } from "@/features/veiculos"

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i

export default function RegisterVehiclePage() {
  const router = useRouter()
  const { mutateAsync: createVeiculo } = useCreateVeiculo()

  const [formData, setFormData] = useState({
    plate: "",
    type: "",
    model: "",
    color: "",
    observations: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const finalValue = name === "plate" ? value.toUpperCase().replace("-", "") : value

    setFormData((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!PLATE_REGEX.test(formData.plate)) {
      defaultAlert.error({
        title: "Placa Inválida",
        text: "A placa deve seguir o padrão AAA1A23 ou AAA1234.",
      })
      return
    }

    const newVehicle: Veiculo = {
      placa: formData.plate,
      tipoVeiculo: formData.type as TipoVeiculo,
      modelo: formData.model,
      cor: formData.color,
      observacao: formData.observations,
    }

    try {
      await createVeiculo({ data: newVehicle })
      defaultAlert.success({ title: "Veículo Criado com Sucesso!" })
      router.push("/usuario/motorista/config")
    } catch (error) {
      console.error("Erro ao criar veículo:", error)
    }
  }

  const inputClass =
    "w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/usuario/motorista/config"
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Cadastrar veículo</h1>

      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        <p className="text-muted-foreground text-center mb-8">
          Preencha os dados do seu veículo para cadastrá-lo no sistema
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Placa do Veículo</label>
              <input
                type="text"
                name="plate"
                placeholder="ABC1D23"
                maxLength={7}
                value={formData.plate}
                onChange={handleChange}
                required
                className={inputClass + " uppercase"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Tipo de Veículo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Selecione</option>
                <option value="CARRO">Carro</option>
                <option value="MOTO">Moto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Modelo</label>
              <input
                type="text"
                name="model"
                placeholder="Ex: Honda Civic"
                value={formData.model}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Cor</label>
              <input
                type="text"
                name="color"
                placeholder="Ex: Preto"
                value={formData.color}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Observações (opcional)</label>
            <textarea
              name="observations"
              placeholder="Adicione observações sobre seu veículo..."
              value={formData.observations}
              onChange={handleChange}
              rows={4}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cadastrar Veículo
          </button>
        </form>
      </div>
    </main>
  )
}
