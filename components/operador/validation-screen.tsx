"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Header from "./header"
import VisitorModal from "./visitor-modal"
import { Search } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import md5 from "md5"
import {
    saveAccessRecords,
    loadAccessRecords,
    loadCurrentUser,
    getNextEntryType,
    addNotification,
    type AccessRecord,
} from "@/lib/storage"
import Swal from "sweetalert2"

const operatorsDatabase = [
    {
        name: "João Silva Santos",
        plate: "ABC-1234",
        vehicle: "Toyota Supra Mk5",
        phone: "(67) 99999-1234",
        email: "joao.silva@example.com",
        status: "active" as const,
    },
    {
        name: "Maria Oliveira Costa",
        plate: "XEC-1234",
        vehicle: "Honda Civic",
        phone: "(67) 98888-5678",
        email: "maria.oliveira@example.com",
        status: "active" as const,
    },
    {
        name: "Pedro Costa",
        plate: "PED-5678",
        vehicle: "Volkswagen Gol",
        phone: "(67) 97777-9012",
        email: "pedro.costa@example.com",
        status: "active" as const,
    },
    {
        name: "Ana Paula Rodrigues",
        plate: "ANA-9012",
        vehicle: "Fiat Uno",
        phone: "(67) 96666-3456",
        email: "ana.paula@example.com",
        status: "blocked" as const,
        blockReason: "Usuário não faz mais parte da instituição!",
    },
    {
        name: "Carlos Santos",
        plate: "DEF-5678",
        vehicle: "Chevrolet Onix",
        phone: "(67) 95555-7890",
        email: "carlos.santos@example.com",
        status: "active" as const,
    },
    {
        name: "Juliana Ferreira",
        plate: "GHI-9012",
        vehicle: "Hyundai HB20",
        phone: "(67) 94444-1234",
        email: "juliana.ferreira@example.com",
        status: "active" as const,
    },
]

