import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { api } from "@/lib/api"
import type { TipoUsuario } from "@/features/usuarios/types"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas")
        }

        try {
          const response = await api.post("/api/v1/auth/login", {
            email: credentials.email,
            senha: credentials.password,
          })

          const { token, tipoUsuario } = response.data

          if (!token) {
            throw new Error("Falha na autenticação")
          }

          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: token,
            tipoUsuario,
          }
        } catch (error: any) {
          const message = error.response?.data?.message || "Email ou senha incorretos"
          throw new Error(message)
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.tipoUsuario = user.tipoUsuario
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken as string
        session.user.tipoUsuario = token.tipoUsuario as TipoUsuario
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development",
}

export function getSession() {
  return getServerSession(authOptions)
}
