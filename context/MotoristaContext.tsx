"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
// REMOVIDO: useRouter

// --- 1. DEFINIÇÃO DE TIPOS ---
interface Vehicle {
    id: number
    plate: string
    model: string
    color: string
    type: "car" | "bike"
    isPrincipal: boolean
}
interface Parking {
    id: number
    name: string
    address: string
    distance: number
    status: string
    statusColor: string
    availableSpots: number
    totalSpots: number
    occupancy: number
    carSpots: number
    bikeSpots: number
    isConnected?: boolean
    category?: "connected" | "public"
}
interface UserProfile {
    name: string
    email: string
    cpf: string
    phone: string
    address: string
    avatar: number
}
interface Notification {
    id: number
    message: string
    timestamp: string
    read: boolean
}

// --- 2. INTERFACE DO CONTEXTO (Simplificada) ---
interface IMotoristaContext {
    // REMOVIDO: isLoggedIn, login, logout
    userProfile: UserProfile
    vehicles: Vehicle[]
    notifications: Notification[]
    connectedParkings: Parking[]
    publicParkings: Parking[]
    handleSaveProfile: (profile: UserProfile) => void
    handleAddVehicle: (vehicle: Vehicle) => void
    handleSetPrimaryVehicle: (vehicleId: number) => void
    handleDeleteVehicle: (vehicleId: number) => void
    handleChangeAvatar: () => void
    handleConnectParking: (parkingId: number) => void
    handleDisconnectParking: (parkingId: number) => void
    addNotification: (message: string) => void
    markNotificationAsRead: (id: number) => void
    dismissNotification: (id: number) => void
}

const MotoristaContext = createContext<IMotoristaContext | null>(null)

