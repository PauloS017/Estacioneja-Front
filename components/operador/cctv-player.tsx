"use client"

import { useRef, useEffect, useState } from "react"
import { Camera, CameraOff, Video, Maximize2, RefreshCw, Check, ChevronDown } from "lucide-react"

interface CctvPlayerProps {
  estacionamentoDescricao?: string
  className?: string
}

export function CctvPlayer({ estacionamentoDescricao, className }: CctvPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [permission, setPermission] = useState<"prompt" | "checking" | "granted" | "denied">("prompt")
  const [error, setError] = useState<string | null>(null)
  const [showDevices, setShowDevices] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [fps, setFps] = useState<number | null>(null)

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("pt-BR"))
    setDate(new Date().toLocaleDateString("pt-BR"))
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR"))
      setDate(new Date().toLocaleDateString("pt-BR"))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Listen to fullscreen changes to update UI state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const startCamera = async (deviceId?: string) => {
    setError(null)
    setPermission("checking")

    if (typeof window === "undefined") return

    if (!navigator || !navigator.mediaDevices) {
      setError("Ambiente não seguro. O acesso à câmera requer HTTPS ou localhost.")
      setPermission("denied")
      return
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      streamRef.current = mediaStream
      setPermission("granted")

      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter(d => d.kind === "videoinput")
      setDevices(videoDevices)

      const activeTrack = mediaStream.getVideoTracks()[0]
      if (activeTrack) {
        const settings = activeTrack.getSettings()
        if (settings.deviceId) {
          setSelectedDeviceId(settings.deviceId)
          localStorage.setItem("preferred-webcam-device-id", settings.deviceId)
        }
        setFps(typeof settings.frameRate === "number" ? Math.round(settings.frameRate) : null)
      }
    } catch (err: any) {
      console.error("Erro ao acessar a câmera:", err)
      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices) {
          const allDevices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = allDevices.filter(d => d.kind === "videoinput")
          if (videoDevices.length > 0) {
            setDevices(videoDevices)
          }
        }
      } catch (enumErr) {
        console.error("Erro ao enumerar dispositivos no bloco catch:", enumErr)
      }

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Permissão de câmera negada pelo usuário ou bloqueada pelo navegador.")
        setPermission("denied")
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Nenhuma câmera física foi encontrada no computador. Verifique os cabos USB.")
        setPermission("denied")
      } else {
        setError(err.message || "Erro desconhecido ao tentar acessar o dispositivo de câmera.")
        setPermission("denied")
      }
    }
  }

  // Handle device change
  const handleDeviceChange = async (deviceId: string) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
    setFps(null)
    setSelectedDeviceId(deviceId)
    localStorage.setItem("preferred-webcam-device-id", deviceId)
    setShowDevices(false)
    await startCamera(deviceId)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Initial stream start
  useEffect(() => {
    const savedDeviceId = localStorage.getItem("preferred-webcam-device-id")
    startCamera(savedDeviceId || undefined)

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Bind stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const selectedDevice = devices.find(d => d.deviceId === selectedDeviceId)
  const selectedLabel = selectedDevice?.label || "Câmera USB / Integrada"

  return (
    <div 
      ref={containerRef}
      className={`bg-card border border-border rounded-2xl shadow-xl overflow-hidden group flex flex-col ${className || ""}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-foreground leading-none text-sm">
              Câmera Local - Guarita
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">
              {estacionamentoDescricao || "Estacionamento"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {permission === "granted" && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded text-[10px] font-bold text-red-500 uppercase">
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              AO VIVO
            </div>
          )}
          <button 
            type="button"
            onClick={toggleFullscreen}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
            title={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video / Fallback Area */}
      <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
        {permission === "checking" && (
          <div className="text-center p-6 flex flex-col items-center gap-3">
            <RefreshCw className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              Conectando com a câmera...
            </p>
          </div>
        )}

        {permission === "denied" && (
          <div className="text-center p-6 flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <CameraOff className="w-6 h-6 text-destructive animate-pulse" />
            </div>
            
            <h4 className="text-sm font-bold text-foreground mb-1">
              Acesso à câmera bloqueado ou indisponível
            </h4>
            
            {error && (
              <p className="text-[10px] text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded border border-amber-500/20 font-mono mb-4 text-center leading-relaxed max-w-[340px]">
                {error}
              </p>
            )}

            <div className="text-left w-full bg-muted/40 border border-border p-3.5 rounded-xl mb-4 space-y-2 select-none">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                Como habilitar o dispositivo:
              </p>
              <div className="flex items-start gap-1.5 text-xs text-foreground/80 leading-normal">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-[9px] mt-0.5">1</span>
                <span>Clique no ícone de <strong>Cadeado 🔒</strong> na barra de endereços do navegador (ao lado da URL).</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-foreground/80 leading-normal">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-[9px] mt-0.5">2</span>
                <span>Localize a permissão de <strong>Câmera</strong> e configure como <strong>Permitir</strong>.</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-foreground/80 leading-normal">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-[9px] mt-0.5">3</span>
                <span>Confirme se a webcam externa está devidamente conectada à porta USB do computador.</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 px-3 py-2 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-lg transition-colors border border-border cursor-pointer text-center"
              >
                Recarregar Página
              </button>
              <button
                type="button"
                onClick={() => startCamera(selectedDeviceId || undefined)}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/25"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {permission === "granted" && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover opacity-95 brightness-95 transition-transform duration-700"
              muted
              playsInline
              autoPlay
            />

            <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-white/5 transition-all" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            <div className="absolute top-4 left-4 flex flex-col gap-1">
              <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm select-none">
                CAM_GUARITA_LOCAL
              </div>
              <div className="text-[8px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded-sm select-none">
                USB FEED • {fps != null ? `${fps}FPS` : "-- FPS"}
              </div>
            </div>

            {/* DateTime Overlay */}
            <div className="absolute bottom-4 right-4 text-right select-none">
              <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm inline-block">
                {date || "--/--/----"}
              </div>
              <div className="block mt-1">
                <div className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded-sm inline-block">
                  {time || "--:--:--"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 bg-muted/20 flex items-center justify-between border-t border-border relative">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase text-muted-foreground font-bold tracking-widest">
              Sinal
            </span>
            <span className={`text-[10px] font-mono font-bold ${permission === "granted" ? "text-emerald-500" : "text-amber-500"}`}>
              {permission === "granted" ? "LOCAL CONECTADO" : "AGUARDANDO FONTE"}
            </span>
          </div>
          <div className="flex flex-col max-w-[200px]">
            <span className="text-[8px] uppercase text-muted-foreground font-bold tracking-widest">
              Dispositivo
            </span>
            <span className="text-[10px] font-mono text-foreground/70 truncate" title={selectedLabel}>
              {permission === "granted" ? selectedLabel : "Nenhum"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {devices.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDevices(!showDevices)}
                className="px-3 py-1 bg-muted hover:bg-border text-foreground text-[10px] font-bold rounded transition-colors flex items-center gap-1.5 border border-border cursor-pointer"
              >
                <Video className="w-3 h-3" /> ALTERAR FONTE <ChevronDown className="w-3 h-3" />
              </button>

              {showDevices && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDevices(false)} 
                  />
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1 border-b border-border mb-1">
                      Selecione a Câmera
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {devices.map((device) => (
                        <button
                          key={device.deviceId}
                          type="button"
                          onClick={() => handleDeviceChange(device.deviceId)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                            selectedDeviceId === device.deviceId
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted text-foreground/80"
                          }`}
                        >
                          <span className="truncate max-w-[180px]">{device.label || `Câmera ${device.deviceId.slice(0, 5)}...`}</span>
                          {selectedDeviceId === device.deviceId && <Check className="w-3.5 h-3.5 shrink-0 ml-2 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
