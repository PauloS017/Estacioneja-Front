export interface IUsuario {
  id: string
  name: string
  email: string
  cpf: string
  telefone: string
  tipoUsuario: "COMUM" | "ADMINISTRATIVO"
}