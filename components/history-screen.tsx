"use client"

import Header from "./header"
import { CheckCircle2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import md5 from "md5"
import { useRouter } from "next/navigation"
import type { AccessRecord } from "@/lib/storage"

function getGravatarUrl(email: string, size = 32): string {
    const trimmedEmail = email.toLowerCase().trim()
    const hash = md5(trimmedEmail)
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

function groupRecordsByDate(records: AccessRecord[]) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayStr = today.toLocaleDateString("pt-BR")
    const yesterdayStr = yesterday.toLocaleDateString("pt-BR")

    const groups: { [key: string]: AccessRecord[] } = {}

    records.forEach((record) => {
        if (record.date === todayStr) {
            if (!groups["Hoje"]) groups["Hoje"] = []
            groups["Hoje"].push(record)
        } else if (record.date === yesterdayStr) {
            if (!groups["Ontem"]) groups["Ontem"] = []
            groups["Ontem"].push(record)
        } else {
            if (!groups[record.date]) groups[record.date] = []
            groups[record.date].push(record)
        }
    })

    return groups
}

export default function HistoryScreen({
    accessRecords = [],
    onLogout,
}: { accessRecords: AccessRecord[]; onLogout?: () => void }) {
    const router = useRouter()

    const handleRecordClick = (recordId: number) => {
        router.push(`/usuario/operador/${recordId}`)
    }

    const groupedRecords = groupRecordsByDate(accessRecords)
    const sortedGroups = Object.entries(groupedRecords).sort((a, b) => {
        if (a[0] === "Hoje") return -1
        if (b[0] === "Hoje") return 1
        if (a[0] === "Ontem") return -1
        if (b[0] === "Ontem") return 1
        return 0
    })

    return (
        <div className="flex flex-col h-full">
            <Header onLogout={onLogout} />

            <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Histórico de Acessos</h2>

                <div className="space-y-8">
                    {accessRecords.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            <p className="text-lg font-medium">Nenhum acesso registrado hoje</p>
                        </div>
                    ) : (
                        sortedGroups.map(([dateLabel, records]) => (
                            <div key={dateLabel}>
                                <h3 className="text-xl font-bold text-gray-700 mb-4">{dateLabel}:</h3>
                                <div className="space-y-4">
                                    {records.map((record) => (
                                        <div
                                            key={record.id}
                                            onClick={() => handleRecordClick(record.id)}
                                            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <div className="flex-shrink-0">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage
                                                        src={getGravatarUrl(record.email) || "/placeholder.svg"}
                                                        alt={record.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                        {record.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {record.status === "authorized" ? (
                                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        ✕
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-gray-900">{record.name}</h3>
                                                            {record.tag === "Visitante" && (
                                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                                                    Visitante
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            {record.plate} • {record.date} • {record.time}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-600">{record.operator}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {record.status === "authorized" ? (
                                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                                                        Autorizado
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                                        Negado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
