"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Car, Bike, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApiQuery } from "@/server/api/queries/apiQuery"
import { IEstacionamento } from "@/interfaces/iestacionamento"

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

export default function ParkingDetailPage() {
    const router = useRouter()
    const params = useParams()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const parkingId = params.id

    const { data: parking, isLoading, isError } = useApiQuery<IEstacionamento>({
        queryKey: ["estacionamento", String(parkingId)],
        endpoint: `/api/v1/estacionamentos/${parkingId}`,
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-gray-500 font-medium">Carregando detalhes...</p>
            </div>
        )
    }

    if (isError || !parking) {
        return (
            <main className="max-w-4xl mx-auto px-6 py-8">
                <Link href="/usuario/motorista" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6">
                    <ChevronLeft className="w-5 h-5" /> Voltar
                </Link>
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    O Sistema não encontrado ou erro ao carregar os dados.
                </div>
            </main>
        )
    }

    const enderecoBruto = parking.empresa.endereco
    const enderecoFormatado = `${enderecoBruto?.logradouro} - ${enderecoBruto?.bairro}, ${enderecoBruto?.cidade}-${enderecoBruto?.uf}`
    
    const ocupacao = Math.round(
        ((parking.capacidade - parking.capacidadeDisponivel) / parking.capacidade) * 100
    )

    // Fallback para imagens caso a API não retorne ou você queira usar as estáticas por enquanto
    const displayImages = ["/estacionamento1.jpg", "/parking-facility-2.jpg", "/estacionamento3.jpg"]

    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <Link
                href="/usuario/motorista"
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6"
            >
                <ChevronLeft className="w-5 h-5" />
                Voltar
            </Link>

            {/* Carrossel de Imagens */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-8 aspect-video flex items-center justify-center group">
                <img
                    src={displayImages[currentImageIndex]}
                    alt={`${parking.empresa.nome}`}
                    className="w-full h-full object-cover"
                />
                
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Informações Principais */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{parking.empresa.nome}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <span>{enderecoFormatado}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{parking.descricao || "Sem descrição disponível."}</p>
            </div>

            {/* Grid de Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-lg ${getStatusColor(ocupacao)}`}>
                    <p className="text-sm font-medium opacity-75 mb-2">Status de Ocupação</p>
                    <p className="text-2xl font-bold">{getStatusLabel(ocupacao)}</p>
                    <div className="mt-4 bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${
                                ocupacao > 75 ? "bg-red-600" : ocupacao > 50 ? "bg-orange-600" : "bg-emerald-600"
                            }`}
                            style={{ width: `${ocupacao}%` }}
                        />
                    </div>
                    <p className="text-xs opacity-75 mt-2">{ocupacao}% ocupado</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-700 mb-4">Vagas Disponíveis Agora</p>
                    <p className="text-4xl font-bold text-emerald-600 mb-1">{parking.capacidadeDisponivel}</p>
                    <p className="text-xs text-emerald-600">de {parking.capacidade} vagas totais</p>
                </div>
            </div>

            {/* Detalhes de Vagas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm font-medium mb-1">Capacidade</p>
                    <p className="text-2xl font-bold text-gray-900">{parking.capacidade}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm font-medium mb-1">Em uso</p>
                    <p className="text-2xl font-bold text-gray-900">{parking.capacidade - parking.capacidadeDisponivel}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Car className="w-8 h-8 text-blue-500" />
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Carros</p>
                        <p className="text-xl font-bold text-gray-900">{parking.capacidadeDisponivel}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Bike className="w-8 h-8 text-orange-500" />
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Motos</p>
                        <p className="text-xl font-bold text-gray-900">--</p>
                    </div>
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4">
                <Button
                    onClick={() => router.push(`/usuario/motorista/estacionamento/${parking.id}/historico`)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6 flex items-center justify-center gap-2"
                >
                    <Clock className="w-5 h-5" />
                    Ver Histórico de Ocupação
                </Button>
            </div>
        </main>
    )
}