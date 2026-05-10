"use client"

import { cn } from "@/lib/utils"
import { useEmpresaBanner } from "@/features/empresas"

interface EmpresaLogoProps {
  empresaId: string
  empresaNome: string
  className?: string
  imgClassName?: string
  fallback: React.ReactNode
}

export function EmpresaBanner({
  empresaId,
  empresaNome,
  className,
  imgClassName,
  fallback,
}: EmpresaLogoProps) {
  const { data, refetch, isLoading } = useEmpresaBanner(empresaId);

  if (isLoading) {
    return <div className={cn("animate-pulse bg-muted", className)} />
  }

  if (!data?.url) return <>{fallback}</>

  return (
    <div className={className}>
      <img
        src={data.url}
        alt={`Logo de ${empresaNome}`}
        onError={() => refetch()}
        className={cn("w-full h-full object-cover", imgClassName)}
      />
    </div>
  )
}
