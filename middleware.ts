import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { isApiHealthy } from "@/lib/api/health"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isOfflinePage = pathname === "/api-offline"
  const isHealthEndpoint = pathname === "/api/health"

  // Health gate: se a API estiver offline, nada além da própria tela offline
  // (e do endpoint de health usado pelo polling) pode ser acessado.
  const apiUp = await isApiHealthy()
  if (!apiUp) {
    if (isOfflinePage || isHealthEndpoint) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = "/api-offline"
    url.search = ""
    return NextResponse.rewrite(url)
  }

  // API voltou: usuário preso na tela offline volta pra home.
  if (isOfflinePage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development" })

  const isAuthPage = pathname === "/login" || pathname === "/"
  const isProtectedPath = pathname.startsWith("/usuario")
  const isMotorista = pathname.startsWith("/usuario/motorista")
  const isOperador = pathname.startsWith("/usuario/operador")

  if (isAuthPage) {
    if (token) {
      const dest = token.tipoUsuario === "ADMINISTRATIVO" ? "/usuario/operador" : "/usuario/motorista"
      return NextResponse.redirect(new URL(dest, req.url))
    }
    return NextResponse.next()
  }

  if (!token && isProtectedPath) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
  }

  if (token && isProtectedPath) {
    if (isMotorista && token.tipoUsuario !== "COMUM") {
      return NextResponse.redirect(new URL("/nao-autorizado", req.url))
    }
    if (isOperador && token.tipoUsuario !== "ADMINISTRATIVO") {
      return NextResponse.redirect(new URL("/nao-autorizado", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Roda em todas as rotas exceto internas do Next, assets com extensão
  // e a rota do NextAuth (que precisa funcionar pro SessionProvider mesmo com a API fora).
  matcher: ["/((?!_next|api/auth|.*\\..*).*)"],
}
