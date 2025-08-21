"use server";

import { stringifyFormData } from "@/lib/helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const headers = {
  "Content-Type": "application/json",
};
export type VeiculoFormState = {
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
  renavam: string;
  tipo?: string;
};

export async function criarVeiculo(  prevState: VeiculoFormState, formData: FormData) {
  let response = await fetch(`${API_URL}/veiculo`, {
    headers,
    method: "POST",
    body: stringifyFormData(formData),
  });
   
  return { success: true, ...prevState} ;
}
