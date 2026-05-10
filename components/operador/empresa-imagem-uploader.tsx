"use client"

import { useEffect, useRef, useState } from "react"
import { AxiosError } from "axios"
import { ImagePlus, Check, Trash2, X } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Toast, confirmDialog, defaultAlert, cn } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"] as const
const ACCEPT_ATTR = ACCEPTED_TYPES.join(",")
const MAX_BYTES = 5 * 1024 * 1024

interface EmpresaImagemUploaderProps {
  label: string
  description: string
  currentUrl: string | null | undefined
  hasImage: boolean
  upload: ReturnType<typeof useMutation<any, Error, { empresaId: string; file: File }>>
  remove: ReturnType<typeof useMutation<any, Error, { empresaId: string }>>
  empresaId: string
  /** Proporção do preview (logo = quadrado, banner = larga). */
  aspectClass: string
  emptyHint: string
}

export function EmpresaImagemUploader({
  label,
  description,
  currentUrl,
  hasImage,
  upload,
  remove,
  empresaId,
  aspectClass,
  emptyHint,
}: EmpresaImagemUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const isWorking = upload.isPending || remove.isPending

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function openPicker() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
      defaultAlert.error({
        title: "Formato não suportado",
        text: "Envie uma imagem JPEG, PNG, WEBP ou SVG.",
      })
      return
    }
    if (file.size > MAX_BYTES) {
      defaultAlert.error({
        title: "Arquivo muito grande",
        text: "O tamanho máximo é 5 MB.",
      })
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function cancelPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPendingFile(null)
  }

  async function confirmUpload() {
    if (!pendingFile) return
    try {
      await upload.mutateAsync({ empresaId, file: pendingFile })
      Toast.fire({ icon: "success", title: `${label} atualizado(a) com sucesso!` })
      cancelPreview()
    } catch (err) {
      const status = err instanceof AxiosError ? err.response?.status : undefined
      const msg =
        status === 400
          ? "Arquivo inválido. Verifique o formato e o tamanho."
          : status === 403
            ? "Você não tem permissão para alterar esta imagem."
            : status === 404
              ? "Empresa não encontrada."
              : status === 413
                ? "Arquivo grande demais para o servidor."
                : "Não foi possível enviar a imagem. Tente novamente em instantes."
      defaultAlert.error({ title: `Erro ao enviar ${label.toLowerCase()}`, text: msg })
    }
  }

  async function handleRemove() {
    const result = await confirmDialog(
      `Remover ${label.toLowerCase()}?`,
      `O(a) ${label.toLowerCase()} atual será apagado(a) do workspace.`,
      "Sim, remover",
    )
    if (!result.isConfirmed) return
    try {
      await remove.mutateAsync({ empresaId })
      Toast.fire({ icon: "success", title: `${label} removido(a).` })
    } catch {
      defaultAlert.error({
        title: `Não foi possível remover o(a) ${label.toLowerCase()}`,
        text: "Tente novamente em instantes.",
      })
    }
  }

  const displayUrl = previewUrl ?? currentUrl ?? null

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{label}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      <div className={cn("relative w-full bg-muted/40 rounded-lg overflow-hidden border border-dashed border-border", aspectClass)}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={`Pré-visualização de ${label.toLowerCase()}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImagePlus className="w-8 h-8" />
            <span className="text-xs text-center px-4">{emptyHint}</span>
          </div>
        )}

        {isWorking && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <Spinner className="size-6" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={cancelPreview} disabled={isWorking}>
            <X className="w-4 h-4 mr-1" /> Cancelar
          </Button>
          <Button type="button" size="sm" onClick={confirmUpload} disabled={isWorking}>
            {isWorking ? <Spinner /> : (<><Check className="w-4 h-4 mr-1" /> Salvar</>)}
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={openPicker} disabled={isWorking}>
            <ImagePlus className="w-4 h-4 mr-1" /> {hasImage ? "Trocar imagem" : "Enviar imagem"}
          </Button>
          {hasImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isWorking}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Remover
            </Button>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">JPEG, PNG, WEBP ou SVG — até 5 MB.</p>
    </div>
  )
}
