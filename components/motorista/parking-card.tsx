"use client"

import { IEstacionamento } from "@/interfaces/iestacionamento";
import { Lock, LockKeyholeOpen, MapPin } from "lucide-react"

export default function ParkingCard({ capacidade, capacidadeDisponivel, empresa, privacidade }: IEstacionamento) {
  const enderecoBruto = empresa.endereco;

  const enderecoFormatado = `${enderecoBruto.logradouro} - ${enderecoBruto.bairro}, ${enderecoBruto.cidade}-${enderecoBruto.uf}` 

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className={`${privacidade == "PRIVADO" ? 'bg-emerald-600' : 'bg-red-400'} h-1`} />

      <div className="p-4">
        {/* Title and Location */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 flex gap-2">{ privacidade == "PRIVADO" ? <Lock /> : <LockKeyholeOpen /> } {empresa.nome}</h3>

        <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
          <MapPin className="w-4 h-4" />
          <span>{enderecoFormatado}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 text-xs">📍 X km</span>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                capacidadeDisponivel < 70 ? "bg-green-500" : capacidadeDisponivel < 85 ? "bg-yellow-400" : "bg-red-500"
              }`}
              style={{ width: `${(capacidade - capacidadeDisponivel) / (  capacidade ) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Ocupação: {(capacidade - capacidadeDisponivel) / ( capacidade ) * 100}%</p>
        </div>

        {/* Spots Information */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4  border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Vagas Disponíveis</p>
            
          </div>
          <div>
            <p className="text-xs text-gray-600 text-right">Total: {capacidade}</p>
      
          </div>
        </div>

        {/* Vehicle Types
        <div className="flex justify-around pt-2">
          <div className="text-center">
            <span className="text-2xl">🚗</span>
            <p className="text-xs font-semibold text-gray-900">{capacidade}</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">🏍️</span>
            <p className="text-xs font-semibold text-gray-900">{capacidade}</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
