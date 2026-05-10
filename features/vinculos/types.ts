import type { Estacionamento } from "@/features/estacionamentos/types"
import type { Usuario } from "@/features/usuarios/types"

export interface VeiculoVinculo {
  id: string
  placa: string
  modelo: string
  cor: string
  tipoVeiculo: string
  observacao: string
  usuario: Usuario
}

export interface Vinculo {
  id: string
  veiculo: VeiculoVinculo
  estacionamento: Estacionamento
}

export interface CriarVinculoPayload {
  estacionamentoId: string
  placaVeiculo: string
}
