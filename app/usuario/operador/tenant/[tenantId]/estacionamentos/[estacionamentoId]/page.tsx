"use client"

import { Search, User, RefreshCw } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getGravatarUrl, formatLicensePlate } from "@/lib/utils"
import { useValidationPage } from "@/features/vinculos"
import { CctvPlayer } from "@/components/operador/cctv-player"

export default function ValidationPage() {
  const {
    inputRef,
    placa,
    setPlaca,
    searchPlaca,
    estacionamentoSelecionado,
    vinculo,
    fotoPerfil,
    temFotoPerfil,
    status,
    handleSearch,
    handleKeyPress,
    handleAbrirFechar,
    handleLiberarVisitante,
  } = useValidationPage()

  return (
    <div className="flex-1 flex flex-col p-8 bg-background overflow-y-auto">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl shadow-xl p-8 md:p-12 order-2 lg:order-1">
          <div className="flex justify-center mb-8">
            {status === "success" ? (
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage
                  src={temFotoPerfil && fotoPerfil.data?.url || getGravatarUrl(`${searchPlaca}@email.com`)}
                  alt={searchPlaca ?? ""}
                />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {searchPlaca?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center shadow-inner border border-border">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="text-center mb-8 h-28 flex flex-col items-center justify-center">
            {status === "idle" && (
              <p className="text-lg text-muted-foreground font-medium">
                Digite a placa{" "}
                {estacionamentoSelecionado?.descricao ? `- ${estacionamentoSelecionado.descricao}` : ""}
              </p>
            )}

            {status === "loading" && (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground font-medium">Verificando vínculo...</p>
              </div>
            )}

            {status === "success" && (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold text-foreground mb-1">{vinculo?.veiculo?.usuario?.name}</h2>
                <p className="text-primary font-mono text-xl font-bold tracking-widest">{searchPlaca}</p>
                <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">Autorizado</span>
              </div>
            )}

            {status === "error" && (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-lg text-destructive font-bold uppercase tracking-tight">Veículo não vinculado</p>
                <p className="text-sm text-muted-foreground mt-1">Acesso negado para {searchPlaca}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="ABC1D23"
                value={formatLicensePlate(placa)}
                onChange={(e) => setPlaca(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xl font-mono tracking-widest text-foreground placeholder-muted-foreground uppercase transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={status === "loading"}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 text-lg"
            >
              {status === "loading" ? "Buscando..." : "Consultar Placa"}
            </button>
          </div>

          <div className="flex justify-center border-t border-border pt-6">
            {status === "success" && (
              <button
                onClick={handleAbrirFechar}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Liberar Acesso
              </button>
            )}

            {status === "error" && (
              <button
                onClick={handleLiberarVisitante}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                Liberar como Visitante
              </button>
            )}

            {status === "idle" && (
              <div className="w-full py-4 px-8 rounded-xl bg-muted text-muted-foreground font-bold text-center border border-dashed border-border opacity-60">
                Aguardando placa...
              </div>
            )}
          </div>
        </div>

        {/* Câmera de Segurança */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <CctvPlayer
            estacionamentoDescricao={estacionamentoSelecionado?.descricao}
          />
        </div>

      </div>
    </div>
  )
}
