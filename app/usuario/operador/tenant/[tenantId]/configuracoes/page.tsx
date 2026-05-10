"use client"

import { useParams } from "next/navigation"
import { Building2, CreditCard, Lock, CheckCircle2 } from "lucide-react"

import { useMyAccessInTenant } from "@/features/acesso"

export default function ConfiguracoesTenantPage() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId
  const { data: meuAcesso, isLoading } = useMyAccessInTenant(tenantId)

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando painel de configuração...</div>
  }

  if (meuAcesso?.tipoAcesso !== "MASTER") {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
         <Lock className="w-12 h-12 text-muted-foreground/40 mb-4" />
         <h1 className="text-xl font-bold text-foreground">Acesso Restrito</h1>
         <p className="text-muted-foreground max-w-sm mt-2">Apenas o proprietário (MASTER) do Tenant pode gerenciar planos financeiros e pagamentos.</p>
       </div>
     )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
           <Building2 className="w-6 h-6 text-primary" />
           Configurações da Conta
        </h1>
        <p className="text-sm text-muted-foreground">Gerencie a assinatura e os dados de faturamento do workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">Plano Vigente</h3>
            <div className="flex items-start justify-between">
               <div>
                  <div className="text-3xl font-extrabold text-primary mb-1">{meuAcesso?.empresa?.plano}</div>
                  <p className="text-sm text-muted-foreground">Ciclo de faturamento: Mensal</p>
               </div>
               <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1 border border-primary/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
               </span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
               <button className="w-full text-center px-4 py-2.5 bg-muted hover:bg-accent border border-border text-sm font-medium text-foreground rounded-lg transition">
                 Alterar o Plano
               </button>
            </div>
         </div>

         <div className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-muted-foreground" /> Forma de Pagamento
            </h3>
            
            <div className="flex-1">
               <p className="text-sm text-muted-foreground mb-4">Cartão de Crédito principal para o plano do sistema EstacioneJá.</p>
               
               <div className="flex items-center gap-4 p-4 border border-border bg-muted/30 rounded-lg">
                  <div className="w-12 h-8 bg-foreground rounded flex items-center justify-center shadow-sm">
                     <span className="text-[9px] text-background font-bold tracking-widest italic">VISA</span>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                     <p className="text-xs text-muted-foreground">Expira em 12/28</p>
                  </div>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex gap-3">
               <button className="flex-1 text-center px-4 py-2.5 bg-foreground hover:bg-foreground/90 text-background text-sm font-medium rounded-lg transition shadow-sm">
                 Adicionar Cartão
               </button>
               <button className="px-4 py-2.5 text-destructive hover:bg-destructive/10 text-sm font-medium rounded-lg transition border border-transparent hover:border-destructive/20">
                 Remover
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
