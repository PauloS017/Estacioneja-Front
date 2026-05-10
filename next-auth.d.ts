import type { DefaultSession } from "next-auth"

import type { TipoUsuario } from "@/features/usuarios/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      accessToken: string
      tipoUsuario: TipoUsuario
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    accessToken: string
    tipoUsuario: TipoUsuario | string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    tipoUsuario?: string
  }
}
