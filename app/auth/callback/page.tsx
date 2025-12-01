"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    localStorage.setItem("jwt", token!)

    router.push("/usuario/motorista")
  }, [])

  return <p>Redirecionando...</p>
}
