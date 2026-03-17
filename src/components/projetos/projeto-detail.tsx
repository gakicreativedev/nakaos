"use client";

import { useState } from "react";
import Link from "next/link";
import { AltArrowLeft, CloseCircle, Pen, Figma } from "@solar-icons/react";
import type {
  Projeto,
  ProjetoColor,
  ProjetoFont,
  ProjetoAsset,
  ProjetoKanbanColumn,
  ProjetoTask,
  ProjetoMembro,
  ProjetoLogo,
  ProjetoIdentidade,
  ProjetoHistorico,
  Usuario,
} from "@/lib/types";
import ProjetoBrand from "./projeto-brand";
import ProjetoKanban from "./projeto-kanban";
import ProjetoAssets from "./projeto-assets";
import ProjetoMembros from "./projeto-membros";

const TABS = [
  { id: "geral", label: "Geral" },
  { id: "brand", label: "Brand" },
  { id: "tarefas", label: "Tarefas" },
  { id: "galeria", label: "Galeria" },
  { id: "membros", label: "Membros" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Ativo: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  Pausado: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
  Concluído: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Arquivado: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

const STATUS_OPTIONS = ["Ativo", "Pausado", "Concluído", "Arquivado"];

function StatusSelector({ projetoId, status, canEdit }: { projetoId: string; status: string; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const c = STATUS_COLORS[current] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

  const handleChange = async (newStatus: string) => {
    if (newStatus === current) { setOpen(false); return; }
    setSaving(true);
    setOpen(false);
    setCurrent(newStatus);
    const { updateProjetoStatus } = await import("@/actions/projetos");
    await updateProjetoStatus(projetoId, newStatus);
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

interface ProjetoDetailProps {
  projeto: Projeto;
  colors: ProjetoColor[];
  fonts: ProjetoFont[];
  assets: ProjetoAsset[];
  columns: ProjetoKanbanColumn[];
  tasks: ProjetoTask[];
  membros: ProjetoMembro[];
  logos: ProjetoLogo[];
  identidade: ProjetoIdentidade | null;
  historico: ProjetoHistorico[];
  usuarios: Usuario[];
  userRole: string;
}

export default function ProjetoDetail({
  projeto,
  colors,
  fonts,
  assets,
  columns,
  tasks,
  membros,
  logos,
  identidade,
  historico,
  usuarios,
  userRole,
}: ProjetoDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("geral");
  const canEdit = userRole === "Admin" || userRole === "Editor";

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/projetos" className="p-2 rounded-xl hover:bg-surface transition-colors text-muted">
          <AltArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gradient tracking-tight truncate">
              {projeto.nome}
            </h1>
            <StatusSelector projetoId={projeto.id} status={projeto.status} canEdit={canEdit} />
          </div>
          <p className="text-muted text-sm mt-0.5">
            Criado em {new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-foreground" : "text-muted-soft hover:text-muted"
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
        {activeTab === "geral" && <TabGeral projeto={projeto} canEdit={canEdit} />}
        {activeTab === "brand" && <ProjetoBrand projetoId={projeto.id} colors={colors} fonts={fonts} logos={logos} identidade={identidade} historico={historico} canEdit={canEdit} />}
        {activeTab === "tarefas" && <ProjetoKanban projetoId={projeto.id} columns={columns} tasks={tasks} membros={membros} usuarios={usuarios} canEdit={canEdit} />}
        {activeTab === "galeria" && <ProjetoAssets projetoId={projeto.id} assets={assets} canEdit={canEdit} />}
        {activeTab === "membros" && <ProjetoMembros projetoId={projeto.id} membros={membros} usuarios={usuarios} canEdit={canEdit} />}
      </div>
    </>
  );
}

function TabGeral({ projeto, canEdit }: { projeto: Projeto; canEdit: boolean }) {
  const [showFigmaModal, setShowFigmaModal] = useState(false);

  /* Build Figma embed URL from any figma.com link */
  const figmaEmbedUrl = projeto.figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(projeto.figmaUrl)}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
          <h3 className="text-sm font-medium text-gradient mb-4">Informações do Projeto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Nome</p>
              <p className="text-sm text-[#c8c8c8]">{projeto.nome}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm text-[#c8c8c8]">{projeto.status}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Criado Em</p>
              <p className="text-sm text-[#c8c8c8]">{new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">Atualizado Em</p>
              <p className="text-sm text-[#c8c8c8]">{new Date(projeto.atualizadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
          <h3 className="text-sm font-medium text-gradient mb-3">Descrição</h3>
          <p className="text-sm text-[#c8c8c8] leading-relaxed">{projeto.descricao || "Nenhuma descrição."}</p>
        </div>
      </div>

      {/* Figma Preview */}
      <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Figma size={16} className="text-muted" />
            <h3 className="text-sm font-medium text-gradient">Figma</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowFigmaModal(true)}
              className="text-muted-soft hover:text-muted transition-colors flex items-center gap-1 text-xs"
            >
              <Pen size={12} /> {projeto.figmaUrl ? "Editar" : "Adicionar link"}
            </button>
          )}
        </div>

        {figmaEmbedUrl ? (
          <div className="rounded-xl overflow-hidden border border-border bg-[#0a0a0a]">
            <iframe
              src={figmaEmbedUrl}
              className="w-full border-0"
              style={{ height: "480px" }}
              allowFullScreen
            />
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
              <p className="text-[11px] text-muted-soft truncate max-w-[70%]">{projeto.figmaUrl}</p>
              <a
                href={projeto.figmaUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-soft hover:text-muted transition-colors px-2.5 py-1 rounded-lg border border-border hover:border-border-hover"
              >
                Abrir no Figma
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-[#0a0a0a] flex flex-col items-center justify-center py-12 gap-3">
            <Figma size={32} className="text-muted-soft" />
            <p className="text-xs text-muted-soft">Nenhum link do Figma adicionado.</p>
            {canEdit && (
              <button
                onClick={() => setShowFigmaModal(true)}
                className="text-xs text-muted-soft hover:text-muted transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-border-hover"
              >
                Adicionar link
              </button>
            )}
          </div>
        )}
      </div>

      {showFigmaModal && (
        <FigmaLinkModal
          projetoId={projeto.id}
          currentUrl={projeto.figmaUrl || ""}
          onClose={() => setShowFigmaModal(false)}
        />
      )}
    </div>
  );
}

/* ── Figma Link Modal ── */
function FigmaLinkModal({ projetoId, currentUrl, onClose }: { projetoId: string; currentUrl: string; onClose: () => void }) {
  const [url, setUrl] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !url.includes("figma.com")) {
      setError("O link deve ser do Figma (figma.com).");
      return;
    }
    setSaving(true);
    const { updateProjetoFigmaUrl } = await import("@/actions/projetos");
    const result = await updateProjetoFigmaUrl(projetoId, url);
    if (result.error) { setError(result.error); setSaving(false); return; }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Link do Figma</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">URL do arquivo no Figma</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.figma.com/design/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors"
            />
          </div>
          <p className="text-[10px] text-muted-soft">Cole o link do arquivo, frame ou protótipo do Figma. A pré-visualização será carregada automaticamente.</p>
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
