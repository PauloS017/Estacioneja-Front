import { api } from "../../apiconfig";

export async function getUser(token: string | null) {
  const response = await api.get("/usuarios/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}
