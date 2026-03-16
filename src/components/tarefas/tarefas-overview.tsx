"use client";

import { useState } from "react";
import { AltArrowRight } from "@solar-icons/react";
import type { Client, Task, KanbanColumn, TaskPriority } from "@/lib/types";
import KanbanBoard from "./kanban-board";

const PRIORITY_COLORS: Record<string, string> = {
  Urgente: "bg-urgent",
  Alta: "bg-warning",
  Média: "bg-info",
  Baixa: "bg-success",
};

interface TarefasOverviewProps {
  clients: Client[];
  tasks: Task[];
  columns: KanbanColumn[];
}

export default function TarefasOverview({ clients, tasks, columns }: TarefasOverviewProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  if (selectedClientId) {
    return (
      <KanbanBoard
        clients={clients}
        tasks={tasks}
        columns={columns}
        initialClientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  const activeClients = clients.filter(
    (c) => c.status === "Ativo" || c.status === "Onboarding"
  );

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gradient tracking-tight">
          Tarefas
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Selecione um cliente para visualizar o quadro de tarefas.
        </p>
      </div>

      {/* Client Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {activeClients.map((client) => {
          const clientTasks = tasks.filter((t) => t.clientId === client.id);
          const clientColumns = columns.filter((c) => c.clientId === client.id);
          const totalTasks = clientTasks.length;

          // Count by priority
          const byPriority = clientTasks.reduce(
            (acc, t) => {
              acc[t.prioridade] = (acc[t.prioridade] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

          // Count overdue
          const overdue = clientTasks.filter(
            (t) =>
              new Date(t.prazo) < new Date() &&
              !clientColumns.find(
                (c) =>
                  c.id === t.colunaId &&
                  c.titulo.toLowerCase().includes("aprovado")
              )
          ).length;

          // Etapas progress
          const totalEtapas = clientTasks.reduce(
            (sum, t) => sum + t.etapas.length,
            0
          );
          const doneEtapas = clientTasks.reduce(
            (sum, t) => sum + t.etapas.filter((e) => e.concluida).length,
            0
          );
          const progressPercent =
            totalEtapas > 0 ? Math.round((doneEtapas / totalEtapas) * 100) : 0;

          // Tasks per column summary
          const columnSummary = clientColumns
            .sort((a, b) => a.ordem - b.ordem)
            .map((col) => ({
              titulo: col.titulo,
              count: clientTasks.filter((t) => t.colunaId === col.id).length,
            }))
            .filter((c) => c.count > 0);

          return (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className="glass-card rounded-3xl p-6 text-left transition-all group relative z-0"
            >
              {/* Top progress accent bar */}
              {totalEtapas > 0 && (
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full overflow-hidden">
                  <div className="h-full bg-[#1a1a1a] w-full" />
                  <div
                    className="h-full rounded-full bg-success absolute top-0 left-0 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}

              {/* Client header */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/10 flex items-center justify-center text-sm font-bold text-success shrink-0">
                    {client.nome[0]}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                      {client.nome}
                    </p>
                    <p className="text-[11px] text-muted-soft mt-0.5">
                      {totalTasks} tarefa{totalTasks !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {overdue > 0 && (
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-urgent/10 text-urgent font-medium border border-urgent/10">
                      {overdue} atrasada{overdue !== 1 ? "s" : ""}
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-muted-soft group-hover:text-foreground group-hover:bg-white/[0.08] transition-all">
                    <AltArrowRight size={16} />
                  </div>
                </div>
              </div>

              {/* Progress info */}
              {totalEtapas > 0 && (
                <div className="mb-5 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-soft uppercase tracking-widest font-medium">
                      Progresso
                    </span>
                    <span className="text-[11px] text-success font-semibold">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-success to-success/70 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Priority + Column summary */}
              <div className="flex items-center justify-between relative z-10">
                {/* Priority indicators */}
                <div className="flex items-center gap-2.5">
                  {(
                    ["Urgente", "Alta", "Média", "Baixa"] as TaskPriority[]
                  ).map((p) => {
                    const count = byPriority[p] || 0;
                    if (count === 0) return null;
                    return (
                      <span
                        key={p}
                        className="flex items-center gap-1.5 text-[11px] text-muted-soft"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[p] ?? "bg-muted"}`}
                        />
                        {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Column breakdown pills */}
              {columnSummary.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 relative z-10">
                  {columnSummary.map((col) => (
                    <span
                      key={col.titulo}
                      className="text-[10px] px-2.5 py-1 rounded-xl bg-white/[0.04] text-muted-soft border border-white/[0.04]"
                    >
                      {col.titulo}{" "}
                      <span className="text-foreground/70 font-semibold">
                        {col.count}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
