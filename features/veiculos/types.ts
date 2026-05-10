import type { Usuario } from "@/features/usuarios/types"

export type TipoVeiculo = "CARRO" | "MOTO" | "ONIBUS" | "CAMINHAO" | "TRATOR"

export interface Veiculo {
  id?: string
  placa: string
  modelo: string
  cor: string
  tipoVeiculo: TipoVeiculo
  observacao: string
  usuario?: Usuario
}
