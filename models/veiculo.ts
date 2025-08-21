export type Veiculo = {
    id: number;
    placa: string;
    modelo: string;
    cor: string;
    ano: number;
    renavam: string;
    tipo: 'carro' | 'moto' | 'caminhao'| 'outro';
}