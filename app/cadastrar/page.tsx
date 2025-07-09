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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function CadastrarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCadastro = (event: React.FormEvent<HTMLFormElement>, userType: string) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulação de cadastro
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Cadastro realizado com sucesso",
        description: `Sua conta de ${userType} foi criada. Você já pode fazer login.`,
      })
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center py-10 md:py-20">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para se cadastrar no EstacioneJá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="motorista" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="motorista">Motorista</TabsTrigger>
              <TabsTrigger value="instituicao">Instituição</TabsTrigger>
            </TabsList>
            <TabsContent value="motorista">
              <form onSubmit={(e) => handleCadastro(e, "motorista")}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Seu nome completo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-motorista">Email</Label>
                    <Input id="email-motorista" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" placeholder="(00) 00000-0000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vinculo">Vínculo com a Instituição</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estudante">Estudante</SelectItem>
                          <SelectItem value="professor">Professor</SelectItem>
                          <SelectItem value="funcionario">Funcionário</SelectItem>
                          <SelectItem value="visitante">Visitante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input id="senha" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                      <Input id="confirmar-senha" type="password" required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="termos" required />
                    <label
                      htmlFor="termos"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Concordo com os{" "}
                      <Link href="/termos" className="text-primary hover:underline">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-primary hover:underline">
                        política de privacidade
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar como Motorista"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="instituicao">
              <form onSubmit={(e) => handleCadastro(e, "instituição")}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-instituicao">Nome da Instituição</Label>
                      <Input id="nome-instituicao" placeholder="Nome da instituição" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-instituicao">Email Institucional</Label>
                    <Input id="email-instituicao" type="email" placeholder="contato@instituicao.edu" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone-instituicao">Telefone</Label>
                      <Input id="telefone-instituicao" placeholder="(00) 0000-0000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo-instituicao">Tipo de Instituição</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="universidade">Universidade</SelectItem>
                          <SelectItem value="faculdade">Faculdade</SelectItem>
                          <SelectItem value="instituto">Instituto Técnico</SelectItem>
                          <SelectItem value="escola">Escola</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input id="endereco" placeholder="Rua, número, bairro, cidade, estado" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha-instituicao">Senha</Label>
                      <Input id="senha-instituicao" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha-instituicao">Confirmar Senha</Label>
                      <Input id="confirmar-senha-instituicao" type="password" required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="termos-instituicao" required />
                    <label
                      htmlFor="termos-instituicao"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Concordo com os{" "}
                      <Link href="/termos" className="text-primary hover:underline">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-primary hover:underline">
                        política de privacidade
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar como Instituição"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
