"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Car, Clock, MapPin, Users, ShipWheelIcon as Wheelchair, CheckCircle, ArrowRight } from "lucide-react"

// Dados simulados
const estacionamentos = [
  {
    id: "1",
    nome: "Estacionamento Central",
    endereco: "Rua Principal, 123",
    vagasDisponiveis: 15,
    totalVagas: 50,
    distancia: "200m",
  },
  {
    id: "2",
    nome: "Estacionamento Setor Norte",
    endereco: "Av. Norte, 456",
    vagasDisponiveis: 8,
    totalVagas: 30,
    distancia: "350m",
  },
  {
    id: "3",
    nome: "Estacionamento Biblioteca",
    endereco: "Rua da Biblioteca, 789",
    vagasDisponiveis: 3,
    totalVagas: 25,
    distancia: "150m",
  },
]

const veiculos = [
  { id: "1", placa: "ABC-1234", modelo: "Honda Civic", tipo: "carro" },
  { id: "2", placa: "XYZ-5678", modelo: "Toyota Corolla", tipo: "carro" },
]

const vagas = [
  { id: "1", numero: "A-23", tipo: "normal", disponivel: true, estacionamentoId: "1" },
  { id: "2", numero: "A-24", tipo: "normal", disponivel: true, estacionamentoId: "1" },
  { id: "3", numero: "A-25", tipo: "normal", disponivel: false, estacionamentoId: "1" },
  { id: "4", numero: "B-10", tipo: "normal", disponivel: true, estacionamentoId: "1" },
  { id: "5", numero: "B-11", tipo: "normal", disponivel: true, estacionamentoId: "1" },
  { id: "6", numero: "C-05", tipo: "pcd", disponivel: true, estacionamentoId: "1" },
  { id: "7", numero: "D-15", tipo: "convidado", disponivel: true, estacionamentoId: "1" },
  { id: "8", numero: "E-08", tipo: "normal", disponivel: true, estacionamentoId: "2" },
  { id: "9", numero: "F-12", tipo: "pcd", disponivel: true, estacionamentoId: "2" },
  { id: "10", numero: "G-20", tipo: "normal", disponivel: true, estacionamentoId: "3" },
]

