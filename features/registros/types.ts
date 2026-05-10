import type { Estacionamento } from "@/features/estacionamentos/types"
import type { Veiculo } from "@/features/veiculos/types"

export type TipoRegistro = "ENTRADA" | "SAIDA"

export interface Registro {
  id: string
  veiculo: Veiculo
  estacionamento: Estacionamento
  tipoRegistro: TipoRegistro
  dataRegistro: Date
}
