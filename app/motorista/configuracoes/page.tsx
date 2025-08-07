"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { User, Car, Bell, Lock, Plus, Settings, Mail, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteButton } from "@/components/ui/delete-button"

// Dados simulados de veículos (reutilizando do dashboard do motorista)
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

export default function MotoristaConfiguracoesPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("meus-dados")

    // Dados simulados do perfil do motorista
    const [personalData, setPersonalData] = useState({
        nome: "João Silva",
        email: "joao.silva@email.com",
        cpf: "000.000.000-00",
        telefone: "(00) 98765-4321",
        vinculo: "estudante",
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailReservas: true,
        emailPromocoes: false,
        pushLembretes: true,
        pushAlertas: true,
    })

    const handleSavePersonalData = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Dados pessoais atualizados",
                description: "Suas informações foram salvas com sucesso.",
            })
        }, 1500)
    }

    const handleSaveNotifications = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Preferências de notificação salvas",
                description: "Suas preferências foram atualizadas.",
            })
        }, 1500)
    }

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Meu Perfil</h1>
                    <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                    Voltar
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
                    <TabsTrigger value="meus-dados" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Meus Dados
                    </TabsTrigger>
                    <TabsTrigger value="meus-veiculos" className="flex items-center gap-2">
                        <Car className="h-4 w-4" /> Meus Veículos
                    </TabsTrigger>
                    <TabsTrigger value="notificacoes" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Notificações
                    </TabsTrigger>
                </TabsList>

                <Card>
                    <TabsContent value="meus-dados">
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>Atualize seus dados cadastrais</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSavePersonalData}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome Completo</Label>
                                    <Input
                                        id="nome"
                                        value={personalData.nome}
                                        onChange={(e) => setPersonalData({ ...personalData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={personalData.email}
                                            onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            value={personalData.cpf}
                                            onChange={(e) => setPersonalData({ ...personalData, cpf: e.target.value })}
                                            required
                                            disabled // CPF geralmente não é editável
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input
                                            id="telefone"
                                            value={personalData.telefone}
                                            onChange={(e) => setPersonalData({ ...personalData, telefone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vinculo">Vínculo com a Instituição</Label>
                                        <Select
                                            value={personalData.vinculo}
                                            onValueChange={(value) => setPersonalData({ ...personalData, vinculo: value })}
                                            required
                                        >
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
                                <div className="space-y-2 pt-4">
                                    <Label htmlFor="change-password">Alterar Senha</Label>
                                    <Link href="/motorista/configuracoes/alteraSenha">
                                        {" "}
                                        {/* Adicionado o Link aqui */}
                                        <Button variant="outline" className="w-full justify-start bg-transparent">
                                            <Lock className="h-4 w-4 mr-2" /> Alterar Senha
                                        </Button>
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        Você será redirecionado para uma página segura para alterar sua senha.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="meus-veiculos">
                        <CardHeader>
                            <CardTitle>Meus Veículos</CardTitle>
                            <CardDescription>Gerencie os veículos cadastrados em sua conta</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                <span className="text-sm font-medium capitalize">{veiculo.tipo}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 w-full">
                                            <div className="flex-1">
                                                <Link href="/motorista/Editar-veiculo" className="block h-full">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full h-full bg-transparent"
                                                    >
                                                        <Settings className="h-4 w-4 mr-1" />
                                                        Editar
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div className="flex-1">
                                                <DeleteButton />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Adicionar Veículo</h3>
                                <p className="text-muted-foreground text-center mb-4">Cadastre um novo veículo à sua conta</p>
                                <Link href="/motorista/cadastrar-veiculo">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Cadastrar Veículo
                                    </Button>
                                </Link>
                            </Card>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="notificacoes">
                        <CardHeader>
                            <CardTitle>Preferências de Notificação</CardTitle>
                            <CardDescription>Escolha como você deseja receber nossas comunicações</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSaveNotifications}>
                            <CardContent className="space-y-6">
                                <div className="space-y-4 border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Notificações por Email
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="emailReservas">Lembretes de Reserva e Confirmações</Label>
                                        <Switch
                                            id="emailReservas"
                                            checked={notificationSettings.emailReservas}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, emailReservas: checked })
                                            }
                                        />
                                    </div>

                                    { /*<div className="flex items-center justify-between">
                                        <Label htmlFor="emailPromocoes">Promoções e Novidades</Label>
                                        <Switch
                                            id="emailPromocoes"
                                            checked={notificationSettings.emailPromocoes}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, emailPromocoes: checked })
                                            }
                                        />
                                    </div>*/}

                                </div>

                                <div className="space-y-4 border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Notificações Push (Aplicativo)
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pushLembretes">Lembretes de Check-in/Check-out</Label>
                                        <Switch
                                            id="pushLembretes"
                                            checked={notificationSettings.pushLembretes}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, pushLembretes: checked })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pushAlertas">Alertas de Vagas Próximas</Label>
                                        <Switch
                                            id="pushAlertas"
                                            checked={notificationSettings.pushAlertas}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, pushAlertas: checked })
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    )
}
