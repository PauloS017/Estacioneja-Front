"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Swal from "sweetalert2"
import { saveCurrentUser } from "@/lib/storage"

const operators = [
    {
        email: "jose.antonio@estacioneja.com.br",
        password: "1234",
        name: "José Antonio",
    },
    {
        email: "maria.fernanda@estacioneja.com.br",
        password: "1234",
        name: "Maria Fernanda",
    },
]

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        const operator = operators.find((op) => op.email === email && op.password === password)

        if (operator) {
            saveCurrentUser({
                email: operator.email,
                name: operator.name,
                role: "operator",
            })
            onLogin()
        } else {
            Swal.fire({
                icon: "error",
                title: "Erro ao fazer login",
                text: "E-mail ou senha incorretos!",
            })
        }
    }

    const handleForgotPassword = () => {
        Swal.fire({
            icon: "info",
            title: "Esqueceu sua senha?",
            html: "Entre em contato com nosso time de desenvolvimento<br/><strong>estacionaja.dev@estacioneja.com.br</strong>",
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-3xl">EJ</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">EstacioneJá</h1>
                    <p className="text-gray-600 mt-2">Sistema de Controle de Acesso</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                            placeholder="seu.email@estacioneja.com.br"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Esqueci minha senha
                    </button>

                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}
