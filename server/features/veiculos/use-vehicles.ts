import { IVeiculo } from "@/interfaces/iveiculo";
import { useApiMutation } from "@/server/api/queries/apiMutation";

export function useCreateVehicle() {
    const mutation = useApiMutation<IVeiculo>({
        method: "POST",
        endpoint: `/api/v1/veiculos`,
        invalidateQueries: [["veiculos"]],
    });


    function createVehicle(payload: IVeiculo) {
        return mutation.mutateAsync({ data: payload })
    }
    
      return {
        createVehicle,
        isLoading: mutation.isPending,
        isError: mutation.isError,
      }
}