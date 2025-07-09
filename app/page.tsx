"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroSlider } from "@/components/hero-slider"
import { PricingCard } from "@/components/pricing-card"
import { Car, Clock, MapPin, Shield, ThumbsUp, Users, CheckCircle, Calendar, Smartphone } from "lucide-react"

// Imagens para o slider
const sliderImages = [
  {
    url: "/estacionamento1.jpg?height=500&width=1200",
    alt: "Estacionamento universitário moderno",
  },
  {
    url: "/estacionamento2.jpg?height=500&width=1200",
    alt: "Sistema de controle de acesso",
  },
  {
    url: "/estacionamento3.jpg?height=500&width=1200",
    alt: "Aplicativo móvel para reservas",
  },
]

// Dados dos planos
const planos = [
  {
    title: "Básico",
    price: "Gratuito",
    description: "Para pequenas instituições",
    features: ["Até 50 vagas", "Cadastro de veículos", "Reservas básicas", "Relatórios mensais", "Suporte por email"],
    buttonText: "Começar Grátis",
    buttonLink: "/cadastrar",
    popular: false,
  },
  {
    title: "Profissional",
    price: "R$ 299",
    description: "Para instituições de médio porte",
    features: [
      "Até 200 vagas",
      "Cadastro ilimitado de veículos",
      "Sistema de reservas avançado",
      "Relatórios detalhados",
      "Suporte prioritário",
      "Integração com cancelas",
    ],
    buttonText: "Assinar Agora",
    buttonLink: "/cadastrar",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "R$ 599",
    description: "Para grandes universidades",
    features: [
      "Vagas ilimitadas",
      "Múltiplos estacionamentos",
      "Sistema completo de gestão",
      "Relatórios personalizados",
      "Suporte 24/7",
      "API para integrações",
      "Painel administrativo avançado",
    ],
    buttonText: "Fale Conosco",
    buttonLink: "/contato",
    popular: false,
  },
]

// Depoimentos
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
  const [count, setCount] = useState({ usuarios: 0, reservas: 0, instituicoes: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => ({
        usuarios: prev.usuarios < 5000 ? prev.usuarios + 50 : 5000,
        reservas: prev.reservas < 25000 ? prev.reservas + 250 : 25000,
        instituicoes: prev.instituicoes < 120 ? prev.instituicoes + 1 : 120,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section com Slider */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <HeroSlider images={sliderImages} />
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary-700 text-white">
                Acessar Sistema
              </Button>
            </Link>
            <Link href="/cadastrar">
              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contador de Estatísticas */}
      <section className="w-full py-8 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">{count.usuarios.toLocaleString()}</h3>
              <p className="text-lg font-medium">Usuários Ativos</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">{count.reservas.toLocaleString()}</h3>
              <p className="text-lg font-medium">Reservas Realizadas</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">{count.instituicoes.toLocaleString()}</h3>
              <p className="text-lg font-medium">Instituições Parceiras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Por que escolher o EstacioneJá?</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Nossa plataforma oferece soluções completas para o gerenciamento de estacionamentos universitários
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Reservas Antecipadas</h3>
              <p className="text-muted-foreground">
                Garanta sua vaga com antecedência e evite atrasos para suas aulas e compromissos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Localização Inteligente</h3>
              <p className="text-muted-foreground">
                Encontre facilmente as vagas disponíveis mais próximas do seu destino no campus.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Segurança Garantida</h3>
              <p className="text-muted-foreground">
                Estacionamentos monitorados e com controle de acesso para maior segurança.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon secondary-icon">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Gestão Eficiente</h3>
              <p className="text-muted-foreground">
                Ferramentas completas para administradores gerenciarem vagas e usuários.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon secondary-icon">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Múltiplos Veículos</h3>
              <p className="text-muted-foreground">
                Cadastre e gerencie múltiplos veículos em uma única conta de usuário.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="feature-icon secondary-icon">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Experiência Simplificada</h3>
              <p className="text-muted-foreground">
                Interface intuitiva e fácil de usar para todos os tipos de usuários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Como Funciona</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Conheça o processo simples para utilizar o EstacioneJá
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-br-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <CardContent className="pt-12 pb-8 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cadastre-se</h3>
                <p className="text-muted-foreground">
                  Crie sua conta como motorista ou administrador de instituição em poucos minutos.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 bg-secondary rounded-br-lg flex items-center justify-center text-white font-bold">
                2
              </div>
              <CardContent className="pt-12 pb-8 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-secondary/10 rounded-full">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Reserve sua Vaga</h3>
                <p className="text-muted-foreground">
                  Escolha o estacionamento, data e horário desejados para sua reserva.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-br-lg flex items-center justify-center text-white font-bold">
                3
              </div>
              <CardContent className="pt-12 pb-8 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Estacione sem Preocupações</h3>
                <p className="text-muted-foreground">
                  Chegue ao local, faça check-in e estacione na vaga reservada com tranquilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section id="planos" className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Planos e Preços</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">Escolha o plano ideal para sua instituição</p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <PricingCard key={index} {...plano} />
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">O que dizem nossos clientes</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Veja o que as instituições parceiras falam sobre o EstacioneJá
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-12 pb-8">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="rounded-full border-4 border-background overflow-hidden">
                      <Image
                        src={depoimento.avatar || "/placeholder.svg"}
                        alt={depoimento.nome}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-center italic mb-4">"{depoimento.texto}"</p>
                  <div className="text-center">
                    <h4 className="font-bold">{depoimento.nome}</h4>
                    <p className="text-sm text-muted-foreground">{depoimento.cargo}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pronto para começar?</h2>
              <p className="max-w-[600px] md:text-xl/relaxed">
                Crie sua conta agora e comece a aproveitar todos os benefícios do EstacioneJá
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/cadastrar">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Criar Conta
                </Button>
              </Link>
              <Link href="/sobre">
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">EstacioneJá</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Soluções inteligentes para estacionamentos universitários.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/sobre" className="text-muted-foreground hover:text-foreground">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/#planos" className="text-muted-foreground hover:text-foreground">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contato" className="text-muted-foreground hover:text-foreground">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/suporte" className="text-muted-foreground hover:text-foreground">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="text-muted-foreground hover:text-foreground">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">contato@estacioneja.com.br</li>
                <li className="text-muted-foreground">(11) 4002-8922</li>
                <li className="text-muted-foreground">São Paulo, SP - Brasil</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} EstacioneJá. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacidade" className="text-xs text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="text-xs text-muted-foreground hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
