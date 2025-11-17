"use client"

import { Menu, User, Calendar } from "lucide-react"
// 1. REMOVIDO o 'useState'
import Link from "next/link"
import { usePathname } from "next/navigation"

// 2. DEFINA AS PROPS QUE O COMPONENTE VAI RECEBER
interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// 3. RECEBA AS PROPS
export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()

    // 4. REMOVIDO o useState local
    // const [isOpen, setIsOpen] = useState(true)

    const menuItems = [
        {
            id: "validation",
            label: "Validação de credenciais",
            icon: User,
            href: "/usuario/operador/validacao"
        },
        {
            id: "history",
            label: "Histórico de Acessos",
            icon: Calendar,
            href: "/usuario/operador/historico"
        },
    ]

    return (
        // 5. ATUALIZADO O CONTAINER <aside>
        // Adicionado 'fixed', 'inset-y-0', 'left-0', 'z-10'
        // A largura é controlada pela prop 'isOpen'
        <aside
            className={`
              fixed inset-y-0 left-0 z-10 bg-white border-r border-gray-200 
              transition-all duration-300
              ${isOpen ? "w-72" : "w-20"}
            `}
        >
            <div className="p-4 border-b border-gray-200">
                {/* 6. O 'onClick' agora usa a prop 'setIsOpen' */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-800" />
                </button>
            </div>

            <nav className="pt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${isActive
                                ? "bg-gray-100 text-gray-900 border-l-4 border-emerald-500"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {/* 7. O 'span' é renderizado baseado na prop 'isOpen' */}
                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}