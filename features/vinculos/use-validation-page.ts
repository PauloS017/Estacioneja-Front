"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Swal from "sweetalert2"
import { useCheckVinculo } from "./use-vinculos"
import { useEstacionamentoById } from "@/features/estacionamentos"
import { useFotoPerfilUrl } from "@/features/usuarios"

export function useValidationPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { estacionamentoId } = useParams<{ estacionamentoId: string }>()

  const { data: estacionamentoSelecionado } = useEstacionamentoById(estacionamentoId)

  const [placa, _setPlaca] = useState("")
  const [searchPlaca, setSearchPlaca] = useState<string | null>(null)

  const setPlaca = (val: string) => {
    const raw = val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 7)
    _setPlaca(raw)
  }

  const placaNormalizada = placa

  const {
    data: vinculo,
    isFetching,
    isFetched,
  } = useCheckVinculo(searchPlaca ?? undefined, estacionamentoId)

  const temFotoPerfil = vinculo?.veiculo?.usuario?.temFotoPerfil ?? false;
  const fotoPerfil = useFotoPerfilUrl(vinculo?.veiculo?.usuario?.id, temFotoPerfil);

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const status = useMemo(() => {
    if (!searchPlaca) return "idle"
    if (isFetching) return "loading"
    if (isFetched && vinculo?.id !== null && vinculo?.id !== undefined) return "success"
    if (isFetched && vinculo?.id === null) return "error"
    return "idle"
  }, [searchPlaca, isFetching, isFetched, vinculo])

  const handleSearch = () => {
    if (!placaNormalizada) {
      Swal.fire({ icon: "warning", title: "Informe a placa" })
      return
    }
    if (!estacionamentoId) {
      Swal.fire({ icon: "error", title: "Nenhum estacionamento selecionado" })
      return
    }
    setSearchPlaca(placaNormalizada)
  }

  useEffect(() => {
    if (!searchPlaca || !isFetched) return

    if (vinculo) {
      Swal.fire({
        icon: "success",
        title: "Vínculo encontrado",
        text: "Veículo autorizado para este estacionamento",
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Sem vínculo",
        text: "Veículo não vinculado a este estacionamento",
      })
    }
  }, [vinculo, isFetched, searchPlaca])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const reset = () => {
    setPlaca("")
    setSearchPlaca(null)
    inputRef.current?.focus()
  }

  const handleAbrirFechar = () => {
    Swal.fire({ icon: "success", title: "Acesso liberado", text: `Placa ${searchPlaca}` })
    reset()
  }

  const handleLiberarVisitante = () => {
    Swal.fire({
      icon: "info",
      title: "Liberar visitante",
      text: `Cadastrar visitante para placa ${searchPlaca}`,
    })
  }

  return {
    inputRef,
    placa,
    setPlaca,
    searchPlaca,
    estacionamentoSelecionado,
    vinculo,
    fotoPerfil,
    temFotoPerfil,
    status,
    handleSearch,
    handleKeyPress,
    handleAbrirFechar,
    handleLiberarVisitante,
  }
}
