"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { BackToHome } from "@/components/ui/back-to-home"
import { SiteFooter } from "@/components/site-footer"
import { signIn } from "next-auth/react"
import { User, ShieldCheck, Mail, Lock, Phone, Fingerprint } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  formatCPF,
  formatPhone,
  onlyDigits,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils"

interface ValidationError {
  field: string
  message: string
}

const MIN_PASSWORD_LENGTH = 8

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    tipoUsuario: "COMUM",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  function validate(): ValidationError[] {
    const v: ValidationError[] = []

    if (formData.name.trim().length < 3) {
      v.push({ field: "name", message: "Informe o nome completo." })
    }
    if (!isValidCPF(formData.cpf)) {
      v.push({ field: "cpf", message: "CPF inválido." })
    }
    if (!isValidPhone(formData.telefone)) {
      v.push({ field: "telefone", message: "Telefone inválido. Use DDD + número." })
    }
    if (!isValidEmail(formData.email)) {
      v.push({ field: "email", message: "E-mail inválido." })
    }
    if (formData.senha.length < MIN_PASSWORD_LENGTH) {
      v.push({ field: "senha", message: `A senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.` })
    }
    if (formData.senha !== formData.confirmarSenha) {
      v.push({ field: "confirmarSenha", message: "As senhas não conferem." })
    }

    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    const clientErrors = validate()
    if (clientErrors.length > 0) {
      setErrors(clientErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name.trim(),
        cpf: onlyDigits(formData.cpf),
        tipoUsuario: formData.tipoUsuario,
        telefone: onlyDigits(formData.telefone),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
      }

      const response = await api.post("/api/v1/auth/register", payload)

      if (response.status === 201) {
        const result = await signIn("credentials", {
          email: payload.email,
          password: payload.senha,
          redirect: false,
        })

        if (result?.ok) {
          router.push("/")
          router.refresh()
        } else {
          router.push("/login?registered=true")
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response?.status === 400) {
        const backendErrors = axiosError.response.data as ValidationError[]
        setErrors(backendErrors)
      } else if (axiosError.response?.status === 409) {
        const conflict = axiosError.response.data as { message: string }
        setErrors([{ field: "email", message: conflict.message }])
      } else {
        setErrors([{ field: "geral", message: "Erro interno no servidor. Tente mais tarde." }])
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (fieldName: string) =>
    errors.find((e) => e.field === fieldName)?.message

  const inputClassName = (fieldName: string) =>
    `w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background transition-all ${
      getFieldError(fieldName) ? "border-destructive bg-destructive/10" : "border-input"
    }`

  const fieldError = (fieldName: string) =>
    getFieldError(fieldName) ? (
      <span className="text-[10px] text-destructive font-bold ml-1">{getFieldError(fieldName)}</span>
    ) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex flex-col">
      <BackToHome />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border p-8 w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-auto mb-2">
            <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-full w-auto object-contain dark:hidden" />
            <img src="/logodarkmode.svg" alt="EstacioneJá" className="h-full w-auto object-contain hidden dark:block" />
          </div>
          <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Crie sua conta agora</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex gap-4 p-1 bg-muted rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoUsuario: "COMUM" })}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                formData.tipoUsuario === "COMUM" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User size={16} /> COMUM
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoUsuario: "ADMINISTRATIVO" })}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                formData.tipoUsuario === "ADMINISTRATIVO" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck size={16} /> ADMINISTRADOR
            </button>
          </div>

          {getFieldError("geral") && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm rounded-lg p-3">
              {getFieldError("geral")}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative md:col-span-2">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Nome Completo"
                autoComplete="name"
                className={inputClassName("name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {fieldError("name")}
            </div>

            <div className="relative">
              <Fingerprint className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                inputMode="numeric"
                placeholder="CPF"
                autoComplete="off"
                maxLength={14}
                className={inputClassName("cpf")}
                value={formatCPF(formData.cpf) ?? ""}
                onChange={(e) => setFormData({ ...formData, cpf: onlyDigits(e.target.value) })}
              />
              {fieldError("cpf")}
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="tel"
                inputMode="tel"
                placeholder="Telefone"
                autoComplete="tel"
                maxLength={15}
                className={inputClassName("telefone")}
                value={formatPhone(formData.telefone)}
                onChange={(e) => setFormData({ ...formData, telefone: onlyDigits(e.target.value) })}
              />
              {fieldError("telefone")}
            </div>

            <div className="relative md:col-span-2">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                className={inputClassName("email")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {fieldError("email")}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Senha"
                autoComplete="new-password"
                className={inputClassName("senha")}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
              {fieldError("senha")}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirmar"
                autoComplete="new-password"
                className={inputClassName("confirmarSenha")}
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              />
              {fieldError("confirmarSenha")}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold shadow-md mt-4 transition-all"
          >
            {loading ? <Spinner /> : "Cadastrando conta"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Já possui conta? <a href="/login" className="text-primary font-bold hover:underline">Faça login</a>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
