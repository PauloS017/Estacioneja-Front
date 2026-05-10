"use client"

import { Lock, LockKeyholeOpen, MapPin } from "lucide-react"
import type { Estacionamento } from "@/features/estacionamentos"

export default function ParkingCard({
  capacidade,
  capacidadeDisponivel,
  empresa,
  privacidade,
}: Estacionamento) {
  const endereco = empresa.endereco
  const enderecoFormatado = `${endereco.logradouro} - ${endereco.bairro}, ${endereco.cidade}-${endereco.uf}`
  const ocupacao = ((capacidade - capacidadeDisponivel) / capacidade) * 100

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className={`${privacidade === "PRIVADO" ? "bg-primary" : "bg-destructive/70"} h-1`} />

      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-2 flex gap-2">
          {privacidade === "PRIVADO" ? <Lock /> : <LockKeyholeOpen />}
          {empresa.nome}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-4 h-4" />
          <span>{enderecoFormatado}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-xs">📍 X km</span>
        </div>

        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                ocupacao < 70
                  ? "bg-emerald-500"
                  : ocupacao < 85
                    ? "bg-amber-400"
                    : "bg-red-500"
              }`}
              style={{ width: `${ocupacao}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Ocupação: {ocupacao.toFixed(0)}%</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-border">
          <div>
            <p className="text-xs text-muted-foreground">Vagas Disponíveis</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground text-right">Total: {capacidade}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
