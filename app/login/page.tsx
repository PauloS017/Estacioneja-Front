"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input" // 1. NÃO PRECISAMOS MAIS DESTE COMPONENTE
import { useMotorista } from "@/context/MotoristaContext"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useMotorista()
    const [email, setEmail] = useState("larissa.nagoia@gmail.com.br")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const success = login(email, password)
        if (success) {
            router.push("/usuario/motorista")
        } else {
            setError("E-mail ou senha inválidos.")
        }
    }

    // Estilo que vamos aplicar (fundo branco, borda cinza, texto preto, foco verde)
    const inputClassName = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-white"

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="text-4xl font-bold mb-2">
                        <span className="text-emerald-600">Estacione</span>
                        <span className="text-yellow-500">Já</span>
                    </div>
                    <p className="text-gray-600 text-sm">SUA VAGA GARANTIDA</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                        {/* 2. SUBSTITUÍDO <Input /> por <input /> */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClassName} // 3. Aplicando nosso estilo
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Senha</label>
                        {/* 2. SUBSTITUÍDO <Input /> por <input /> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClassName} // 3. Aplicando nosso estilo
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                        Entrar
                    </Button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Não tem conta?{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Cadastre-se
                    </a>
                </p>
            </div>
        </div>
    )
}