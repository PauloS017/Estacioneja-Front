"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Car, Building2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>, userType: string) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // Verificar credenciais para o usuário de teste
    if (
      userType === "motorista" &&
      formData.email === "joao.silva41@estudante.ifms.edu.br" &&
      formData.senha === "pauloluanruth123"
    ) {
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo ao sistema EstacioneJá, João Silva!`,
        })
        router.push("/motorista/dashboard")
      }, 1500)
    } else if (
      userType === "instituicao" &&
      formData.email === "joao.silva41@estudante.ifms.edu.br" &&
      formData.senha === "pauloluanruth123"
    ) {
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo ao sistema EstacioneJá, Administrador!`,
        })
        router.push("/admin/dashboard")
      }, 1500)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setError("Email ou senha incorretos. Tente novamente.")
      }, 1000)
    }
  }

  return (
    <div className="container flex items-center justify-center py-10 md:py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Acesso ao Sistema</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o EstacioneJá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="motorista" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="motorista" className="flex items-center gap-2">
                <Car className="h-4 w-4" /> Motorista
              </TabsTrigger>
              <TabsTrigger value="instituicao" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Instituição
              </TabsTrigger>
            </TabsList>
            <TabsContent value="motorista">
              <form onSubmit={(e) => handleLogin(e, "motorista")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="senha">Senha</Label>
                      <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      required
                      value={formData.senha}
                      onChange={handleChange}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-700" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como Motorista"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Teste com: joao.silva41@estudante.ifms.edu.br</p>
                    <p>Senha: pauloluanruth123</p>
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="instituicao">
              <form onSubmit={(e) => handleLogin(e, "instituicao")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-admin">Email</Label>
                    <Input
                      id="email-admin"
                      name="email"
                      type="email"
                      placeholder="admin@instituicao.edu"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="senha-admin">Senha</Label>
                      <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="senha-admin"
                      name="senha"
                      type="password"
                      required
                      value={formData.senha}
                      onChange={handleChange}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary-700" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como Instituição"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Teste com: joao.silva41@estudante.ifms.edu.br</p>
                    <p>Senha: pauloluanruth123</p>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/cadastrar" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
