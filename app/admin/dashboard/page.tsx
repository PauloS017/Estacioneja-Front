"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Bell, Building2, Calendar, FileText, Plus, Settings } from "lucide-react"
import { ReservaCard } from "@/components/reserva-card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { EstacionamentoCard } from "@/components/estacionamento-card"
import { FeedbackCard } from "@/components/feedback-card"

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

const estacionamentos = [
  {
    id: "1",
    nome: "Estacionamento Central",
    capacidade: 120,
    vagasOcupadas: 78,
    vagasDisponiveis: 42,
    vagasPCD: 8,
    vagasConvidados: 10,
  },
  {
    id: "2",
    nome: "Estacionamento Setor Norte",
    capacidade: 80,
    vagasOcupadas: 45,
    vagasDisponiveis: 35,
    vagasPCD: 5,
    vagasConvidados: 6,
  },
  {
    id: "3",
    nome: "Estacionamento Biblioteca",
    capacidade: 60,
    vagasOcupadas: 52,
    vagasDisponiveis: 8,
    vagasPCD: 4,
    vagasConvidados: 4,
  },
]

const feedbacks = [
  {
    id: "1",
    usuario: "João Silva",
    estacionamento: "Estacionamento Central",
    avaliacao: 4,
    comentario: "Ótimo serviço, mas poderia ter mais vagas disponíveis.",
    data: "10/06/2025",
  },
  {
    id: "2",
    usuario: "Maria Oliveira",
    estacionamento: "Estacionamento Setor Norte",
    avaliacao: 5,
    comentario: "Excelente sistema, muito prático e fácil de usar!",
    data: "09/06/2025",
  },
  {
    id: "3",
    usuario: "Carlos Santos",
    estacionamento: "Estacionamento Biblioteca",
    avaliacao: 3,
    comentario: "O sistema é bom, mas tive problemas com o check-in.",
    data: "08/06/2025",
  },
]

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("visao-geral")

  const totalVagas = estacionamentos.reduce((acc, est) => acc + est.capacidade, 0)
  const totalVagasOcupadas = estacionamentos.reduce((acc, est) => acc + est.vagasOcupadas, 0)
  const totalVagasDisponiveis = estacionamentos.reduce((acc, est) => acc + est.vagasDisponiveis, 0)
  const ocupacaoPercentual = Math.round((totalVagasOcupadas / totalVagas) * 100)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie os estacionamentos da sua instituição</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/cadastrar-estacionamento">
            <Button className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Cadastrar Estacionamento</span>
            </Button>
          </Link>
          <Link href="/admin/relatorios">
            <Button className="flex items-center gap-2" variant="outline">
              <FileText className="h-4 w-4" />
              <span>Relatórios</span>
            </Button>
          </Link>
          <Link href="/admin/configuracoes">
            <Button className="flex items-center gap-2" variant="outline">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Reservas Ativas</CardTitle>
            <CardDescription>Total de reservas em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">{reservasAtivas.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Ocupação</CardTitle>
            <CardDescription>Percentual de vagas ocupadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-4xl font-bold text-primary">{ocupacaoPercentual}%</div>
              <Progress value={ocupacaoPercentual} className="w-full h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Vagas Disponíveis</CardTitle>
            <CardDescription>Total de vagas livres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">{totalVagasDisponiveis}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Notificações</CardTitle>
            <CardDescription>Alertas pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">3</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visao-geral" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-8">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="estacionamentos">Estacionamentos</TabsTrigger>
          <TabsTrigger value="reservas">Reservas Ativas</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ocupação por Estacionamento</CardTitle>
                <CardDescription>Percentual de ocupação de cada estacionamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estacionamentos.map((est) => (
                    <div key={est.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{est.nome}</span>
                        <span>{Math.round((est.vagasOcupadas / est.capacidade) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((est.vagasOcupadas / est.capacidade) * 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notificações Recentes</CardTitle>
                <CardDescription>Últimos alertas do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Estacionamento Central quase lotado</p>
                      <p className="text-sm text-muted-foreground">Apenas 5 vagas disponíveis</p>
                      <p className="text-xs text-muted-foreground mt-1">Hoje, 10:23</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <Bell className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Manutenção necessária</p>
                      <p className="text-sm text-muted-foreground">Cancela do Estacionamento Norte com defeito</p>
                      <p className="text-xs text-muted-foreground mt-1">Ontem, 16:45</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <Bell className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Novo feedback recebido</p>
                      <p className="text-sm text-muted-foreground">3 novos feedbacks de usuários</p>
                      <p className="text-xs text-muted-foreground mt-1">11/06/2025, 09:12</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Estatísticas Semanais</CardTitle>
                <CardDescription>Dados dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Gráfico de estatísticas semanais</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="estacionamentos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estacionamentos.map((estacionamento) => (
              <EstacionamentoCard key={estacionamento.id} estacionamento={estacionamento} />
            ))}
            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Adicionar Estacionamento</h3>
              <p className="text-muted-foreground text-center mb-4">Cadastre um novo estacionamento no sistema</p>
              <Link href="/admin/cadastrar-estacionamento">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Estacionamento
                </Button>
              </Link>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reservas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservasAtivas.length > 0 ? (
              reservasAtivas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} showActions={false} isAdmin={true} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhuma reserva ativa</h3>
                <p className="text-muted-foreground mt-2">Não há reservas ativas no momento.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="feedbacks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
