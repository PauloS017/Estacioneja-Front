"use client"

import { useEffect, useRef, useState } from "react"
import { AxiosError } from "axios"
import { Camera, Check, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/user-avatar"
import {
  useDeleteFotoPerfil,
  useUploadFotoPerfil,
} from "@/features/usuarios"
import { Toast, confirmDialog, defaultAlert } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const ACCEPT_ATTR = ACCEPTED_TYPES.join(",")
const MAX_BYTES = 5 * 1024 * 1024

interface ProfilePhotoEditorProps {
  userId: string
  temFotoPerfil: boolean
  name?: string
  className?: string
}

export function ProfilePhotoEditor({
  userId,
  temFotoPerfil,
  name,
  className,
}: ProfilePhotoEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const upload = useUploadFotoPerfil()
  const remove = useDeleteFotoPerfil()
  const isWorking = upload.isPending || remove.isPending

  // Limpa Object URLs criadas via URL.createObjectURL pra não vazar memória.
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
    e.target.value = "" // permite re-selecionar o mesmo arquivo se o usuário cancelar
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
      defaultAlert.error({
        title: "Formato não suportado",
        text: "Envie uma imagem JPEG, PNG ou WEBP.",
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
      await upload.mutateAsync({ userId, file: pendingFile })
      Toast.fire({ icon: "success", title: "Foto atualizada com sucesso!" })
      cancelPreview()
    } catch (err) {
      const status = err instanceof AxiosError ? err.response?.status : undefined
      const msg =
        status === 400
          ? "Arquivo inválido. Verifique o formato e o tamanho."
          : status === 403
            ? "Você não tem permissão para alterar esta foto."
            : status === 404
              ? "Usuário não encontrado."
              : status === 413
                ? "Arquivo grande demais para o servidor."
                : "Não foi possível enviar a foto. Tente novamente em instantes."
      defaultAlert.error({ title: "Erro ao enviar foto", text: msg })
    }
  }

  async function handleRemove() {
    const result = await confirmDialog(
      "Remover foto de perfil?",
      "Sua foto será apagada e o avatar voltará a exibir suas iniciais.",
      "Sim, remover",
    )
    if (!result.isConfirmed) return
    try {
      await remove.mutateAsync({ userId })
      Toast.fire({ icon: "success", title: "Foto removida." })
    } catch {
      defaultAlert.error({
        title: "Não foi possível remover a foto",
        text: "Tente novamente em instantes.",
      })
    }
  }

  return (
    <div className={"flex flex-col items-center gap-3 " + (className ?? "")}>
      <div className="relative group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Pré-visualização da nova foto"
            className="w-32 h-32 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <UserAvatar
            userId={userId}
            temFotoPerfil={temFotoPerfil}
            name={name}
            className="w-32 h-32 border-2 border-primary"
            fallbackClassName="text-2xl"
          />
        )}

        {!previewUrl && !isWorking && (
          <button
            type="button"
            onClick={openPicker}
            aria-label="Alterar foto de perfil"
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition flex flex-col items-center justify-center gap-1 text-white text-xs font-medium"
          >
            <Camera className="w-5 h-5" />
            Alterar foto
          </button>
        )}

        {isWorking && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelPreview}
            disabled={isWorking}
          >
            <X className="w-4 h-4 mr-1" /> Cancelar
          </Button>
          <Button type="button" size="sm" onClick={confirmUpload} disabled={isWorking}>
            {isWorking ? (
              <Spinner />
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" /> Salvar foto
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPicker}
            disabled={isWorking}
          >
            <Camera className="w-4 h-4 mr-1" /> Alterar foto
          </Button>
          {temFotoPerfil && (
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

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        JPEG, PNG ou WEBP — até 5 MB.
      </p>
    </div>
  )
}
