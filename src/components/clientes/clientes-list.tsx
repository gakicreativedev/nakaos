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
  const colors: Record<string, { bg: string; text: string }> = {
    Ativo: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
    Onboarding: { bg: "rgba(183,196,255,0.12)", text: "#b7c4ff" },
    Pausado: { bg: "rgba(234,179,8,0.12)", text: "#f59e0b" },
    Encerrado: { bg: "rgba(141,144,154,0.12)", text: "#8d909a" },
  };
  const c = colors[status] ?? { bg: "rgba(141,144,154,0.12)", text: "#8d909a" };
  return (
    <span
      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

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
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Clientes</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {clients.filter((c) => c.status === "Ativo").length} ativos de {clients.length} total
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Novo Cliente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Magnifier size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === opt.value
                  ? "bg-primary-container/20 text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant text-sm">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => {
            const renewalDate = new Date(client.dataRenovacao);
            const now = new Date();
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const showRenewalAlert = daysUntilRenewal <= 30 && daysUntilRenewal > 0 && client.status === "Ativo";
            const isPaused = client.status === "Pausado" || client.status === "Encerrado";

            return (
              <Link
                key={client.id}
                href={`/clientes/${client.id}`}
                className={`group rounded-xl overflow-hidden transition-all duration-300 ${
                  isPaused
                    ? "bg-surface-container-low/40 opacity-60 hover:opacity-80"
                    : "bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                {/* Cover / Header */}
                <div className="relative h-[100px] overflow-hidden">
                  {client.coverImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.coverImage} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPaused ? "grayscale" : ""}`} alt={`${client.nome} cover`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-surface-container-lowest" />
                  )}
                  <div className="relative z-10 flex items-start justify-between p-4">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-primary">
                      {client.nome[0]}
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {client.nome}
                      </p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {client.responsavel}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                      <AltArrowRight size={16} />
                    </div>
                  </div>

                  {/* Value */}
                  <p className="text-lg font-semibold text-on-surface tracking-tight mb-3">
                    R$ {client.valorMensal.toLocaleString("pt-BR")}
                    <span className="text-[10px] text-on-surface-variant font-normal ml-1 uppercase tracking-widest">/mês</span>
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {client.servicosContratados.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant"
                      >
                        {s}
                      </span>
                    ))}
                    {client.servicosContratados.length > 2 && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                        +{client.servicosContratados.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Renewal alert */}
                  {showRenewalAlert && (
                    <div className="text-[10px] px-3 py-1.5 rounded-full bg-warning/10 text-warning font-bold uppercase tracking-widest inline-block">
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
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Novo Cliente</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1" disabled={isPending}>
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

          <div className="pt-6 mt-2">
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-3">Redes Sociais</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField name="instagram" label="Instagram" placeholder="@usuario" />
              <FormField name="facebook" label="Facebook" placeholder="pagina" />
              <FormField name="linkedin" label="LinkedIn" placeholder="empresa" />
              <FormField name="tiktok" label="TikTok" placeholder="@usuario" />
            </div>
          </div>

          <div className="pt-6 mt-2">
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-3">Contrato</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField name="valorMensal" label="Valor mensal" placeholder="R$ 0,00" />
              <FormField name="dataInicio" label="Data de início" type="date" />
            </div>
            <div className="mt-3">
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Serviços contratados</label>
              <div className="flex flex-wrap gap-2">
                {["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"].map((s) => (
                  <label key={s} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input type="checkbox" name="servicos" value={s} className="accent-secondary rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Observações</label>
            <textarea
              name="observacoes"
              placeholder="Notas internas sobre o cliente..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
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
      <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]"
      />
    </div>
  );
}
