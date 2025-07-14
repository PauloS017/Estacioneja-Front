import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, StarIcon, User, Calendar } from "lucide-react"

interface Feedback {
  id: string
  usuario: string
  estacionamento: string
  avaliacao: number
  comentario: string
  data: string
}

interface FeedbackCardProps {
  feedback: Feedback
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < rating ? (
          <StarIcon className="h-4 w-4 text-secondary fill-secondary" />
        ) : (
          <Star className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
    ))
  }

  const getAvaliacaoColor = (avaliacao: number) => {
    if (avaliacao >= 4) return "bg-green-100 text-green-800"
    if (avaliacao >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          {feedback.usuario}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{feedback.estacionamento}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {feedback.data}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(feedback.avaliacao)}</div>
            <Badge className={getAvaliacaoColor(feedback.avaliacao)}>{feedback.avaliacao}/5</Badge>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground italic">"{feedback.comentario}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
