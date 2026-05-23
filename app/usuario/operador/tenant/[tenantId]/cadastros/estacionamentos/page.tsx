"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Building, Plus, Settings2, Trash2, Loader2, X } from "lucide-react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
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

const TIPOS_VEICULO = ["CARRO", "MOTO", "ONIBUS", "CAMINHAO", "TRATOR"] as const

const METODOS_ENTRADA = [
  { value: "QR_CODE", label: "QR Code" },
  { value: "NFC_RFID", label: "NFC / RFID" },
  { value: "GUARITA_SIMPLES", label: "Guarita simples" },
] as const

const estSchema = z.object({
  descricao: z.string().min(3, "Obrigatório"),
  privacidade: z.enum(["PUBLICO", "PRIVADO"]),
  metodoEntrada: z.enum(["QR_CODE", "NFC_RFID", "GUARITA_SIMPLES"], {
    errorMap: () => ({ message: "Selecione um método de entrada" }),
  }),
  regrasCapacidade: z
    .array(
      z.object({
        tipoVeiculo: z.enum(TIPOS_VEICULO),
        capacidade: z.coerce.number().min(1, "Capacidade > 0"),
      }),
    )
    .min(1, "Adicione ao menos uma regra de capacidade")
    .refine(
      (regras) => new Set(regras.map((r) => r.tipoVeiculo)).size === regras.length,
      { message: "Não repita o mesmo tipo de veículo" },
    ),
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
    control,
    watch,
    formState: { errors },
  } = useForm<EstForm>({
    resolver: zodResolver(estSchema),
    defaultValues: {
      privacidade: "PUBLICO",
      metodoEntrada: "QR_CODE",
      regrasCapacidade: [{ tipoVeiculo: "CARRO", capacidade: 50 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "regrasCapacidade",
  })

  const regrasAtuais = watch("regrasCapacidade") ?? []
  const tiposJaUsados = new Set(regrasAtuais.map((r) => r?.tipoVeiculo).filter(Boolean))
  const tiposDisponiveis = TIPOS_VEICULO.filter((t) => !tiposJaUsados.has(t))
  const podeAdicionarRegra = tiposDisponiveis.length > 0

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
            <DialogContent className="border-none shadow-2xl rounded-2xl overflow-hidden p-0 sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-emerald-600 px-6 py-4 sticky top-0 z-10">
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
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Privacidade</label>
                    <select
                      {...register("privacidade")}
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    >
                      <option value="PUBLICO">Público</option>
                      <option value="PRIVADO">Privado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Método de Entrada</label>
                    <select
                      {...register("metodoEntrada")}
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    >
                      {METODOS_ENTRADA.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    {errors.metodoEntrada && (
                      <p className="text-destructive text-xs mt-1">{errors.metodoEntrada.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Regras de Capacidade
                    </label>
                    <button
                      type="button"
                      disabled={!podeAdicionarRegra}
                      onClick={() => {
                        if (tiposDisponiveis[0]) {
                          append({ tipoVeiculo: tiposDisponiveis[0], capacidade: 10 })
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar regra
                    </button>
                  </div>

                  <div className="space-y-2">
                    {fields.map((field, index) => {
                      const tipoAtual = regrasAtuais[index]?.tipoVeiculo
                      const opcoesParaEsteCampo = TIPOS_VEICULO.filter(
                        (t) => t === tipoAtual || !tiposJaUsados.has(t),
                      )

                      return (
                        <div
                          key={field.id}
                          className="flex items-start gap-2 p-2 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex-1">
                            <Controller
                              control={control}
                              name={`regrasCapacidade.${index}.tipoVeiculo`}
                              render={({ field: ctrl }) => (
                                <select
                                  {...ctrl}
                                  className="w-full border border-border bg-background text-foreground rounded-lg p-2 text-sm"
                                >
                                  {opcoesParaEsteCampo.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                      {tipo}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>
                          <div className="w-28">
                            <input
                              type="number"
                              min={1}
                              {...register(`regrasCapacidade.${index}.capacidade`)}
                              placeholder="Vagas"
                              className="w-full border border-border bg-background text-foreground rounded-lg p-2 text-sm font-mono"
                            />
                            {errors.regrasCapacidade?.[index]?.capacidade && (
                              <p className="text-destructive text-[10px] mt-1">
                                {errors.regrasCapacidade[index]?.capacidade?.message as string}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Remover regra"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {errors.regrasCapacidade && typeof errors.regrasCapacidade.message === "string" && (
                    <p className="text-destructive text-xs mt-1">{errors.regrasCapacidade.message}</p>
                  )}
                  {errors.regrasCapacidade?.root?.message && (
                    <p className="text-destructive text-xs mt-1">{errors.regrasCapacidade.root.message}</p>
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
                <th className="px-6 py-4">Capacidade por tipo</th>
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
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex flex-col gap-0.5">
                      {est.regrasCapacidade?.length ? (
                        est.regrasCapacidade.map((r) => (
                          <span key={r.tipoVeiculo} className="text-xs">
                            <span className="font-semibold">{r.tipoVeiculo}:</span>{" "}
                            {r.capacidadeDisponivel}/{r.capacidade} vagas
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Can I="manage" a="Estacionamento">
                      <button
                        onClick={() => {
                          setEditingId(est.id)
                          reset({
                            descricao: est.descricao,
                            privacidade: est.privacidade,
                            metodoEntrada: est.metodoEntrada ?? "QR_CODE",
                            regrasCapacidade: est.regrasCapacidade?.length
                              ? est.regrasCapacidade.map((r) => ({
                                  tipoVeiculo: r.tipoVeiculo,
                                  capacidade: r.capacidade,
                                }))
                              : [{ tipoVeiculo: "CARRO", capacidade: 10 }],
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
