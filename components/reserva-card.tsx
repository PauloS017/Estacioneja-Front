"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Car, Clock, X } from "lucide-react"

interface Reserva {
  id: string
  estacionamento: string
  vaga: string
  dataHoraEntrada: string
  dataHoraSaida: string
  status: string
  tipo: string
}

interface ReservaCardProps {
  reserva: Reserva
  showActions?: boolean
  isAdmin?: boolean
  onCancel?: () => void
}

export function ReservaCard({ reserva, showActions = false, isAdmin = false, onCancel }: ReservaCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-100 text-green-800"
      case "concluida":
        return "bg-blue-100 text-blue-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return "bg-blue-100 text-blue-800"
      case "convidado":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativa":
        return "Ativa"
      case "concluida":
        return "Concluída"
      case "cancelada":
        return "Cancelada"
      default:
        return status
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "pcd":
        return "PCD"
      case "convidado":
        return "Convidado"
      case "normal":
        return "Normal"
      default:
        return tipo
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          {reserva.estacionamento}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          Vaga {reserva.vaga}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Entrada:</span>
            <span className="font-medium">{reserva.dataHoraEntrada}</span>
          </div>

          {reserva.dataHoraSaida && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Saída:</span>
              <span className="font-medium">{reserva.dataHoraSaida}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className={getStatusColor(reserva.status)}>{getStatusLabel(reserva.status)}</Badge>
              <Badge variant="outline" className={getTipoColor(reserva.tipo)}>
                {getTipoLabel(reserva.tipo)}
              </Badge>
            </div>
          </div>

          {showActions && reserva.status === "ativa" && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              {!isAdmin && (
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Clock className="h-4 w-4 mr-1" />
                  Detalhes
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
