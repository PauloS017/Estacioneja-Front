"use client"

import { Calendar, Clock, LogOut, LogIn } from "lucide-react"

// Não precisamos de 'onNavigate' ou 'parkingId'
// Esta é a página de histórico GERAL

// Dados estáticos (Tópico 1 - a ser refatorado com API no futuro)
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
    // ... (etc.)
]

export default function HistoryPage() {

    // 1. Como esta é a página de histórico geral, não filtramos os dados.
    const historyData = allHistoryData

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            {/* 2. Não precisamos do botão "Voltar" aqui, pois o Header
               já tem a navegação principal (Home / Histórico)
            */}

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
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === "entry" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {entry.type === "entry" ? "Entrada" : "Saída"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {/* ... (JSX do histórico) ... */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}