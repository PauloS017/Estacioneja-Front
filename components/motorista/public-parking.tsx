"use client"

import { useState } from "react"
import {
  Car,
  ChevronDown,
  KeyRound,
  Lock,
  MapPin,
  ScanLine,
  Unlock,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { VeiculoVinculo } from "@/features/vinculos/types"
import { EstacionamentoHeader } from "@/features/estacionamentos/types"

interface Props extends EstacionamentoHeader {
  veiculos?: VeiculoVinculo[]
  variant?: "connected" | "public"
}

export default function PublicParking({
  nomeEmpresa,
  endereco,
  privacidade,
  regrasCapacidade,
  veiculos = [],
  variant = "connected",
}: Props) {
  const isPublicView = variant === "public"
  const [showVehicles, setShowVehicles] = useState(false)
  const [showEntryMethod, setShowEntryMethod] = useState(false)

  const enderecoFormatado = `${endereco.logradouro} - ${endereco.bairro}, ${endereco.cidade}-${endereco.uf}`

  const regras = regrasCapacidade ?? []
  const totalCapacidade = regras.reduce((acc, r) => acc + r.capacidade, 0)
  const totalDisponivel = regras.reduce((acc, r) => acc + r.capacidadeDisponivel, 0)
  const safeCapacidade = totalCapacidade > 0 ? totalCapacidade : 1
  const ocupacao = ((safeCapacidade - totalDisponivel) / safeCapacidade) * 100
  const ocupacaoLabel = Math.max(0, Math.min(100, Math.round(ocupacao)))

  const isPrivado = privacidade === "PRIVADO"

  return (
    <>
      <article
        className={`
          group relative flex flex-col h-full
          bg-card text-card-foreground
          border border-border rounded-xl
          overflow-hidden
          transition-all duration-200
          ${isPrivado
            ? "hover:border-primary/40"
            : "hover:border-orange-500/40"}
        `}
      >
        <div
          className={`h-0.5 w-full ${
            isPrivado ? "bg-primary" : "bg-orange-500"
          }`}
        />

        <div className="p-5 flex flex-col flex-1 gap-4">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-[15px] leading-snug line-clamp-2">
                {nomeEmpresa}
              </h3>
              <div className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{enderecoFormatado}</span>
              </div>
            </div>

            <span
              className={`
                inline-flex items-center gap-1
                text-[10px] font-semibold uppercase tracking-wider
                px-2 py-0.5 rounded-full flex-shrink-0
                ${isPrivado
                  ? "bg-primary/10 text-primary"
                  : "bg-orange-500/10 text-orange-600 dark:text-orange-400"}
              `}
            >
              {isPrivado ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Unlock className="w-3 h-3" />
              )}
              {isPrivado ? "Privado" : "Público"}
            </span>
          </header>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                Ocupação geral
              </span>
              <span className="text-xs font-semibold text-foreground tabular-nums">
                {ocupacaoLabel}%
              </span>
            </div>

            {regras.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Sem regras de capacidade cadastradas
              </p>
            ) : (
              <ul className="space-y-1.5">
                {regras.map((r) => {
                  const cap = r.capacidade > 0 ? r.capacidade : 1
                  const ocupTipo = ((cap - r.capacidadeDisponivel) / cap) * 100
                  const ocupTipoLabel = Math.max(0, Math.min(100, Math.round(ocupTipo)))
                  const barColor =
                    ocupTipo < 70
                      ? "bg-primary"
                      : ocupTipo < 85
                        ? "bg-amber-500"
                        : "bg-red-500"
                  return (
                    <li key={r.tipoVeiculo}>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {r.tipoVeiculo}:
                          </span>{" "}
                          {r.capacidadeDisponivel}/{r.capacidade} vagas
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
                          {ocupTipoLabel}%
                        </span>
                      </div>
                      <div
                        className="w-full h-1 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={ocupTipoLabel}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full ${barColor} transition-all duration-300`}
                          style={{ width: `${ocupTipoLabel}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {!isPublicView && (
            <div className="mt-auto flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowVehicles((v) => !v)
                }}
                aria-expanded={showVehicles}
                className="
                  w-full inline-flex items-center justify-between
                  px-3 py-2 rounded-md text-sm font-medium
                  bg-primary text-primary-foreground
                  hover:bg-primary/90
                  cursor-pointer
                  transition
                "
              >
                <span className="inline-flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Ver veículos vinculados
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showVehicles ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEntryMethod(true)
                }}
                className="
                  w-full inline-flex items-center justify-center gap-2
                  px-3 py-2 rounded-md text-sm font-medium
                  border border-border bg-background text-foreground
                  hover:bg-muted hover:border-foreground/30
                  cursor-pointer
                  transition
                "
              >
                <KeyRound className="w-4 h-4" />
                Método de entrada
              </button>
            </div>
          )}

          {!isPublicView && showVehicles && (
            <div
              className="rounded-md border border-border bg-background p-2 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {veiculos.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  Nenhum veículo vinculado
                </p>
              ) : (
                veiculos.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted/60 transition-colors"
                  >
                    <Car className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="font-mono font-semibold text-foreground">
                      {v.placa}
                    </span>
                    {v.modelo && (
                      <span className="text-muted-foreground truncate">
                        · {v.modelo}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </article>

      <Dialog open={showEntryMethod} onOpenChange={setShowEntryMethod}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Método de entrada
            </DialogTitle>
            <DialogDescription>{nomeEmpresa}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0
                  ${isPrivado
                    ? "bg-primary/10 text-primary"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400"}
                `}
              >
                {isPrivado ? (
                  <ScanLine className="w-4 h-4" />
                ) : (
                  <Car className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {isPrivado
                    ? "Acesso autenticado pela placa"
                    : "Acesso público pela portaria"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {isPrivado
                    ? "Na chegada, o operador valida a placa vinculada ao seu cadastro e libera a entrada."
                    : "Apresente-se na portaria e siga as orientações do operador local."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-border">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted text-muted-foreground flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Endereço
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {enderecoFormatado}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
