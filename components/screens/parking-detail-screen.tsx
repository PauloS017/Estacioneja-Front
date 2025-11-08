"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Car, Bike, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ParkingDetailScreenProps {
  parkingId: number | null
  onNavigate: (
    screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history" | "parking-history",
  ) => void
  onParkingHistory: (parkingId: number) => void
}

const parkingData: Record<number, any> = {
  1: {
    id: 1,
    name: "(Naviraí) IFMS - Instituto Federal de Mato Grosso do Sul",
    address: "R. Hilda, 203 - Naviraí, MS",
    description: "Instituto Federal com estacionamento seguro e bem localizado no centro da cidade.",
    images: ["/parking-lot-1.jpg", "/parking-facility-1.jpg", "/vehicle-parking-1.jpg"],
    status: "Moderado",
    totalSpots: 200,
    occupiedSpots: 155,
    availableSpots: 45,
    carSpots: 35,
    bikeSpots: 10,
    occupancy: 78,
  },
  2: {
    id: 2,
    name: "(001 - Sede) COPASUL - Cooperativa",
    address: "R. Hilda, 203 - Naviraí, MS",
    description: "Cooperativa com área ampla para estacionamento de veículos.",
    images: ["/parking-lot-2.jpg", "/parking-facility-2.jpg", "/vehicle-parking-2.jpg"],
    status: "Quase Cheio",
    totalSpots: 80,
    occupiedSpots: 68,
    availableSpots: 12,
    carSpots: 8,
    bikeSpots: 4,
    occupancy: 85,
  },
  3: {
    id: 3,
    name: "(015 - Fiação) COPASUL - Cooperativa",
    address: "R. Hilda, 203 - Naviraí, MS",
    description: "Estacionamento com lotação completa no momento.",
    images: ["/parking-lot-3.jpg", "/parking-facility-3.jpg", "/vehicle-parking-3.jpg"],
    status: "Lotado",
    totalSpots: 150,
    occupiedSpots: 150,
    availableSpots: 0,
    carSpots: 0,
    bikeSpots: 0,
    occupancy: 100,
  },
}

function getStatusColor(occupancy: number): string {
  if (occupancy > 75) return "bg-red-100 text-red-800 border border-red-300"
  if (occupancy > 50) return "bg-orange-100 text-orange-800 border border-orange-300"
  return "bg-emerald-100 text-emerald-800 border border-emerald-300"
}

function getStatusLabel(occupancy: number): string {
  if (occupancy > 75) return "Quase Lotado"
  if (occupancy > 50) return "Moderado"
  return "Leve"
}

export default function ParkingDetailScreen({ parkingId, onNavigate, onParkingHistory }: ParkingDetailScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const parking = parkingId ? parkingData[parkingId] : parkingData[1]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % parking.images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [parking.images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % parking.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + parking.images.length) % parking.images.length)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </button>

      {/* Image Carousel */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-8 aspect-video flex items-center justify-center group">
        <img
          src={parking.images[currentImageIndex] || "/placeholder.svg?height=400&width=800&query=parking lot"}
          alt={`${parking.name} - Imagem ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {parking.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {parking.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Parking Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{parking.name}</h1>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>{parking.address}</span>
        </div>
        <p className="text-gray-700 leading-relaxed">{parking.description}</p>
      </div>

      {/* Status and Availability Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${getStatusColor(parking.occupancy)}`}>
          <p className="text-sm font-medium opacity-75 mb-2">Status de Ocupação</p>
          <p className="text-2xl font-bold">{getStatusLabel(parking.occupancy)}</p>
          <div className="mt-4 bg-black/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                parking.occupancy > 75 ? "bg-red-600" : parking.occupancy > 50 ? "bg-orange-600" : "bg-emerald-600"
              }`}
              style={{ width: `${parking.occupancy}%` }}
            />
          </div>
          <p className="text-xs opacity-75 mt-2">{parking.occupancy}% ocupado</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
          <p className="text-sm font-medium text-emerald-700 mb-4">Vagas Disponíveis</p>
          <p className="text-4xl font-bold text-emerald-600 mb-1">{parking.availableSpots}</p>
          <p className="text-xs text-emerald-600">de {parking.totalSpots} vagas</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Total de Vagas</p>
          <p className="text-2xl font-bold text-gray-900">{parking.totalSpots}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Vagas Ocupadas</p>
          <p className="text-2xl font-bold text-gray-900">{parking.occupiedSpots}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
          <Car className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-gray-600 text-sm font-medium">Carros</p>
            <p className="text-2xl font-bold text-gray-900">{parking.carSpots}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
          <Bike className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-gray-600 text-sm font-medium">Motos</p>
            <p className="text-2xl font-bold text-gray-900">{parking.bikeSpots}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => onParkingHistory(parking.id)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6 flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Histórico
        </Button>
      </div>
    </main>
  )
}
