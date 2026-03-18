"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronDown,
  Check,
  User,
  LogOut,
  CircleParking,
  LayoutGrid,
  BarChart3,
  BookOpen,
  Settings,
  Users,
  Loader2
} from "lucide-react"

import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { useUser } from "@/server/features/usuario/use-usuario"
import { useEstacionamentosByEmpresa } from "@/server/features/empresas/use-empresa"
import { useMyAccessInTenant } from "@/server/features/access/use-access"
import { IEstacionamento } from "@/interfaces/iestacionamento"
import { signOut } from "next-auth/react"

const GESTAO_OPTIONS = {
  MASTER: [
    { title: "BIs e Fluxo", desc: "Métricas e ocupação", href: "/dashboard", icon: BarChart3 },
    { title: "Cadastrar Estacionamentos", desc: "Gerenciar unidades", href: "/cadastros/estacionamentos", icon: CircleParking },
    { title: "Usuários", desc: "Controle de acessos", href: "/usuarios", icon: Users },
    { title: "Equipamentos", desc: "Configurar IOT", href: "/equipamentos", icon: Settings },
  ],
  AUDITORIA: [
    { title: "Relatórios de BIs", desc: "Indicadores gerais", href: "/relatorios", icon: BarChart3 },
    { title: "Histórico", desc: "Movimentação completa", href: "/historico", icon: BookOpen },
  ],
}

export default function Header() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId
  const estacionamentoIdFromUrl = Array.isArray(params?.estacionamentoId) 
    ? params.estacionamentoId[0] 
    : params?.estacionamentoId

  const { data: meuAcesso } = useMyAccessInTenant(tenantId)
  const { data: estacionamentos, isLoading: loadingEst } = useEstacionamentosByEmpresa(tenantId, true)

  const tipoAcesso = meuAcesso?.tipoAcesso as string
  const isGestao = tipoAcesso === "MASTER" || tipoAcesso === "AUDITORIA"

  const estacionamentoAtivo = useMemo(() => {
    return estacionamentos?.find(e => String(e.id) === String(estacionamentoIdFromUrl))
  }, [estacionamentos, estacionamentoIdFromUrl])

  useEffect(() => {
    setOpen(false)
  }, [tenantId])

  return (
    <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
      
      {/* LADO ESQUERDO */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Link href="/usuario/operador">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">EJ</span>
            </div>
          </Link>
          <div className="leading-tight hidden md:block">
            <h1 className="text-sm font-medium text-gray-900">
              {tipoAcesso === "GUARITA" ? "Operação Guarita" : "Painel Administrativo"}
            </h1>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              {meuAcesso?.empresa?.nome || "Selecione um Workspace"}
            </p>
          </div>
        </div>

        {isGestao && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all text-sm font-medium shadow-sm active:scale-95">
                <LayoutGrid className="w-4 h-4 text-emerald-600" />
                Menu Gestão
                <ChevronDown className="w-3 h-3 text-gray-400 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="w-72 p-1 border-gray-200 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 uppercase px-3 py-2 tracking-wider">
                Ações de Gestão
              </DropdownMenuLabel>
              {GESTAO_OPTIONS[tipoAcesso as keyof typeof GESTAO_OPTIONS]?.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    href={`/usuario/operador/tenant/${tenantId}${item.href}`}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 group"
                  >
                    <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                      <item.icon className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-900">{item.title}</span>
                      <span className="text-[11px] text-gray-400 group-hover:text-emerald-600/70">{item.desc}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-4">
        
        {tenantId && (
          <div className="relative w-64 hidden lg:block">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${estacionamentoAtivo ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={`text-sm truncate ${estacionamentoAtivo ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {estacionamentoAtivo ? estacionamentoAtivo.descricao : "Selecionar Estacionamento"}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-auto p-1">
                {loadingEst ? (
                  <div className="p-4 flex items-center justify-center text-xs text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Carregando...
                  </div>
                ) : (
                  estacionamentos?.map((est: IEstacionamento) => {
                    const isSelected = String(est.id) === String(estacionamentoIdFromUrl);
                    return (
                      <div
                        key={est.id}
                        onClick={() => {
                          setOpen(false)
                          router.push(`/usuario/operador/tenant/${tenantId}/estacionamentos/${est.id}`)
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded cursor-pointer transition-colors
                          ${isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}
                        `}
                      >
                        <span className="truncate">{est.descricao}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* PERFIL - Correção da Imagem Eliptica */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 focus:outline-none group shrink-0">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400 font-normal uppercase">{tipoAcesso}</p>
              </div>
              {/* h-9 e w-9 com aspect-square e shrink-0 garante que seja um círculo perfeito */}
              <Avatar className="h-9 w-9 shrink-0 aspect-square border border-gray-100 rounded-full overflow-hidden">
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-medium rounded-full flex items-center justify-center h-full w-full">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1 border-gray-200 shadow-xl">
            <div className="px-3 py-2 mb-1">
               <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 rounded focus:bg-gray-50">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              Minha Conta
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={signOut} 
              className="cursor-pointer py-2 rounded text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              Encerrar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}