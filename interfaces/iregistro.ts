import { IEstacionamento } from "./iestacionamento"
import { IVeiculo } from "./iveiculo"

export interface IRegistro {
    id: string
    veiculo: IVeiculo,
    estacionamento: IEstacionamento
    tipoRegistro: "ENTRADA" | "SAIDA"
    dataRegistro: Date
}