"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroSlider } from "@/components/hero-slider"
import { PlanosSection } from "@/components/planos-section"
import { Car, Clock, MapPin, Shield, ThumbsUp, Users, CheckCircle, Calendar, Smartphone, ChevronRight } from "lucide-react"

const sliderImages = [
  {
    url: "/estacionamento1.jpg?height=800&width=1600",
    alt: "Estacionamento universitário moderno",
  },
  {
    url: "/estacionamento2.jpg?height=800&width=1600",
    alt: "Sistema de controle de acesso",
  },
  {
    url: "/estacionamento3.jpg?height=800&width=1600",
    alt: "Aplicativo móvel para reservas",
  },
]

const depoimentos = [
  {
    nome: "Universidade Federal do ABC",
    cargo: "Diretor de Infraestrutura",
    texto:
    "O EstacioneJá revolucionou a forma como gerenciamos nossos estacionamentos. Reduzimos filas, melhoramos a experiência dos alunos e otimizamos o uso das vagas.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    nome: "Instituto Federal de São Paulo",
    cargo: "Coordenador Administrativo",
    texto:
    "Desde que implementamos o EstacioneJá, os problemas com estacionamento diminuíram drasticamente. A plataforma é intuitiva e o suporte é excelente.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    nome: "Universidade Estadual de Campinas",
    cargo: "Pró-Reitor de Administração",
    texto:
    "O sistema nos permitiu ter controle total sobre os estacionamentos do campus. Os relatórios são fundamentais para nosso planejamento estratégico.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function Home() {
  const usuarios = "2.5K+";
  const instituicoes = "15+";

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background selection:bg-primary/20">
      {/* Hero Section com Slider */}
      <section className="w-full pt-6 pb-12 md:pt-10 md:pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <HeroSlider images={sliderImages} />
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5">
                Acessar Sistema
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/cadastrar" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-6 text-base font-medium border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary bg-transparent rounded-full transition-all duration-300 hover:-translate-y-0.5"
              >
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contador de Estatísticas */}
      <section className="w-full py-16 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-primary/20">
            <div className="space-y-2 py-2">
              <h3 className="text-4xl md:text-5xl font-bold text-primary">{usuarios}</h3>
              <p className="text-lg font-medium text-muted-foreground uppercase tracking-wide">Usuários Ativos</p>
            </div>
            <div className="space-y-2 py-2">
              <h3 className="text-4xl md:text-5xl font-bold text-primary">{instituicoes}</h3>
              <p className="text-lg font-medium text-muted-foreground uppercase tracking-wide">Instituições Parceiras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
            <div className="space-y-3 max-w-[800px]">
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl text-foreground">
                Por que escolher o EstacioneJá?
              </h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                Nossa plataforma oferece soluções completas e inteligentes para o gerenciamento de estacionamentos.
              </p>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Clock, title: "Reservas Antecipadas", desc: "Garanta sua vaga com antecedência e evite atrasos para suas aulas e compromissos.", primary: true },
              { icon: MapPin, title: "Localização Inteligente", desc: "Encontre facilmente as vagas disponíveis mais próximas do seu destino no campus.", primary: true },
              { icon: Shield, title: "Segurança Garantida", desc: "Estacionamentos monitorados e com controle de acesso para maior segurança.", primary: true },
              { icon: Users, title: "Gestão Eficiente", desc: "Ferramentas completas para administradores gerenciarem vagas e usuários.", primary: false },
              { icon: Car, title: "Múltiplos Veículos", desc: "Cadastre e gerencie múltiplos veículos em uma única conta de usuário.", primary: false },
              { icon: ThumbsUp, title: "Experiência Simplificada", desc: "Interface intuitiva e fácil de usar para todos os tipos de usuários.", primary: false }
            ].map((feature, idx) => (
              <Card key={idx} className="group hover:-translate-y-1 transition-all duration-300 border border-border/40 shadow-sm hover:shadow-md bg-card">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-2xl ${feature.primary ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="w-full py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
            <div className="space-y-3 max-w-[800px]">
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl text-foreground">Como Funciona</h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                Conheça o processo simples e rápido para utilizar o EstacioneJá
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Linha conectora oculta em mobile */}
            <div className="hidden md:block absolute top-[10%] mt-8 left-[15%] right-[15%] h-px bg-border z-0 border-dashed border"></div>
            
            {[
              { step: 1, icon: Smartphone, title: "Cadastre-se", desc: "Crie sua conta como motorista ou administrador de instituição em poucos minutos.", color: "primary" },
              { step: 2, icon: Calendar, title: "Reserve sua Vaga", desc: "Escolha o estacionamento, data e horário desejados para sua reserva.", color: "secondary" },
              { step: 3, icon: CheckCircle, title: "Estacione", desc: "Chegue ao local, faça check-in e estacione na vaga reservada com tranquilidade.", color: "primary" }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md border-4 border-background ${item.color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="text-center bg-background p-6 rounded-2xl shadow-sm border border-border/50 w-full h-full">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${item.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                    PASSO {item.step}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section (Componente Cliente Isolado) */}
      <PlanosSection />

      {/* Depoimentos */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
            <div className="space-y-3 max-w-[800px]">
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl text-foreground">O que dizem nossos clientes</h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                Veja o impacto do EstacioneJá nas instituições parceiras
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((depoimento, index) => (
              <Card key={index} className="flex flex-col h-full border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <div className="rounded-full border border-primary/20 overflow-hidden w-12 h-12 shrink-0">
                      <Image
                        src={depoimento.avatar || "/placeholder.svg"}
                        alt={depoimento.nome}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground leading-tight">{depoimento.nome}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{depoimento.cargo}</p>
                    </div>
                  </div>
                  <blockquote className="flex-1 text-sm text-muted-foreground italic relative">
                    <span className="text-3xl text-primary/10 absolute -top-3 -left-1 font-serif">"</span>
                    <span className="relative z-10">{depoimento.texto}</span>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
