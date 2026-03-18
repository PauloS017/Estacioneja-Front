import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { api } from "@/lib/api"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const response = await api.post("/api/v1/auth/login", {
            email: credentials?.email,
            senha: credentials?.password,
          })

          const { token, tipoUsuario } = response.data

          if (!token) return null

          return {
            id: credentials?.email,
            email: credentials?.email,
            accessToken: token,
            tipoUsuario,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
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
      session.user.accessToken = token.accessToken as string
      session.user.tipoUsuario = token.tipoUsuario as string
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}
