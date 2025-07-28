"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function AlterarSenhaPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast({
                title: "Erro ao alterar senha",
                description: "A nova senha e a confirmação não coincidem.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        // Simulação de alteração de senha
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Senha alterada com sucesso!",
                description: "Sua senha foi atualizada.",
            })
            router.push("/motorista/configuracoes") // Redireciona de volta para a página de perfil
        }, 1500)
    }

    return (
        <div className="w-full bg-gradient-to-b from-primary/10 to-background">
            <div className="container flex items-center justify-center py-10 md:py-20">
                <Card className="w-full max-w-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Alterar Senha</CardTitle>
                        <CardDescription>Preencha os campos abaixo para atualizar sua senha</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Senha Atual</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    placeholder="Sua senha atual"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Senha</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Sua nova senha"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                                <Input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    placeholder="Confirme sua nova senha"
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => router.back()} type="button">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Alterando..." : "Alterar Senha"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
