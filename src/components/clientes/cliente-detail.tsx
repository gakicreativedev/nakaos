"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CLIENTS, type Client, type ClientStatus } from "@/lib/mock-data";

const TABS = [
  { id: "geral", label: "Dados Gerais" },
  { id: "contrato", label: "Contrato" },
  { id: "brand-hub", label: "Brand Hub" },
  { id: "tarefas", label: "Tarefas" },
  { id: "financeiro", label: "Financeiro" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function StatusBadge({ status }: { status: ClientStatus }) {
  const colors: Record<ClientStatus, { bg: string; text: string }> = {
    Ativo: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    Onboarding: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
    Pausado: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
    Encerrado: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
  };
  const c = colors[status];
  return (
    <span
      className="px-3 py-1 rounded-lg text-xs font-medium tracking-wide"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

export default function ClienteDetail({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("geral");
  const client = MOCK_CLIENTS.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-soft">
        <p className="text-lg">Cliente não encontrado</p>
        <Link href="/clientes" className="text-sm mt-2 text-info hover:underline">
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/clientes"
          className="p-2 rounded-xl hover:bg-surface transition-colors text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M13 15L8 10L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gradient tracking-tight truncate">
              {client.nome}
            </h1>
            <StatusBadge status={client.status} />
          </div>
          <p className="text-muted text-sm mt-0.5">{client.responsavel} · {client.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-soft hover:text-muted"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#ebebeb] to-[#a2a2a2] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "geral" && <TabGeral client={client} />}
        {activeTab === "contrato" && <TabContrato client={client} />}
        {activeTab === "brand-hub" && <TabPlaceholder title="Brand Hub" description="O Brand Hub deste cliente será implementado na Fase 3." />}
        {activeTab === "tarefas" && <TabPlaceholder title="Tarefas" description="As tarefas vinculadas serão implementadas na Fase 4." />}
        {activeTab === "financeiro" && <TabPlaceholder title="Financeiro" description="O módulo financeiro será implementado na Fase 5." />}
      </div>
    </>
  );
}

/* ── Info Field ── */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-[#c8c8c8]">{value || "—"}</p>
    </div>
  );
}

/* ── Tab: Dados Gerais ── */
function TabGeral({ client }: { client: Client }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Informações Básicas */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-4">Informações Básicas</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Nome" value={client.nome} />
          <InfoField label="CNPJ" value={client.cnpj} />
          <InfoField label="Responsável" value={client.responsavel} />
          <InfoField label="Telefone" value={client.telefone} />
          <InfoField label="E-mail" value={client.email} />
          <InfoField label="Endereço" value={client.endereco} />
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-4">Redes Sociais</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Instagram" value={client.redesSociais.instagram || "—"} />
          <InfoField label="Facebook" value={client.redesSociais.facebook || "—"} />
          <InfoField label="LinkedIn" value={client.redesSociais.linkedin || "—"} />
          <InfoField label="TikTok" value={client.redesSociais.tiktok || "—"} />
        </div>
      </div>

      {/* Observações */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5 lg:col-span-2">
        <h3 className="text-sm font-medium text-gradient mb-3">Observações</h3>
        <p className="text-sm text-[#c8c8c8] leading-relaxed">{client.observacoes || "Nenhuma observação."}</p>
      </div>
    </div>
  );
}

/* ── Tab: Contrato ── */
function TabContrato({ client }: { client: Client }) {
  const renewalDate = new Date(client.dataRenovacao);
  const now = new Date();
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const showAlert = daysUntilRenewal <= 30 && daysUntilRenewal > 0 && client.status === "Ativo";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Renewal Alert */}
      {showAlert && (
        <div className="lg:col-span-2 bg-gradient-to-b from-[#1d1d15] to-[#14140f] rounded-2xl border border-[#2e2e1c] p-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
          <p className="text-sm text-warning">
            Contrato renova em <strong>{daysUntilRenewal} dias</strong> ({renewalDate.toLocaleDateString("pt-BR")})
          </p>
        </div>
      )}

      {/* Detalhes do Contrato */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-4">Detalhes do Contrato</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Valor mensal" value={`R$ ${client.valorMensal.toLocaleString("pt-BR")}`} />
          <InfoField label="Status" value={client.status} />
          <InfoField label="Data de início" value={new Date(client.dataInicio).toLocaleDateString("pt-BR")} />
          <InfoField label="Renovação" value={renewalDate.toLocaleDateString("pt-BR")} />
        </div>
      </div>

      {/* Serviços Contratados */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-4">Serviços Contratados</h3>
        <div className="flex flex-col gap-2">
          {client.servicosContratados.map((s) => (
            <div key={s} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#141414] border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              <span className="text-sm text-[#c8c8c8]">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Placeholder Tab ── */
function TabPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
      <p className="text-muted text-sm font-medium mb-1">{title}</p>
      <p className="text-muted-soft text-xs">{description}</p>
    </div>
  );
}
