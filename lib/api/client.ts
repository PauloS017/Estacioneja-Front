import axios from "axios"
import { getSession, signOut } from "next-auth/react"

// No SSR (dentro do container Next) "localhost:8080" aponta pro próprio container,
// não pro backend. Usa INTERNAL_API_URL quando estiver no servidor; no browser
// continua usando a URL pública.
const baseURL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  const token = session?.user?.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let isSigningOut = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== "undefined" && !isSigningOut) {
        isSigningOut = true
        await signOut({ callbackUrl: "/login?expired=true", redirect: true })
      }
    }
    return Promise.reject(error)
  }
)

