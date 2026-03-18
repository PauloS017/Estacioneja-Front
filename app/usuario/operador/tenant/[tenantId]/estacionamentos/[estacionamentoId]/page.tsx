"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { Search, User } from "lucide-react";
import md5 from "md5";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCheckVincle } from "@/server/features/vinculo/use-vincle";
import { useParams } from "next/navigation";
import { useParkById } from "@/server/features/estacionamentos/use-estacionamento";

function getGravatarUrl(email: string, size = 128): string {
  const trimmedEmail = email.toLowerCase().trim();
  const hash = md5(trimmedEmail);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export default function ValidationPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { estacionamentoId } = useParams<{ estacionamentoId: string }>();

  const { data: estacionamentoSelecionado } = useParkById(estacionamentoId);

  const [placa, setPlaca] = useState("");
  const [searchPlaca, setSearchPlaca] = useState<string | null>(null);


  const placaNormalizada = useMemo(
    () => placa.replace(/\s+/g, "").toUpperCase(),
    [placa]
  );

  const {
    data: temVinculo,
    isFetching,
    isFetched,
  } = useCheckVincle(searchPlaca ?? undefined, estacionamentoId);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const status = useMemo(() => {
    if (!searchPlaca) return "idle";
    if (isFetching) return "loading";
    if (isFetched && temVinculo === true) return "success";
    if (isFetched && temVinculo === false) return "error";
    return "idle";
  }, [searchPlaca, isFetching, isFetched, temVinculo]);

  const handleSearch = () => {
    if (!placaNormalizada) {
      Swal.fire({ icon: "warning", title: "Informe a placa" });
      return;
    }

    if (!estacionamentoId) {
      Swal.fire({
        icon: "error",
        title: "Nenhum estacionamento selecionado",
      });
      return;
    }

    setSearchPlaca(placaNormalizada);
  };

  useEffect(() => {
    if (!searchPlaca || !isFetched) return;

    if (temVinculo) {
      Swal.fire({
        icon: "success",
        title: "Vínculo encontrado",
        text: "Veículo autorizado para este estacionamento",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Sem vínculo",
        text: "Veículo não vinculado a este estacionamento",
      });
    }
  }, [temVinculo, isFetched, searchPlaca]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const reset = () => {
    setPlaca("");
    setSearchPlaca(null);
    inputRef.current?.focus();
  };

  const handleAbrirFechar = () => {
    Swal.fire({
      icon: "success",
      title: "Acesso liberado",
      text: `Placa ${searchPlaca}`,
    });
    reset();
  };

  const handleLiberarVisitante = () => {
    Swal.fire({
      icon: "info",
      title: "Liberar visitante",
      text: `Cadastrar visitante para placa ${searchPlaca}`,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-lg p-12">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          {status === "success" ? (
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={getGravatarUrl(`${searchPlaca}@email.com`)}
                alt={searchPlaca ?? ""}
              />
              <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                {searchPlaca?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
              <User className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="text-center mb-8 h-24 flex items-center justify-center">
          {status === "idle" && (
            <p className="text-lg text-gray-500 font-medium">
              Digite a placa{" "}
              {estacionamentoSelecionado?.descricao
                ? `- ${estacionamentoSelecionado.descricao}`
                : ""}
            </p>
          )}

          {status === "loading" && (
            <p className="text-lg text-gray-500 font-medium">
              Verificando vínculo...
            </p>
          )}

          {status === "success" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Veículo autorizado
              </h2>
              <p className="text-sm text-gray-600">{searchPlaca}</p>
            </div>
          )}

          {status === "error" && (
            <p className="text-lg text-red-500 font-semibold">
              Veículo não vinculado
            </p>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              ref={inputRef}
              type="text"
              placeholder="ABC1D23"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500
                         text-gray-900 placeholder-gray-500 uppercase"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={status === "loading"}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg
                       hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Botões */}
        <div className="flex justify-end">
          {status === "success" && (
            <button
              onClick={handleAbrirFechar}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Abrir/Fechar
            </button>
          )}

          {status === "error" && (
            <button
              onClick={handleLiberarVisitante}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Liberar Visitante
            </button>
          )}

          {status === "idle" && (
            <button
              disabled
              className="bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-lg cursor-not-allowed"
            >
              Abrir/Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
