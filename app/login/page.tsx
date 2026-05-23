"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { BackToHome } from "@/components/ui/back-to-home"
import { SiteFooter } from "@/components/site-footer"
import { getSession, signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const urlParams = new URLSearchParams(window.location.search)
    const rawCallback = urlParams.get("callbackUrl")
    const callbackUrl = sanitizeCallbackUrl(rawCallback)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result?.ok) {
      // Pull the freshly-issued session so we can route based on tipoUsuario
      // directly — avoids bouncing through middleware with a stale router
      // cache (the source of the spurious /nao-autorizado redirect).
      const session = await getSession()
      const dashboard =
        session?.user?.tipoUsuario === "ADMINISTRATIVO"
          ? "/usuario/operador"
          : "/usuario/motorista"
      const dest =
        callbackUrl && callbackUrl !== "/" ? callbackUrl : dashboard

      // Hard navigation: bypasses Next.js client router cache / prefetch
      // results captured before the auth cookie existed, and guarantees the
      // next middleware run sees the new JWT.
      window.location.replace(dest)
    }
  }

  // Same-origin only. Blocks open-redirect attacks like
  // `?callbackUrl=https://evil.com` or protocol-relative `//evil.com`.
  function sanitizeCallbackUrl(raw: string | null): string | null {
    if (!raw) return null
    if (!raw.startsWith("/")) return null
    if (raw.startsWith("//") || raw.startsWith("/\\")) return null
    return raw
  }

  const inputClassName =
    "w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex flex-col">
      <BackToHome />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border p-8 w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center justify-center h-16 w-auto">
              <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-full w-auto object-contain dark:hidden" />
              <img src="/logodarkmode.svg" alt="EstacioneJá" className="h-full w-auto object-contain hidden dark:block" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName}
                placeholder="******"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold shadow-md"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
