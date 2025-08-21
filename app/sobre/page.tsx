import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Shield, Users, CheckCircle, Target, TrendingUp } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre o EstacioneJá</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Conheça nossa história, missão e como estamos transformando a gestão de estacionamentos em
                  instituições de ensino por todo o Brasil.
                </p>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <Image
                src="/imgSobreNos.jpeg?height=350&width=500"
                alt="Equipe EstacioneJá"
                width={500}
                height={350}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Nossa História</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                De um projeto universitário a uma solução nacional
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-4">
                O EstacioneJá nasceu em 2020, quando um grupo de estudantes de engenharia e computação da Universidade
                Federal do ABC enfrentava diariamente o desafio de encontrar vagas no estacionamento do campus.
              </p>
              <p className="mb-4">
                O que começou como um projeto de conclusão de curso rapidamente se transformou em uma startup inovadora,
                quando percebemos que o problema afetava instituições de ensino em todo o país.
              </p>
              <p className="mb-4">
                Em 2021, recebemos nosso primeiro investimento e expandimos para 5 universidades. Hoje, estamos
                presentes em mais de 120 instituições em todo o Brasil, ajudando a otimizar o uso de estacionamentos e
                melhorando a experiência de milhares de estudantes, professores e funcionários.
              </p>

            </div>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                <div className="pl-6">
                  <h3 className="text-xl font-bold mb-2">2023</h3>
                  <p className="text-muted-foreground">Fundação do EstacioneJá como projeto universitário</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                <div className="pl-6">
                  <h3 className="text-xl font-bold mb-2">2024</h3>
                  <p className="text-muted-foreground">Primeiro investimento e expansão para 5 universidades</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                <div className="pl-6">
                  <h3 className="text-xl font-bold mb-2">2025</h3>
                  <p className="text-muted-foreground">
                    Lançamento do aplicativo móvel e expansão para 50 instituições
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="pl-6">
                  <h3 className="text-xl font-bold mb-2">2026</h3>
                  <p className="text-muted-foreground">
                    Presente em mais de 120 instituições e lançamento de novos recursos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Nossos Valores</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">Princípios que guiam nossas decisões e ações</p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Inovação</h3>
                  <p className="text-muted-foreground">
                    Buscamos constantemente novas soluções e tecnologias para melhorar nossos serviços.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon secondary-icon">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Colaboração</h3>
                  <p className="text-muted-foreground">
                    Trabalhamos em parceria com instituições e usuários para criar soluções eficientes.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Confiabilidade</h3>
                  <p className="text-muted-foreground">
                    Garantimos a segurança dos dados e a estabilidade do sistema em todos os momentos.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon secondary-icon">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Eficiência</h3>
                  <p className="text-muted-foreground">
                    Otimizamos recursos e processos para oferecer a melhor experiência possível.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Excelência</h3>
                  <p className="text-muted-foreground">
                    Buscamos a qualidade em tudo o que fazemos, desde o código até o atendimento ao cliente.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="feature-icon secondary-icon">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Compromisso</h3>
                  <p className="text-muted-foreground">
                    Estamos comprometidos com o sucesso de nossos clientes e a satisfação dos usuários.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Nossa Equipe</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Conheça os profissionais por trás do EstacioneJá
              </p>
            </div>
          </div>

          {/* Lista de membros */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                nome: "LUAN FREIRE ALVES DA SILVA",
                cargo: "CEO & Fundador",
                imagem: "/luan.jpg",
              },
              {
                nome: "JOAO GABRIEL ODILON DA SILVA",
                cargo: "Gerente de Designe",
                imagem: "/joao.jpg",
              },
              {
                nome: "PAULO SERGIO AMORIM DA SILVA",
                cargo: "Gerente de Projeto",
                imagem: "/paulo.jpg",
              },
              {
                nome: "IFMS",
                cargo: "Consultor em Desenvolvimento de Sistemas",
                imagem: "/avatar-padrao.png",
              },
            ].map((membro, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32">
                  <Image
                    src={membro.imagem}
                    alt={`Foto de ${membro.nome}`}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">{membro.nome}</h3>
                <p className="text-sm text-muted-foreground">{membro.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
