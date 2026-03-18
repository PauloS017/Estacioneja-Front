import { IAcesso } from "@/interfaces/iacesso";
import { useApiQuery } from "@/server/api/queries/apiQuery";

export function useMyWorkspaces() {
    return useApiQuery<IAcesso[]>({
        queryKey: ["workspaces", "meus-workspaces"],
        endpoint: "/api/v1/usuarios/my-workspaces"
    })
}

export function useMyAccessInTenant(tenantId?: string) {
    return useApiQuery<IAcesso>({
        queryKey: ["meu-acesso", tenantId],
        endpoint: `/api/v1/empresas/${tenantId}/meu-acesso`
    })
}