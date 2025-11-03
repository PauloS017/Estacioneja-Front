"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { User, Calendar, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AccessRecord {
    name: string;
    plate: string;
    date: string;
    time: string;
    operator: string;
    status: 'authorized' | 'unauthorized';
}

const mockData: AccessRecord[] = [
    {
        name: 'João Silva Santos',
        plate: 'ABC-1234',
        date: '30/09/2025',
        time: '15:32:15',
        operator: 'José',
        status: 'authorized'
    },
    {
        name: 'Maria Oliveira Costa',
        plate: 'XEC-1234',
        date: '30/09/2025',
        time: '14:35:15',
        operator: 'José',
        status: 'authorized'
    },
    {
        name: 'Pedro Costa',
        plate: 'ABC-1234',
        date: '30/09/2025',
        time: '14:32:15',
        operator: 'José',
        status: 'authorized'
    },
    {
        name: 'Ana Paula Rodrigues',
        plate: 'ABC-1234',
        date: '30/09/2025',
        time: '13:32:15',
        operator: 'José',
        status: 'authorized'
    }
];


export default function HistoricoPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)


    const pathname = usePathname()

    const menuItems = [
        { icon: User, label: "Validação de credenciais", href: "/usuario/guarita" },
        { icon: Calendar, label: "Histórico de Acessos", href: "/usuario/guarita/historico" },
    ]
    return (
        <div>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="fixed top-[4.5rem] left-4 z-40 bg-white border border-gray-300 gap-2 px-4 shadow-sm hover:bg-gray-50"
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
            <div className="mx-28 pt-8">
                <h1 className="text-2xl font-bold mb-6 pt-8 ">Histórico de Acessos</h1>
                <Card className="p-6">
                    <div className="flex flex-col gap-4">
                        {mockData.map((record, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-base">{record.name}</h3>
                                        <div className="flex gap-6 mt-1">
                                            <p className="text-xs text-gray-600">{record.date}</p>
                                            <p className="text-xs text-gray-600">{record.time}</p>
                                            <p className="text-xs text-gray-600">Placa: {record.plate}</p>
                                            <p className="text-xs text-gray-600">Operador: {record.operator}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`${record.status === 'authorized'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {record.status === 'authorized' ? 'Autorizado' : 'Não Autorizado'}
                                    </Badge>
                                </div>
                                {index < mockData.length - 1 && <Separator />}
                            </React.Fragment>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}