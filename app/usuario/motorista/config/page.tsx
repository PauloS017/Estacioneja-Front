"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Loader2, UserCircle2 } from "lucide-react"

import { formatCPF, formatPhone, defaultAlert, onlyDigits } from "@/lib/utils"
import { useUser, useUpdateUser, type Usuario } from "@/features/usuarios"
import { ProfilePhotoEditor } from "@/components/profile-photo-editor"

type FormState = {
  name: string
  email: string
  telefone: string
  cpf: string
}

export default function ConfigPage() {
  const { data: user } = useUser()
  const { mutateAsync: updateUser, isPending: isSaving } = useUpdateUser()

  const [formData, setFormData] = useState<FormState | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (user && !formData) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        telefone: user.telefone ?? "",
        cpf: user.cpf ?? "",
      })
    }
  }, [user, formData])

  function handleInputChange<K extends keyof FormState>(field: K, value: string) {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const hasChanges = useMemo(() => {
    if (!user || !formData) return false
    return (
      formData.name !== (user.name ?? "") ||
      formData.email !== (user.email ?? "") ||
      formData.telefone !== (user.telefone ?? "") ||
      formData.cpf !== (user.cpf ?? "")
    )
  }, [user, formData])

  async function handleSave() {
    if (!user || !formData || !hasChanges || isSaving) return

    const payload: Partial<Usuario> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      cpf: formData.cpf.trim(),
    }

    try {
      await updateUser({ id: user.id, data: payload })
      defaultAlert.success({ title: "Perfil atualizado com sucesso" })
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2500)
    } catch {
      defaultAlert.error({
        title: "Não foi possível atualizar",
        text: "Verifique os dados e tente novamente.",
      })
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link
        href="/usuario/motorista"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
            <UserCircle2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Configurações do perfil
            </h1>
            <p className="text-sm text-muted-foreground">
              Atualize seus dados pessoais e foto
            </p>
          </div>
        </div>
      </header>

      <section className="bg-card border border-border rounded-xl overflow-hidden">
        {!formData ? (
          <div className="p-6 sm:p-8">
            <SkeletonProfile />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 px-6 sm:px-8 py-6 sm:py-8 bg-muted/30 border-b border-border">
              {user && (
                <ProfilePhotoEditor
                  userId={user.id}
                  temFotoPerfil={user.temFotoPerfil}
                  name={user.name}
                />
              )}
              <p className="text-xs text-muted-foreground">
                Clique na foto para atualizar
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <Input
                label="Nome completo"
                value={formData.name}
                onChange={(v) => handleInputChange("name", v)}
              />
              <Input
                label="CPF"
                value={formatCPF(formData.cpf) ?? ""}
                onChange={(v) => handleInputChange("cpf", onlyDigits(v))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleInputChange("email", v)}
                />
                <Input
                  label="Telefone"
                  value={formatPhone(formData.telefone)}
                  onChange={(v) => handleInputChange("telefone", onlyDigits(v))}
                  placeholder="(##) #####-####"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="
                    w-full inline-flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-md text-sm font-semibold
                    bg-primary text-primary-foreground
                    hover:bg-primary/90
                    enabled:cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : justSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Salvo
                    </>
                  ) : hasChanges ? (
                    "Salvar alterações"
                  ) : (
                    "Nenhuma alteração pendente"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function SkeletonProfile() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 w-24 bg-muted rounded-full mx-auto" />
      <div className="h-10 bg-muted rounded" />
      <div className="h-10 bg-muted rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}

type InputProps = {
  label: string
  value: string
  onChange?: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
}

function Input({ label, value, onChange, type = "text", placeholder, disabled }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full px-3 py-2
          bg-background text-foreground
          border border-border rounded-md
          text-sm
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          placeholder:text-muted-foreground
          disabled:bg-muted disabled:opacity-70 disabled:cursor-not-allowed
          transition
        "
      />
    </div>
  )
}
