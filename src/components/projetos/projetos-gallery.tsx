"use client";

import { useState } from "react";
import Link from "next/link";
import { CloseCircle } from "@solar-icons/react";
import type { Projeto } from "@/lib/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Ativo: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  Pausado: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
  Concluído: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Arquivado: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

interface ProjetosGalleryProps {
  projetos: Projeto[];
  userRole: string;
}

export default function ProjetosGallery({ projetos, userRole }: ProjetosGalleryProps) {
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gradient tracking-tight">Projetos</h1>
          <p className="text-muted text-sm mt-1">{projetos.length} projeto{projetos.length !== 1 ? "s" : ""}</p>
        </div>
        {(userRole === "Admin") && (
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors"
          >
            + Novo Projeto
          </button>
        )}
      </div>

      {projetos.length === 0 ? (
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
          <p className="text-muted text-sm font-medium mb-1">Nenhum projeto</p>
          <p className="text-muted-soft text-xs">Crie um projeto para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((p) => {
            const sc = STATUS_COLORS[p.status] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
            return (
              <Link
                key={p.id}
                href={`/projetos/${p.id}`}
                className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border p-5 hover:border-border-hover transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-border flex items-center justify-center text-lg font-semibold text-muted group-hover:text-foreground transition-colors">
                    {p.nome[0]}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{ background: sc.bg, color: sc.text }}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#c8c8c8] group-hover:text-foreground transition-colors mb-1">
                  {p.nome}
                </h3>
                <p className="text-xs text-muted-soft line-clamp-2">{p.descricao || "Sem descrição"}</p>
                <p className="text-[10px] text-muted-soft mt-3">
                  Criado em {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {showNew && <NewProjetoModal onClose={() => setShowNew(false)} />}
    </>
  );
}

function NewProjetoModal({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { createProjeto } = await import("@/actions/projetos");
    const result = await createProjeto(nome, descricao);
    if (result.error) { setError(result.error); setSaving(false); return; }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gradient">Novo Projeto</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Nome <span className="text-urgent">*</span></label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors resize-none" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {saving ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
