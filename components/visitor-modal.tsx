"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Swal from "sweetalert2"
import { saveAccessRecords, loadAccessRecords, addNotification, type AccessRecord } from "@/lib/storage"

interface VisitorModalProps {
    isOpen: boolean
    onClose: () => void
    onVisitorAdded: (records: AccessRecord[]) => void
    currentOperator: string
    initialPlate?: string
}

export default function VisitorModal({
    isOpen,
    onClose,
    onVisitorAdded,
    currentOperator,
    initialPlate = "",
}: VisitorModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        plate: "",
        vehicle: "",
        email: "",
        phone: "",
    })

    useEffect(() => {
        if (isOpen && initialPlate) {
            setFormData((prev) => ({ ...prev, plate: initialPlate.toUpperCase() }))
        }
    }, [isOpen, initialPlate])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email && !formData.phone) {
            Swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Por favor, forneça pelo menos um meio de comunicação (e-mail ou telefone).",
            })
            return
        }

        const now = new Date()
        const date = now.toLocaleDateString("pt-BR")
        const time = now.toLocaleTimeString("pt-BR")

        const newRecord: AccessRecord = {
            id: Date.now(),
            name: formData.name,
            plate: formData.plate,
            email: formData.email || "Não informado",
            vehicle: formData.vehicle,
            phone: formData.phone || "Não informado",
            date,
            time,
            operator: currentOperator,
            status: "authorized",
            tag: "Visitante",
            entryType: "Entrada",
        }

        const existingRecords = loadAccessRecords()
        const updatedRecords = [...existingRecords, newRecord]
        saveAccessRecords(updatedRecords)
        onVisitorAdded(updatedRecords)

        const nameParts = formData.name.split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts[nameParts.length - 1]
        addNotification(`${firstName} ${lastName} - Usuário Autorizado`)

        Swal.fire({
            icon: "success",
            title: "Visitante Liberado!",
            text: `${formData.name} foi cadastrado e autorizado.`,
            timer: 2000,
        })

        setFormData({ name: "", plate: "", vehicle: "", email: "", phone: "" })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Liberar Visitante</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="Nome completo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Placa do Veículo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.plate}
                            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="ABC-1234"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Veículo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="Marca e modelo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail {!formData.phone && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required={!formData.phone}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone {!formData.email && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required={!formData.email}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="(67) 99999-9999"
                        />
                    </div>

                    <p className="text-xs text-gray-500 italic">* Pelo menos um meio de comunicação é obrigatório</p>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            Liberar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
