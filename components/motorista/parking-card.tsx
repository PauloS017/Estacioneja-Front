"use client"

import { MapPin } from "lucide-react"

interface ParkingCardProps {
  id: number
  name: string
  address: string
  distance: number
  status: string
  statusColor: string
  availableSpots: number
  totalSpots: number
  occupancy: number
  carSpots: number
  bikeSpots: number
  isConnected?: boolean
}

export default function ParkingCard({
  name,
  address,
  distance,
  status,
  statusColor,
  availableSpots,
  totalSpots,
  occupancy,
  carSpots,
  bikeSpots,
}: ParkingCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Header with status */}
      <div className={`${statusColor} h-1`} />

      <div className="p-4">
        {/* Title and Location */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{name}</h3>

        <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
          <MapPin className="w-4 h-4" />
          <span>{address}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`${statusColor} text-white text-xs font-semibold px-2 py-1 rounded`}>{status}</span>
          <span className="text-gray-600 text-xs">📍 {distance} km</span>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                occupancy < 70 ? "bg-green-500" : occupancy < 85 ? "bg-yellow-400" : "bg-red-500"
              }`}
              style={{ width: `${occupancy}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Ocupação: {occupancy}%</p>
        </div>

        {/* Spots Information */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Vagas Disponíveis</p>
            <p className="text-2xl font-bold text-green-600">{availableSpots}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 text-right">Total</p>
            <p className="text-2xl font-bold text-gray-900 text-right">{totalSpots}</p>
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="flex justify-around pt-2">
          <div className="text-center">
            <span className="text-2xl">🚗</span>
            <p className="text-xs font-semibold text-gray-900">{carSpots}</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">🏍️</span>
            <p className="text-xs font-semibold text-gray-900">{bikeSpots}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
