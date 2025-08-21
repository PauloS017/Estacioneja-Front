"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload"
import { Clock, MapPin, Car, ShipWheelIcon as Wheelchair, Users, AlertCircle } from "lucide-react"

interface InfoCep {
  localidade?: string
  uf?: string
  bairro?: string
  logradouro?: string
  estado?: string
  // adicione outros campos conforme necessário
}

export default function CadastrarEstacionamentoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("informacoes")

  const [cep, setCep] = useState("")
  const [info, setInfo] = useState<InfoCep>({})

  const handleBlur = async (ceps: string) => {

    ceps = ceps.replace(/\D/g, "");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${ceps}/json/`);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const data = await response.json();

      setInfo(data);
    } catch (error) {

    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulação de cadastro
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Estacionamento cadastrado com sucesso",
        description: "O novo estacionamento foi adicionado ao sistema.",
      })
      router.push("/admin/dashboard")
    }, 1500)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cadastrar Estacionamento</h1>
          <p className="text-muted-foreground">Adicione um novo estacionamento ao sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8 justify-items-center">
            <TabsTrigger value="informacoes" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="vagas" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> Vagas
            </TabsTrigger>
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Horários
            </TabsTrigger>
          </TabsList>
          <Card>
            <TabsContent value="informacoes">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha os dados básicos do estacionamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Estacionamento</Label>
                    <Input id="nome" placeholder="Ex: Estacionamento Central" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código de Identificação</Label>
                    <Input id="codigo" placeholder="Ex: EST-001" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco"
                    placeholder="Rua, número, bairro"
                    value={info.logradouro}
                    onChange={(e) => setInfo({ ...info, logradouro: e.target.value })}
                    required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>

                    <Input
                      id="cidade"
                      placeholder="Cidade"
                      value={info.localidade}
                      onChange={(e) => setInfo({ ...info, localidade: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado"
                      placeholder="Estado"
                      value={info.estado}
                      onChange={(e) => setInfo({ ...info, estado: e.target.value })}
                      required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onBlur={(e) => handleBlur(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o estacionamento, localização, características, etc."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mapa do Estacionamento</Label>
                  <FileUpload />
                  <p className="text-xs text-muted-foreground mt-1">
                    Faça upload de uma imagem ou planta do estacionamento (opcional)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setActiveTab("vagas")}>
                  Próximo
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="vagas">
              <CardHeader>
                <CardTitle>Configuração de Vagas</CardTitle>
                <CardDescription>Defina a quantidade e tipos de vagas disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="total-vagas">Total de Vagas</Label>
                  <Input id="total-vagas" type="number" min="1" placeholder="Ex: 100" required />
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" /> Vagas Normais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vagas-normais">Quantidade</Label>
                      <Input id="vagas-normais" type="number" min="0" placeholder="Ex: 80" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prefixo-normais">Prefixo de Identificação</Label>
                      <Input id="prefixo-normais" placeholder="Ex: N-" required />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Wheelchair className="h-4 w-4" /> Vagas PCD
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vagas-pcd">Quantidade</Label>
                      <Input id="vagas-pcd" type="number" min="0" placeholder="Ex: 10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prefixo-pcd">Prefixo de Identificação</Label>
                      <Input id="prefixo-pcd" placeholder="Ex: P-" required />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" /> Vagas para Convidados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vagas-convidados">Quantidade</Label>
                      <Input id="vagas-convidados" type="number" min="0" placeholder="Ex: 10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prefixo-convidados">Prefixo de Identificação</Label>
                      <Input id="prefixo-convidados" placeholder="Ex: C-" required />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("informacoes")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("horarios")}>
                  Próximo
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="horarios">
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
                <CardDescription>Defina os horários de funcionamento do estacionamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="24horas" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="h-4 w-4" /> Funcionamento 24 horas
                  </Label>
                  <Switch id="24horas" />
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Dias de Semana (Segunda a Sexta)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semana-abertura">Horário de Abertura</Label>
                      <Input id="semana-abertura" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semana-fechamento">Horário de Fechamento</Label>
                      <Input id="semana-fechamento" type="time" required />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Sábados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sabado-abertura">Horário de Abertura</Label>
                      <Input id="sabado-abertura" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sabado-fechamento">Horário de Fechamento</Label>
                      <Input id="sabado-fechamento" type="time" required />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Domingos e Feriados</h3>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="domingo-fechado" className="text-sm">Fechado</Label>
                      <Switch id="domingo-fechado" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="domingo-abertura">Horário de Abertura</Label>
                      <Input id="domingo-abertura" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domingo-fechamento">Horário de Fechamento</Label>
                      <Input id="domingo-fechamento" type="time" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("vagas")}>
                  Anterior
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </CardFooter>
            </TabsContent>

          </Card>
        </Tabs>
      </form>
    </div >
  )
}
