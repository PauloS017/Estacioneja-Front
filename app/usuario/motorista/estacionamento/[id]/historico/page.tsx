"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, Clock, LogOut, LogIn, ArrowLeft } from "lucide-react"

// 1. DEFINIÇÃO DA INTERFACE (Resolve o erro 'any[]')
// Precisamos dizer ao TypeScript como é a estrutura de um item do histórico
interface HistoryEntry {
    id: number;
    parkingName: string;
    type: "entry" | "exit";
    date: string;
    time: string;
    duration: string | null;
}

// 2. DADOS ESTÁTICOS COM A TIPAGEM CORRETA
// Aplicamos a interface ao nosso array
const allHistoryData: HistoryEntry[] = [
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
    // ... (etc.)
]

// 3. FUNÇÃO 'getParkingName' CORRIGIDA (Resolve o erro 'string | void')
// Garantimos que ela SEMPRE retorna uma string (nunca 'void' ou 'undefined')
const getParkingName = (id: number): string => {
    const parkingMap: Record<number, string> = {
        1: "(Naviraí) IFMS - Instituto Federal",
        2: "(001 - Sede) COPASUL - Cooperativa",
        3: "(015 - Fiação) COPASUL - Cooperativa",
    }
    return parkingMap[id] || ""; // O '|| ""' garante que sempre retorne uma string
}


export default function ParkingHistoryPage() {
    const params = useParams()
    const parkingId = params.id ? Number(params.id) : null

    // Agora o TypeScript sabe que 'allHistoryData' é 'HistoryEntry[]',
    // então 'historyData' também será 'HistoryEntry[]' (sem erro de 'any[]')
    const historyData = parkingId
        ? allHistoryData.filter((entry) => entry.parkingName === getParkingName(parkingId))
        : allHistoryData

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <Link
                href={`/usuario/motorista/estacionamento/${parkingId}`}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
            >
                <ArrowLeft className="w-5 h-5" />
                Voltar
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {/* Agora 'getParkingName' sempre retorna string, 
                  o que é um 'ReactNode' válido (sem erro de 'void')
                */}
                Histórico de: {parkingId ? getParkingName(parkingId) : "Histórico"}
            </h1>

            <div className="space-y-4">
                {historyData.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
                        {/* ... (Resto do seu JSX para mostrar o histórico) ... */}
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${entry.type === "entry" ? "bg-emerald-100" : "bg-red-100"}`}>
                                {entry.type === "entry" ? (
                                    <LogIn className={`w-6 h-6 ${entry.type === "entry" ? "text-emerald-600" : "text-red-600"}`} />
                                ) : (
                                    <LogOut className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{entry.parkingName}</h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === "entry" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
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