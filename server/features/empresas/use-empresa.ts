import { IEstacionamento } from "@/interfaces/iestacionamento";
import { useApiQuery } from "@/server/api/queries/apiQuery";

export function useEstacionamentosByEmpresa(tenantId?: string, enabled?: boolean) {
    return useApiQuery<IEstacionamento[]>({
        queryKey: ["estacionamentos-por-empresa", tenantId], 
        endpoint: `/api/v1/estacionamentos/empresa/${tenantId}`,
        enabled: !!tenantId && enabled
    })
}

export function useEmpresaById(tenantId?: string) {
    return useApiQuery<IEstacionamento[]>({
        // Adicionando o tenantId aqui também por segurança
        queryKey: ["empresa-por-id", tenantId], 
        endpoint: `/api/v1/empresas/${tenantId}`,
        enabled: !!tenantId
    })
}