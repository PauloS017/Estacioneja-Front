import type {
  EstacionamentoHeader,
  RegraCapacidadeOutput,
} from "@/features/estacionamentos/types"
import type { Usuario } from "@/features/usuarios/types"

export interface VeiculoVinculo {
  id: string
  placa: string
  modelo: string
  cor: string
  tipoVeiculo: string
  observacao: string
  usuario?: Usuario
}

export interface Vinculo {
  id: string
  veiculo: VeiculoVinculo
  estacionamento: EstacionamentoHeader
  proprietario?: ProprietarioResumo
}

export interface VeiculoResumo {
  id: string
  placa: string
  modelo: string
  cor: string
  tipoVeiculo: string
  observacao: string
}

export interface EstacionamentoCardUsuario {
  id: string
  descricao: string
  nomeEmpresa: string
  cidade: string
  uf: string
  regrasCapacidade: RegraCapacidadeOutput[]
}

export interface VinculoCardUsuario {
  id: string
  veiculo: VeiculoResumo
  estacionamento: EstacionamentoCardUsuario
}

export interface ProprietarioResumo {
  id: string
  nome: string
  email: string
}

export interface EstacionamentoRotulo {
  id: string
  descricao: string
}

export interface VinculoLinhaAdmin {
  id: string
  veiculo: VeiculoResumo
  proprietario: ProprietarioResumo
  estacionamento: EstacionamentoRotulo
}

export interface VinculoConsultaGuarita {
  placa: string
  modelo: string
  cor: string
}

export interface CriarVinculoPayload {
  estacionamentoId: string
  placaVeiculo: string
}

