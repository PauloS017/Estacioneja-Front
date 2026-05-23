"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus } from "lucide-react"

import { defaultAlert, formatLicensePlate } from "@/lib/utils"
import { useCreateVeiculo, type Veiculo, type TipoVeiculo } from "@/features/veiculos"

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i

const VEHICLE_TYPES: { value: TipoVeiculo; label: string }[] = [
  { value: "CARRO", label: "Carro" },
  { value: "MOTO", label: "Moto" },
  { value: "ONIBUS", label: "Ônibus" },
  { value: "CAMINHAO", label: "Caminhão" },
]

export default function RegisterVehiclePage() {
  const router = useRouter()
  const { mutateAsync: createVeiculo, isPending } = useCreateVeiculo()

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
    const finalValue =
      name === "plate"
        ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7)
        : value

    setFormData((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!PLATE_REGEX.test(formData.plate)) {
      defaultAlert.error({
        title: "Placa inválida",
        text: "A placa deve seguir o padrão AAA1A23 ou AAA1234.",
      })
      return
    }

    if (!formData.type) {
      defaultAlert.error({ title: "Selecione o tipo do veículo" })
      return
    }

    const newVehicle: Veiculo = {
      placa: formData.plate,
      tipoVeiculo: formData.type as TipoVeiculo,
      modelo: formData.model.trim(),
      cor: formData.color.trim(),
      observacao: formData.observations.trim(),
    }

    try {
      await createVeiculo({ data: newVehicle })
      defaultAlert.success({ title: "Veículo cadastrado" })
      router.push("/usuario/motorista/veiculos")
    } catch {
      defaultAlert.error({
        title: "Não foi possível cadastrar",
        text: "Verifique os dados e tente novamente.",
      })
    }
  }

  const inputClass =
    "w-full px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition"

  const labelClass =
    "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5"

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link
        href="/usuario/motorista/veiculos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <header className="mb-6 sm:mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
          Sua garagem
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Cadastrar veículo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha os dados do veículo para vinculá-lo à sua conta.
        </p>
      </header>

      <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="plate" className={labelClass}>
                Placa
              </label>
              <input
                id="plate"
                type="text"
                name="plate"
                placeholder="ABC1D23"
                maxLength={8}
                value={formatLicensePlate(formData.plate)}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputClass + " uppercase font-mono tracking-widest"}
              />
            </div>

            <div>
              <label htmlFor="type" className={labelClass}>
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={inputClass + " cursor-pointer"}
              >
                <option value="">Selecione</option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model" className={labelClass}>
                Modelo
              </label>
              <input
                id="model"
                type="text"
                name="model"
                placeholder="Ex: Honda Civic"
                value={formData.model}
                onChange={handleChange}
                required
                maxLength={60}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="color" className={labelClass}>
                Cor
              </label>
              <input
                id="color"
                type="text"
                name="color"
                placeholder="Ex: Preto"
                value={formData.color}
                onChange={handleChange}
                required
                maxLength={30}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="observations" className={labelClass}>
              Observações <span className="text-muted-foreground/70 normal-case tracking-normal">(opcional)</span>
            </label>
            <textarea
              id="observations"
              name="observations"
              placeholder="Detalhes que ajudem a identificar o veículo..."
              value={formData.observations}
              onChange={handleChange}
              rows={3}
              maxLength={240}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full inline-flex items-center justify-center gap-2
              px-4 py-2.5 rounded-md text-sm font-semibold
              bg-primary text-primary-foreground
              hover:bg-primary/90
              enabled:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              transition
            "
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Cadastrar veículo
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  )
}
