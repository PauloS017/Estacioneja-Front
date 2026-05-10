import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full pt-16 pb-8 bg-card border-t border-border">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center h-8 w-auto">
                <img src="/logowhitetheme.svg" alt="EstacioneJá" className="h-full w-auto object-contain dark:hidden" />
                <img src="/logodarkmode.svg" alt="EstacioneJá" className="h-full w-auto object-contain hidden dark:block" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Soluções inteligentes para gestão moderna de estacionamentos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/#planos" className="text-muted-foreground hover:text-primary transition-colors">Planos</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="/suporte" className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground hover:text-foreground transition-colors">
                <a href="mailto:contato@estacioneja.com.br">contato@estacioneja.com.br</a>
              </li>
              <li className="text-muted-foreground hover:text-foreground transition-colors">
                <a href="tel:+556740028922">(67) 4002-8922</a>
              </li>
              <li className="text-muted-foreground">Naviraí, MS - Brasil</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} EstacioneJá. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacidade" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Termos
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
