import { getUser } from "@/utils/api/http/get/user"

export interface Operator {
  name: string
  plate: string
  vehicle: string
  phone: string
  email: string
  status?: "active" | "blocked"
  blockReason?: string
}

export interface AccessRecord {
  id: number
  name: string
  plate: string
  email: string
  vehicle: string
  phone: string
  date: string
  time: string
  operator: string
  status: "authorized" | "denied"
  tag?: "Visitante"
  entryType?: "Entrada" | "Saída"
}

export interface AuthUser {
  id: string
  name: string
  email: string
  cpf: string | null
  tipoUsuario: "COMUM" | "ADMINISTRATIVO"
}

const STORAGE_KEY = "access_records"
const AUTH_KEY = "jwt"
const NOTIFICATIONS_KEY = "notifications"

export function saveAccessRecords(records: AccessRecord[]): void {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }
}

export function loadAccessRecords(): AccessRecord[] {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export function getRecordById(id: number): AccessRecord | null {
  const records = loadAccessRecords()
  return records.find((record) => record.id === id) || null
}

export function getRecordsByPlate(plate: string): AccessRecord[] {
  const records = loadAccessRecords()
  return records.filter((record) => record.plate === plate).sort((a, b) => b.id - a.id)
}

export function saveCurrentUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user))
  }
}

export async function loadCurrentUser() {
  if (typeof window !== "undefined") {
    const token: string | null = localStorage.getItem('jwt');

    return await getUser(token);
  }
  return null
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    sessionStorage.removeItem(AUTH_KEY)
  }
}

export function getLastEntryType(plate: string): "Entrada" | "Saída" | null {
  const records = loadAccessRecords()
  const plateRecords = records.filter((record) => record.plate === plate && record.status === "authorized")

  if (plateRecords.length === 0) return null

  const lastRecord = plateRecords[plateRecords.length - 1]
  return lastRecord.entryType || null
}

export function getNextEntryType(plate: string): "Entrada" | "Saída" {
  const lastType = getLastEntryType(plate)

  if (!lastType || lastType === "Saída") {
    return "Entrada"
  }
  return "Saída"
}

export interface Notification {
  id: number
  message: string
  time: string
  read: boolean
}

export function saveNotifications(notifications: Notification[]): void {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    sessionStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  }
}

export function loadNotifications(): Notification[] {
  if (typeof window !== "undefined") {
    // ALTERADO: de localStorage para sessionStorage
    const stored = sessionStorage.getItem(NOTIFICATIONS_KEY)
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            message: "Bem vindo ao EstacioneJá, aproveite o software!",
            time: "Agora",
            read: false,
          },
        ]
  }
  return []
}

export function addNotification(message: string): void {
  const notifications = loadNotifications()
  const newNotification: Notification = {
    id: Date.now(),
    message,
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    read: false,
  }
  saveNotifications([newNotification, ...notifications])
}