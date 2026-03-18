import { TipoAcesso } from "@/types/tipo-acesso"
import { IUsuario } from "./iusuario"
import { IEmpresa } from "./iempresa"

export interface IAcesso {
    id?: string
    tipoAcesso: TipoAcesso
    usuario: IUsuario
    empresa: IEmpresa
}