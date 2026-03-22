"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AltArrowLeft, CloseCircle, Pen, Figma, Gallery, TrashBinMinimalistic, CheckCircle } from "@solar-icons/react";
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
      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: c.bg, color: c.text }}>
        {current}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{ background: c.bg, color: c.text }}
      >
        {saving ? "..." : current}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-surface-container border border-outline-variant/15 rounded-xl overflow-hidden shadow-xl min-w-[140px]">
            {STATUS_OPTIONS.map((s) => {
              const sc = STATUS_COLORS[s] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
              return (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-surface-container transition-colors ${s === current ? "bg-surface-container" : ""}`}
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("geral");
  const canEdit = userRole === "Admin" || userRole === "Editor";
  const [editingHeader, setEditingHeader] = useState(false);
  const [editNome, setEditNome] = useState(projeto.nome);
  const [editDescricao, setEditDescricao] = useState(projeto.descricao);
  const [savingHeader, setSavingHeader] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveHeader = async () => {
    if (!editNome.trim()) return;
    setSavingHeader(true);
    const { updateProjeto } = await import("@/actions/projetos");
    await updateProjeto(projeto.id, editNome, editDescricao);
    setSavingHeader(false);
    setEditingHeader(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { deleteProjeto } = await import("@/actions/projetos");
    await deleteProjeto(projeto.id);
    router.push("/projetos");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/projetos" className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
          <AltArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          {editingHeader ? (
            <div className="flex flex-col gap-2">
              <input value={editNome} onChange={(e) => setEditNome(e.target.value)} autoFocus
                className="text-2xl font-semibold text-on-surface bg-surface-container-low border-none rounded-xl px-3 py-1 outline-none focus:ring-1 focus:ring-primary w-full"
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveHeader(); if (e.key === "Escape") { setEditingHeader(false); setEditNome(projeto.nome); setEditDescricao(projeto.descricao); } }} />
              <input value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} placeholder="Descrição do projeto..."
                className="text-sm text-on-surface-variant bg-surface-container-low border-none rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary w-full" />
              <div className="flex gap-2">
                <button onClick={handleSaveHeader} disabled={savingHeader} className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-1">
                  <CheckCircle size={12} /> {savingHeader ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => { setEditingHeader(false); setEditNome(projeto.nome); setEditDescricao(projeto.descricao); }} className="px-4 py-1.5 rounded-full text-xs text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-on-surface tracking-tight truncate">{projeto.nome}</h1>
                <StatusSelector projetoId={projeto.id} status={projeto.status} canEdit={canEdit} />
                {canEdit && (
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => setEditingHeader(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" title="Editar projeto"><Pen size={14} /></button>
                    <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors" title="Excluir projeto"><TrashBinMinimalistic size={14} /></button>
                  </div>
                )}
              </div>
              <p className="text-on-surface-variant text-sm mt-0.5">
                {projeto.descricao ? `${projeto.descricao} · ` : ""}Criado em {new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-sm font-semibold text-on-surface mb-2">Excluir projeto &quot;{projeto.nome}&quot;?</h3>
            <p className="text-xs text-on-surface-variant mb-4">Todas as tarefas, colunas, membros, brand e assets serão excluídos permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 rounded-full bg-error/20 text-sm font-medium text-error hover:bg-error/30 disabled:opacity-50">
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface-variant"
            }`}
          >
            {tab.label}
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
  const [showCoverModal, setShowCoverModal] = useState(false);

  /* Build Figma embed URL from any figma.com link */
  const figmaEmbedUrl = projeto.figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(projeto.figmaUrl)}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-xl p-5">
          <h3 className="text-sm font-medium text-on-surface mb-4">Informações do Projeto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Nome</p>
              <p className="text-sm text-on-surface">{projeto.nome}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm text-on-surface">{projeto.status}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Criado Em</p>
              <p className="text-sm text-on-surface">{new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">Atualizado Em</p>
              <p className="text-sm text-on-surface">{new Date(projeto.atualizadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5">
          <h3 className="text-sm font-medium text-on-surface mb-3">Descrição</h3>
          <p className="text-sm text-on-surface leading-relaxed">{projeto.descricao || "Nenhuma descrição."}</p>
        </div>
      </div>

      {/* Cover Image Preview */}
      <div className="bg-surface-container-low rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
            <Gallery size={16} className="text-on-surface-variant" />
             <h3 className="text-sm font-medium text-on-surface">Imagem de Capa</h3>
           </div>
           {canEdit && (
             <button
               onClick={() => setShowCoverModal(true)}
               className="text-outline hover:text-on-surface-variant transition-colors flex items-center gap-1 text-xs"
             >
               <Pen size={12} /> {projeto.coverImage ? "Editar" : "Adicionar imagem"}
             </button>
           )}
        </div>

        {projeto.coverImage ? (
           <div className="rounded-xl overflow-hidden bg-surface group relative" style={{ aspectRatio: '3/1' }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={projeto.coverImage} alt="Capa do projeto" className="w-full h-full object-cover" />
           </div>
        ) : (
          <div className="border-2 border-dashed border-outline-variant/20 rounded-xl bg-surface flex flex-col items-center justify-center py-12 gap-3 aspect-[3/1]">
             <Gallery size={32} className="text-outline" />
             <p className="text-xs text-outline">Nenhuma imagem de capa adicionada.</p>
             {canEdit && (
               <button
                 onClick={() => setShowCoverModal(true)}
                 className="text-xs text-outline hover:text-on-surface-variant transition-colors px-3 py-1.5 rounded-full border border-outline-variant/10 hover:border-outline/30"
               >
                 Adicionar imagem
               </button>
             )}
          </div>
        )}
      </div>

      {/* Figma Preview */}
      <div className="bg-surface-container-low rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Figma size={16} className="text-on-surface-variant" />
            <h3 className="text-sm font-medium text-on-surface">Figma</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowFigmaModal(true)}
              className="text-outline hover:text-on-surface-variant transition-colors flex items-center gap-1 text-xs"
            >
              <Pen size={12} /> {projeto.figmaUrl ? "Editar" : "Adicionar link"}
            </button>
          )}
        </div>

        {figmaEmbedUrl ? (
          <div className="rounded-xl overflow-hidden bg-surface">
            <iframe
              src={figmaEmbedUrl}
              className="w-full border-0"
              style={{ height: "480px" }}
              allowFullScreen
            />
            <div className="px-4 py-2.5 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-[11px] text-outline truncate max-w-[70%]">{projeto.figmaUrl}</p>
              <a
                href={projeto.figmaUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-outline hover:text-on-surface-variant transition-colors px-2.5 py-1 rounded-full border border-outline-variant/10 hover:border-outline/30"
              >
                Abrir no Figma
              </a>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-outline-variant/20 rounded-xl bg-surface flex flex-col items-center justify-center py-12 gap-3">
            <Figma size={32} className="text-outline" />
            <p className="text-xs text-outline">Nenhum link do Figma adicionado.</p>
            {canEdit && (
              <button
                onClick={() => setShowFigmaModal(true)}
                className="text-xs text-outline hover:text-on-surface-variant transition-colors px-3 py-1.5 rounded-full border border-outline-variant/10 hover:border-outline/30"
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
      {showCoverModal && (
        <CoverImageModal
          projetoId={projeto.id}
          currentUrl={projeto.coverImage || ""}
          onClose={() => setShowCoverModal(false)}
        />
      )}
    </div>
  );
}

/* ── Figma Link Modal ── */
function FigmaLinkModal({ projetoId, currentUrl, onClose }: { projetoId: string; currentUrl: string; onClose: () => void }) {
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Link do Figma</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">URL do arquivo no Figma</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.figma.com/design/..."
              className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <p className="text-[10px] text-outline">Cole o link do arquivo, frame ou protótipo do Figma. A pré-visualização será carregada automaticamente.</p>
          {error && <p className="text-error text-xs">{error}</p>}
          <div className="flex gap-3 mt-1">
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

/* ── Cover Image Modal ── */
function CoverImageModal({ projetoId, currentUrl, onClose }: { projetoId: string; currentUrl: string; onClose: () => void }) {
  const router = useRouter();
  const [url, setUrl] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { updateProjetoCoverImage } = await import("@/actions/projetos");
    const result = await updateProjetoCoverImage(projetoId, url);
    if (result.error) { setError(result.error); setSaving(false); return; }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Imagem de Capa</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">URL da Imagem</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <p className="text-[10px] text-outline">Cole o link (URL) direto para uma imagem em alta resolução (ex: .png, .jpg, .webp).</p>
          {error && <p className="text-error text-xs">{error}</p>}
          <div className="flex gap-3 mt-1">
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
