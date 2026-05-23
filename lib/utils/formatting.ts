export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}

export function formatCPF(value?: string): string | undefined {
  if (!value) return

  const cleaned = onlyDigits(value).slice(0, 11)
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

export function formatPhone(value: string): string {
  const cleaned = onlyDigits(value).slice(0, 11)
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calcCheck = (sliceEnd: number) => {
    let sum = 0
    for (let i = 0; i < sliceEnd; i++) {
      sum += parseInt(cpf[i], 10) * (sliceEnd + 1 - i)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return calcCheck(9) === parseInt(cpf[9], 10) && calcCheck(10) === parseInt(cpf[10], 10)
}

export function isValidEmail(value: string): boolean {
  // Aceita o formato local@dominio.tld — suficiente pra UI; validação real é no backend.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value)
  // Fixo (10 dígitos) ou celular (11, com 9 inicial após o DDD).
  if (digits.length === 10) return true
  if (digits.length === 11 && digits[2] === "9") return true
  return false
}
export function formatLicensePlate(value: string): string {
  // Normalize and limit to 7 characters
  const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 7)
  
  if (cleaned.length <= 3) return cleaned
  
  // Rule for old format: AAA-1234 (3 letters + 4 numbers)
  const isOldPlate = cleaned.length >= 4 && /^[A-Z]{3}[0-9]/.test(cleaned)
  
  if (isOldPlate) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }
  
  return cleaned
}
