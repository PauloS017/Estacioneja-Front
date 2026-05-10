"use client"

import { useParams } from "next/navigation"
import { Lock, Palette } from "lucide-react"

import { useMyAccessInTenant } from "@/features/acesso"
import {
  useEmpresaLogo,
  useEmpresaBanner,
  useUploadEmpresaLogo,
  useUploadEmpresaBanner,
  useDeleteEmpresaLogo,
  useDeleteEmpresaBanner,
} from "@/features/empresas"
import { EmpresaImagemUploader } from "@/components/operador/empresa-imagem-uploader"

export default function AparenciaTenantPage() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId

  const { data: meuAcesso, isLoading } = useMyAccessInTenant(tenantId)
  const { data: logo } = useEmpresaLogo(tenantId, true)
  const { data: banner } = useEmpresaBanner(tenantId, true)

  const uploadLogo = useUploadEmpresaLogo()
  const uploadBanner = useUploadEmpresaBanner()
  const removeLogo = useDeleteEmpresaLogo()
  const removeBanner = useDeleteEmpresaBanner()

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando aparência...</div>
  }

  if (meuAcesso?.tipoAcesso !== "MASTER") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <Lock className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h1 className="text-xl font-bold text-foreground">Acesso Restrito</h1>
        <p className="text-muted-foreground max-w-sm mt-2">
          Apenas o proprietário (MASTER) do workspace pode gerenciar a aparência da empresa.
        </p>
      </div>
    )
  }

  if (!tenantId) return null

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Aparência da Empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          Personalize a logo e o banner exibidos no workspace e nos pontos de acesso da {meuAcesso.empresa.nome}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmpresaImagemUploader
          label="Logo"
          description="Aparece no cabeçalho do painel e no card do workspace."
          currentUrl={logo?.url}
          hasImage={!!logo?.url}
          upload={uploadLogo}
          remove={removeLogo}
          empresaId={tenantId}
          aspectClass="aspect-square max-w-xs mx-auto"
          emptyHint="Nenhuma logo cadastrada."
        />

        <EmpresaImagemUploader
          label="Banner"
          description="Imagem de destaque para páginas e capas do workspace."
          currentUrl={banner?.url}
          hasImage={!!banner?.url}
          upload={uploadBanner}
          remove={removeBanner}
          empresaId={tenantId}
          aspectClass="aspect-[3/1]"
          emptyHint="Nenhum banner cadastrado."
        />
      </div>
    </div>
  )
}
