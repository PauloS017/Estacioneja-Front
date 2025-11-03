"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, Calendar, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"

export default function OperadorPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const pathname = usePathname()

    const motoristaData = {
        nome: "João Silva Santos",
        placa: "ABC-1234",
        veiculo: "Toyota Supra Mk5",
        telefone: "(67) 99999-1234",
    }

    const menuItems = [
        { icon: User, label: "Validação de credenciais", href: "/usuario/guarita" },
        { icon: Calendar, label: "Histórico de Acessos", href: "/usuario/guarita/historico" },
    ]

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="fixed top-18 left-4 z-40 bg-white border border-gray-300 gap-2 px-4 shadow-sm hover:bg-gray-50"
                    >
                        <Menu className="h-4 w-4" />
                        <span className="text-sm font-medium">Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetTitle>
                        <VisuallyHidden>Menu da Guarita</VisuallyHidden>
                    </SheetTitle>

                    <nav className="flex flex-col gap-1 p-4 pt-8">
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "justify-start gap-3 text-sm font-medium",
                                    pathname === item.href
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            <main className="flex-1 p-4 md:p-8 pl-28">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-24 h-24 rounded-full bg-gray-400 mb-4" />
                        <h2 className="text-lg font-semibold text-foreground mb-1">{motoristaData.nome}</h2>
                        <p className="text-sm text-muted-foreground mb-1">{motoristaData.placa}</p>
                        <p className="text-sm text-muted-foreground mb-2">{motoristaData.veiculo}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{motoristaData.telefone}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Buscar por placa ou nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="outline" className="px-6 bg-transparent">
                            Buscar
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white px-8">Abrir/Fechar</Button>
                    </div>
                </div>
            </main>
        </div>
    )
}