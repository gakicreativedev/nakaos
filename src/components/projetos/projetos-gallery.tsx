"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Projetos</h1>
          <p className="text-on-surface-variant text-sm mt-1">{projetos.length} projeto{projetos.length !== 1 ? "s" : ""}</p>
        </div>
        {(userRole === "Admin") && (
          <button
            onClick={() => setShowNew(true)}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Novo Projeto
          </button>
        )}
      </div>

      {projetos.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-12 flex flex-col items-center text-center">
          <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhum projeto</p>
          <p className="text-outline text-xs">Crie um projeto para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((p) => {
            const sc = STATUS_COLORS[p.status] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
            return (
              <Link
                key={p.id}
                href={`/projetos/${p.id}`}
                className="bg-surface-container-low rounded-xl p-5 hover:bg-surface-container transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-lg font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {p.nome[0]}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: sc.bg, color: sc.text }}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-on-surface group-hover:text-on-surface transition-colors mb-1">
                  {p.nome}
                </h3>
                <p className="text-xs text-outline line-clamp-2">{p.descricao || "Sem descrição"}</p>
                <p className="text-[10px] text-outline mt-3">
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
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Novo Projeto</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Nome <span className="text-error">*</span></label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none resize-none" />
          </div>
          {error && <p className="text-error text-sm text-center">{error}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
