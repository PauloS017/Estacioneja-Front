export type {
  Vinculo,
  CriarVinculoPayload,
  VeiculoResumo,
  EstacionamentoCardUsuario,
  VinculoCardUsuario,
  ProprietarioResumo,
  EstacionamentoRotulo,
  VinculoLinhaAdmin,
  VinculoConsultaGuarita,
} from "./types"
export {
  vinculosKeys,
  useMeusEstacionamentosVinculados,
  useCheckVinculo,
  useCreateVinculo,
  useVinculosDaEmpresa,
  useDeleteVinculo,
} from "./use-vinculos"
export { useValidationPage } from "./use-validation-page"
