export interface ConexaoEquipamento {
  tipoComunicacao: "WIFI" | "ETHERNET" | "SERIAL" | "BLUETOOTH" | "ZIGBEE" | "DRY_CONTACT"
  tipoProtocolo: "MQTT" | "HTTP" | "HTTPS" | "MODBUS" | "RS485" | "WIEGAND" | "PROPRIETARIO"
  endereco: string
  porta: number
  credenciais: string
  enderecoMac: string
}

export interface Equipamento {
  id?: string
  nome: string
  descricao: string
  modelo: string
  tipoEquipamento: "ENTRADA_SAIDA" | "AUTENTICADOR"
  conexao: ConexaoEquipamento
  estacionamentoId: string
}

export type EquipamentoPayload = Omit<Equipamento, "id">
