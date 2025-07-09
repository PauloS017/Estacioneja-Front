"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload"

export default function CadastrarVeiculoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulação de cadastro
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Veículo cadastrado com sucesso",
        description: "Seu veículo foi adicionado à sua conta.",
      })
      router.push("/motorista/dashboard")
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center py-10 md:py-20">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Cadastrar Veículo</CardTitle>
          <CardDescription>Preencha os dados do seu veículo para cadastrá-lo no sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa do Veículo</Label>
                <Input id="placa" placeholder="ABC-1234" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Veículo</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" placeholder="Ex: Honda Civic" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" placeholder="Ex: 2022" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" placeholder="Ex: Preto" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renavam">Renavam</Label>
                <Input id="renavam" placeholder="Número do Renavam" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Documentação do Veículo</Label>
              <FileUpload />
              <p className="text-xs text-muted-foreground mt-1">Anexe uma foto ou PDF do documento do veículo (CRLV)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Input id="observacoes" placeholder="Informações adicionais sobre o veículo" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Veículo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
