"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/utils/api/http/get/user"


export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")

      localStorage.setItem("jwt", token!)

      const user = await getUser(token);

      if (user?.tipoUsuario === "COMUM") {
        router.push("/usuario/motorista");
      } else {
        router.push("/usuario/operador");
      }
    }

    run();
  }, [])


  return <p>Redirecionando...</p>
}
