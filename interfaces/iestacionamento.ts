import { IEmpresa } from "./iempresa"

export type ITipoVeiculo = "CARRO" | "MOTO" | "ONIBUS" | "CAMINHAO" | "TRATOR"

export interface IRegraCapacidade {
  tipoVeiculo: ITipoVeiculo
  capacidade: number
  capacidadeDisponivel: number
}

export interface IEstacionamento {
  id: string
  descricao: string
  privacidade: "PUBLICO" | "PRIVADO"
  empresa: IEmpresa
  regrasCapacidade: IRegraCapacidade[]
}
