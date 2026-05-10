"use client"

import Link from "next/link"
import { Building2, Plus } from "lucide-react"

import WorkspaceCard from "@/components/operador/workspace-card"
import { useMyWorkspaces } from "@/features/acesso"
import { Button } from "@/components/ui/button"

export default function WorkspacesAvailable() {
  const { data, isLoading, isError } = useMyWorkspaces()

  if (isLoading) {
    return <div className="p-6 text-gray-500">Carregando workspaces...</div>
  }

  if (isError) {
    return <div className="p-6 text-red-500">Erro ao carregar seus workspaces.</div>
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 h-[80vh]">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-primary/5">
          <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Nenhum Workspace encontrado</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Você ainda não possui ou não faz parte de nenhuma empresa em nossa plataforma. <Link href={"/b2b"} className="text-primary hover:underline">Crie seu próprio workspace</Link>{' '}
          agora mesmo e comece a gerenciar seu estacionamento.
        </p>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 h-full min-h-screen bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seus Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse e gerencie suas empresas vinculadas.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        {data.map((acesso) => (
          <div key={`${acesso.empresa.id}-${acesso.tipoAcesso}`} className="w-full sm:w-auto">
            <WorkspaceCard empresa={acesso.empresa} tipoAcesso={acesso.tipoAcesso} />
          </div>
        ))}
      </div>
    </div>
  )
}
