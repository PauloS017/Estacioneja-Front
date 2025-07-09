import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AccessibilityIcon as Accessible, Car, Settings } from "lucide-react"
import Link from "next/link"

interface EstacionamentoProps {
  id: string
  nome: string
  capacidade: number
  vagasOcupadas: number
  vagasDisponiveis: number
  vagasPCD: number
  vagasConvidados: number
}

interface EstacionamentoCardProps {
  estacionamento: EstacionamentoProps
}

export function EstacionamentoCard({ estacionamento }: EstacionamentoCardProps) {
  const ocupacaoPercentual = Math.round((estacionamento.vagasOcupadas / estacionamento.capacidade) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{estacionamento.nome}</CardTitle>
          <Badge
            className={
              ocupacaoPercentual > 90
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : ocupacaoPercentual > 70
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  : "bg-green-100 text-green-800 hover:bg-green-100"
            }
            variant="outline"
          >
            {ocupacaoPercentual}% Ocupado
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ocupação</span>
            <span>
              {estacionamento.vagasOcupadas} de {estacionamento.capacidade} vagas
            </span>
          </div>
          <Progress
            value={ocupacaoPercentual}
            className="h-2"
            indicatorClassName={
              ocupacaoPercentual > 90 ? "bg-red-500" : ocupacaoPercentual > 70 ? "bg-amber-500" : "bg-green-500"
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted p-2">
            <Car className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Disponíveis</p>
            <p className="font-medium">{estacionamento.vagasDisponiveis}</p>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <Accessible className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">PCD</p>
            <p className="font-medium">{estacionamento.vagasPCD}</p>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <Badge className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Convidados</p>
            <p className="font-medium">{estacionamento.vagasConvidados}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link href={`/admin/estacionamento/${estacionamento.id}`}>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
            Detalhes
          </Button>
        </Link>
        <Link href={`/admin/estacionamento/${estacionamento.id}/configurar`}>
          <Button
            variant="outline"
            size="sm"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
          >
            <Settings className="h-4 w-4 mr-1" /> Configurar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
