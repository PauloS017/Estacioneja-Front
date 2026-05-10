"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Search, User, Cctv, Video, Maximize2, RefreshCw } from "lucide-react"
import Swal from "sweetalert2"

import Hls from "hls.js"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getGravatarUrl } from "@/lib/utils"
import { useCheckVinculo } from "@/features/vinculos"
import { useEstacionamentoById } from "@/features/estacionamentos"
import { useFotoPerfilUrl } from "@/features/usuarios"

function CctvPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { })
      })
      return () => hls.destroy()
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => { })
      })
    }
  }, [url])

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover opacity-90 brightness-90 transition-transform duration-700"
      muted
      playsInline
      autoPlay
    />
  )
}

export default function ValidationPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { estacionamentoId } = useParams<{ estacionamentoId: string }>()

  const { data: estacionamentoSelecionado } = useEstacionamentoById(estacionamentoId)

  const [placa, setPlaca] = useState("")
  const [searchPlaca, setSearchPlaca] = useState<string | null>(null)

  const placaNormalizada = useMemo(() => placa.replace(/\s+/g, "").toUpperCase(), [placa])

  const {
    data: vinculo,
    isFetching,
    isFetched,
  } = useCheckVinculo(searchPlaca ?? undefined, estacionamentoId)

  const temFotoPerfil = vinculo?.veiculo?.usuario?.temFotoPerfil ?? false;

  const fotoPerfil = useFotoPerfilUrl(vinculo?.veiculo?.usuario?.id, temFotoPerfil);


  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState("")

  useEffect(() => {
    setMounted(true)
    setTime(new Date().toLocaleTimeString('pt-BR'))

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR'))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const status = useMemo(() => {
    if (!searchPlaca) return "idle"
    if (isFetching) return "loading"
    if (isFetched && vinculo?.id !== null && vinculo?.id !== undefined) return "success"
    if (isFetched && vinculo?.id === null) return "error"
    return "idle"
  }, [searchPlaca, isFetching, isFetched, vinculo])

  const handleSearch = () => {
    if (!placaNormalizada) {
      Swal.fire({ icon: "warning", title: "Informe a placa" })
      return
    }
    if (!estacionamentoId) {
      Swal.fire({ icon: "error", title: "Nenhum estacionamento selecionado" })
      return
    }
    setSearchPlaca(placaNormalizada)
  }

  useEffect(() => {
    if (!searchPlaca || !isFetched) return

    if (vinculo) {
      Swal.fire({
        icon: "success",
        title: "Vínculo encontrado",
        text: "Veículo autorizado para este estacionamento",
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Sem vínculo",
        text: "Veículo não vinculado a este estacionamento",
      })
    }
  }, [vinculo, isFetched, searchPlaca])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const reset = () => {
    setPlaca("")
    setSearchPlaca(null)
    inputRef.current?.focus()
  }

  const handleAbrirFechar = () => {
    Swal.fire({ icon: "success", title: "Acesso liberado", text: `Placa ${searchPlaca}` })
    reset()
  }

  const handleLiberarVisitante = () => {
    Swal.fire({
      icon: "info",
      title: "Liberar visitante",
      text: `Cadastrar visitante para placa ${searchPlaca}`,
    })
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-background overflow-y-auto">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Painel de Controle */}
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
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
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

        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden group">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">

                <div>
                  <h3 className="font-bold text-foreground leading-none text-sm">Câmera Principal - Entrada</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{estacionamentoSelecionado?.empresa.nome}</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black overflow-hidden">
              <CctvPlayer url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />

              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-white/5 transition-all" />

              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm">
                  CAM_ENTRY_01
                </div>
                <div className="text-[8px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded-sm">
                  ISO 400 • 30FPS
                </div>
              </div>

              <div className="absolute bottom-4 right-4 text-right">
                <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm inline-block">
                  {mounted ? new Date().toLocaleDateString('pt-BR') : '--/--/----'}
                </div>
                <div className="block mt-1">
                  <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm inline-block">
                    {mounted ? time : '--:--:--'}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            <div className="p-4 bg-muted/20 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-muted-foreground font-bold tracking-widest">Sinal</span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">EXCELENTE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-muted-foreground font-bold tracking-widest">IP</span>
                  <span className="text-[10px] font-mono text-foreground/70">192.168.1.144</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-muted hover:bg-border text-foreground text-[10px] font-bold rounded transition-colors flex items-center gap-1.5 border border-border">
                  <Video className="w-3 h-3" /> ALTERAR FONTE
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
