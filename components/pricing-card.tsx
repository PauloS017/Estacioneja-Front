import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plano } from "@/features/planos/types"

interface PricingCardProps extends Plano {
  isPopular?: boolean;
}

export function PricingCard({
    titulo,
    recomendadoParaAte,
    beneficios,
    custoPorMes,
    isPopular
}: PricingCardProps) {
  return (
    <Card 
      className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        isPopular ? "border-primary border-2 shadow-lg shadow-primary/10" : "border-border shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Recomendado
        </div>
      )}
      
      <CardHeader className="pt-8">
        <CardTitle className="text-xl font-semibold">{titulo}</CardTitle>
        <CardDescription className="text-sm mt-2">
          Ideal para estacionamentos com até {recomendadoParaAte} vagas
        </CardDescription>
        <div className="mt-6 flex items-baseline text-foreground">
          <span className="text-3xl font-bold tracking-tight">{custoPorMes}</span>
          <span className="text-muted-foreground ml-1 font-medium text-sm">/mês</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 mt-4">
        <ul className="space-y-3">
          {beneficios.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="mt-6 pb-8">
        <Link href={"/sua-empresa-aqui"} className="w-full">
          <Button
            variant={isPopular ? "default" : "outline"}
            className={`w-full font-semibold ${
              isPopular 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
                : "hover:bg-muted"
            }`}
          >
            Falar com Especialistas
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
