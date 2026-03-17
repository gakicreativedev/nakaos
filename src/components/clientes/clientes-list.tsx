"use client";

import { useState } from "react";
import Link from "next/link";
import { Magnifier, AltArrowRight, CloseCircle } from "@solar-icons/react";
import { useTransition } from "react";
import { createClient } from "@/actions/clientes";

import type { Client, ClientStatus } from "@/lib/types";

const STATUS_OPTIONS: { label: string; value: ClientStatus | "Todos" }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Ativo", value: "Ativo" },
  { label: "Onboarding", value: "Onboarding" },
  { label: "Pausado", value: "Pausado" },
  { label: "Encerrado", value: "Encerrado" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    Ativo: { bg: "rgba(255,255,255,0.15)", text: "#ffffff", border: "rgba(255,255,255,0.2)" },
    Onboarding: { bg: "rgba(168,85,247,0.25)", text: "#e9d5ff", border: "rgba(168,85,247,0.3)" },
    Pausado: { bg: "rgba(234,179,8,0.25)", text: "#fef08a", border: "rgba(234,179,8,0.3)" },
    Encerrado: { bg: "rgba(107,114,128,0.25)", text: "#d1d5db", border: "rgba(107,114,128,0.3)" },
  };
  const c = colors[status] ?? { bg: "rgba(107,114,128,0.25)", text: "#d1d5db", border: "rgba(107,114,128,0.3)" };
  return (
    <span
      className="px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wide backdrop-blur-sm"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {status}
    </span>
  );
}

const STATUS_GRADIENTS: Record<string, { card: string; line: string }> = {
  Ativo: {
    card: "from-[#2d6b1e] via-[#4a9e2f] to-[#7bcf45]",
    line: "from-[#4a9e2f] via-[#7bcf45] to-[#4a9e2f]",
  },
  Onboarding: {
    card: "from-[#5b21b6] via-[#7c3aed] to-[#a78bfa]",
    line: "from-[#7c3aed] via-[#a78bfa] to-[#7c3aed]",
  },
  Pausado: {
    card: "from-[#92400e] via-[#d97706] to-[#fbbf24]",
    line: "from-[#d97706] via-[#fbbf24] to-[#d97706]",
  },
  Encerrado: {
    card: "from-[#374151] via-[#6b7280] to-[#9ca3af]",
    line: "from-[#6b7280] via-[#9ca3af] to-[#6b7280]",
  },
};

const AVATAR_COLORS = [
  "from-[#2a2a3a] to-[#1a1a1a]",
  "from-[#2a3a2a] to-[#1a1a1a]",
  "from-[#3a2a2a] to-[#1a1a1a]",
  "from-[#2a3a3a] to-[#1a1a1a]",
  "from-[#3a2a3a] to-[#1a1a1a]",
];

interface ClientesListProps {
  clients: Client[];
}

