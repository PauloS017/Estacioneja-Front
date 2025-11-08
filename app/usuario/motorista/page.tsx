"use client"

import { useState } from "react"
import Header from "@/components/motorista/header"
import HomeScreen from "@/components/screens/home-screen"
import ConfigScreen from "@/components/screens/config-screen"
import RegisterVehicleScreen from "@/components/screens/register-vehicle-screen"
import ParkingDetailScreen from "@/components/screens/parking-detail-screen"
import HistoryScreen from "@/components/screens/history-screen"
import LoginScreen from "@/components/screens/login-screen"

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

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [currentScreen, setCurrentScreen] = useState<
        "home" | "config" | "register-vehicle" | "parking-detail" | "history" | "parking-history"
    >("home")
    const [selectedParkingId, setSelectedParkingId] = useState<number | null>(null)

    const [userProfile, setUserProfile] = useState({
        name: "Larissa Nagoia",
        email: "larissa.nagoia@gmail.com.br",
        cpf: "123.456.789-00",
        phone: "(67) 98765-4321",
        address: "Rua Exemplo, 123 - Naviraí/MS",
        avatar: 1,
    })

    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            id: 1,
            plate: "ABC-123",
            model: "Honda Civic",
            color: "Preto",
            type: "car",
            isPrincipal: true,
        },
        {
            id: 2,
            plate: "ABD-143",
            model: "Honda CG 160",
            color: "Vermelha",
            type: "bike",
            isPrincipal: false,
        },
        {
            id: 3,
            plate: "XYZ-157",
            model: "Honda CG 160",
            color: "Preto",
            type: "bike",
            isPrincipal: false,
        },
    ])

    const [notifications, setNotifications] = useState<any[]>([
        {
            id: 1,
            message: "Bem vindo ao EstacioneJá, aproveite o software!",
            timestamp: "Agora",
            read: false,
        },
    ])

    const [connectedParkings, setConnectedParkings] = useState<Parking[]>([
        {
            id: 1,
            name: "(Naviraí) IFMS - Instituto Federal...",
            address: "R. Hilda, 203",
            distance: 2.5,
            status: "Moderado",
            statusColor: "bg-orange-400",
            availableSpots: 45,
            totalSpots: 200,
            occupancy: 78,
            carSpots: 35,
            bikeSpots: 10,
            category: "connected",
        },
        {
            id: 2,
            name: "(001 - Sede) COPASUL - Coope...",
            address: "R. Hilda, 203",
            distance: 5.5,
            status: "Quase Cheio",
            statusColor: "bg-yellow-400",
            availableSpots: 12,
            totalSpots: 80,
            occupancy: 85,
            carSpots: 8,
            bikeSpots: 4,
            category: "connected",
        },
        {
            id: 3,
            name: "(015 - Fiação) COPASUL - Coope...",
            address: "R. Hilda, 203",
            distance: 3.0,
            status: "Lotado",
            statusColor: "bg-red-500",
            availableSpots: 0,
            totalSpots: 150,
            occupancy: 100,
            carSpots: 0,
            bikeSpots: 0,
            category: "connected",
        },
        {
            id: 4,
            name: "UEMS - Universidade Est...",
            address: "R. Hilda, 203",
            distance: 2.0,
            status: "Moderado",
            statusColor: "bg-orange-400",
            availableSpots: 30,
            totalSpots: 120,
            occupancy: 75,
            carSpots: 20,
            bikeSpots: 10,
            category: "connected",
        },
    ])

    const [publicParkings, setPublicParkings] = useState<Parking[]>([
        {
            id: 5,
            name: "Shopping Avenida Ce...",
            address: "R. Hilda, 203",
            distance: 122.5,
            status: "Moderado",
            statusColor: "bg-orange-400",
            availableSpots: 45,
            totalSpots: 200,
            occupancy: 78,
            carSpots: 35,
            bikeSpots: 10,
            isConnected: false,
            category: "public",
        },
        {
            id: 6,
            name: "Mercado - Fogo Atac...",
            address: "R. Hilda, 203",
            distance: 2.5,
            status: "Quase Cheio",
            statusColor: "bg-yellow-400",
            availableSpots: 12,
            totalSpots: 80,
            occupancy: 85,
            carSpots: 8,
            bikeSpots: 4,
            isConnected: false,
            category: "public",
        },
        {
            id: 7,
            name: "IFMS Campus Navirai",
            address: "R. Hilda, 203",
            distance: 2.5,
            status: "Lotado",
            statusColor: "bg-red-500",
            availableSpots: 0,
            totalSpots: 150,
            occupancy: 100,
            carSpots: 0,
            bikeSpots: 0,
            isConnected: false,
            category: "public",
        },
    ])

    const handleLogout = () => {
        setIsLoggedIn(false)
        setCurrentScreen("home")
    }

    const handleNavigate = (
        screen: "home" | "config" | "register-vehicle" | "parking-detail" | "history" | "parking-history",
    ) => {
        setCurrentScreen(screen)
    }

    const handleSelectParking = (parkingId: number) => {
        setSelectedParkingId(parkingId)
        setCurrentScreen("parking-detail")
    }

    const handleParkingHistory = (parkingId: number) => {
        setSelectedParkingId(parkingId)
        setCurrentScreen("parking-history")
    }

    const handleConnectParking = (parkingId: number) => {
        const parking = publicParkings.find((p) => p.id === parkingId)
        if (parking) {
            const { isConnected, ...parkingWithoutFlag } = parking
            setConnectedParkings([...connectedParkings, parkingWithoutFlag])
            setPublicParkings(publicParkings.filter((p) => p.id !== parkingId))
            addNotification("Estacionamento conectado com sucesso!")
        }
    }

    const handleDisconnectParking = (parkingId: number) => {
        const parking = connectedParkings.find((p) => p.id === parkingId && p.category === "public")
        if (parking) {
            const { category, ...parkingWithoutCategory } = parking
            setPublicParkings([...publicParkings, { ...parkingWithoutCategory, isConnected: false, category: "public" }])
            setConnectedParkings(connectedParkings.filter((p) => p.id !== parkingId))
            addNotification("Estacionamento desconectado com sucesso!")
        }
    }

    const handleSaveProfile = (updatedProfile: any) => {
        setUserProfile(updatedProfile)
        addNotification("Alteração foi realizada com sucesso")
    }

    const handleSetPrimaryVehicle = (vehicleId: number) => {
        setVehicles(
            vehicles.map((v) => ({
                ...v,
                isPrincipal: v.id === vehicleId,
            })),
        )
    }

    const handleDeleteVehicle = (vehicleId: number) => {
        setVehicles(vehicles.filter((v) => v.id !== vehicleId))
        addNotification("Veículo deletado com sucesso")
    }

    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicles([...vehicles, newVehicle])
        addNotification("Novo Veículo Adicionado com sucesso")
    }

    const handleChangeAvatar = () => {
        setUserProfile({
            ...userProfile,
            avatar: (userProfile.avatar % 5) + 1,
        })
    }

    const addNotification = (message: string) => {
        const newNotification = {
            id: Date.now(),
            message,
            timestamp: "Agora",
            read: false,
        }
        setNotifications([newNotification, ...notifications])
    }

    if (!isLoggedIn) {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} />
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case "home":
                return (
                    <HomeScreen
                        onNavigate={handleNavigate}
                        onSelectParking={handleSelectParking}
                        connectedParkings={connectedParkings}
                        publicParkings={publicParkings}
                        onConnectParking={handleConnectParking}
                        onDisconnectParking={handleDisconnectParking}
                        userProfile={userProfile}
                        vehicles={vehicles}
                    />
                )
            case "config":
                return (
                    <ConfigScreen
                        onNavigate={handleNavigate}
                        userProfile={userProfile}
                        vehicles={vehicles}
                        onSaveProfile={handleSaveProfile}
                        onSetPrimaryVehicle={handleSetPrimaryVehicle}
                        onDeleteVehicle={handleDeleteVehicle}
                        onChangeAvatar={handleChangeAvatar}
                    />
                )
            case "register-vehicle":
                return <RegisterVehicleScreen onNavigate={handleNavigate} onAddVehicle={handleAddVehicle} />
            case "parking-detail":
                return (
                    <ParkingDetailScreen
                        parkingId={selectedParkingId}
                        onNavigate={handleNavigate}
                        onParkingHistory={handleParkingHistory}
                    />
                )
            case "history":
                return <HistoryScreen onNavigate={handleNavigate} />
            case "parking-history":
                return <HistoryScreen onNavigate={handleNavigate} parkingId={selectedParkingId} isParkingSpecific />
            default:
                return (
                    <HomeScreen
                        onNavigate={handleNavigate}
                        onSelectParking={handleSelectParking}
                        connectedParkings={connectedParkings}
                        publicParkings={publicParkings}
                        onConnectParking={handleConnectParking}
                        onDisconnectParking={handleDisconnectParking}
                        userProfile={userProfile}
                        vehicles={vehicles}
                    />
                )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                notifications={notifications}
                userProfile={userProfile}
            />
            {renderScreen()}
        </div>
    )
}
