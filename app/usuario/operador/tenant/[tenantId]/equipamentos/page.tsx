"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Plus, Settings2, Trash2, Cpu, Loader2 } from "lucide-react"
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

import { useEstacionamentosByEmpresa } from "@/features/estacionamentos"
import {
  useCreateEquipamento,
  useEquipamentosByEmpresa,
  useDeleteEquipamento,
  useUpdateEquipamento,
} from "@/features/equipamentos"

const equipSchema = z.object({
  nome: z.string().min(3, "Obrigatório"),
  descricao: z.string().min(3, "Obrigatório"),
  modelo: z.string().min(2, "Obrigatório"),
  tipoEquipamento: z.enum(["ENTRADA_SAIDA", "AUTENTICADOR"]),
  estacionamentoId: z.string().uuid("Estacionamento inválido"),
  conexao: z.object({
    tipoComunicacao: z.enum(["WIFI", "ETHERNET", "SERIAL", "BLUETOOTH", "ZIGBEE", "DRY_CONTACT"]),
    tipoProtocolo: z.enum(["MQTT", "HTTP", "HTTPS", "MODBUS", "RS485", "WIEGAND", "PROPRIETARIO"]),
    endereco: z.string().min(1, "Obrigatório"),
    porta: z.coerce.number().min(1, "Porta inválida"),
    credenciais: z.string().min(1, "Obrigatório"),
    enderecoMac: z.string().min(1, "Obrigatório"),
  }),
})

type EquipForm = z.infer<typeof equipSchema>

