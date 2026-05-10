import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackToHome() {
  return (
    <Link
      href="/"
      aria-label="Voltar para a página inicial"
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:text-foreground hover:bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
    >
      <ArrowLeft
        size={16}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      <span className="hidden sm:inline">Início</span>
    </Link>
  )
}
