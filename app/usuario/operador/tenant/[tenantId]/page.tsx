"use client";

import { useMyAccessInTenant } from "@/server/features/access/use-access";
import { useParams } from "next/navigation";
import {
  MapPin,
  BookOpen,
  Info,
  ShieldCheck,
  BarChart3,
  ShieldMinus,
} from "lucide-react";
export default function TenantWorkspace() {
  const { tenantId } = useParams<{ tenantId: string }>();

  const { data: meuAcesso, isLoading, isError } =
    useMyAccessInTenant(tenantId);

  if (isLoading) return <>Carregando empresa...</>;
  if (isError || !meuAcesso) return <>Erro ao carregar empresa</>;

  const tipo = meuAcesso.tipoAcesso;
  const endereco = meuAcesso.empresa.endereco;

  if (tipo === "EMBARCADO") {
    return (
      <div className="p-10 text-center text-gray-500">
        Acesso embarcado não possui interface visual.
      </div>
    );
  }

  const hasCoords =
    endereco?.latitude !== null && endereco?.longitude !== null;

  const mapsSrc = hasCoords
    ? `https://www.google.com/maps?q=${endereco.latitude},${endereco.longitude}&hl=pt-BR&z=17&output=embed`
    : null;

  const perfilIcon =
    tipo === "MASTER" ? (
      <ShieldCheck className="w-5 h-5" />
    ) : tipo === "AUDITORIA" ? (
      <BarChart3 className="w-5 h-5" />
    ) : (
      <ShieldMinus className="w-5 h-5" />
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6 space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {meuAcesso.empresa.nome}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
              {perfilIcon}
              Perfil: <b>{tipo}</b>
            </p>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* TÍTULO OCUPANDO AS 3 COLUNAS → ALINHA TUDO */}
          <div className="xl:col-span-3">
            <h2 className="text-lg font-semibold">
              O que você pode fazer
            </h2>
          </div>

          {/* COLUNA ESQUERDA */}
          <div className="xl:col-span-2 space-y-6">
            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tipo === "MASTER" && (
                <>
                  <InfoCard title="Cadastrar Usuários" desc="Gerencie os acessos do sistema." />
                  <InfoCard title="Cadastrar Funcionários" desc="Controle a equipe operacional." />
                  <InfoCard title="Cadastrar Estacionamentos" desc="Gerencie as unidades." />
                  <InfoCard title="Cadastrar Equipamentos" desc="Definir Equipamentos e Controladores IOT que irão automatizar tarefas de guarita." />
                  <InfoCard title="Editar Empresa" desc="Atualize os dados cadastrais." />
                  <InfoCard title="BIs e Fluxo" desc="Acompanhe métricas e ocupação." />
                </>
              )}

              {tipo === "AUDITORIA" && (
                <>
                  <InfoCard title="BIs dos Estacionamentos" desc="Indicadores e relatórios." />
                  <InfoCard title="Fluxo de Veículos" desc="Entradas e saídas em tempo real." />
                  <InfoCard title="Histórico" desc="Consulta completa de movimentações." />
                </>
              )}

              {tipo === "GUARITA" && (
                <>
                  <InfoCard title="Consultar Placa" desc="Verifique vínculo com o estacionamento." />
                  <InfoCard title="Abrir Cancela" desc="Libere acesso de veículos autorizados." />
                </>
              )}
            </div>

            {/* MANUAL */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-700" />
                Como usar
              </h2>

              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Selecione o estacionamento onde irá trabalhar.</li>

                {tipo === "GUARITA" && (
                  <>
                    <li>Digite a placa do veículo.</li>
                    <li>Verifique o vínculo.</li>
                    <li>Abra a cancela se autorizado.</li>
                  </>
                )}

                {tipo === "MASTER" && (
                  <>
                    <li>Gerencie usuários, funcionários e estacionamentos.</li>
                    <li>Acompanhe BIs e fluxo.</li>
                  </>
                )}

                {tipo === "AUDITORIA" && (
                  <>
                    <li>Visualize BIs e relatórios.</li>
                    <li>Consulte histórico e fluxo.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* COLUNA DIREITA — MAPA */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3 h-fit">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              Localização
            </h2>

            <p className="text-xs text-gray-600">
              {endereco.logradouro}, {endereco.cidade} / {endereco.uf}
            </p>

            {mapsSrc ? (
              <div className="w-full h-[200px] rounded-lg overflow-hidden border">
                <iframe
                  src={mapsSrc}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Coordenadas não disponíveis.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>

        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          Menu
        </span>
      </div>

      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}