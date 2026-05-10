"use client";

import { usePlanos } from "@/features/planos/use-planos";
import { Plano } from "@/features/planos/types";
import { PricingCard } from "@/components/pricing-card";

export function PlanosSection() {
  const { data: planos = [], isLoading, isError } = usePlanos();

  return (
    <section id="planos" className="w-full py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-[800px]">
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl text-foreground">
              Planos e Preços
            </h2>
            <p className="text-muted-foreground md:text-lg/relaxed">
              Escolha o plano ideal para a necessidade da sua instituição
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {isLoading ? (
            // Skeletons
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border-2 border-muted bg-card text-card-foreground shadow-sm h-[400px] p-6 animate-pulse"
                >
                  <div className="w-1/2 h-8 bg-muted rounded mb-4"></div>
                  <div className="w-3/4 h-4 bg-muted rounded mb-8"></div>
                  <div className="w-1/3 h-10 bg-muted rounded mb-8"></div>
                  <div className="space-y-3 mt-auto">
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-5/6 h-4 bg-muted rounded"></div>
                    <div className="w-4/6 h-4 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </>
          ) : isError ? (
            <div className="col-span-full text-center p-8 bg-destructive/10 text-destructive rounded-2xl">
              <p className="font-medium">Ocorreu um erro ao carregar os planos. Tente novamente mais tarde.</p>
            </div>
          ) : planos.length === 0 ? (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              <p>Nenhum plano disponível no momento.</p>
            </div>
          ) : (
            planos.map((plano: Plano, index: number) => (
              <PricingCard key={index} {...plano} isPopular={index === 1} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
