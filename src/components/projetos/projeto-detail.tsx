"use client";

import { useState } from "react";
import Link from "next/link";
import { AltArrowLeft } from "@solar-icons/react";
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
        {activeTab === "geral" && <TabGeral projeto={projeto} />}
        {activeTab === "brand" && <ProjetoBrand projetoId={projeto.id} colors={colors} fonts={fonts} logos={logos} identidade={identidade} historico={historico} canEdit={canEdit} />}
        {activeTab === "tarefas" && <ProjetoKanban projetoId={projeto.id} columns={columns} tasks={tasks} membros={membros} usuarios={usuarios} canEdit={canEdit} />}
        {activeTab === "galeria" && <ProjetoAssets projetoId={projeto.id} assets={assets} canEdit={canEdit} />}
        {activeTab === "membros" && <ProjetoMembros projetoId={projeto.id} membros={membros} usuarios={usuarios} canEdit={canEdit} />}
      </div>
    </>
  );
}

function TabGeral({ projeto }: { projeto: Projeto }) {
  return (
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
  );
}
