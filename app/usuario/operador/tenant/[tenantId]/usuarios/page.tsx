"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Plus, Trash2, Shield, Car, Loader2 } from "lucide-react"
import { Can } from "@/lib/casl/context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useAcessosDaEmpresa, useCreateAcesso, useDeleteAcesso } from "@/features/acesso"
import { useCreateVinculo, useVinculosDaEmpresa, useDeleteVinculo } from "@/features/vinculos"
import { useEstacionamentosByEmpresa } from "@/features/estacionamentos"
import { useUser } from "@/features/usuarios"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Toast, confirmDialog } from "@/lib/utils/sweetalert"

const acessoSchema = z.object({
  email: z.string().email("E-mail inválido para busca"),
  tipoAcesso: z.enum(["MASTER", "AUDITORIA", "GUARITA"]),
})
type AcessoForm = z.infer<typeof acessoSchema>

const vinculoSchema = z.object({
  estacionamentoId: z.string().uuid("Estacionamento inválido"),
  placaVeiculo: z.string().min(7, "Placa inválida"),
})
type VinculoForm = z.infer<typeof vinculoSchema>

export default function UsuariosPage() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId
  const { data: user } = useUser()

  const [activeTab, setActiveTab] = useState<"ACESSOS" | "VINCULOS">("ACESSOS")
  const [openAcesso, setOpenAcesso] = useState(false)
  const [openVinculo, setOpenVinculo] = useState(false)

  const { data: acessos, isLoading: isLoadingAcessos } = useAcessosDaEmpresa(tenantId)
  const { data: estacionamentos } = useEstacionamentosByEmpresa(tenantId)

  const { mutateAsync: criarAcesso, isPending: pendingAcesso } = useCreateAcesso(tenantId)
  const { mutateAsync: deleteAcesso, isPending: pendingDeleteAcesso } = useDeleteAcesso(tenantId)
  const { mutateAsync: criarVinculo, isPending: pendingVinculo } = useCreateVinculo()
  const { data: vinculos, isLoading: isLoadingVinculos } = useVinculosDaEmpresa(tenantId)
  const { mutateAsync: deleteVinculo, isPending: pendingDeleteVinculo } = useDeleteVinculo(tenantId)

  const formAcesso = useForm<AcessoForm>({
    resolver: zodResolver(acessoSchema),
    defaultValues: { tipoAcesso: "GUARITA" }
  })

  const formVinculo = useForm<VinculoForm>({
    resolver: zodResolver(vinculoSchema)
  })


  const onSubmitAcesso = async (data: AcessoForm) => {
    try {
      const res = await api.get(`/api/v1/usuarios/email/${data.email}`)
      const usuarioId = res.data?.id

      if (!usuarioId) {
        throw new Error("Usuário não encontrado com este e-mail.")
      }

      await criarAcesso({ data: { usuarioId, tipoAcesso: data.tipoAcesso } })

      setOpenAcesso(false)
      formAcesso.reset()
      Toast.fire({
        icon: 'success',
        title: 'Acesso concedido com sucesso!'
      })
    } catch (e: any) {
      Toast.fire({
        icon: 'error',
        title: 'Erro ao conceder acesso: ' + (e.response?.data?.message || e.message)
      })
    }
  }

  const onSubmitVinculo = async (data: VinculoForm) => {
    try {
      await criarVinculo({ data })
      setOpenVinculo(false)
      formVinculo.reset()
      Toast.fire({
        icon: 'success',
        title: 'Veículo vinculado com sucesso!'
      })
    } catch (e: any) {
      Toast.fire({
        icon: 'error',
        title: 'Erro ao vincular veículo: ' + (e.response?.data?.message || e.message)
      })
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Pessoas</h1>
          <p className="text-sm text-muted-foreground">Administre o acesso da equipe e o vínculo de clientes aos estacionamentos.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("ACESSOS")}
          className={`px-4 py-3 font-medium text-sm transition border-b-2 flex items-center gap-2 ${activeTab === 'ACESSOS' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Shield className="w-4 h-4" /> Equipe (Acessos)
        </button>
        <button
          onClick={() => setActiveTab("VINCULOS")}
          className={`px-4 py-3 font-medium text-sm transition border-b-2 flex items-center gap-2 ${activeTab === 'VINCULOS' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Car className="w-4 h-4" /> Motoristas (Vínculos)
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {activeTab === "ACESSOS" && (
          <>
            <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Acessos Administrativos</h3>
              <Can I="manage" a="Usuario">
                <Dialog open={openAcesso} onOpenChange={setOpenAcesso}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded shadow hover:bg-emerald-700 transition">
                      <Plus className="w-3.5 h-3.5" /> Adicionar Staff
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden rounded-xl">
                    <div className="bg-emerald-600 px-6 py-4">
                      <DialogTitle className="text-white font-bold text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-100" /> Promover Membro
                      </DialogTitle>
                    </div>
                    <form onSubmit={formAcesso.handleSubmit(onSubmitAcesso)} className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">E-mail do Usuário Cadastrado</label>
                        <input {...formAcesso.register("email")} placeholder="joao@estacioneja.com" className="w-full border border-border bg-background text-foreground rounded-md p-2 text-sm" />
                        {formAcesso.formState.errors.email && <p className="text-destructive text-xs mt-1">{formAcesso.formState.errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Nível de Permissão</label>
                        <select {...formAcesso.register("tipoAcesso")} className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground">
                          <option value="GUARITA">Operador de Guarita</option>
                          <option value="AUDITORIA">Auditor (Somente Leitura)</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <DialogClose asChild>
                          <button type="button" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded">Cancelar</button>
                        </DialogClose>
                        <button type="submit" disabled={pendingAcesso} className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded disabled:opacity-70">
                          {pendingAcesso ? <Loader2 className="w-4 h-4 animate-spin" /> : "Conceder Acesso"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </Can>
            </div>

            {isLoadingAcessos ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando permissões...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase text-muted-foreground font-semibold bg-muted/20">
                    <th className="px-6 py-3">Usuário</th>
                    <th className="px-6 py-3">Privilégio</th>
                    <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {acessos?.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                        <Shield className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        Nenhum acesso emitido.
                      </td>
                    </tr>
                  )}
                  {acessos?.map(acesso => (
                    <tr key={acesso.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{acesso.usuario?.name ?? `Usuário ${acesso.id}`}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold rounded-full">
                          {acesso.tipoAcesso}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {acesso.usuario?.id !== user?.id && (
                          <Can I="manage" a="Usuario">
                            <button
                              onClick={async () => {
                                const result = await confirmDialog('Remover acesso?', 'Deseja realmente remover esta permissão administrativa?', 'Sim, remover')
                                if (result.isConfirmed) {
                                  try {
                                    await deleteAcesso({ id: acesso.id })
                                    Toast.fire({ icon: 'success', title: 'Acesso removido com sucesso!' })
                                  }
                                  catch (e) {
                                    Toast.fire({ icon: 'error', title: 'Erro ao deletar acesso!' })
                                  }
                                }
                              }}
                              disabled={pendingDeleteAcesso}
                              className="text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                            >
                              {pendingDeleteAcesso ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </Can>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "VINCULOS" && (
          <>
            <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Vínculos de Usuarios (Placa)</h3>
              <Can I="manage" a="Usuario">
                <Dialog open={openVinculo} onOpenChange={setOpenVinculo}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded shadow hover:bg-sky-700 transition">
                      <Plus className="w-3.5 h-3.5" /> Vincular Placa
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden rounded-xl">
                    <div className="bg-sky-600 px-6 py-4">
                      <DialogTitle className="text-white font-bold text-lg flex items-center gap-2">
                        <Car className="w-5 h-5 text-sky-100" /> Liberação Automática (Vínculo)
                      </DialogTitle>
                    </div>
                    <form onSubmit={formVinculo.handleSubmit(onSubmitVinculo)} className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Estacionamento</label>
                        <select {...formVinculo.register("estacionamentoId")} className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-sky-500 outline-none">
                          <option value="">Selecione o estacionamento...</option>
                          {estacionamentos?.map(est => <option key={est.id} value={est.id}>{est.descricao}</option>)}
                        </select>
                        {formVinculo.formState.errors.estacionamentoId && <p className="text-destructive text-xs mt-1">{formVinculo.formState.errors.estacionamentoId.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Placa do Veículo Emitido</label>
                        <input {...formVinculo.register("placaVeiculo")} placeholder="ABC1234" className="w-full border border-border bg-background text-foreground rounded-md p-2 text-sm font-mono uppercase" />
                        {formVinculo.formState.errors.placaVeiculo && <p className="text-destructive text-xs mt-1">{formVinculo.formState.errors.placaVeiculo.message}</p>}
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <DialogClose asChild>
                          <button type="button" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded">Cancelar</button>
                        </DialogClose>
                        <button type="submit" disabled={pendingVinculo} className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 rounded disabled:opacity-70">
                          {pendingVinculo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vincular"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </Can>
            </div>

            {isLoadingVinculos ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando vínculos...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase text-muted-foreground font-semibold bg-muted/20">
                    <th className="px-6 py-3">Motorista</th>
                    <th className="px-6 py-3">Veículo (Placa)</th>
                    <th className="px-6 py-3">Estacionamento</th>
                    <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vinculos?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        <Car className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        Nenhum vínculo ativo listado aqui.
                      </td>
                    </tr>
                  )}
                  {vinculos?.map(vinculo => (
                    <tr key={vinculo.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{vinculo.veiculo?.usuario?.name ?? "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold rounded-full uppercase font-mono">
                          {vinculo.veiculo?.placa ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{vinculo.estacionamento?.descricao ?? "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <Can I="manage" a="Usuario">
                          <button
                            onClick={async () => {
                              const result = await confirmDialog('Remover vínculo?', 'Deseja realmente remover este vínculo do veículo com o estacionamento?', 'Sim, remover')
                              if (result.isConfirmed) {
                                try {
                                  await deleteVinculo({ id: vinculo.id })
                                  Toast.fire({ icon: 'success', title: 'Vínculo removido com sucesso!' })
                                }
                                catch (e) {
                                  Toast.fire({ icon: 'error', title: 'Erro ao deletar vínculo!' })
                                }
                              }
                            }}
                            disabled={pendingDeleteVinculo}
                            className="text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                          >
                            {pendingDeleteVinculo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  )
}
