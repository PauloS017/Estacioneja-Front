"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Mail, MessageSquare, HelpCircle } from "lucide-react"

// Dados das perguntas frequentes
const faqData = [
  {
    category: "Geral",
    questions: [
      {
        id: "q1",
        question: "O que é o EstacioneJá?",
        answer:
          "O EstacioneJá é uma plataforma de gerenciamento de estacionamentos voltada para instituições de ensino. Nosso sistema permite que motoristas reservem vagas com antecedência, façam check-in e check-out de forma digital, enquanto administradores podem gerenciar todo o estacionamento de forma eficiente.",
      },
      {
        id: "q2",
        question: "Como funciona o sistema de reservas?",
        answer:
          "O sistema permite que usuários cadastrados reservem vagas com antecedência, escolhendo data, horário e localização. Após a reserva, o usuário recebe uma confirmação e pode fazer check-in quando chegar ao estacionamento, utilizando o aplicativo ou o sistema web.",
      },
      {
        id: "q3",
        question: "Quais são os planos disponíveis?",
        answer:
          "Oferecemos três planos: Básico (gratuito para pequenas instituições), Profissional (para instituições de médio porte) e Enterprise (para grandes universidades). Cada plano possui diferentes recursos e limites de uso. Visite nossa página de planos para mais detalhes.",
      },
    ],
  },
  {
    category: "Motoristas",
    questions: [
      {
        id: "q4",
        question: "Como faço para me cadastrar como motorista?",
        answer:
          "Para se cadastrar como motorista, clique em 'Cadastrar' no menu superior, selecione a opção 'Motorista' e preencha o formulário com seus dados pessoais e informações de contato. Após confirmar seu email, você já poderá acessar o sistema.",
      },
      {
        id: "q5",
        question: "Posso cadastrar mais de um veículo?",
        answer:
          "Sim, você pode cadastrar múltiplos veículos em sua conta. Após fazer login, acesse a seção 'Meus Veículos' no dashboard e clique em 'Cadastrar Veículo' para adicionar um novo veículo à sua conta.",
      },
      {
        id: "q6",
        question: "Como faço para cancelar uma reserva?",
        answer:
          "Para cancelar uma reserva, acesse seu dashboard, vá até a seção 'Minhas Reservas', localize a reserva que deseja cancelar e clique no botão 'Cancelar'. Dependendo da política da instituição, pode haver um prazo limite para cancelamentos sem cobrança.",
      },
      {
        id: "q7",
        question: "O que acontece se eu não utilizar minha reserva?",
        answer:
          "Se você não utilizar sua reserva e não cancelá-la dentro do prazo estabelecido, a vaga permanecerá reservada para você durante o período selecionado. Algumas instituições podem aplicar penalidades por reservas não utilizadas e não canceladas.",
      },
    ],
  },
  {
    category: "Instituições",
    questions: [
      {
        id: "q8",
        question: "Como cadastrar minha instituição no sistema?",
        answer:
          "Para cadastrar sua instituição, clique em 'Cadastrar' no menu superior, selecione a opção 'Instituição' e preencha o formulário com os dados da instituição. Nossa equipe entrará em contato para verificar as informações e ativar sua conta.",
      },
      {
        id: "q9",
        question: "É possível integrar o sistema com cancelas eletrônicas?",
        answer:
          "Sim, o EstacioneJá oferece integração com diversos modelos de cancelas eletrônicas. Essa funcionalidade está disponível nos planos Profissional e Enterprise. Entre em contato com nossa equipe de suporte para verificar a compatibilidade com seu equipamento.",
      },
      {
        id: "q10",
        question: "Como configurar diferentes tipos de vagas (normal, PCD, convidados)?",
        answer:
          "No painel administrativo, acesse a seção 'Estacionamentos', selecione o estacionamento desejado e clique em 'Configurar'. Lá você poderá definir a quantidade e os tipos de vagas disponíveis, incluindo vagas normais, para PCD e para convidados.",
      },
      {
        id: "q11",
        question: "É possível gerar relatórios de ocupação?",
        answer:
          "Sim, o sistema oferece diversos tipos de relatórios, incluindo ocupação por período, horários de pico, tempo médio de permanência e muito mais. Acesse a seção 'Relatórios' no painel administrativo para gerar os relatórios desejados.",
      },
    ],
  },
  {
    category: "Suporte Técnico",
    questions: [
      {
        id: "q12",
        question: "Como entrar em contato com o suporte?",
        answer:
          "Você pode entrar em contato com nossa equipe de suporte através do email suporte@estacioneja.com.br, pelo chat disponível em nosso site ou pelo telefone (11) 4002-8922, de segunda a sexta, das 8h às 18h.",
      },
      {
        id: "q13",
        question: "O sistema funciona offline?",
        answer:
          "O sistema principal requer conexão com a internet para funcionar. No entanto, oferecemos soluções de contingência para casos de queda de internet, permitindo operações básicas offline que serão sincronizadas quando a conexão for restabelecida.",
      },
      {
        id: "q14",
        question: "Existe um aplicativo móvel?",
        answer:
          "Sim, disponibilizamos aplicativos para iOS e Android, que permitem aos usuários fazer reservas, check-in e check-out, além de visualizar o histórico de uso. Os aplicativos podem ser baixados nas respectivas lojas de aplicativos.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Geral")

  // Filtra as perguntas com base no termo de pesquisa
  const filteredFAQ = searchTerm
    ? faqData
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqData

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2 max-w-[800px]">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Perguntas Frequentes</h1>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Encontre respostas para as dúvidas mais comuns sobre o EstacioneJá
          </p>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar perguntas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categorias de FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar com categorias */}
        <div className="md:col-span-1">
          <div className="space-y-2 sticky top-24">
            <h3 className="font-medium mb-4">Categorias</h3>
            {faqData.map((category) => (
              <Button
                key={category.category}
                variant={expandedCategory === category.category ? "default" : "ghost"}
                className={`w-full justify-start ${
                  expandedCategory === category.category ? "bg-primary text-white" : ""
                }`}
                onClick={() => setExpandedCategory(category.category)}
              >
                {category.category}
              </Button>
            ))}
          </div>
        </div>

        {/* Perguntas e respostas */}
        <div className="md:col-span-3">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category) => (
              <div
                key={category.category}
                className={`mb-8 ${expandedCategory === category.category || searchTerm ? "" : "hidden"}`}
              >
                {searchTerm ? null : <h2 className="text-2xl font-bold mb-4">{category.category}</h2>}
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Não encontramos respostas para sua pesquisa. Tente outros termos ou entre em contato conosco.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Seção "Não encontrou o que procurava?" */}
      <div className="mt-16 bg-muted/50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h2>
          <p className="text-muted-foreground mb-8">
            Entre em contato com nossa equipe de suporte e teremos prazer em ajudar com suas dúvidas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">suporte@estacioneja.com.br</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">Chat ao Vivo</h3>
                <p className="text-sm text-muted-foreground">Disponível de seg. a sex., 8h às 18h</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium mb-2">Central de Ajuda</h3>
                <p className="text-sm text-muted-foreground">Tutoriais e guias detalhados</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