export default function AgendarVagaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("estacionamento")
  const [selectedEstacionamento, setSelectedEstacionamento] = useState("")
  const [selectedVeiculo, setSelectedVeiculo] = useState("")
  const [selectedVaga, setSelectedVaga] = useState("")
  const [formData, setFormData] = useState({
    dataEntrada: "",
    horaEntrada: "",
    dataSaida: "",
    horaSaida: "",
    observacoes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulação de agendamento
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Vaga agendada com sucesso!",
        description: "Sua reserva foi confirmada. Você receberá um e-mail de confirmação.",
      })
      router.push("/motorista/dashboard")
    }, 1500)
  }

  const vagasDisponiveis = vagas.filter((vaga) => vaga.estacionamentoId === selectedEstacionamento && vaga.disponivel)
  const estacionamentoSelecionado = estacionamentos.find((est) => est.id === selectedEstacionamento)
  const veiculoSelecionado = veiculos.find((veiculo) => veiculo.id === selectedVeiculo)
  const vagaSelecionada = vagas.find((vaga) => vaga.id === selectedVaga)

  const getTipoVagaIcon = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return <Wheelchair className="h-4 w-4" />
      case "convidado":
        return <Users className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const getTipoVagaLabel = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return "PCD"
      case "convidado":
        return "Convidado"
      default:
        return "Normal"
    }
  }

  const getTipoVagaColor = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "convidado":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStepNumber = (step: string) => {
    switch (step) {
      case "estacionamento":
        return 1
      case "vaga":
        return 2
      case "horario":
        return 3
      case "confirmar":
        return 4
      default:
        return 1
    }
  }

  const getCurrentStep = () => getStepNumber(activeTab)
  const getProgressPercentage = () => (getCurrentStep() / 4) * 100

  const canAccessStep = (step: string) => {
    switch (step) {
      case "estacionamento":
        return true
      case "vaga":
        return selectedEstacionamento !== ""
      case "horario":
        return selectedEstacionamento !== "" && selectedVaga !== ""
      case "confirmar":
        return (
          selectedEstacionamento !== "" &&
          selectedVaga !== "" &&
          formData.dataEntrada !== "" &&
          formData.horaEntrada !== ""
        )
      default:
        return false
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agendar Vaga</h1>
          <p className="text-muted-foreground">Reserve sua vaga de estacionamento</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          Voltar
        </Button>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso</span>
          <span className="text-sm text-muted-foreground">{getCurrentStep()} de 4</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1">
            <TabsTrigger
              value="estacionamento"
              className="flex items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              disabled={!canAccessStep("estacionamento")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeTab === "estacionamento" ? "bg-white text-primary" : "bg-primary/20 text-primary"
                  }`}
                >
                  1
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Estacionamento</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="vaga"
              className="flex items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              disabled={!canAccessStep("vaga")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeTab === "vaga"
                      ? "bg-white text-primary"
                      : canAccessStep("vaga")
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  <span>Vaga</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="horario"
              className="flex items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              disabled={!canAccessStep("horario")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeTab === "horario"
                      ? "bg-white text-primary"
                      : canAccessStep("horario")
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Horário</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="confirmar"
              className="flex items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              disabled={!canAccessStep("confirmar")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeTab === "confirmar"
                      ? "bg-white text-primary"
                      : canAccessStep("confirmar")
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  4
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirmar</span>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          <Card>
            <TabsContent value="estacionamento">
              <CardHeader>
                <CardTitle>Selecionar Estacionamento</CardTitle>
                <CardDescription>Escolha o estacionamento onde deseja reservar uma vaga</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {estacionamentos.map((estacionamento) => (
                    <Card
                      key={estacionamento.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedEstacionamento === estacionamento.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedEstacionamento(estacionamento.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {estacionamento.nome}
                        </CardTitle>
                        <CardDescription>{estacionamento.endereco}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Vagas disponíveis:</span>
                            <Badge variant={estacionamento.vagasDisponiveis > 5 ? "default" : "destructive"}>
                              {estacionamento.vagasDisponiveis}/{estacionamento.totalVagas}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Distância:</span>
                            <span className="text-sm font-medium">{estacionamento.distancia}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setActiveTab("vaga")} disabled={!selectedEstacionamento}>
                  Próximo: Selecionar Vaga
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="vaga">
              <CardHeader>
                <CardTitle>Selecionar Vaga</CardTitle>
                <CardDescription>Escolha uma vaga disponível no {estacionamentoSelecionado?.nome}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {vagasDisponiveis.map((vaga) => (
                    <Card
                      key={vaga.id}
                      className={`cursor-pointer transition-all hover:shadow-md p-4 ${
                        selectedVaga === vaga.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedVaga(vaga.id)}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-2">{getTipoVagaIcon(vaga.tipo)}</div>
                        <div className="font-medium text-sm">{vaga.numero}</div>
                        <Badge variant="outline" className={`text-xs mt-1 ${getTipoVagaColor(vaga.tipo)}`}>
                          {getTipoVagaLabel(vaga.tipo)}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                {vagasDisponiveis.length === 0 && (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma vaga disponível</h3>
                    <p className="text-muted-foreground">Não há vagas disponíveis neste estacionamento no momento.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("estacionamento")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("horario")} disabled={!selectedVaga}>
                  Próximo: Definir Horário
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="horario">
              <CardHeader>
                <CardTitle>Definir Horário</CardTitle>
                <CardDescription>Escolha o período da sua reserva</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="veiculo">Selecionar Veículo</Label>
                  <Select value={selectedVeiculo} onValueChange={setSelectedVeiculo} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculos.map((veiculo) => (
                        <SelectItem key={veiculo.id} value={veiculo.id}>
                          {veiculo.placa} - {veiculo.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataEntrada">Data de Entrada</Label>
                    <Input
                      id="dataEntrada"
                      name="dataEntrada"
                      type="date"
                      value={formData.dataEntrada}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaEntrada">Hora de Entrada</Label>
                    <Input
                      id="horaEntrada"
                      name="horaEntrada"
                      type="time"
                      value={formData.horaEntrada}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataSaida">Data de Saída</Label>
                    <Input
                      id="dataSaida"
                      name="dataSaida"
                      type="date"
                      value={formData.dataSaida}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaSaida">Hora de Saída</Label>
                    <Input
                      id="horaSaida"
                      name="horaSaida"
                      type="time"
                      value={formData.horaSaida}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Input
                    id="observacoes"
                    name="observacoes"
                    placeholder="Informações adicionais sobre a reserva"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("vaga")}>
                  Anterior
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("confirmar")}
                  disabled={!selectedVeiculo || !formData.dataEntrada || !formData.horaEntrada}
                >
                  Próximo: Confirmar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="confirmar">
              <CardHeader>
                <CardTitle>Confirmar Reserva</CardTitle>
                <CardDescription>Revise os dados da sua reserva antes de confirmar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Detalhes da Reserva</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estacionamento:</span>
                          <span className="font-medium">{estacionamentoSelecionado?.nome}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vaga:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{vagaSelecionada?.numero}</span>
                            <Badge variant="outline" className={getTipoVagaColor(vagaSelecionada?.tipo || "")}>
                              {getTipoVagaLabel(vagaSelecionada?.tipo || "")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Veículo:</span>
                          <span className="font-medium">{veiculoSelecionado?.placa}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Período da Reserva</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data de Entrada:</span>
                          <span className="font-medium">{formData.dataEntrada}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hora de Entrada:</span>
                          <span className="font-medium">{formData.horaEntrada}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data de Saída:</span>
                          <span className="font-medium">{formData.dataSaida}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hora de Saída:</span>
                          <span className="font-medium">{formData.horaSaida}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {formData.observacoes && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{formData.observacoes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("horario")}>
                  Anterior
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Confirmando..." : "Confirmar Reserva"}
                </Button>
              </CardFooter>
            </TabsContent>
          </Card>
        </Tabs>
      </form>
    </div>
  )
}
