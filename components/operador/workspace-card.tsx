"use client"

import Link from "next/link"
import { IEmpresa } from "@/interfaces/iempresa"
import { TipoAcesso } from "@/types/tipo-acesso"

interface IWorkspaceCardProps {
  tipoAcesso: TipoAcesso
  empresa: IEmpresa
}

const corAcesso: Record<TipoAcesso, string> = {
  MASTER: "bg-purple-100 text-purple-700",
  AUDITORIA: "bg-blue-100 text-blue-700",
  GUARITA: "bg-green-100 text-green-700",
  EMBARCADO: "bg-orange-100 text-orange-700",
}

export default function WorkspaceCard({ empresa, tipoAcesso }: IWorkspaceCardProps) {
  return (
    <Link
      href={`/usuario/operador/tenant/${empresa.id}`}
      className="block"
    >
      <div className="flex items-center gap-4 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition cursor-pointer">
        
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
          {empresa.nome.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-500">Workspace</span>
          <span className="text-lg font-semibold text-gray-800">
            {empresa.nome}
          </span>
        </div>

        {/* Tipo de acesso */}
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${corAcesso[tipoAcesso]}`}
        >
          {tipoAcesso}
        </span>
      </div>
    </Link>
  )
}
