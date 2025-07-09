import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"

interface FeedbackProps {
  id: string
  usuario: string
  estacionamento: string
  avaliacao: number
  comentario: string
  data: string
}

interface FeedbackCardProps {
  feedback: FeedbackProps
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{feedback.usuario}</h3>
            <p className="text-sm text-muted-foreground">{feedback.estacionamento}</p>
          </div>
          <p className="text-xs text-muted-foreground">{feedback.data}</p>
        </div>
      </CardHeader>
      <CardContent>
        <StarRating rating={feedback.avaliacao} />
        <p className="mt-2 text-sm">{feedback.comentario}</p>
      </CardContent>
    </Card>
  )
}
