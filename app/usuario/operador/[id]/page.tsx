"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// import Header from "@/components/operador/header" // 1. REMOVIDO - O Layout cuida disso
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, ArrowLeft, Mail, Phone, Car } from "lucide-react"
import md5 from "md5"
// 2. Importamos as funções do "banco de dados" (localStorage)
import { getRecordById, getRecordsByPlate, type AccessRecord } from "@/lib/storage"

// 3. Copiamos a função 'getGravatarUrl'
function getGravatarUrl(email: string, size = 128): string {
    const trimmedEmail = email.toLowerCase().trim()
    const hash = md5(trimmedEmail)
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

export default function UserDetailPage() {
    const params = useParams() // Hook para ler a URL
    const router = useRouter() // Hook para navegar

    // O 'id' vem da URL (ex: .../operador/123)
    const recordId = Number(params.id)

    // Estados locais para guardar os dados
    const [currentRecord, setCurrentRecord] = useState<AccessRecord | null>(null)
    const [userAccessHistory, setUserAccessHistory] = useState<AccessRecord[]>([])

    useEffect(() => {
        // 4. Busca os dados quando a página carrega
        const record = getRecordById(recordId)
        if (record) {
            setCurrentRecord(record)
            // Busca o histórico SÓ desse usuário (pela placa)
            const history = getRecordsByPlate(record.plate)
            setUserAccessHistory(history)
        }
    }, [recordId]) // Roda de novo se o ID mudar

    // 5. Tela de "Não encontrado"
    if (!currentRecord) {
        return (
            // O <Header /> foi removido daqui
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuário não encontrado</h2>
                    <button
                        onClick={() => router.push("/usuario/operador/historico")} // Rota corrigida
                        className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Voltar ao histórico
                    </button>
                </div>
            </div>
        )
    }

    // 6. JSX Completo (sem o <Header>)
    return (
        <div className="flex-1 overflow-auto p-8">
            <button
                onClick={() => router.push("/usuario/operador/historico")} // Rota corrigida
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar ao histórico</span>
            </button>

            {/* Card de Perfil do Usuário */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={getGravatarUrl(currentRecord.email) || "/placeholder.svg"}
                            alt={currentRecord.name}
                            className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="w-full h-full text-3xl bg-emerald-100 text-emerald-700">
                            {currentRecord.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentRecord.name}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Placa</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentRecord.plate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Veículo</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentRecord.vehicle}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentRecord.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Telefone</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentRecord.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Histórico de Acesso */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Acessos</h2>

                <div className="space-y-4">
                    {userAccessHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-gray-500 font-medium">Nenhum acesso registrado</p>
                        </div>
                    ) : (
                        userAccessHistory.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                            >
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {record.date} às {record.time}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">Operador: {record.operator}</p>
                                        </div>
                                        <div>
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
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}