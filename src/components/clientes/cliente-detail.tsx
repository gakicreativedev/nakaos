"use client";

import { useState } from "react";
import Link from "next/link";
import { AltArrowLeft, Gallery, Pen, CloseCircle } from "@solar-icons/react";
import type { Client, ClientStatus, BrandHubData, BrandColor, Task, TaskPriority, Movimentacao } from "@/lib/types";

const TABS = [
  { id: "geral", label: "Dados Gerais" },
  { id: "contrato", label: "Contrato" },
  { id: "brand-hub", label: "Brand Hub" },
  { id: "tarefas", label: "Tarefas" },
  { id: "financeiro", label: "Financeiro" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Ativo: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  Onboarding: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  Pausado: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
  Encerrado: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

const STATUS_OPTIONS = ["Ativo", "Onboarding", "Pausado", "Encerrado"];

function StatusSelector({ clientId, status, canEdit }: { clientId: string; status: string; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const c = STATUS_COLORS[current] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

  const handleChange = async (newStatus: string) => {
    if (newStatus === current) { setOpen(false); return; }
    setSaving(true);
    setOpen(false);
    setCurrent(newStatus);
    const { updateClientStatus } = await import("@/actions/clientes");
    await updateClientStatus(clientId, newStatus);
    setSaving(false);
  };

  if (!canEdit) {
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-medium tracking-wide" style={{ background: c.bg, color: c.text }}>
        {current}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className="px-3 py-1 rounded-lg text-xs font-medium tracking-wide cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{ background: c.bg, color: c.text }}
      >
        {saving ? "..." : current}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-[#1a1a1a] border border-border rounded-xl overflow-hidden shadow-xl min-w-[140px]">
            {STATUS_OPTIONS.map((s) => {
              const sc = STATUS_COLORS[s] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
              return (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-white/[0.05] transition-colors ${s === current ? "bg-white/[0.03]" : ""}`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: sc.text }} />
                  {s}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface ClienteDetailProps {
  client: Client;
  brandHub: BrandHubData | null;
  tasks: Task[];
  movimentacoes: Movimentacao[];
  userRole?: string;
}

export default function ClienteDetail({ client, brandHub, tasks, movimentacoes, userRole }: ClienteDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("geral");

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientMovs = movimentacoes.filter((m) => m.clientId === client.id);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/clientes"
          className="p-2 rounded-xl hover:bg-surface transition-colors text-muted"
        >
          <AltArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gradient tracking-tight truncate">
              {client.nome}
            </h1>
            <StatusSelector clientId={client.id} status={client.status} canEdit={userRole === "Admin" || userRole === "Editor"} />
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
        {activeTab === "geral" && <TabGeral client={client} canEdit={userRole === "Admin" || userRole === "Editor"} />}
        {activeTab === "contrato" && <TabContrato client={client} />}
        {activeTab === "brand-hub" && <TabBrandHub clientId={client.id} brandHub={brandHub} />}
        {activeTab === "tarefas" && <TabTarefas clientId={client.id} tasks={clientTasks} />}
        {activeTab === "financeiro" && <TabFinanceiro clientId={client.id} movimentacoes={clientMovs} />}
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
function TabGeral({ client, canEdit }: { client: Client; canEdit: boolean }) {
  const [showCoverModal, setShowCoverModal] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Imagem de Capa */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gallery size={16} className="text-muted" />
            <h3 className="text-sm font-medium text-gradient">Imagem de Capa</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowCoverModal(true)}
              className="text-muted-soft hover:text-muted transition-colors flex items-center gap-1 text-xs"
            >
              <Pen size={12} /> {client.coverImage ? "Editar" : "Adicionar imagem"}
            </button>
          )}
        </div>

        {client.coverImage ? (
           <div className="rounded-xl overflow-hidden border border-border bg-[#0a0a0a] group relative" style={{ aspectRatio: '3/1' }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={client.coverImage} alt="Capa do cliente" className="w-full h-full object-cover" />
           </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-[#0a0a0a] flex flex-col items-center justify-center py-12 gap-3 aspect-[3/1]">
             <Gallery size={32} className="text-muted-soft" />
             <p className="text-xs text-muted-soft">Nenhuma imagem de capa adicionada.</p>
             {canEdit && (
               <button
                 onClick={() => setShowCoverModal(true)}
                 className="text-xs text-muted-soft hover:text-muted transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-border-hover"
               >
                 Adicionar imagem
               </button>
             )}
          </div>
        )}
      </div>

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
          <InfoField label="Instagram" value={client.redesSociais?.instagram || "—"} />
          <InfoField label="Facebook" value={client.redesSociais?.facebook || "—"} />
          <InfoField label="LinkedIn" value={client.redesSociais?.linkedin || "—"} />
          <InfoField label="TikTok" value={client.redesSociais?.tiktok || "—"} />
        </div>
      </div>

      {/* Observações */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5 lg:col-span-2">
        <h3 className="text-sm font-medium text-gradient mb-3">Observações</h3>
        <p className="text-sm text-[#c8c8c8] leading-relaxed">{client.observacoes || "Nenhuma observação."}</p>
      </div>

      {showCoverModal && (
        <ClientCoverImageModal
          clientId={client.id}
          currentUrl={client.coverImage || ""}
          onClose={() => setShowCoverModal(false)}
        />
      )}
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

/* ── Tab: Brand Hub (embedded) ── */
function TabBrandHub({ clientId, brandHub }: { clientId: string; brandHub: BrandHubData | null }) {

  if (!brandHub) {
    return (
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-muted text-sm font-medium mb-1">Nenhum Brand Hub criado</p>
        <p className="text-muted-soft text-xs mb-4">Crie a identidade visual deste cliente.</p>
        <Link
          href={`/brand-hub/${clientId}`}
          className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors"
        >
          + Criar Brand Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quick overview + link to full page */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-soft">
          Atualizado em {new Date(brandHub.ultimaAtualizacao).toLocaleDateString("pt-BR")}
        </p>
        <Link
          href={`/brand-hub/${clientId}`}
          className="text-xs text-muted-soft hover:text-muted transition-colors"
        >
          Ver completo →
        </Link>
      </div>

      {/* Color palette */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-3">Paleta de Cores</h3>
        <div className="flex gap-2">
          {brandHub.cores.map((cor) => (
            <div key={cor.hex} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl border border-white/10" style={{ background: cor.hex }} />
              <span className="text-[10px] text-muted-soft">{cor.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-2xl border border-border p-4">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Tom de Voz</p>
          <p className="text-sm text-[#c8c8c8]">{brandHub.tomDeVoz}</p>
        </div>
        <div className="bg-[#141414] rounded-2xl border border-border p-4">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Slogan</p>
          <p className="text-sm text-[#c8c8c8]">{brandHub.slogan}</p>
        </div>
      </div>

      {/* Fonts */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-gradient mb-3">Tipografia</h3>
        <div className="flex gap-4">
          {brandHub.fontes.map((f) => (
            <div key={f.nome}>
              <p className="text-sm text-[#c8c8c8] font-medium">{f.nome}</p>
              <p className="text-[11px] text-muted-soft">{f.categoria}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Tarefas (embedded) ── */
const PRIORITY_DOT: Record<string, string> = {
  Urgente: "bg-urgent",
  Alta: "bg-warning",
  Média: "bg-info",
  Baixa: "bg-success",
};

function TabTarefas({ clientId, tasks: clientTasks }: { clientId: string; tasks: Task[] }) {
  if (clientTasks.length === 0) {
    return (
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-muted text-sm font-medium mb-1">Nenhuma tarefa vinculada</p>
        <p className="text-muted-soft text-xs mb-4">Crie tarefas para este cliente no Kanban.</p>
        <Link
          href="/tarefas"
          className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors"
        >
          Ir para Tarefas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-soft">{clientTasks.length} tarefa{clientTasks.length > 1 ? "s" : ""}</p>
        <Link href="/tarefas" className="text-xs text-muted-soft hover:text-muted transition-colors">
          Ver no Kanban →
        </Link>
      </div>
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden">
        {clientTasks.map((task) => {
          const isOverdue = new Date(task.prazo) < new Date();
          return (
            <div key={task.id} className="flex items-center px-5 py-3.5 border-b border-[#1a1a1a] last:border-b-0 gap-3 hover:bg-white/[0.02] transition-colors">
              <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.prioridade] ?? "bg-muted"} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#c8c8c8] truncate">{task.titulo}</p>
                <p className="text-[10px] text-muted-soft mt-0.5">{task.responsavel} · {task.tags.slice(0, 2).join(", ")}</p>
              </div>
              <span className={`text-[11px] ${isOverdue ? "text-urgent font-medium" : "text-muted-soft"}`}>
                {new Date(task.prazo).toLocaleDateString("pt-BR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab: Financeiro (embedded) ── */
function TabFinanceiro({ clientId, movimentacoes: movs }: { clientId: string; movimentacoes: Movimentacao[] }) {
  const totalReceita = movs.filter((m) => m.categoria === "Receita").reduce((s, m) => s + m.valor, 0);
  const totalDespesa = movs.filter((m) => m.categoria !== "Receita").reduce((s, m) => s + m.valor, 0);

  if (movs.length === 0) {
    return (
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-muted text-sm font-medium mb-1">Nenhuma movimentação</p>
        <p className="text-muted-soft text-xs mb-4">Não há lançamentos financeiros para este cliente.</p>
        <Link href="/financas" className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
          Ir para Finanças
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Receita</p>
            <p className="text-lg font-semibold text-success">R$ {totalReceita.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Despesas</p>
            <p className="text-lg font-semibold text-urgent">R$ {totalDespesa.toLocaleString("pt-BR")}</p>
          </div>
        </div>
        <Link href="/financas" className="text-xs text-muted-soft hover:text-muted transition-colors">
          Ver completo →
        </Link>
      </div>
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden">
        {movs.map((mov) => {
          const isReceita = mov.categoria === "Receita";
          return (
            <div key={mov.id} className="flex items-center px-5 py-3 border-b border-[#1a1a1a] last:border-b-0 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#c8c8c8] truncate">{mov.descricao}</p>
                <p className="text-[10px] text-muted-soft mt-0.5">{new Date(mov.data).toLocaleDateString("pt-BR")} · {mov.status}</p>
              </div>
              <span className={`text-sm font-semibold ${isReceita ? "text-success" : "text-urgent"}`}>
                {isReceita ? "+" : "-"} R$ {mov.valor.toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Cover Image Modal ── */
function ClientCoverImageModal({ clientId, currentUrl, onClose }: { clientId: string; currentUrl: string; onClose: () => void }) {
  const [url, setUrl] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { updateClientCoverImage } = await import("@/actions/clientes");
    const result = await updateClientCoverImage(clientId, url);
    if (result.error) { setError(result.error); setSaving(false); return; }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Imagem de Capa</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">URL da Imagem</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://exemplo.com/capa.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors"
            />
          </div>
          <p className="text-[10px] text-muted-soft">Cole o link (URL) direto para uma imagem em alta resolução (ex: .png, .jpg, .webp).</p>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
