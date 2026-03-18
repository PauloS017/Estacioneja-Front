import { TipoVeiculo } from "@/types/tipo-veiculo";
import { IUsuario } from "./iusuario";

export interface IVeiculo {
  id?: string
  placa: string
  modelo: string
  cor: string
  tipoVeiculo: TipoVeiculo;
  observacao: string
  usuario?: IUsuario
}
