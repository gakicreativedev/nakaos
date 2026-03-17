"use client";

import { useState } from "react";
import { CloseCircle, TrashBinMinimalistic, AddCircle, UserPlus } from "@solar-icons/react";
import type { ProjetoMembro, Usuario } from "@/lib/types";

interface ProjetoMembrosProps {
  projetoId: string;
  membros: ProjetoMembro[];
  usuarios: Usuario[];
  canEdit: boolean;
}

const PAPEL_COLORS: Record<string, { bg: string; text: string }> = {
  Admin: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  Membro: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Visualizador: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

export default function ProjetoMembros({ projetoId, membros, usuarios, canEdit }: ProjetoMembrosProps) {
  const [showAdd, setShowAdd] = useState(false);

  const membrosWithUser = membros.map((m) => ({
    ...m,
    usuario: usuarios.find((u) => u.id === m.usuarioId),
  }));

  const handleRemove = async (membroId: string) => {
    const { removeProjetoMembro } = await import("@/actions/projetos");
    await removeProjetoMembro(membroId, projetoId);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-soft">{membros.length} membro{membros.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors flex items-center gap-2">
            <UserPlus size={16} /> Convidar
          </button>
        )}
      </div>

      {membros.length === 0 ? (
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
          <p className="text-muted text-sm font-medium mb-1">Nenhum membro</p>
          <p className="text-muted-soft text-xs">Convide membros da equipe para este projeto.</p>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden">
          {membrosWithUser.map((m) => {
            const pc = PAPEL_COLORS[m.papel] ?? PAPEL_COLORS.Membro;
            return (
              <div key={m.id} className="flex items-center px-5 py-3.5 border-b border-[#1a1a1a] last:border-b-0 gap-3 hover:bg-white/[0.02] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center text-xs font-semibold text-muted">
                  {m.usuario?.nome?.[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#c8c8c8] truncate">{m.usuario?.nome ?? "Usuário desconhecido"}</p>
                  <p className="text-[10px] text-muted-soft">{m.usuario?.email ?? ""}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{ background: pc.bg, color: pc.text }}>
                  {m.papel}
                </span>
                {canEdit && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-soft hover:text-urgent transition-all p-1"
                  >
                    <TrashBinMinimalistic size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddMembroModal projetoId={projetoId} membros={membros} usuarios={usuarios} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddMembroModal({
  projetoId,
  membros,
  usuarios,
  onClose,
}: {
  projetoId: string;
  membros: ProjetoMembro[];
  usuarios: Usuario[];
  onClose: () => void;
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [papel, setPapel] = useState("Membro");
  const [saving, setSaving] = useState(false);

  const existingIds = new Set(membros.map((m) => m.usuarioId));
  const available = usuarios.filter((u) => !existingIds.has(u.id) && u.ativo !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setSaving(true);
    const { addProjetoMembro } = await import("@/actions/projetos");
    await addProjetoMembro(projetoId, selectedUserId, papel);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Convidar Membro</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Usuário</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors"
            >
              <option value="">Selecione um usuário</option>
              {available.map((u) => (
                <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Papel</label>
            <select value={papel} onChange={(e) => setPapel(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
              <option value="Admin">Admin</option>
              <option value="Membro">Membro</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">Cancelar</button>
            <button type="submit" disabled={saving || !selectedUserId} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {saving ? "Salvando..." : "Convidar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
