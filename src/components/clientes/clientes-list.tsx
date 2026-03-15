"use client";

import { useState } from "react";
import Link from "next/link";
import { Magnifier, AltArrowRight, CloseCircle } from "@solar-icons/react";

import { MOCK_CLIENTS, type ClientStatus } from "@/lib/mock-data";

const STATUS_OPTIONS: { label: string; value: ClientStatus | "Todos" }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Ativo", value: "Ativo" },
  { label: "Onboarding", value: "Onboarding" },
  { label: "Pausado", value: "Pausado" },
  { label: "Encerrado", value: "Encerrado" },
];

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

const AVATAR_COLORS = [
  "from-[#2a2a3a] to-[#1a1a1a]",
  "from-[#2a3a2a] to-[#1a1a1a]",
  "from-[#3a2a2a] to-[#1a1a1a]",
  "from-[#2a3a3a] to-[#1a1a1a]",
  "from-[#3a2a3a] to-[#1a1a1a]",
];

export default function ClientesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "Todos">("Todos");
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gradient tracking-tight">Clientes</h1>
          <p className="text-muted text-sm mt-1">
            {MOCK_CLIENTS.filter((c) => c.status === "Ativo").length} ativos de {MOCK_CLIENTS.length} total
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors"
        >
          + Novo Cliente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Magnifier size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === opt.value
                  ? "bg-gradient-to-t from-[#191919] to-[#2a2a2a] text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  : "text-muted-soft hover:text-muted hover:bg-surface"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted-soft text-sm">
            Nenhum cliente encontrado.
          </div>
        ) : (
          filtered.map((client, i) => {
            const renewalDate = new Date(client.dataRenovacao);
            const now = new Date();
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const showRenewalAlert = daysUntilRenewal <= 30 && daysUntilRenewal > 0 && client.status === "Ativo";

            return (
              <Link
                key={client.id}
                href={`/clientes/${client.id}`}
                className="flex items-center px-5 py-4 border-b border-[#1a1a1a] gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-semibold text-muted shrink-0`}
                >
                  {client.nome[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#c8c8c8] truncate">{client.nome}</p>
                    {showRenewalAlert && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-warning/15 text-warning font-medium shrink-0">
                        Renova em {daysUntilRenewal}d
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-soft mt-0.5">
                    {client.responsavel} · {client.servicosContratados.length} serviço{client.servicosContratados.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="hidden sm:block text-right mr-2">
                  <p className="text-sm font-medium text-[#c8c8c8]">
                    R$ {client.valorMensal.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-[11px] text-muted-soft">/mês</p>
                </div>
                <StatusBadge status={client.status} />
                <AltArrowRight size={16} className="text-muted-soft shrink-0" />
              </Link>
            );
          })
        )}
      </div>

      {/* New Client Modal */}
      {showNewModal && <NewClientModal onClose={() => setShowNewModal(false)} />}
    </>
  );
}

/* ── New Client Modal ── */
function NewClientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gradient">Novo Cliente</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <FormField label="Nome da empresa" placeholder="Ex: Studio Zen" required />
          <FormField label="CNPJ" placeholder="00.000.000/0000-00" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Responsável" placeholder="Nome do contato" required />
            <FormField label="Telefone" placeholder="(00) 00000-0000" />
          </div>
          <FormField label="E-mail" placeholder="contato@empresa.com.br" type="email" />
          <FormField label="Endereço" placeholder="Rua, número - Cidade, UF" />

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Redes Sociais</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Instagram" placeholder="@usuario" />
              <FormField label="Facebook" placeholder="pagina" />
              <FormField label="LinkedIn" placeholder="empresa" />
              <FormField label="TikTok" placeholder="@usuario" />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Contrato</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor mensal" placeholder="R$ 0,00" />
              <FormField label="Data de início" type="date" />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-muted block mb-1.5">Serviços contratados</label>
              <div className="flex flex-wrap gap-2">
                {["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"].map((s) => (
                  <label key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141414] border border-border text-xs text-[#c8c8c8] cursor-pointer hover:border-border-hover transition-colors">
                    <input type="checkbox" className="accent-info rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-xs font-medium text-muted block mb-1.5">Observações</label>
            <textarea
              placeholder="Notas internas sobre o cliente..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
              Criar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted block mb-1.5">
        {label}
        {required && <span className="text-urgent ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors"
      />
    </div>
  );
}
