import type { Empresa, Endereco } from "@/features/empresas/types"
import type { TipoVeiculo } from "@/features/veiculos/types"

export type PrivacidadeEstacionamento = "PUBLICO" | "PRIVADO"

export type MetodoEntrada = "QR_CODE" | "NFC_RFID" | "GUARITA_SIMPLES"

export interface RegraCapacidadeInput {
  tipoVeiculo: TipoVeiculo
  capacidade: number
}

export interface RegraCapacidadeOutput {
  tipoVeiculo: TipoVeiculo
  capacidade: number
  capacidadeDisponivel: number
}

export interface Estacionamento {
  id: string
  descricao: string
  privacidade: PrivacidadeEstacionamento
  empresa: Empresa
  cidade: String
  regrasCapacidade: RegraCapacidadeOutput[]
  metodoEntrada?: MetodoEntrada
}

export interface EstacionamentoPayload {
  descricao: string
  privacidade: PrivacidadeEstacionamento | string
  empresaId: string
  regrasCapacidade: RegraCapacidadeInput[]
  metodoEntrada: MetodoEntrada
}

export interface EstacionamentoHeader {
  id: string
  descricao: string
  nomeEmpresa: string
  endereco: Endereco
  privacidade: PrivacidadeEstacionamento | string
  regrasCapacidade: RegraCapacidadeOutput[]
}
