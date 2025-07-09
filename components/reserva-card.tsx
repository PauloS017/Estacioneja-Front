"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

interface ReservaProps {
  id: string
  estacionamento: string
  vaga: string
  dataHoraEntrada: string
  dataHoraSaida: string
  status: string
  tipo: string
  veiculo?: string
}

interface ReservaCardProps {
  reserva: ReservaProps
  showActions?: boolean
  isAdmin?: boolean
  onCheckIn?: (id: string) => void
  onCheckOut?: (id: string) => void
}

export function ReservaCard({
  reserva,
  showActions = false,
  isAdmin = false,
  onCheckIn,
  onCheckOut,
}: ReservaCardProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "concluída":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "cancelada":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "convidado":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{reserva.estacionamento}</CardTitle>
          <Badge className={getBadgeVariant(reserva.status)} variant="outline">
            {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            Vaga {reserva.vaga}{" "}
            <Badge className={getTipoBadgeVariant(reserva.tipo)} variant="outline">
              {reserva.tipo === "pcd" ? "PCD" : reserva.tipo.charAt(0).toUpperCase() + reserva.tipo.slice(1)}
            </Badge>
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="grid grid-cols-2 gap-2 text-sm w-full">
            <div>
              <span className="text-muted-foreground">Entrada:</span>
              <p>{reserva.dataHoraEntrada}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Saída:</span>
              <p>{reserva.dataHoraSaida}</p>
            </div>
          </div>
        </div>
        {isAdmin && reserva.veiculo && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Veículo:</span>
              <p>{reserva.veiculo}</p>
            </div>
          </div>
        )}
      </CardContent>
      {showActions && reserva.status === "ativa" && (
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => onCheckIn && onCheckIn(reserva.id)}
          >
            Check-in
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            onClick={() => onCheckOut && onCheckOut(reserva.id)}
          >
            Check-out
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
