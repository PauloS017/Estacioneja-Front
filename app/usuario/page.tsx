import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authoptions"
import { redirect } from "next/navigation"

export default async function UsuarioGateway() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.tipoUsuario === "ADMINISTRATIVO") {
    redirect("/usuario/operador")
  }

  redirect("/usuario/motorista")
}
