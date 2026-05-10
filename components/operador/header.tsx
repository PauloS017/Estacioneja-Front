"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
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
  Loader2,
  Palette,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UserAvatar } from "@/components/user-avatar"
import { EmpresaLogo } from "@/components/empresa-logo"
import { useUser } from "@/features/usuarios"
import { useEstacionamentosByEmpresa } from "@/features/estacionamentos"
import { acessoKeys, useMyAccessInTenant, useTenantAbility } from "@/features/acesso"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const MENU_ITEMS = [
  { title: "BIs e Relatórios", desc: "Métricas e ocupação", href: "/dashboard", icon: BarChart3, subject: "Dashboard", action: "read" },
  { title: "Cadastrar Estacionamentos", desc: "Gerenciar unidades", href: "/cadastros/estacionamentos", icon: CircleParking, subject: "Estacionamento", action: "manage" },
  { title: "Histórico", desc: "Movimentação completa", href: "/historico", icon: BookOpen, subject: "Estacionamento", action: "read" },
  { title: "Usuários", desc: "Controle de acessos", href: "/usuarios", icon: Users, subject: "Usuario", action: "manage" },
  { title: "Equipamentos", desc: "Configurar IOT", href: "/equipamentos", icon: Settings, subject: "Equipamento", action: "manage" },
  { title: "Aparência da Empresa", desc: "Logo e banner do workspace", href: "/aparencia", icon: Palette, subject: "Configuracoes", action: "manage" },
] as const

export default function Header() {
  const params = useParams()
  const router = useRouter()
  const { data: user } = useUser()
  const [open, setOpen] = useState(false)

  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId
  const estacionamentoIdFromUrl = Array.isArray(params?.estacionamentoId)
    ? params.estacionamentoId[0]
    : params?.estacionamentoId

  const { data: meuAcesso } = useMyAccessInTenant(tenantId)
  const { ability, tipoAcesso } = useTenantAbility()
  const { data: estacionamentos, isLoading: loadingEst } = useEstacionamentosByEmpresa(tenantId)

  const isGestao = !!tenantId && (ability.can("read", "Dashboard") || ability.can("manage", "all"))
  const allowedItems = useMemo(
    () => MENU_ITEMS.filter((it) => ability.can(it.action, it.subject)),
    [ability]
  )

  const estacionamentoAtivo = useMemo(
    () => estacionamentos?.find((e) => String(e.id) === String(estacionamentoIdFromUrl)),
    [estacionamentos, estacionamentoIdFromUrl]
  )

  useEffect(() => {
    setOpen(false)
  }, [tenantId])

  return (
    <header className="flex items-center justify-between px-8 py-3 bg-background border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Link href="/usuario/operador">
            <div className="flex items-center justify-center h-16 w-32">
              <img src="/logowhitetheme.svg" alt="EstacioneJá" className="w-full h-full object-contain dark:hidden" />
              <img src="/logodarkmode.svg" alt="EstacioneJá" className="w-full h-full object-contain hidden dark:block" />
            </div>
          </Link>
          {tenantId && <div className="h-6 w-px bg-border mx-1 hidden sm:block" />}


          {meuAcesso?.empresa ? (
            <Link href={`/usuario/operador/tenant/${tenantId}`} className="flex items-center gap-2">
              <EmpresaLogo
                empresaId={meuAcesso.empresa.id}
                empresaNome={meuAcesso.empresa.nome}
                className="hidden md:flex items-center justify-center h-12 w-32"
                imgClassName="max-h-12"
                fallback={
                  <div className="leading-tight hidden md:block">
                    <h1 className="text-sm font-medium text-foreground">
                      {tipoAcesso === "GUARITA" ? "Operação Guarita" : "Painel Administrativo"}
                    </h1>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                      {meuAcesso.empresa.nome}
                    </p>
                  </div>
                }
              />
            </Link>
          ) : (
            <div className="leading-tight hidden md:block">
              <h1 className="text-sm font-medium text-foreground">
                {tipoAcesso === "GUARITA" ? "Operação Guarita" : "Painel Administrativo"}
              </h1>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Selecione um Workspace
              </p>
            </div>
          )}
        </div>

        {isGestao && allowedItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent hover:border-accent hover:text-foreground transition-all text-sm font-medium shadow-sm active:scale-95">
                <LayoutGrid className="w-4 h-4 text-primary" />
                Menu Gestão
                <ChevronDown className="w-3 h-3 text-muted-foreground opacity-70" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-72 p-1 border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-100">
              <DropdownMenuLabel className="text-[10px] font-medium text-muted-foreground uppercase px-3 py-2 tracking-wider">
                Ações de Gestão
              </DropdownMenuLabel>
              {allowedItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    href={`/usuario/operador/tenant/${tenantId}${item.href}`}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent focus:bg-accent group"
                  >
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-background group-hover:border-primary/50 transition-colors">
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{item.title}</span>
                      <span className="text-[11px] text-muted-foreground group-hover:text-primary/70">{item.desc}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center gap-4">
        {tenantId && tipoAcesso === "GUARITA" && (
          <div className="relative w-64 hidden lg:block">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between w-full border border-border rounded-md px-3 py-2 bg-muted hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${estacionamentoAtivo ? "bg-primary" : "bg-muted-foreground"}`} />
                <span className={`text-sm truncate ${estacionamentoAtivo ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {estacionamentoAtivo ? estacionamentoAtivo.descricao : "Selecionar Estacionamento"}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute mt-1 w-full bg-card border border-border rounded-md shadow-xl z-50 max-h-60 overflow-auto p-1">
                {loadingEst ? (
                  <div className="p-4 flex items-center justify-center text-xs text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Carregando...
                  </div>
                ) : (
                  estacionamentos?.map((est) => {
                    const isSelected = String(est.id) === String(estacionamentoIdFromUrl)
                    return (
                      <div
                        key={est.id}
                        onClick={() => {
                          setOpen(false)
                          router.push(`/usuario/operador/tenant/${tenantId}/estacionamentos/${est.id}`)
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground"
                          }`}
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

        {
          tenantId && <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
        }

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 focus:outline-none group shrink-0">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-medium text-foreground">{user?.name?.split(" ")[0]}</p>
                <p className="text-[10px] text-muted-foreground font-normal uppercase">{tipoAcesso || ""}</p>
              </div>
              {user && (
                <UserAvatar
                  userId={user.id}
                  temFotoPerfil={user.temFotoPerfil}
                  name={user.name}
                  className="h-9 w-9 shrink-0 border border-border"
                  fallbackClassName="bg-primary text-primary-foreground text-xs"
                />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1 border-border bg-card shadow-xl">
            <div className="px-3 py-2 mb-1">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer py-2 rounded focus:bg-accent">
              <Link href="/usuario/operador/perfil" className="flex w-full items-center text-foreground">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                Minha Conta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className="cursor-pointer py-2 rounded text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2 text-destructive" />
              Encerrar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
