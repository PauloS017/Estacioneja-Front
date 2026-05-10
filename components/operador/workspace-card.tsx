"use client"

import Link from "next/link"
import type { Empresa } from "@/features/empresas"
import type { TipoAcesso } from "@/features/acesso"
import { EmpresaBanner } from "../empresa-banner"

interface WorkspaceCardProps {
  tipoAcesso: TipoAcesso
  empresa: Empresa
}

const corAcesso: Record<TipoAcesso, string> = {
  MASTER: "bg-blue-600 text-white dark:bg-blue-600/20 dark:text-blue-400 border border-transparent dark:border-blue-600/30",
  CADASTRO_GESTAO: "bg-blue-600 text-white dark:bg-blue-600/20 dark:text-blue-400 border border-transparent dark:border-blue-600/30",
  AUDITORIA: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-transparent dark:border-blue-800/50",
  GUARITA: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-transparent dark:border-green-800/50",
  EMBARCADO: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-transparent dark:border-orange-800/50",
}

export default function WorkspaceCard({ empresa, tipoAcesso }: WorkspaceCardProps) {
  return (
    <Link href={`/usuario/operador/tenant/${empresa.id}`} className="block">
      <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
        <EmpresaBanner
          empresaId={empresa.id}
          empresaNome={empresa.nome}
          className="h-32 w-full overflow-hidden"
          imgClassName="w-full h-full object-cover"
          fallback={
            <div className="h-32 w-full bg-muted flex items-center justify-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {empresa.nome.slice(0, 2).toUpperCase()}
              </div>
            </div>
          }
        />

        <div className="p-4 space-y-2">
          <h2 className="text-md font-semibold text-foreground truncate">{empresa.nome}</h2>

          <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${corAcesso[tipoAcesso]}`}>
            Acesso: {tipoAcesso}
          </span>
        </div>
      </div>
    </Link>
  )
}
