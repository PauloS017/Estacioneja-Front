"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Building, Plus, Settings2, Trash2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Can } from "@/lib/casl/context"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Toast, confirmDialog } from "@/lib/utils/sweetalert"

import {
  useEstacionamentosByEmpresa,
  useCreateEstacionamento,
  useUpdateEstacionamento,
  useDeleteEstacionamento,
} from "@/features/estacionamentos"

const estSchema = z.object({
  descricao: z.string().min(3, "Obrigatório"),
  privacidade: z.enum(["PUBLICO", "PRIVADO"]),
  capacidade: z.coerce.number().min(1, "Obrigatório"),
  regraEstacionamento: z
    .array(z.enum(["CARRO", "MOTO", "ONIBUS", "CAMINHAO", "TRATOR"]))
    .min(1, "Selecione ao menos um tipo"),
})

type EstForm = z.infer<typeof estSchema>

export default function EstacionamentosPage() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: estacionamentos, isLoading } = useEstacionamentosByEmpresa(tenantId)
  const { mutateAsync: criarEstacionamento, isPending: pendingCreate } = useCreateEstacionamento()
  const { mutateAsync: updateEstacionamento, isPending: pendingUpdate } = useUpdateEstacionamento()
  const { mutateAsync: deleteEstacionamento } = useDeleteEstacionamento()

  const isPending = pendingCreate || pendingUpdate

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EstForm>({
    resolver: zodResolver(estSchema),
    defaultValues: { privacidade: "PUBLICO", regraEstacionamento: ["CARRO"], capacidade: 50 },
  })

  const onSubmit = async (data: EstForm) => {
    try {
      const payload = { ...data, empresaId: tenantId } as never
      if (editingId) {
        await updateEstacionamento({ id: editingId, data: payload })
        Toast.fire({ icon: 'success', title: 'Estacionamento atualizado com sucesso!' })
      } else {
        await criarEstacionamento({ data: payload })
        Toast.fire({ icon: 'success', title: 'Estacionamento criado com sucesso!' })
      }
      setOpen(false)
      setEditingId(null)
      reset()
    } catch (e: any) {
      Toast.fire({ icon: 'error', title: 'Erro ao salvar estacionamento: ' + (e.response?.data?.message || e.message) })
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estacionamentos</h1>
          <p className="text-sm text-muted-foreground">Faça a gestão dos estacionamentos vinculados a esta empresa.</p>
        </div>

        <Can I="manage" a="Estacionamento">
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val)
              if (!val) {
                setEditingId(null)
                reset()
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  setEditingId(null)
                  reset()
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" /> Novo Estacionamento
              </button>
            </DialogTrigger>
            <DialogContent className="border-none shadow-2xl rounded-2xl overflow-hidden p-0 sm:max-w-md">
              <div className="bg-emerald-600 px-6 py-4">
                <DialogTitle className="text-white font-bold text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-100" />
                  {editingId ? "Editar Estacionamento" : "Registrar Estacionamento"}
                </DialogTitle>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 bg-background">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Nome / Descrição</label>
                  <input
                    {...register("descricao")}
                    placeholder="Ex: Estacionamento Principal"
                    className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                  />
                  {errors.descricao && <p className="text-destructive text-xs mt-1">{errors.descricao.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Capacidade Útil</label>
                    <input
                      type="number"
                      {...register("capacidade")}
                      placeholder="Vagas"
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Privacidade</label>
                    <select
                      {...register("privacidade")}
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    >
                      <option value="PUBLICO">Público</option>
                      <option value="PRIVADO">Privado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                    Regras de Veículos Permitidos
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(["CARRO", "MOTO", "ONIBUS", "CAMINHAO", "TRATOR"] as const).map((tipo) => (
                      <label
                        key={tipo}
                        className="flex items-center gap-2 text-sm bg-background border border-border text-foreground rounded-lg px-3 py-2 cursor-pointer hover:bg-accent transition"
                      >
                        <input
                          type="checkbox"
                          value={tipo}
                          {...register("regraEstacionamento")}
                          className="text-primary rounded focus:ring-primary"
                        />
                        {tipo}
                      </label>
                    ))}
                  </div>
                  {errors.regraEstacionamento && (
                    <p className="text-destructive text-xs mt-1">{errors.regraEstacionamento.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  </DialogClose>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition disabled:opacity-70"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingId ? (
                      "Salvar Alterações"
                    ) : (
                      "Criar Unidade"
                    )}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </Can>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando dados...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/20 border-b border-border text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                <th className="px-6 py-4">Nome / Descrição</th>
                <th className="px-6 py-4">Privacidade</th>
                <th className="px-6 py-4">Capacidade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {estacionamentos?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    <Building className="w-8 h-8 mx-auto opacity-30 mb-2" />
                    Nenhum estacionamento encontrado.
                  </td>
                </tr>
              )}
              {estacionamentos?.map((est) => (
                <tr key={est.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{est.descricao}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[11px] font-semibold rounded-full border border-primary/20">
                      {est.privacidade?.toUpperCase() || "PÚBLICO"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{est.capacidade} Vagas</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Can I="manage" a="Estacionamento">
                      <button
                        onClick={() => {
                          setEditingId(est.id)
                          reset({
                            descricao: est.descricao,
                            privacidade: est.privacidade,
                            capacidade: est.capacidade,
                            regraEstacionamento: ["CARRO"],
                          })
                          setOpen(true)
                        }}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          const result = await confirmDialog('Excluir Estacionamento?', 'Deseja realmente apagar este estacionamento?', 'Sim, excluir')
                          if (result.isConfirmed) {
                            try {
                              await deleteEstacionamento({ id: est.id })
                              Toast.fire({ icon: 'success', title: 'Estacionamento excluído com sucesso!' })
                            } catch {
                              Toast.fire({ icon: 'error', title: 'Não foi possível excluir o estacionamento.' })
                            }
                          }
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
