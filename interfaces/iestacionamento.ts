import { IEmpresa } from "./iempresa"

export interface IEstacionamento {
  id: string
  descricao: string
  privacidade: "PUBLICO" | "PRIVADO"
  capacidade: number
  capacidadeDisponivel: number
  tipoVeiculo: "CARRO" | "MOTO" | "ONIBUS" | "CAMINHAO"| "TRATOR";
  empresa: IEmpresa
}