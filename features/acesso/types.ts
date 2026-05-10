import type { Empresa } from "@/features/empresas/types"
import type { Usuario } from "@/features/usuarios/types"

export type TipoAcesso = "MASTER" | "AUDITORIA" | "CADASTRO_GESTAO" | "GUARITA" | "EMBARCADO"

export interface Acesso {
  id: string
  tipoAcesso: TipoAcesso
  usuario: Usuario
  empresa: Empresa
}

export interface CriarAcessoPayload {
  tipoAcesso: Exclude<TipoAcesso, "EMBARCADO">
  usuarioId: string
}
