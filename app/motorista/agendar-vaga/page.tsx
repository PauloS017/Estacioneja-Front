"use client"

// Dados simulados
const estacionamentos = [
  { id: "1", nome: "Estacionamento Central" },
  { id: "2", nome: "Estacionamento Setor Norte" },
  { id: "3", nome: "Estacionamento Biblioteca" },
]

const veiculos = [
  { id: "1", placa: "ABC-1234", modelo: "Honda Civic" },
  { id: "2", placa: "XYZ-5678", modelo: "Toyota Corolla" },
]

const vagas = [
  { id: "1", numero: "A-23", tipo: "normal", disponivel: true },
  { id: "2", numero: "A-24", tipo: "normal", disponivel: true },
  { id: "3", numero: "A-25", tipo: "normal", disponivel: false },
  { id: "4", numero: "B-10", tipo: "normal", disponivel: true },
  { id: "5", numero: "B-11", tipo: "normal", disponivel: true },
  { id: "6", numero: "C-05", tipo: "pcd", disponivel: true },
  ]