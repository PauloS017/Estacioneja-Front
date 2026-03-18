"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface Notification {
  id: number
  message: string
  timestamp: string
  read: boolean
}

interface IMotoristaContext {
  notifications: Notification[]
  addNotification: (message: string) => void
  markNotificationAsRead: (id: number) => void
  dismissNotification: (id: number) => void
}

const MotoristaContext = createContext<IMotoristaContext | null>(null)

export function MotoristaProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      timestamp: "Agora",
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <MotoristaContext.Provider
      value={{
        notifications,
        addNotification,
        markNotificationAsRead,
        dismissNotification,
      }}
    >
      {children}
    </MotoristaContext.Provider>
  )
}

export function useMotorista() {
  const context = useContext(MotoristaContext)
  if (!context) {
    throw new Error("useMotorista deve ser usado dentro de um MotoristaProvider")
  }
  return context
}