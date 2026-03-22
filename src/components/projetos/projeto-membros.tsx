"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);

  const membrosWithUser = membros.map((m) => ({
    ...m,
    usuario: usuarios.find((u) => u.id === m.usuarioId),
  }));

  const handleRemove = async (membroId: string) => {
    const { removeProjetoMembro } = await import("@/actions/projetos");
    await removeProjetoMembro(membroId, projetoId);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-outline">{membros.length} membro{membros.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <button onClick={() => setShowAdd(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <UserPlus size={16} /> Convidar
          </button>
        )}
      </div>

      {membros.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-12 flex flex-col items-center text-center">
          <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhum membro</p>
          <p className="text-outline text-xs">Convide membros da equipe para este projeto.</p>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          {membrosWithUser.map((m) => {
            const pc = PAPEL_COLORS[m.papel] ?? PAPEL_COLORS.Membro;
            return (
              <div key={m.id} className="flex items-center px-5 py-3.5 gap-3 hover:bg-surface-container transition-colors group">
                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-xs font-semibold text-on-surface-variant">
                  {m.usuario?.nome?.[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{m.usuario?.nome ?? "Usuário desconhecido"}</p>
                  <p className="text-[10px] text-outline">{m.usuario?.email ?? ""}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: pc.bg, color: pc.text }}>
                  {m.papel}
                </span>
                {canEdit && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all p-1"
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
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Convidar Membro</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Usuário</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
            >
              <option value="">Selecione um usuário</option>
              {available.map((u) => (
                <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Papel</label>
            <select value={papel} onChange={(e) => setPapel(e.target.value)} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
              <option value="Admin">Admin</option>
              <option value="Membro">Membro</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving || !selectedUserId} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Convidar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
