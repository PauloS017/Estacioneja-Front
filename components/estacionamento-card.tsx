import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building2, Car, Users, ShipWheelIcon as Wheelchair, Settings, Eye } from "lucide-react"

interface Estacionamento {
  id: string
  nome: string
  capacidade: number
  vagasOcupadas: number
  vagasDisponiveis: number
  vagasPCD: number
  vagasConvidados: number
}

interface EstacionamentoCardProps {
  estacionamento: Estacionamento
}

export function EstacionamentoCard({ estacionamento }: EstacionamentoCardProps) {
  const ocupacaoPercentual = Math.round((estacionamento.vagasOcupadas / estacionamento.capacidade) * 100)

  const getOcupacaoColor = (percentual: number) => {
    if (percentual >= 90) return "text-red-600"
    if (percentual >= 70) return "text-amber-600"
    return "text-green-600"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {estacionamento.nome}
        </CardTitle>
        <CardDescription>Capacidade total: {estacionamento.capacidade} vagas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ocupação</span>
              <span className={`font-medium ${getOcupacaoColor(ocupacaoPercentual)}`}>{ocupacaoPercentual}%</span>
            </div>
            <Progress value={ocupacaoPercentual} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{estacionamento.vagasOcupadas} ocupadas</span>
              <span>{estacionamento.vagasDisponiveis} disponíveis</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
              <Car className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{estacionamento.vagasDisponiveis}</p>
                <p className="text-green-600 text-xs">Disponíveis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50">
              <Car className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium text-red-800">{estacionamento.vagasOcupadas}</p>
                <p className="text-red-600 text-xs">Ocupadas</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1">
              <Wheelchair className="h-4 w-4 text-blue-600" />
              <span>
                PCD: <span className="font-medium">{estacionamento.vagasPCD}</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-600" />
              <span>
                Convidados: <span className="font-medium">{estacionamento.vagasConvidados}</span>
              </span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