export default function ClientesList({ clients }: ClientesListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "Todos">("Todos");
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = clients.filter((c) => {
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
            {clients.filter((c) => c.status === "Ativo").length} ativos de {clients.length} total
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

      {/* Client Cards */}
      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center text-muted-soft text-sm">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((client, i) => {
            const renewalDate = new Date(client.dataRenovacao);
            const now = new Date();
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const showRenewalAlert = daysUntilRenewal <= 30 && daysUntilRenewal > 0 && client.status === "Ativo";

            return (
              <Link
                key={client.id}
                href={`/clientes/${client.id}`}
                className="group rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                {/* Top section - cover image or status-based gradient */}
                <div 
                  className={`relative h-[110px] p-5 flex flex-col justify-between overflow-hidden ${!client.coverImage ? `bg-gradient-to-br ${(STATUS_GRADIENTS[client.status] ?? STATUS_GRADIENTS.Ativo).card}` : ''}`}
                >
                  {client.coverImage ? (
                    <>
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={client.coverImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`${client.nome} cover`} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    </>
                  ) : (
                    <>
                      {/* Shine effect for gradients */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-0 left-0 w-[60%] h-full bg-gradient-to-r from-white/10 to-transparent rounded-br-[60%]" />
                    </>
                  )}

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xs font-bold text-white">
                      {client.nome[0]}
                    </div>
                    <StatusBadge status={client.status} />
                  </div>

                  <div className="relative z-10 text-right">
                    <p className="text-2xl font-bold text-white tracking-tight leading-none">
                      R$ {client.valorMensal.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-medium">
                      Valor mensal
                    </p>
                  </div>
                </div>

                {/* Accent line between sections */}
                <div className={`h-[2px] bg-gradient-to-r ${(STATUS_GRADIENTS[client.status] ?? STATUS_GRADIENTS.Ativo).line}`} />

                {/* Bottom section - dark with client info */}
                <div className="bg-[#111111] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[15px] font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                        {client.nome}
                      </p>
                      <p className="text-[11px] text-muted-soft mt-0.5">
                        {client.responsavel}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-muted-soft group-hover:text-foreground group-hover:bg-white/[0.08] transition-all">
                      <AltArrowRight size={16} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {client.servicosContratados.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-muted-soft border border-white/[0.04]"
                      >
                        {s}
                      </span>
                    ))}
                    {client.servicosContratados.length > 2 && (
                      <span className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-muted-soft">
                        +{client.servicosContratados.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Renewal alert */}
                  {showRenewalAlert && (
                    <div className="text-[10px] px-2.5 py-1.5 rounded-xl bg-warning/10 text-warning font-medium border border-warning/10 inline-block">
                      Renova em {daysUntilRenewal} dias
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* New Client Modal */}
      {showNewModal && <NewClientModal onClose={() => setShowNewModal(false)} />}
    </>
  );
}

/* ── New Client Modal ── */
function NewClientModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      const res = await createClient(formData);
      if (res?.error) {
        alert(res.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gradient">Novo Cliente</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1" disabled={isPending}>
            <CloseCircle size={18} />
          </button>
        </div>

        <form action={handleCreate} className="flex flex-col gap-4">
          <FormField name="nome" label="Nome da empresa" placeholder="Ex: Studio Zen" required />
          <FormField name="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" />
          <div className="grid grid-cols-2 gap-3">
            <FormField name="responsavel" label="Responsável" placeholder="Nome do contato" required />
            <FormField name="telefone" label="Telefone" placeholder="(00) 00000-0000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField name="email" label="E-mail" placeholder="contato@empresa.com.br" type="email" />
            <FormField name="coverImage" label="URL Imagem de Capa" placeholder="https://exemplo.com/capa.jpg" />
          </div>
          <FormField name="endereco" label="Endereço" placeholder="Rua, número - Cidade, UF" />

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Redes Sociais</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField name="instagram" label="Instagram" placeholder="@usuario" />
              <FormField name="facebook" label="Facebook" placeholder="pagina" />
              <FormField name="linkedin" label="LinkedIn" placeholder="empresa" />
              <FormField name="tiktok" label="TikTok" placeholder="@usuario" />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Contrato</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField name="valorMensal" label="Valor mensal" placeholder="R$ 0,00" />
              <FormField name="dataInicio" label="Data de início" type="date" />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-muted block mb-1.5">Serviços contratados</label>
              <div className="flex flex-wrap gap-2">
                {["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"].map((s) => (
                  <label key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141414] border border-border text-xs text-[#c8c8c8] cursor-pointer hover:border-border-hover transition-colors">
                    <input type="checkbox" name="servicos" value={s} className="accent-info rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-xs font-medium text-muted block mb-1.5">Observações</label>
            <textarea
              name="observacoes"
              placeholder="Notas internas sobre o cliente..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {isPending ? "Criando..." : "Criar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
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
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors"
      />
    </div>
  );
}