export default function EquipamentosPage() {
  const params = useParams()
  const tenantId = Array.isArray(params?.tenantId) ? params.tenantId[0] : params?.tenantId

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: equipamentos, isLoading } = useEquipamentosByEmpresa(tenantId)
  const { data: estacionamentos } = useEstacionamentosByEmpresa(tenantId)

  const { mutateAsync: criarEquipamento, isPending: pendingCreate } = useCreateEquipamento()
  const { mutateAsync: updateEquipamento, isPending: pendingUpdate } = useUpdateEquipamento()
  const { mutateAsync: deletarEquipamento } = useDeleteEquipamento()

  const isPending = pendingCreate || pendingUpdate

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipForm>({
    resolver: zodResolver(equipSchema),
    defaultValues: { 
      tipoEquipamento: "ENTRADA_SAIDA", 
      conexao: { 
        tipoComunicacao: "ETHERNET", 
        tipoProtocolo: "MQTT", 
        porta: 80,
        endereco: "",
        credenciais: "",
        enderecoMac: ""
      } 
    },
  })

  const onSubmit = async (data: EquipForm) => {
    try {
      if (editingId) {
        await updateEquipamento({ id: editingId, data })
        Toast.fire({ icon: 'success', title: 'Equipamento atualizado com sucesso!' })
      } else {
        await criarEquipamento({ data })
        Toast.fire({ icon: 'success', title: 'Equipamento criado com sucesso!' })
      }
      setOpen(false)
      setEditingId(null)
      reset()
    } catch (e: any) {
      Toast.fire({ icon: 'error', title: 'Erro ao salvar equipamento: ' + (e.response?.data?.message || e.message) })
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipamentos e IoT</h1>
          <p className="text-sm text-muted-foreground">Faça a gestão das cancelas, totens e câmeras.</p>
        </div>

        <Can I="manage" a="Equipamento">
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
                <Plus className="w-4 h-4" /> Novo Equipamento
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-2xl overflow-hidden p-0">
              <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                <DialogTitle className="text-white font-bold text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-100" />
                  {editingId ? "Editar Equipamento" : "Cadastrar Equipamento"}
                </DialogTitle>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 bg-background">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Estacionamento Alvo
                    </label>
                    <select
                      {...register("estacionamentoId")}
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">Selecione...</option>
                      {estacionamentos?.map((est) => (
                        <option key={est.id} value={est.id}>
                          {est.descricao}
                        </option>
                      ))}
                    </select>
                    {errors.estacionamentoId && (
                      <p className="text-destructive text-xs mt-1">{errors.estacionamentoId.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Nome do Aparelho
                    </label>
                    <input
                      {...register("nome")}
                      placeholder="Ex: Cancela Principal"
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    />
                    {errors.nome && <p className="text-destructive text-xs mt-1">{errors.nome.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Descrição do Aparelho
                    </label>
                    <input
                      {...register("descricao")}
                      placeholder="Ex: Localizado na entrada principal"
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    />
                    {errors.descricao && <p className="text-destructive text-xs mt-1">{errors.descricao.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tipo</label>
                    <select
                      {...register("tipoEquipamento")}
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    >
                      <option value="ENTRADA_SAIDA">Entrada / Saída</option>
                      <option value="AUTENTICADOR">Autenticador</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Modelo / Marca</label>
                    <input
                      {...register("modelo")}
                      placeholder="Intelbras Cancela"
                      className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                    />
                    {errors.modelo && <p className="text-destructive text-xs mt-1">{errors.modelo.message}</p>}
                  </div>

                  <div className="col-span-2 border-t border-border pt-4 mt-2">
                    <h4 className="text-xs text-muted-foreground font-bold uppercase mb-3 text-center tracking-widest">
                      Conexão de Rede / Comunicação
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Comunicação</label>
                        <select
                          {...register("conexao.tipoComunicacao")}
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                        >
                          <option value="WIFI">Wi-Fi</option>
                          <option value="ETHERNET">Ethernet</option>
                          <option value="SERIAL">Serial</option>
                          <option value="BLUETOOTH">Bluetooth</option>
                          <option value="ZIGBEE">Zigbee</option>
                          <option value="DRY_CONTACT">Contato Seco</option>
                        </select>
                        {errors.conexao?.tipoComunicacao && <p className="text-destructive text-xs mt-1">{errors.conexao.tipoComunicacao.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Protocolo</label>
                        <select
                          {...register("conexao.tipoProtocolo")}
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm"
                        >
                          <option value="MQTT">MQTT</option>
                          <option value="HTTP">HTTP</option>
                          <option value="HTTPS">HTTPS</option>
                          <option value="MODBUS">Modbus</option>
                          <option value="RS485">RS485</option>
                          <option value="WIEGAND">Wiegand</option>
                          <option value="PROPRIETARIO">Proprietário</option>
                        </select>
                        {errors.conexao?.tipoProtocolo && <p className="text-destructive text-xs mt-1">{errors.conexao.tipoProtocolo.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                          Endereço / IP
                        </label>
                        <input
                          {...register("conexao.endereco")}
                          placeholder="192.168.1.100 ou COM3"
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm font-mono"
                        />
                        {errors.conexao?.endereco && <p className="text-destructive text-xs mt-1">{errors.conexao.endereco.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Porta</label>
                        <input
                          type="number"
                          {...register("conexao.porta")}
                          placeholder="80"
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm font-mono"
                        />
                        {errors.conexao?.porta && <p className="text-destructive text-xs mt-1">{errors.conexao.porta.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Endereço MAC</label>
                        <input
                          {...register("conexao.enderecoMac")}
                          placeholder="00:1B:44:11:3A:B7"
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm font-mono uppercase"
                        />
                        {errors.conexao?.enderecoMac && <p className="text-destructive text-xs mt-1">{errors.conexao.enderecoMac.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Credenciais</label>
                        <input
                          {...register("conexao.credenciais")}
                          placeholder="user:pass ou token"
                          className="w-full border border-border bg-background text-foreground rounded-lg p-2.5 text-sm font-mono"
                        />
                        {errors.conexao?.credenciais && <p className="text-destructive text-xs mt-1">{errors.conexao.credenciais.message}</p>}
                      </div>
                    </div>
                  </div>
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
                      "Salvar Aparelho"
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
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">IP / Rede</th>
                <th className="px-6 py-4">Estacionamento ID</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {equipamentos?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground bg-muted/10">
                    <Cpu className="w-10 h-10 mx-auto opacity-30 mb-3 grayscale" />
                    <p className="font-semibold text-foreground">Nada conectado</p>
                    <p className="text-sm mt-1">
                      Registre o primeiro equipamento de IoT da infraestrutura clicando acima.
                    </p>
                  </td>
                </tr>
              )}
              {equipamentos?.map((eq) => (
                <tr key={eq.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {eq.nome}
                    <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                      {eq.modelo} - {eq.tipoEquipamento}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                    {eq.conexao?.endereco}:{eq.conexao?.porta}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{eq.estacionamentoId}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Can I="manage" a="Equipamento">
                      <button
                        onClick={() => {
                          if (!eq.id) return
                          setEditingId(eq.id)
                          reset({
                            nome: eq.nome,
                            descricao: eq.descricao,
                            modelo: eq.modelo,
                            tipoEquipamento: eq.tipoEquipamento as EquipForm["tipoEquipamento"],
                            estacionamentoId: eq.estacionamentoId,
                            conexao: {
                              tipoComunicacao: eq.conexao?.tipoComunicacao as EquipForm["conexao"]["tipoComunicacao"],
                              tipoProtocolo: eq.conexao?.tipoProtocolo as EquipForm["conexao"]["tipoProtocolo"],
                              endereco: eq.conexao?.endereco,
                              porta: eq.conexao?.porta,
                              credenciais: eq.conexao?.credenciais,
                              enderecoMac: eq.conexao?.enderecoMac,
                            },
                          })
                          setOpen(true)
                        }}
                        className="text-muted-foreground hover:text-primary transition p-2"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!eq.id) return
                          const result = await confirmDialog('Remover Equipamento?', 'Desconectar e remover equipamento da infraestrutura?', 'Sim, remover')
                          if (result.isConfirmed) {
                            try {
                              await deletarEquipamento({ id: eq.id })
                              Toast.fire({ icon: 'success', title: 'Equipamento removido com sucesso!' })
                            } catch {
                              Toast.fire({ icon: 'error', title: 'Erro ao deletar equipamento.' })
                            }
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive transition p-2"
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
