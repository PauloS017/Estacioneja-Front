import { IEndereco } from "./iendereco"
import { IUsuario } from "./iusuario"

export interface IEmpresa {
    id: string,
    nome: string, 
    tipoEmpresa: "UNIVERSIDADE" | "COOPERATIVA" | "SHOPPING" | "SUPERMERCADOS"
    representante: IUsuario,
    cnpj: string,
    prefixo: string,
    plano: "INICIAL" | "MEDIO" | "AVANCADO",
    endereco: IEndereco
}
