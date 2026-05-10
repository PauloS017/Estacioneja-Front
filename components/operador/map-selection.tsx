"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import L from "leaflet"

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
})

interface MapSelectionProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

function LocationMarker({ onLocationSelect, initialLat, initialLng }: MapSelectionProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
  )

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  )
}

export default function MapSelection({ onLocationSelect, initialLat, initialLng }: MapSelectionProps) {
  const defaultCenter: L.LatLngExpression = initialLat && initialLng
    ? [initialLat, initialLng]
    : [-23.550520, -46.633308] // São Paulo as fallback

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0 relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      </MapContainer>
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 text-xs text-center rounded-lg shadow font-medium text-gray-700 z-[400] pointer-events-none">
        Clique no mapa para marcar a localização exata do seu estacionamento.
      </div>
    </div>
  )
}
