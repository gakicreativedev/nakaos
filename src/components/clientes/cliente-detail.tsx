"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Ativo: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  Onboarding: { bg: "rgba(183,196,255,0.12)", text: "#b7c4ff" },
  Pausado: { bg: "rgba(234,179,8,0.12)", text: "#f59e0b" },
  Encerrado: { bg: "rgba(141,144,154,0.12)", text: "#8d909a" },
};

const STATUS_OPTIONS = ["Ativo", "Onboarding", "Pausado", "Encerrado"];

function StatusSelector({ clientId, status, canEdit }: { clientId: string; status: string; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const c = STATUS_COLORS[current] ?? { bg: "rgba(141,144,154,0.12)", text: "#8d909a" };

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
      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: c.bg, color: c.text }}>
        {current}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{ background: c.bg, color: c.text }}
      >
        {saving ? "..." : current}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container border border-outline-variant/15 rounded-xl overflow-hidden shadow-xl min-w-[140px]">
            {STATUS_OPTIONS.map((s) => {
              const sc = STATUS_COLORS[s] ?? { bg: "rgba(141,144,154,0.12)", text: "#8d909a" };
              return (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-surface-container-high transition-colors ${s === current ? "bg-surface-container-high" : ""}`}
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
        <Link href="/clientes" className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <AltArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-on-surface tracking-tight truncate">
              {client.nome}
            </h1>
            <StatusSelector clientId={client.id} status={client.status} canEdit={userRole === "Admin" || userRole === "Editor"} />
          </div>
          <p className="text-on-surface-variant text-sm mt-0.5">{client.responsavel} · {client.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/10 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            {tab.label}
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
      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-on-surface">{value || "—"}</p>
    </div>
  );
}

/* ── Tab: Dados Gerais ── */
function TabGeral({ client, canEdit }: { client: Client; canEdit: boolean }) {
  const [showCoverModal, setShowCoverModal] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Imagem de Capa */}
      <div className="bg-surface-container-low rounded-xl p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gallery size={16} className="text-on-surface-variant" />
            <h3 className="text-sm font-semibold text-on-surface">Imagem de Capa</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowCoverModal(true)}
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs"
            >
              <Pen size={12} /> {client.coverImage ? "Editar" : "Adicionar imagem"}
            </button>
          )}
        </div>

        {client.coverImage ? (
           <div className="rounded-xl overflow-hidden bg-surface-container-lowest group relative" style={{ aspectRatio: '3/1' }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={client.coverImage} alt="Capa do cliente" className="w-full h-full object-cover" />
           </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest flex flex-col items-center justify-center py-12 gap-3 aspect-[3/1]">
             <Gallery size={32} className="text-on-surface-variant" />
             <p className="text-xs text-on-surface-variant">Nenhuma imagem de capa adicionada.</p>
             {canEdit && (
               <button
                 onClick={() => setShowCoverModal(true)}
                 className="text-xs text-primary hover:opacity-80 transition-opacity px-4 py-2 rounded-full bg-primary/10"
               >
                 Adicionar imagem
               </button>
             )}
          </div>
        )}
      </div>

      {/* Informações Básicas */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Informações Básicas</h3>
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
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Redes Sociais</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Instagram" value={client.redesSociais?.instagram || "—"} />
          <InfoField label="Facebook" value={client.redesSociais?.facebook || "—"} />
          <InfoField label="LinkedIn" value={client.redesSociais?.linkedin || "—"} />
          <InfoField label="TikTok" value={client.redesSociais?.tiktok || "—"} />
        </div>
      </div>

      {/* Observações */}
      <div className="bg-surface-container-low rounded-xl p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-on-surface mb-3">Observações</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">{client.observacoes || "Nenhuma observação."}</p>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Renewal Alert */}
      {showAlert && (
        <div className="lg:col-span-2 bg-warning/5 rounded-xl p-5 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
          <p className="text-sm text-warning">
            Contrato renova em <strong>{daysUntilRenewal} dias</strong> ({renewalDate.toLocaleDateString("pt-BR")})
          </p>
        </div>
      )}

      {/* Detalhes do Contrato */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Detalhes do Contrato</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Valor mensal" value={`R$ ${client.valorMensal.toLocaleString("pt-BR")}`} />
          <InfoField label="Status" value={client.status} />
          <InfoField label="Data de início" value={new Date(client.dataInicio).toLocaleDateString("pt-BR")} />
          <InfoField label="Renovação" value={renewalDate.toLocaleDateString("pt-BR")} />
        </div>
      </div>

      {/* Serviços Contratados */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Serviços Contratados</h3>
        <div className="flex flex-col gap-2">
          {client.servicosContratados.map((s) => (
            <div key={s} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-lowest">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              <span className="text-sm text-on-surface">{s}</span>
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
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20 p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhum Brand Hub criado</p>
        <p className="text-outline text-xs mb-4">Crie a identidade visual deste cliente.</p>
        <Link
          href={`/brand-hub/${clientId}`}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Criar Brand Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-on-surface-variant">
          Atualizado em {new Date(brandHub.ultimaAtualizacao).toLocaleDateString("pt-BR")}
        </p>
        <Link href={`/brand-hub/${clientId}`} className="text-xs text-primary hover:opacity-80 transition-opacity">
          Ver completo →
        </Link>
      </div>

      {/* Color palette */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-3">Paleta de Cores</h3>
        <div className="flex gap-3">
          {brandHub.cores.map((cor) => (
            <div key={cor.hex} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl" style={{ background: cor.hex }} />
              <span className="text-[10px] text-on-surface-variant">{cor.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-5">
          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Tom de Voz</p>
          <p className="text-sm text-on-surface">{brandHub.tomDeVoz}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5">
          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Slogan</p>
          <p className="text-sm text-on-surface">{brandHub.slogan}</p>
        </div>
      </div>

      {/* Fonts */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-3">Tipografia</h3>
        <div className="flex gap-6">
          {brandHub.fontes.map((f) => (
            <div key={f.nome}>
              <p className="text-sm text-on-surface font-medium">{f.nome}</p>
              <p className="text-[11px] text-on-surface-variant">{f.categoria}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Tarefas (embedded) ── */
const PRIORITY_DOT: Record<string, string> = { Urgente: "bg-error", Alta: "bg-warning", Média: "bg-secondary", Baixa: "bg-success" };

function TabTarefas({ clientId, tasks: clientTasks }: { clientId: string; tasks: Task[] }) {
  if (clientTasks.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20 p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhuma tarefa vinculada</p>
        <p className="text-outline text-xs mb-4">Crie tarefas para este cliente no Kanban.</p>
        <Link href="/tarefas" className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">Ir para Tarefas</Link>
      </div>
    );
  }

  const overdue = clientTasks.filter((t) => new Date(t.prazo) < new Date()).length;
  const urgent = clientTasks.filter((t) => t.prioridade === "Urgente").length;
  const totalEtapas = clientTasks.reduce((s, t) => s + t.etapas.length, 0);
  const doneEtapas = clientTasks.reduce((s, t) => s + t.etapas.filter((e) => e.concluida).length, 0);
  const pct = totalEtapas > 0 ? Math.round((doneEtapas / totalEtapas) * 100) : 0;
  const services = [...new Set(clientTasks.map((t) => t.servico).filter(Boolean))];

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest rounded-xl p-3"><p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Total</p><p className="text-lg font-semibold text-on-surface">{clientTasks.length}</p></div>
        <div className="bg-surface-container-lowest rounded-xl p-3"><p className="text-[10px] text-error uppercase tracking-widest">Urgentes</p><p className="text-lg font-semibold text-error">{urgent}</p></div>
        <div className="bg-surface-container-lowest rounded-xl p-3"><p className="text-[10px] text-warning uppercase tracking-widest">Atrasadas</p><p className="text-lg font-semibold text-warning">{overdue}</p></div>
        <div className="bg-surface-container-lowest rounded-xl p-3"><p className="text-[10px] text-success uppercase tracking-widest">Progresso</p><p className="text-lg font-semibold text-success">{pct}%</p></div>
      </div>

      {/* Service breakdown */}
      {services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {services.map((svc) => <span key={svc} className="text-[10px] px-2.5 py-1 rounded-xl bg-surface-container text-on-surface-variant">{svc} <span className="text-on-surface font-semibold">{clientTasks.filter((t) => t.servico === svc).length}</span></span>)}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-xs text-on-surface-variant">{clientTasks.length} tarefa{clientTasks.length > 1 ? "s" : ""}</p>
        <Link href="/tarefas" className="text-xs text-primary hover:opacity-80 transition-opacity">Abrir Kanban →</Link>
      </div>

      {/* Task table */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-medium border-b border-outline-variant/10">
          <span>Tarefa</span><span>Serviço</span><span>Prioridade</span><span>Prazo</span>
        </div>
        {clientTasks.map((task) => {
          const isOverdue = new Date(task.prazo) < new Date();
          return (
            <div key={task.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-4 py-3 hover:bg-surface-container transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{task.titulo}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{task.responsavel}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{task.servico || "Geral"}</span>
              <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.prioridade] ?? "bg-outline"}`} /><span className="text-[10px] text-on-surface-variant">{task.prioridade}</span></span>
              <span className={`text-[11px] ${isOverdue ? "text-error font-medium" : "text-on-surface-variant"}`}>{new Date(task.prazo).toLocaleDateString("pt-BR")}</span>
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
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20 p-8 flex flex-col items-center text-center min-h-[200px]">
        <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhuma movimentação</p>
        <p className="text-outline text-xs mb-4">Não há lançamentos financeiros para este cliente.</p>
        <Link href="/financas" className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
          Ir para Finanças
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Receita</p>
            <p className="text-lg font-semibold text-success">R$ {totalReceita.toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Despesas</p>
            <p className="text-lg font-semibold text-error">R$ {totalDespesa.toLocaleString("pt-BR")}</p>
          </div>
        </div>
        <Link href="/financas" className="text-xs text-primary hover:opacity-80 transition-opacity">
          Ver completo →
        </Link>
      </div>
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        {movs.map((mov) => {
          const isReceita = mov.categoria === "Receita";
          return (
            <div key={mov.id} className="flex items-center px-6 py-4 gap-3 hover:bg-surface-container transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{mov.descricao}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{new Date(mov.data).toLocaleDateString("pt-BR")} · {mov.status}</p>
              </div>
              <span className={`text-sm font-semibold ${isReceita ? "text-success" : "text-error"}`}>
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
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant/15 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-on-surface">Imagem de Capa</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">URL da Imagem</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://exemplo.com/capa.jpg"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <p className="text-[10px] text-on-surface-variant">Cole o link (URL) direto para uma imagem em alta resolução.</p>
          {error && <p className="text-error text-xs">{error}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
