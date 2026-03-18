import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  const isAuthPage = pathname === "/login" || pathname === "/"
  const isMotorista = pathname.startsWith("/usuario/motorista")
  const isOperador = pathname.startsWith("/usuario/operador")

  // 🔐 Usuário não logado tentando acessar área protegida
  if (!token && (isMotorista || isOperador)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔐 Usuário logado tentando acessar login ou landing
  if (token && isAuthPage) {
    if (token.tipoUsuario === "ADMINISTRATIVO") {
      return NextResponse.redirect(new URL("/usuario/operador", req.url))
    }
    return NextResponse.redirect(new URL("/usuario/motorista", req.url))
  }

  // 🔐 Proteção por role
  if (token) {
    const tipo = token.tipoUsuario

    if (isMotorista && tipo !== "COMUM") {
      return NextResponse.redirect(new URL("/nao-autorizado", req.url))
    }

    if (isOperador && tipo !== "ADMINISTRATIVO") {
      return NextResponse.redirect(new URL("/nao-autorizado", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/usuario/:path*",
  ],
}
