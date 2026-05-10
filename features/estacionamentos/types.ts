import type { Empresa } from "@/features/empresas/types"
import type { TipoVeiculo } from "@/features/veiculos/types"

export type PrivacidadeEstacionamento = "PUBLICO" | "PRIVADO"

export interface Estacionamento {
  id: string
  descricao: string
  privacidade: PrivacidadeEstacionamento
  capacidade: number
  capacidadeDisponivel: number
  tipoVeiculo: TipoVeiculo
  empresa: Empresa
}

export interface EstacionamentoPayload {
  descricao: string
  privacidade: PrivacidadeEstacionamento | string
  capacidade: number
  tipoVeiculo: TipoVeiculo | string
  empresaId: string
}
