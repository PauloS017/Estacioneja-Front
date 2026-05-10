export type TipoUsuario = "COMUM" | "ADMINISTRATIVO"

export interface Usuario {
  id: string
  name: string
  email: string
  cpf: string
  telefone: string
  tipoUsuario: TipoUsuario
  temFotoPerfil: boolean
}

export interface FotoPerfilResponse {
  url: string | null
  expiresAt: string | null
}
