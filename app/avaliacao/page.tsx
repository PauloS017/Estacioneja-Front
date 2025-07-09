"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Star, StarIcon } from "lucide-react"
import { FeedbackCard } from "@/components/feedback-card"
import { CheckCircle } from "lucide-react" // Import CheckCircle icon

// Dados simulados de feedbacks
const feedbacksExistentes = [
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
  {
    id: "4",
    usuario: "Ana Pereira",
    estacionamento: "Estacionamento Central",
    avaliacao: 5,
    comentario: "Muito satisfeita com o serviço! Facilita muito minha rotina.",
    data: "07/06/2025",
  },
  {
    id: "5",
    usuario: "Roberto Almeida",
    estacionamento: "Estacionamento Setor Norte",
    avaliacao: 4,
    comentario: "Bom serviço, mas o aplicativo poderia ser mais rápido.",
    data: "06/06/2025",
  },
  {
    id: "6",
    usuario: "Fernanda Lima",
    estacionamento: "Estacionamento Biblioteca",
    avaliacao: 5,
    comentario: "Perfeito! Nunca mais tive problemas para encontrar vagas.",
    data: "05/06/2025",
  },
]

// Lista de estacionamentos para o select
const estacionamentos = [
  { id: "1", nome: "Estacionamento Central" },
  { id: "2", nome: "Estacionamento Setor Norte" },
  { id: "3", nome: "Estacionamento Biblioteca" },
  { id: "4", nome: "Estacionamento Bloco A" },
  { id: "5", nome: "Estacionamento Administrativo" },
]

export default function AvaliacaoPage() {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    estacionamento: "",
    comentario: "",
  })

  const handleRatingChange = (value: number) => {
    setRating(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, estacionamento: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Avaliação enviada com sucesso!",
        description: "Agradecemos pelo seu feedback.",
      })

      // Resetar formulário
      setRating(0)
      setFormData({
        nome: "",
        email: "",
        estacionamento: "",
        comentario: "",
      })
    }, 1500)
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2 max-w-[800px]">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Avaliações e Feedback</h1>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Sua opinião é importante para continuarmos melhorando nossos serviços
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulário de Avaliação */}
        <Card>
          <CardHeader>
            <CardTitle>Deixe sua avaliação</CardTitle>
            <CardDescription>Compartilhe sua experiência com o EstacioneJá</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estacionamento">Estacionamento</Label>
                <Select value={formData.estacionamento} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estacionamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {estacionamentos.map((estacionamento) => (
                      <SelectItem key={estacionamento.id} value={estacionamento.nome}>
                        {estacionamento.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      {star <= (hoveredRating || rating) ? (
                        <StarIcon className="h-8 w-8 text-secondary fill-secondary" />
                      ) : (
                        <Star className="h-8 w-8 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comentario">Comentário</Label>
                <Textarea
                  id="comentario"
                  name="comentario"
                  placeholder="Compartilhe sua experiência..."
                  value={formData.comentario}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-700"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Estatísticas e Informações */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Avaliação</CardTitle>
              <CardDescription>Média de avaliações dos nossos serviços</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="text-6xl font-bold text-primary mr-4">4.7</div>
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <StarIcon key={star} className="h-6 w-6 text-secondary fill-secondary" />
                  ))}
                  <StarIcon className="h-6 w-6 text-secondary fill-secondary opacity-70" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>5 estrelas</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[65%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>4 estrelas</span>
                    <span>25%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[25%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>3 estrelas</span>
                    <span>8%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[8%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>2 estrelas</span>
                    <span>1%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[1%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>1 estrela</span>
                    <span>1%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[1%]"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Por que avaliar?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>Ajuda a melhorar nossos serviços</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>Contribui para a experiência de outros usuários</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>Identifica pontos de melhoria no sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span>Reconhece o bom trabalho da nossa equipe</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avaliações Recentes */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Avaliações Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacksExistentes.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </div>
    </div>
  )
}
