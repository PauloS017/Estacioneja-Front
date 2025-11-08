"use client"

import { Calendar, Clock, LogOut, LogIn, ArrowLeft } from "lucide-react"

interface HistoryScreenProps {
  onNavigate: (
    screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history" | "parking-history",
  ) => void
  parkingId?: number | null
  isParkingSpecific?: boolean
}

const allHistoryData = [
  {
    id: 1,
    parkingName: "(Naviraí) IFMS - Instituto Federal",
    type: "entry",
    date: "25 de Novembro, 2024",
    time: "08:30",
    duration: null,
  },
  {
    id: 2,
    parkingName: "(Naviraí) IFMS - Instituto Federal",
    type: "exit",
    date: "25 de Novembro, 2024",
    time: "10:45",
    duration: "2h 15min",
  },
  {
    id: 3,
    parkingName: "(001 - Sede) COPASUL - Cooperativa",
    type: "entry",
    date: "24 de Novembro, 2024",
    time: "14:20",
    duration: null,
  },
  {
    id: 4,
    parkingName: "(001 - Sede) COPASUL - Cooperativa",
    type: "exit",
    date: "24 de Novembro, 2024",
    time: "15:50",
    duration: "1h 30min",
  },
  {
    id: 5,
    parkingName: "(015 - Fiação) COPASUL - Cooperativa",
    type: "entry",
    date: "23 de Novembro, 2024",
    time: "09:10",
    duration: null,
  },
  {
    id: 6,
    parkingName: "(015 - Fiação) COPASUL - Cooperativa",
    type: "exit",
    date: "23 de Novembro, 2024",
    time: "12:55",
    duration: "3h 45min",
  },
]

export default function HistoryScreen({ onNavigate, parkingId, isParkingSpecific }: HistoryScreenProps) {
  const getParkingName = (id: number) => {
    const parkingMap: Record<number, string> = {
      1: "(Naviraí) IFMS - Instituto Federal",
      2: "(001 - Sede) COPASUL - Cooperativa",
      3: "(015 - Fiação) COPASUL - Cooperativa",
    }
    return parkingMap[id] || ""
  }

  const historyData = isParkingSpecific
    ? allHistoryData.filter((entry) => entry.parkingName === getParkingName(parkingId || 0))
    : allHistoryData

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {isParkingSpecific && (
        <button
          onClick={() => onNavigate("parking-detail")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Histórico de Entrada e Saída</h1>

      <div className="space-y-4">
        {historyData.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${entry.type === "entry" ? "bg-emerald-100" : "bg-red-100"}`}>
                {entry.type === "entry" ? (
                  <LogIn className={`w-6 h-6 ${entry.type === "entry" ? "text-emerald-600" : "text-red-600"}`} />
                ) : (
                  <LogOut className={`w-6 h-6 ${entry.type === "entry" ? "text-emerald-600" : "text-red-600"}`} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{entry.parkingName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.type === "entry" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {entry.type === "entry" ? "Entrada" : "Saída"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{entry.time}</span>
                  </div>
                  {entry.type === "exit" && entry.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Permanência: {entry.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
