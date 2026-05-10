"use client"

import { CheckCircle2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { getGravatarUrl } from "@/lib/utils"
import { loadAccessRecords, type AccessRecord } from "@/lib/legacy/access-records"

function groupRecordsByDate(records: AccessRecord[]) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayStr = today.toLocaleDateString("pt-BR")
    const yesterdayStr = yesterday.toLocaleDateString("pt-BR")

    const groups: Record<string, AccessRecord[]> = {}

    records.forEach((record) => {
        const label = record.date === todayStr ? "Hoje" : record.date === yesterdayStr ? "Ontem" : record.date
        groups[label] ??= []
        groups[label].push(record)
    })

    return groups
}

export default function HistoryPage() {
    const router = useRouter()
    const accessRecords = loadAccessRecords()

    const handleRecordClick = (recordId: number) => {
        router.push(`/usuario/operador/${recordId}`)
    }

    const groupedRecords = groupRecordsByDate(accessRecords)
    const sortedGroups = Object.entries(groupedRecords).sort((a, b) => {
        if (a[0] === "Hoje") return -1
        if (b[0] === "Hoje") return 1
        if (a[0] === "Ontem") return -1
        if (b[0] === "Ontem") return 1
        const [dayA, monthA, yearA] = a[0].split("/").map(Number)
        const [dayB, monthB, yearB] = b[0].split("/").map(Number)
        return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime()
    })

    return (
        <div className="flex-1 flex flex-col p-8 bg-background overflow-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Histórico de Acessos</h2>

            <div className="space-y-8">
                {accessRecords.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <p className="text-lg font-medium">Nenhum acesso registrado</p>
                    </div>
                ) : (
                    sortedGroups.map(([dateLabel, records]) => (
                        <div key={dateLabel}>
                            <h3 className="text-xl font-bold text-foreground mb-4">{dateLabel}:</h3>
                            <div className="space-y-4">
                                {records.map((record) => (
                                    <div
                                        key={record.id}
                                        onClick={() => handleRecordClick(record.id)}
                                        className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30"
                                    >
                                        <div className="flex-shrink-0">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage
                                                    src={getGravatarUrl(record.email) || "/placeholder.svg"}
                                                    alt={record.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {record.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {record.status === "authorized" ? (
                                                <CheckCircle2 className="w-8 h-8 text-primary" />
                                            ) : (
                                                <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    ✕
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-foreground">{record.name}</h3>
                                                        {record.tag === "Visitante" && (
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                                                Visitante
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {record.plate} • {record.date} • {record.time}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">{record.operator}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {record.status === "authorized" ? (
                                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                                                    Autorizado
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full border border-destructive/20">
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
    )
}