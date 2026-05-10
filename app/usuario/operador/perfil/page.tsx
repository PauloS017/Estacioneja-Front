"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Shield } from "lucide-react"

import { formatCPF, formatPhone } from "@/lib/utils"
import { useUser, useUpdateUser, type Usuario } from "@/features/usuarios"
import { ProfilePhotoEditor } from "@/components/profile-photo-editor"

type FormState = {
  name: string
  email: string
  telefone: string
  cpf: string
}

export default function AdminProfilePage() {
  const { data: user } = useUser()
  const { mutateAsync: updateUser, isPending: isSaving } = useUpdateUser()

  const [formData, setFormData] = useState<FormState | null>(null)
  const [showSaveMessage, setShowSaveMessage] = useState(false)

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

  async function handleSaveProfileClick() {
    if (!user || !formData || !hasChanges || isSaving) return

    const payload: Partial<Usuario> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      cpf: formData.cpf.trim(),
    }

    try {
      await updateUser({ id: user.id, data: payload })
      setShowSaveMessage(true)
      setTimeout(() => setShowSaveMessage(false), 3000)
    } catch (error) {
      alert("Erro ao atualizar perfil administrativo.")
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full mb-16">
      <Link
        href="/usuario/operador"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil de Acesso</h1>
          <p className="text-sm text-muted-foreground">Configure suas informações pessoais do painel administrativo.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-8 max-w-2xl">
        {!formData ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 w-32 bg-muted rounded-full mx-auto" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-border">
              {user && (
                <ProfilePhotoEditor
                  userId={user.id}
                  temFotoPerfil={user.temFotoPerfil}
                  name={user.name}
                />
              )}
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full tracking-wider border border-primary/20">
                Conta Administrativa
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nome Completo</label>
                <input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">CPF</label>
                <input
                  value={formatCPF(formData.cpf) ?? ""}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Telefone</label>
                  <input
                    value={formatPhone(formData.telefone)}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(##) #####-####"
                    className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm"
                  />
                </div>
              </div>

              <div className="relative pt-6">
                <button
                  onClick={handleSaveProfileClick}
                  disabled={!hasChanges || isSaving}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:shadow-none"
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações do Perfil"}
                </button>

                {showSaveMessage && (
                  <div className="absolute inset-x-0 bottom-0 top-6 flex items-center justify-center bg-card/95 backdrop-blur-sm rounded-lg animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Check className="w-5 h-5" />
                      Perfil Atualizado com Sucesso
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
