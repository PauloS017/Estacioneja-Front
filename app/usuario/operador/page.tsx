"use client"

import WorkspaceCard from "@/components/operador/workspace-card" 
import { useMyWorkspaces } from "@/server/features/access/use-access"

export default function WorkspacesAvailable() {
  const { data, isLoading, isError } = useMyWorkspaces()

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando workspaces...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Erro ao carregar seus workspaces.
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        Você ainda não possui acesso a nenhum workspace.
      </div>
    )
  }

  return (
    <>
        <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold text-gray-800">
            Seus workspaces
        </h1>

        <div className="grid gap-3">
            {data.map((acesso) => (
            <WorkspaceCard
                key={acesso.empresa.id}
                empresa={acesso.empresa}
                tipoAcesso={acesso.tipoAcesso}
            />
            ))}
        </div>
        </div>
    </>
  )
}
