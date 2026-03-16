"use client";

import { useState } from "react";
import { CloseCircle, CheckCircle } from "@solar-icons/react";
import type { Client, Task } from "@/lib/types";

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  Urgente: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  Alta: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  Média: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Baixa: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
};

export default function TaskModal({ task, clients, onClose }: { task: Task; clients: Client[]; onClose: () => void }) {
  const [newComment, setNewComment] = useState("");
  const client = clients.find((c) => c.id === task.clientId);
  const etapasDone = task.etapas.filter((e) => e.concluida).length;
  const etapasTotal = task.etapas.length;
  const pc = PRIORITY_COLORS[task.prioridade] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-border rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-border p-5 flex items-start justify-between gap-4 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: pc.bg, color: pc.text }}
              >
                {task.prioridade}
              </span>
              {client && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-muted-soft">
                  {client.nome}
                </span>
              )}
              {task.recorrente && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple/15 text-purple font-medium">
                  {task.frequencia}
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gradient">{task.titulo}</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1 shrink-0">
            <CloseCircle size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Meta info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoBlock label="Responsável" value={task.responsavel} />
            <InfoBlock
              label="Prazo"
              value={new Date(task.prazo).toLocaleDateString("pt-BR")}
              alert={new Date(task.prazo) < new Date()}
            />
            <InfoBlock label="Criado em" value={new Date(task.criadoEm).toLocaleDateString("pt-BR")} />
            <InfoBlock label="Etapas" value={etapasTotal > 0 ? `${etapasDone}/${etapasTotal}` : "Nenhuma"} />
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">Descrição</p>
            <p className="text-sm text-[#c8c8c8] leading-relaxed bg-[#141414] rounded-xl border border-border p-4">
              {task.descricao}
            </p>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-[#141414] border border-border text-[#c8c8c8]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Etapas */}
          {task.etapas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Etapas</p>
                {etapasTotal > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[#141414] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all"
                        style={{ width: `${(etapasDone / etapasTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-soft">{Math.round((etapasDone / etapasTotal) * 100)}%</span>
                  </div>
                )}
              </div>
              <div className="bg-[#141414] rounded-xl border border-border overflow-hidden">
                {task.etapas.map((etapa) => (
                  <div
                    key={etapa.id}
                    className="flex items-center px-4 py-3 border-b border-[#1a1a1a] last:border-b-0 gap-3"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        etapa.concluida
                          ? "bg-success/20 border-success"
                          : "border-border"
                      }`}
                    >
                      {etapa.concluida && (
                        <CheckCircle size={10} color="#4ade80" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${etapa.concluida ? "text-muted-soft line-through" : "text-[#c8c8c8]"}`}>
                        {etapa.titulo}
                      </p>
                      <p className="text-[10px] text-muted-soft mt-0.5">
                        {etapa.responsavel} · {new Date(etapa.prazo).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
              Comentários ({task.comentarios.length})
            </p>

            {task.comentarios.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {task.comentarios.map((comment) => (
                  <div key={comment.id} className="bg-[#141414] rounded-xl border border-border p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#c8c8c8]">{comment.usuario}</span>
                      <span className="text-[10px] text-muted-soft">
                        {new Date(comment.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-soft leading-relaxed">{comment.texto}</p>
                  </div>
                ))}
              </div>
            )}

            {/* New comment input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar comentário... Use @ para mencionar"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors"
              />
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors shrink-0">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-[#141414] rounded-xl border border-border p-3">
      <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-medium ${alert ? "text-urgent" : "text-[#c8c8c8]"}`}>{value}</p>
    </div>
  );
}