// --- 3. O PROVEDOR (Simplificado) ---
export function MotoristaProvider({ children }: { children: ReactNode }) {
    // REMOVIDO: useRouter, isLoggedIn, setIsLoggedIn, login, logout

    // --- ESTADO DOS DADOS (Completo) ---
    const [userProfile, setUserProfile] = useState({
        name: "Larissa Nagoia",
        email: "larissa.nagoia@gmail.com.br",
        cpf: "123.456.789-00",
        phone: "(67) 98765-4321",
        address: "Rua Exemplo, 123 - Naviraí/MS",
        avatar: 1,
    })

    const [vehicles, setVehicles] = useState<Vehicle[]>([
        { id: 1, plate: "ABC-123", model: "Honda Civic", color: "Preto", type: "car", isPrincipal: true },
        { id: 2, plate: "ABD-143", model: "Honda CG 160", color: "Vermelha", type: "bike", isPrincipal: false },
        { id: 3, plate: "XYZ-157", model: "Honda CG 160", color: "Preto", type: "bike", isPrincipal: false },
    ])

    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, message: "Bem vindo ao EstacioneJá, aproveite o software!", timestamp: "Agora", read: false },
    ])

    const [connectedParkings, setConnectedParkings] = useState<Parking[]>([
        { id: 1, name: "(Naviraí) IFMS - Instituto Federal...", address: "R. Hilda, 203", distance: 2.5, status: "Moderado", statusColor: "bg-orange-400", availableSpots: 45, totalSpots: 200, occupancy: 78, carSpots: 35, bikeSpots: 10, category: "connected" },
        { id: 2, name: "(001 - Sede) COPASUL - Coope...", address: "R. Hilda, 203", distance: 5.5, status: "Quase Cheio", statusColor: "bg-yellow-400", availableSpots: 12, totalSpots: 80, occupancy: 85, carSpots: 8, bikeSpots: 4, category: "connected" },
        { id: 3, name: "(015 - Fiação) COPASUL - Coope...", address: "R. Hilda, 203", distance: 3.0, status: "Lotado", statusColor: "bg-red-500", availableSpots: 0, totalSpots: 150, occupancy: 100, carSpots: 0, bikeSpots: 0, category: "connected" },
        { id: 4, name: "UEMS - Universidade Est...", address: "R. Hilda, 203", distance: 2.0, status: "Moderado", statusColor: "bg-orange-400", availableSpots: 30, totalSpots: 120, occupancy: 75, carSpots: 20, bikeSpots: 10, category: "connected" },
    ])

    const [publicParkings, setPublicParkings] = useState<Parking[]>([
        { id: 5, name: "Shopping Avenida Ce...", address: "R. Hilda, 203", distance: 122.5, status: "Moderado", statusColor: "bg-orange-400", availableSpots: 45, totalSpots: 200, occupancy: 78, carSpots: 35, bikeSpots: 10, isConnected: false, category: "public" },
        { id: 6, name: "Mercado - Fogo Atac...", address: "R. Hilda, 203", distance: 2.5, status: "Quase Cheio", statusColor: "bg-yellow-400", availableSpots: 12, totalSpots: 80, occupancy: 85, carSpots: 8, bikeSpots: 4, isConnected: false, category: "public" },
        { id: 7, name: "IFMS Campus Navirai", address: "R. Hilda, 203", distance: 2.5, status: "Lotado", statusColor: "bg-red-500", availableSpots: 0, totalSpots: 150, occupancy: 100, carSpots: 0, bikeSpots: 0, isConnected: false, category: "public" },
    ])


    // --- FUNÇÕES (AÇÕES) (Completas) ---

    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: Date.now(),
            message,
            timestamp: "Agora",
            read: false
        }
        setNotifications(prev => [newNotification, ...prev])
    }

    const markNotificationAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        )
    }

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const handleSaveProfile = (updatedProfile: any) => {
        setUserProfile(updatedProfile)
        addNotification("Alteração foi realizada com sucesso")
    }

    const handleSetPrimaryVehicle = (vehicleId: number) => {
        setVehicles(v => v.map(vehicle => ({ ...vehicle, isPrincipal: vehicle.id === vehicleId })))
    }

    const handleDeleteVehicle = (vehicleId: number) => {
        setVehicles(v => v.filter(vehicle => vehicle.id !== vehicleId))
        addNotification("Veículo deletado com sucesso")
    }

    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicles(v => [...v, newVehicle])
        addNotification("Novo Veículo Adicionado com sucesso")
    }

    const handleChangeAvatar = () => {
        setUserProfile(prev => ({
            ...prev,
            avatar: (prev.avatar % 5) + 1,
        }))
    }

    const handleConnectParking = (parkingId: number) => {
        const parking = publicParkings.find((p) => p.id === parkingId)
        if (parking) {
            const { isConnected, ...parkingWithoutFlag } = parking
            setConnectedParkings(prev => [...prev, parkingWithoutFlag])
            setPublicParkings(prev => prev.filter((p) => p.id !== parkingId))
            addNotification("Estacionamento conectado com sucesso!")
        }
    }

    const handleDisconnectParking = (parkingId: number) => {
        const parking = connectedParkings.find((p) => p.id === parkingId && p.category === "public")
        if (parking) {
            const { category, ...parkingWithoutCategory } = parking
            setPublicParkings(prev => [...prev, { ...parkingWithoutCategory, isConnected: false, category: "public" }])
            setConnectedParkings(prev => prev.filter((p) => p.id !== parkingId))
            addNotification("Estacionamento desconectado com sucesso!")
        }
    }


    // --- 5. O VALOR FORNECIDO ---
    const value = {
        // REMOVIDO: isLoggedIn, login, logout
        userProfile,
        vehicles,
        notifications,
        connectedParkings,
        publicParkings,
        handleSaveProfile,
        handleAddVehicle,
        handleSetPrimaryVehicle,
        handleDeleteVehicle,
        handleChangeAvatar,
        handleConnectParking,
        handleDisconnectParking,
        addNotification,
        markNotificationAsRead,
        dismissNotification
    }

    return (
        <MotoristaContext.Provider value={value}>
            {children}
        </MotoristaContext.Provider>
    )
}

// --- 6. O HOOK DE ACESSO ---
export function useMotorista() {
    const context = useContext(MotoristaContext)
    if (!context) {
        throw new Error("useMotorista deve ser usado dentro de um MotoristaProvider")
    }
    return context
}