/**
 * Legacy in-browser store for visitor access records.
 *
 * The operador "histórico" and visitor pages still consume this mock store
 * because the backend endpoints for visitor access have not been built yet.
 * Migrate consumers to the registros API once the backend is ready, then
 * delete this file.
 */
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

const STORAGE_KEY = "access_records"

export function loadAccessRecords(): AccessRecord[] {
  if (typeof window === "undefined") return []
  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveAccessRecords(records: AccessRecord[]): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function getRecordById(id: number): AccessRecord | null {
  return loadAccessRecords().find((record) => record.id === id) ?? null
}

export function getRecordsByPlate(plate: string): AccessRecord[] {
  return loadAccessRecords()
    .filter((record) => record.plate === plate)
    .sort((a, b) => b.id - a.id)
}
