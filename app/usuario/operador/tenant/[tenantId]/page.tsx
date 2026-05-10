"use client";

import { useMyAccessInTenant } from "@/features/acesso";
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
      <div className="p-10 text-center text-muted-foreground">
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
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {meuAcesso.empresa.nome}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              {perfilIcon}
              Perfil: <b className="text-foreground">{tipo}</b>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3">
            <h2 className="text-lg font-semibold text-foreground">
              O que você pode fazer
            </h2>
          </div>

          <div className="xl:col-span-2 space-y-6">
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

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                <BookOpen className="w-4 h-4 text-primary" />
                Como usar
              </h2>

              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
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

          <div className="bg-card rounded-2xl shadow-sm border border-border p-4 space-y-3 h-fit">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Localização
            </h2>

            <p className="text-xs text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
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
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>

        <span className="text-[10px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded">
          Menu
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}