function getGravatarUrl(email: string, size = 128): string {
    const trimmedEmail = email.toLowerCase().trim()
    const hash = md5(trimmedEmail)
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

export default function ValidationScreen({ onAccessRecorded, accessRecords, onLogout }: any) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedOperator, setSelectedOperator] = useState<any | null>(null)
    const [searchState, setSearchState] = useState<"idle" | "found" | "notfound">("idle")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const getAllOperators = () => {
        const records = loadAccessRecords()
        const visitors = records
            .filter((record) => record.tag === "Visitante")
            .map((record) => ({
                name: record.name,
                plate: record.plate,
                vehicle: record.vehicle,
                phone: record.phone,
                email: record.email,
                status: "active" as const,
            }))

        // Remove duplicates by plate
        const visitorMap = new Map(visitors.map((v) => [v.plate, v]))
        const uniqueVisitors = Array.from(visitorMap.values())

        return [...operatorsDatabase, ...uniqueVisitors]
    }

    const allOperators = getAllOperators()
    const uniquePlates = Array.from(new Set(allOperators.map((op) => op.plate)))
    const filteredSuggestions = uniquePlates.filter((plate) => plate.toLowerCase().includes(searchQuery.toLowerCase()))

    const handlePlateSelect = (plate: string) => {
        setSearchQuery(plate)
        setShowSuggestions(false)
        setSelectedOperator(null)
        setSearchState("idle")
    }

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSelectedOperator(null)
            setSearchState("idle")
            setShowSuggestions(false)
            return
        }

        const query = searchQuery.toLowerCase()
        const found = allOperators.find(
            (op) => op.plate.toLowerCase().includes(query) || op.name.toLowerCase().includes(query),
        )

        if (found) {
            setSelectedOperator(found)
            setSearchState("found")

            if (found.status === "blocked") {
                Swal.fire({
                    icon: "error",
                    title: "Acesso Negado",
                    text: found.blockReason || "Este veículo está bloqueado!",
                    footer: '<a href="#">Por que tenho este problema?</a>',
                })
            } else {
                Swal.fire({
                    title: "Verificado!",
                    icon: "success",
                    draggable: true,
                })
            }
        } else {
            setSelectedOperator(null)
            setSearchState("notfound")

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Veículo não cadastrado!",
                footer: '<a href="#">Por que tenho este problema?</a>',
            })
        }
        setShowSuggestions(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleAccessAction = () => {
        if (!selectedOperator) return

        if (selectedOperator.status === "blocked") {
            Swal.fire({
                icon: "error",
                title: "Acesso Negado",
                text: selectedOperator.blockReason || "Este veículo está bloqueado e não pode acessar!",
            })

            const nameParts = selectedOperator.name.split(" ")
            const firstName = nameParts[0]
            const lastName = nameParts[nameParts.length - 1]
            addNotification(`${firstName} ${lastName} - Usuário Bloqueado`)

            return
        }

        const now = new Date()
        const date = now.toLocaleDateString("pt-BR")
        const time = now.toLocaleTimeString("pt-BR")

        const currentUser = loadCurrentUser()

        const entryType = getNextEntryType(selectedOperator.plate)

        const newRecord: AccessRecord = {
            id: Date.now(),
            name: selectedOperator.name,
            plate: selectedOperator.plate,
            email: selectedOperator.email,
            vehicle: selectedOperator.vehicle,
            phone: selectedOperator.phone,
            date,
            time,
            operator: currentUser?.name || "Operador",
            status: "authorized",
            entryType,
        }

        const existingRecords = loadAccessRecords()
        const updatedRecords = [...existingRecords, newRecord]
        saveAccessRecords(updatedRecords)
        onAccessRecorded(updatedRecords)

        const nameParts = selectedOperator.name.split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts[nameParts.length - 1]
        addNotification(`${firstName} ${lastName} - Usuário Autorizado`)

        setSearchQuery("")
        setSelectedOperator(null)
        setSearchState("idle")
        inputRef.current?.focus()
    }

    return (
        <div className="flex flex-col h-full">
            <Header onLogout={onLogout} />

            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-lg p-12">
                    <div className="flex justify-center mb-8">
                        {selectedOperator ? (
                            <Avatar className="w-32 h-32">
                                <AvatarImage
                                    src={getGravatarUrl(selectedOperator.email) || "/placeholder.svg"}
                                    alt={selectedOperator.name}
                                    className="w-full h-full object-cover"
                                />
                                <AvatarFallback className="w-full h-full text-2xl bg-emerald-100 text-emerald-700">
                                    {selectedOperator.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-gray-500 text-5xl font-light">👤</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-8 h-24 flex items-center justify-center">
                        {searchState === "idle" ? (
                            <p className="text-lg text-gray-500 font-medium">Digite uma placa</p>
                        ) : searchState === "found" && selectedOperator ? (
                            <>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOperator.name}</h2>
                                    <p className="text-sm text-gray-600 mb-1">{selectedOperator.plate}</p>
                                    <p className="text-sm text-gray-600 mb-2">{selectedOperator.vehicle}</p>
                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <span>📞</span>
                                        {selectedOperator.phone}
                                    </p>
                                    {selectedOperator.status === "blocked" && (
                                        <div className="mt-2">
                                            <p className="text-sm text-red-600 font-bold">⚠️ BLOQUEADO</p>
                                            <p className="text-xs text-red-500 mt-1">{selectedOperator.blockReason}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : searchState === "notfound" ? (
                            <p className="text-lg text-red-500 font-semibold">Operador não encontrado</p>
                        ) : null}
                    </div>

                    <div className="flex gap-3 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar por placa ou nome..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setShowSuggestions(true)
                                }}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500"
                            />

                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {filteredSuggestions.map((plate) => (
                                        <button
                                            key={plate}
                                            onClick={() => handlePlateSelect(plate)}
                                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 transition-colors text-gray-900 border-b border-gray-100 last:border-b-0"
                                        >
                                            {plate}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Buscar
                        </button>
                    </div>

                    <div className="flex justify-end">
                        {searchState === "found" && selectedOperator?.status !== "blocked" ? (
                            <button
                                onClick={handleAccessAction}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                            >
                                Abrir/Fechar
                            </button>
                        ) : searchState === "notfound" ? (
                            <button
                                onClick={() => setIsVisitorModalOpen(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                            >
                                Liberar Visitante
                            </button>
                        ) : (
                            <button disabled className="bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-lg cursor-not-allowed">
                                Abrir/Fechar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <VisitorModal
                isOpen={isVisitorModalOpen}
                onClose={() => setIsVisitorModalOpen(false)}
                onVisitorAdded={onAccessRecorded}
                currentOperator={loadCurrentUser()?.name || "Operador"}
                initialPlate={searchQuery}
            />
        </div>
    )
}
