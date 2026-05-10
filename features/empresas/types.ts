import type { Usuario } from "@/features/usuarios/types"

export type TipoEmpresa = "UNIVERSIDADE" | "COOPERATIVA" | "SHOPPING" | "SUPERMERCADOS"
export type PlanoEmpresa = "BASICO" | "INICIAL" | "MEDIO" | "PROFISSIONAL" | "AVANCADO"

export interface Endereco {
  id?: number
  logradouro: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  latitude: number
  longitude: number
}

export interface Empresa {
  id: string
  nome: string
  tipoEmpresa: TipoEmpresa | string
  representante: Usuario
  cnpj: string
  prefixo: string
  plano: PlanoEmpresa | string
  endereco: Endereco
}

export interface URLImagemResponse {
  url: string | null
  expiresAt: string | null
}

export interface CriarEmpresaPayload {
  representanteId: string
  nome: string
  endereco: Endereco
  tipoEmpresa: string
  cnpj: string
  prefixo: string
  plano: string
  empresaId?: string
}
