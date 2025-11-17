"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import Swal from 'sweetalert2'
import { GoogleIcon } from "@/components/ui/google-icon"

export default function LoginPage() {
    const router = useRouter()
    const { login, loginWithGoogle } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const loggedInUser = login(email, password)
        handleAuthResponse(loggedInUser)
    }

    const handleGoogleLogin = () => {
        setError(null)
        const loggedInUser = loginWithGoogle();
        handleAuthResponse(loggedInUser);
    }

    const handleAuthResponse = (loggedInUser: any) => { // 'any' por causa do 'AuthUser'
        if (loggedInUser) {
            if (loggedInUser.role === "motorista") {
                router.push("/usuario/motorista")
            } else if (loggedInUser.role === "operator") {
                router.push("/usuario/operador/validacao")
            } else {
                router.push("/")
            }
        } else {
            setError("Falha na autenticação.")
            Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível fazer login." })
        }
    }

    const inputClassName = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

                {/* --- CORREÇÃO AQUI --- */}
                {/* Este é o seu logo, que eu havia removido por engano. */}
                <div className="mb-8 text-center">
                    <div className="text-4xl font-bold mb-2">
                        <span className="text-emerald-600">Estacione</span>
                        <span className="text-yellow-500">Já</span>
                    </div>
                    <p className="text-gray-600 text-sm">SUA VAGA GARANTIDA</p>
                </div>



                {/* Formulário de Email/Senha */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClassName}
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClassName}
                            placeholder="••••••••"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
                        Entrar
                    </Button>
                    <div className="flex items-center my-3">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">OU</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <Button
                        className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        onClick={handleGoogleLogin}
                    >
                        <GoogleIcon className="mr-2" />
                        Entrar com o Google
                    </Button>



                </form>

            </div>
        </div>
    )
}