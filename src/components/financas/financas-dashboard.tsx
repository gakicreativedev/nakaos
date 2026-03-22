"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CloseCircle, ArrowUp, ArrowDown } from "@solar-icons/react";
import type { Movimentacao, MovimentacaoCategoria, MovimentacaoStatus, Client } from "@/lib/types";

const CATEGORIA_COLORS: Record<string, { bg: string; text: string }> = {
  Receita: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  "Despesa Operacional": { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  Fornecedor: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  "Pró-labore": { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  Investimento: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pago: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  Pendente: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
  Agendado: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Atrasado: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  Cancelado: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

function CategoriaBadge({ categoria }: { categoria: string }) {
  const c = CATEGORIA_COLORS[categoria] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
  return (
    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: c.bg, color: c.text }}>
      {categoria}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
  return (
    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

/* ── Simple Bar Chart (CSS-based) ── */
function BarChart({ data }: { data: { label: string; entradas: number; saidas: number }[] }) {
  const max = Math.max(...data.flatMap((d) => [d.entradas, d.saidas]));
  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex gap-1 items-end w-full justify-center h-24">
            <div
              className="w-4 rounded-t bg-success/60 transition-all"
              style={{ height: `${(d.entradas / max) * 100}%` }}
              title={`Entradas: R$ ${d.entradas.toLocaleString("pt-BR")}`}
            />
            <div
              className="w-4 rounded-t bg-error/60 transition-all"
              style={{ height: `${(d.saidas / max) * 100}%` }}
              title={`Saídas: R$ ${d.saidas.toLocaleString("pt-BR")}`}
            />
          </div>
          <span className="text-[10px] text-outline">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── New Movimentação Modal ── */
function NewMovimentacaoModal({ onClose, clients }: { onClose: () => void; clients: Client[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { createMovimentacao } = await import("@/actions/movimentacoes");
    const result = await createMovimentacao(formData);
    if (result.error) {
      setFormError(result.error);
      setSaving(false);
      return;
    }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Nova Movimentação</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Valor <span className="text-error">*</span></label>
              <input name="valor" type="text" placeholder="R$ 0,00" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Data <span className="text-error">*</span></label>
              <input name="data" type="date" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Categoria <span className="text-error">*</span></label>
            <select name="categoria" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]">
              <option value="">Selecionar...</option>
              <option value="Receita">Receita</option>
              <option value="Despesa Operacional">Despesa Operacional</option>
              <option value="Fornecedor">Fornecedor</option>
              <option value="Pró-labore">Pró-labore</option>
              <option value="Investimento">Investimento</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Descrição</label>
            <input name="descricao" type="text" placeholder="Detalhamento do lançamento" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]" />
          </div>

          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Cliente vinculado</label>
            <select name="clientId" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]">
              <option value="">Nenhum (interno)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Status</label>
            <select name="status" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark]">
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Agendado">Agendado</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Comprovante</label>
            <div className="w-full px-3.5 py-6 rounded-xl border-2 border-dashed border-outline-variant/20 text-center text-outline text-xs cursor-pointer hover:opacity-90 transition-colors">
              Clique para anexar arquivo
            </div>
          </div>

          {formError && <p className="text-error text-sm text-center">{formError}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Criar Movimentação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
interface FinancasDashboardProps {
  movimentacoes: Movimentacao[];
  clients: Client[];
}

export default function FinancasDashboard({ movimentacoes, clients }: FinancasDashboardProps) {
  const [filterCategoria, setFilterCategoria] = useState<MovimentacaoCategoria | "Todas">("Todas");
  const [filterStatus, setFilterStatus] = useState<MovimentacaoStatus | "Todos">("Todos");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const currentMonth = movimentacoes.filter((m) => m.data.startsWith("2026-03"));

  const totalEntradas = currentMonth
    .filter((m) => m.categoria === "Receita" && m.status !== "Cancelado")
    .reduce((sum, m) => sum + m.valor, 0);

  const totalSaidas = currentMonth
    .filter((m) => m.categoria !== "Receita" && m.status !== "Cancelado")
    .reduce((sum, m) => sum + m.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  // Per-client revenue
  const clientRevenue = useMemo(() => {
    return clients
      .filter((c) => c.status === "Ativo" || c.status === "Onboarding")
      .map((c) => ({
        nome: c.nome,
        valor: currentMonth
          .filter((m) => m.clientId === c.id && m.categoria === "Receita")
          .reduce((sum, m) => sum + m.valor, 0),
      }))
      .filter((c) => c.valor > 0);
  }, [clients, currentMonth]);

  // Chart data
  const chartData = [
    { label: "Jan", entradas: 11500, saidas: 6900 },
    { label: "Fev", entradas: 12700, saidas: 7800 },
    { label: "Mar", entradas: totalEntradas, saidas: totalSaidas },
  ];

  // Filtered movimentações
  const filtered = currentMonth.filter((m) => {
    if (filterCategoria !== "Todas" && m.categoria !== filterCategoria) return false;
    if (filterStatus !== "Todos" && m.status !== filterStatus) return false;
    if (search && !m.descricao.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upcoming = currentMonth.filter((m) => {
    const d = new Date(m.data);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff <= 7 && (m.status === "Agendado" || m.status === "Pendente");
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Finanças</h1>
          <p className="text-on-surface-variant text-sm mt-1">Visão financeira de março 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Nova Movimentação
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Saldo do Período" value={saldo} accent={saldo >= 0 ? "success" : "urgent"} />
        <SummaryCard label="Total Entradas" value={totalEntradas} accent="success" />
        <SummaryCard label="Total Saídas" value={totalSaidas} accent="urgent" />
        <SummaryCard label="Resultado" value={totalEntradas > 0 ? ((saldo / totalEntradas) * 100) : 0} isPercent accent={saldo >= 0 ? "success" : "urgent"} />
      </div>

      {/* Charts + Client Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Bar chart */}
        <div className="bg-surface-container-low rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-on-surface">Entradas x Saídas</h2>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-outline">
                <span className="w-2.5 h-2.5 rounded bg-success/60" /> Entradas
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-outline">
                <span className="w-2.5 h-2.5 rounded bg-error/60" /> Saídas
              </span>
            </div>
          </div>
          <BarChart data={chartData} />
        </div>

        {/* Client revenue */}
        <div className="bg-surface-container-low rounded-xl p-5">
          <h2 className="text-sm font-medium text-on-surface mb-4">Receita por Cliente</h2>
          <div className="flex flex-col gap-2.5">
            {clientRevenue.map((c) => (
              <div key={c.nome} className="flex items-center justify-between">
                <span className="text-xs text-on-surface">{c.nome}</span>
                <span className="text-xs font-medium text-success">
                  R$ {c.valor.toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming alerts */}
          {upcoming.length > 0 && (
            <div className="mt-5 pt-4 border-t border-outline-variant/10">
              <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-2">Vencendo em 7 dias</p>
              {upcoming.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-outline truncate mr-2">{m.descricao}</span>
                  <span className="text-xs text-warning font-medium whitespace-nowrap">
                    R$ {m.valor.toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movimentações List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h2 className="text-sm font-medium text-on-surface">Movimentações</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-full bg-surface-container-low border-none text-[11px] text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary outline-none w-36"
            />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value as MovimentacaoCategoria | "Todas")}
              className="px-3 py-2 rounded-full bg-surface-container-low border-none text-[11px] text-outline focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="Todas">Todas categorias</option>
              <option value="Receita">Receita</option>
              <option value="Despesa Operacional">Despesa Operacional</option>
              <option value="Fornecedor">Fornecedor</option>
              <option value="Pró-labore">Pró-labore</option>
              <option value="Investimento">Investimento</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as MovimentacaoStatus | "Todos")}
              className="px-3 py-2 rounded-full bg-surface-container-low border-none text-[11px] text-outline focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="Todos">Todos status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Agendado">Agendado</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-outline text-xs">Nenhuma movimentação encontrada.</div>
          ) : (
            filtered.map((mov) => {
              const isReceita = mov.categoria === "Receita";
              const client = clients.find((c) => c.id === mov.clientId);
              return (
                <div key={mov.id} className="flex items-center px-3 sm:px-5 py-3.5 gap-2 sm:gap-3 hover:bg-surface-container transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isReceita ? "bg-success/10" : "bg-error/10"}`}>
                    {isReceita ? <ArrowUp size={14} color="#4ade80" /> : <ArrowDown size={14} color="#ef4444" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-on-surface truncate">{mov.descricao}</p>
                    <p className="text-[10px] text-outline mt-0.5">
                      {new Date(mov.data).toLocaleDateString("pt-BR")}
                      {client && ` · ${client.nome}`}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <CategoriaBadge categoria={mov.categoria} />
                    <StatusBadge status={mov.status} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap ${isReceita ? "text-success" : "text-error"}`}>
                    {isReceita ? "+" : "-"} R$ {mov.valor.toLocaleString("pt-BR")}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && <NewMovimentacaoModal onClose={() => setShowModal(false)} clients={clients} />}
    </>
  );
}

function SummaryCard({ label, value, accent, isPercent = false }: { label: string; value: number; accent: string; isPercent?: boolean }) {
  const colorClass = accent === "success" ? "text-success" : "text-error";
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6">
      <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-semibold mt-2 tracking-tight ${colorClass}`}>
        {isPercent ? `${value.toFixed(1)}%` : `R$ ${Math.abs(value).toLocaleString("pt-BR")}`}
      </p>
    </div>
  );
}
