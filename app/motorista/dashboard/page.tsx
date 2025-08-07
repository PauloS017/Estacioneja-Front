"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Car, MapPin, Plus, Settings, Star } from "lucide-react"
import { ReservaCard } from "@/components/reserva-card"
import { useToast } from "@/components/ui/use-toast"

// Dados simulados
const reservasAtivas = [
  {
    id: "1",
    estacionamento: "Estacionamento Central",
    vaga: "A-23",
    dataHoraEntrada: "12/06/2025 08:00",
    dataHoraSaida: "12/06/2025 18:00",
    status: "ativa",
    tipo: "normal",
  },
  {
    id: "2",
    estacionamento: "Estacionamento Setor Norte",
    vaga: "B-15",
    dataHoraEntrada: "13/06/2025 07:30",
    dataHoraSaida: "13/06/2025 17:30",
    status: "ativa",
    tipo: "normal",
  },
  {
    id: "3",
    estacionamento: "Estacionamento Biblioteca",
    vaga: "C-08",
    dataHoraEntrada: "12/06/2025 09:00",
    dataHoraSaida: "12/06/2025 17:00",
    status: "ativa",
    tipo: "pcd",
  },
]

const historicoReservas = [
  {
    id: "4",
    estacionamento: "Estacionamento Central",
    vaga: "A-15",
    dataHoraEntrada: "10/06/2025 08:00",
    dataHoraSaida: "10/06/2025 18:00",
    status: "concluida",
    tipo: "normal",
  },
  {
    id: "5",
    estacionamento: "Estacionamento Biblioteca",
    vaga: "B-22",
    dataHoraEntrada: "09/06/2025 14:00",
    dataHoraSaida: "09/06/2025 18:00",
    status: "concluida",
    tipo: "normal",
  },
  {
    id: "6",
    estacionamento: "Estacionamento Setor Norte",
    vaga: "C-10",
    dataHoraEntrada: "08/06/2025 07:30",
    dataHoraSaida: "08/06/2025 12:00",
    status: "cancelada",
    tipo: "normal",
  },
]

const veiculos = [
  {
    id: "1",
    placa: "ABC-1234",
    modelo: "Honda Civic",
    ano: "2022",
    cor: "Preto",
    tipo: "carro",
  },
  {
    id: "2",
    placa: "XYZ-5678",
    modelo: "Toyota Corolla",
    ano: "2021",
    cor: "Branco",
    tipo: "carro",
  },
]

const estatisticas = {
  totalReservas: 15,
  reservasAtivas: reservasAtivas.length,
  reservasConcluidas: 12,
  tempoMedioUso: "6h 30min",
  estacionamentoFavorito: "Estacionamento Central",
}

export default function MotoristasDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("visao-geral")

  const handleCancelarReserva = (reservaId: string) => {
    toast({
      title: "Reserva cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meu Painel</h1>
          <p className="text-muted-foreground">Gerencie suas reservas e veículos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/motorista/agendar-vaga">
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Agendar Vaga</span>
            </Button>
          </Link>
          <Link href="/motorista/cadastrar-veiculo">
            <Button className="flex items-center gap-2 bg-transparent" variant="outline">
              <Car className="h-4 w-4" />
              <span>Cadastrar Veículo</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Reservas Ativas</CardTitle>
            <CardDescription>Reservas em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">{estatisticas.reservasAtivas}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Reservas</CardTitle>
            <CardDescription>Reservas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">{estatisticas.totalReservas}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tempo Médio</CardTitle>
            <CardDescription>Duração média das reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-primary">{estatisticas.tempoMedioUso}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Veículos</CardTitle>
            <CardDescription>Veículos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">{veiculos.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visao-geral" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-8">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="reservas-ativas">Reservas Ativas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="veiculos">Meus Veículos</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Próximas Reservas</CardTitle>
                <CardDescription>Suas próximas reservas agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservasAtivas.slice(0, 3).map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{reserva.estacionamento}</p>
                          <p className="text-sm text-muted-foreground">Vaga {reserva.vaga}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{reserva.dataHoraEntrada}</p>
                        <Badge variant="secondary" className="text-xs">
                          {reserva.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Estatísticas Pessoais</CardTitle>
                <CardDescription>Seu uso do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Reservas Concluídas</span>
                      <span>{estatisticas.reservasConcluidas}</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Taxa de Comparecimento</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-secondary" />
                      <span className="font-medium">Estacionamento Favorito</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{estatisticas.estacionamentoFavorito}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Ações Rápidas</CardTitle>
                <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/motorista/agendar-vaga">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Calendar className="h-6 w-6" />
                      <span>Agendar Nova Vaga</span>
                    </Button>
                  </Link>
                  <Link href="/motorista/cadastrar-veiculo">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Car className="h-6 w-6" />
                      <span>Cadastrar Veículo</span>
                    </Button>
                  </Link>
                  <Link href="/avaliacao">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Star className="h-6 w-6" />
                      <span>Avaliar Serviço</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reservas-ativas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservasAtivas.length > 0 ? (
              reservasAtivas.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  showActions={true}
                  onCancel={() => handleCancelarReserva(reserva.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhuma reserva ativa</h3>
                <p className="text-muted-foreground mt-2 mb-4">Você não possui reservas ativas no momento.</p>
                <Link href="/motorista/agendar-vaga">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Vaga
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicoReservas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} showActions={false} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="veiculos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veiculos.map((veiculo) => (
              <Card key={veiculo.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {veiculo.placa}
                  </CardTitle>
                  <CardDescription>{veiculo.modelo}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ano:</span>
                      <span className="text-sm font-medium">{veiculo.ano}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cor:</span>
                      <span className="text-sm font-medium">{veiculo.cor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <Badge variant="outline" className="text-xs">
                        {veiculo.tipo}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href="/motorista/Editar-veiculo/">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Settings className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Adicionar Veículo</h3>
              <p className="text-muted-foreground text-center mb-4">Cadastre um novo veículo</p>
              <Link href="/motorista/cadastrar-veiculo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Veículo
                </Button>
              </Link>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
