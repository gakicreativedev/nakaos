"use client";

import { useState } from "react";
import { AltArrowRight } from "@solar-icons/react";
import type { Client, Task, KanbanColumn, TaskPriority } from "@/lib/types";
import KanbanBoard from "./kanban-board";

const PRI_BG: Record<string, string> = { Urgente: "bg-error", Alta: "bg-warning", Média: "bg-secondary", Baixa: "bg-success" };

interface Props { clients: Client[]; tasks: Task[]; columns: KanbanColumn[]; archivedTasks: Task[] }

export default function TarefasOverview({ clients, tasks, columns, archivedTasks }: Props) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  if (selectedClientId) {
    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (selectedClient) {
      const clientTasks = tasks.filter((t) => t.clientId === selectedClientId);
      const clientColumns = columns.filter((c) => c.clientId === selectedClientId);
      return <KanbanBoard client={selectedClient} tasks={clientTasks} columns={clientColumns} archivedTasks={archivedTasks} onBack={() => setSelectedClientId(null)} />;
    }
  }

  const activeClients = clients.filter((c) => c.status === "Ativo" || c.status === "Onboarding");
  const totalTasks = tasks.length;
  const urgentTasks = tasks.filter((t) => t.prioridade === "Urgente").length;
  const overdueTasks = tasks.filter((t) => new Date(t.prazo) < new Date()).length;

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">Tarefas</h1>
        <p className="text-on-surface-variant text-xs sm:text-sm mt-1">Selecione um cliente para visualizar o quadro de tarefas.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Total</p>
          <p className="text-2xl font-semibold text-on-surface">{totalTasks}</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="text-[10px] text-error uppercase tracking-widest">Urgentes</p>
          <p className="text-2xl font-semibold text-error">{urgentTasks}</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="text-[10px] text-warning uppercase tracking-widest">Atrasadas</p>
          <p className="text-2xl font-semibold text-warning">{overdueTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {activeClients.map((client) => {
          const ct = tasks.filter((t) => t.clientId === client.id);
          const byPriority = ct.reduce((a, t) => { a[t.prioridade] = (a[t.prioridade] || 0) + 1; return a; }, {} as Record<string, number>);
          const overdue = ct.filter((t) => new Date(t.prazo) < new Date()).length;
          const totalEtapas = ct.reduce((s, t) => s + t.etapas.length, 0);
          const doneEtapas = ct.reduce((s, t) => s + t.etapas.filter((e) => e.concluida).length, 0);
          const pct = totalEtapas > 0 ? Math.round((doneEtapas / totalEtapas) * 100) : 0;
          const expanded = expandedClientId === client.id;

          return (
            <div key={client.id} className="bg-surface-container-low rounded-xl transition-all duration-300 group">
              <button onClick={() => setExpandedClientId(expanded ? null : client.id)} className="w-full p-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0">{client.nome[0]}</div>
                    <div>
                      <p className="text-[15px] font-semibold text-on-surface">{client.nome}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{ct.length} tarefa{ct.length !== 1 ? "s" : ""} · {client.servicosContratados.length} serviço{client.servicosContratados.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {overdue > 0 && <span className="text-[10px] px-2.5 py-1 rounded-xl bg-error/10 text-error font-medium">{overdue} atrasada{overdue !== 1 ? "s" : ""}</span>}
                    <div className={`w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant transition-transform ${expanded ? "rotate-90" : ""}`}><AltArrowRight size={16} /></div>
                  </div>
                </div>
                {totalEtapas > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">Progresso</span>
                      <span className="text-[11px] text-success font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-surface-container overflow-hidden"><div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${pct}%` }} /></div>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  {(["Urgente", "Alta", "Média", "Baixa"] as TaskPriority[]).map((p) => {
                    const c = byPriority[p] || 0;
                    if (c === 0) return null;
                    return <span key={p} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant"><span className={`w-2 h-2 rounded-full ${PRI_BG[p]}`} />{c}</span>;
                  })}
                </div>
              </button>
              {expanded && (
                <div className="px-6 pb-6 border-t border-outline-variant/10">
                  {client.servicosContratados.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 mb-3">
                      {client.servicosContratados.map((svc) => {
                        const svcCount = ct.filter((t) => t.servico === svc).length;
                        return <span key={svc} className="text-[10px] px-2.5 py-1 rounded-xl bg-surface-container text-on-surface-variant">{svc} <span className="text-on-surface font-semibold">{svcCount}</span></span>;
                      })}
                    </div>
                  )}
                  <div className="bg-surface-container-lowest rounded-xl overflow-hidden mb-3 max-h-[250px] overflow-y-auto">
                    {ct.length === 0 && <p className="text-xs text-outline text-center py-6">Nenhuma tarefa</p>}
                    {ct.slice(0, 10).map((t) => (
                      <div key={t.id} className="flex items-center px-4 py-3 gap-2 hover:bg-surface-container transition-colors">
                        <span className={`w-2 h-2 rounded-full ${PRI_BG[t.prioridade] ?? "bg-outline"} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-on-surface truncate">{t.titulo}</p>
                          <p className="text-[10px] text-on-surface-variant">{t.servico || "Geral"} · {t.responsavel}</p>
                        </div>
                        <span className={`text-[10px] ${new Date(t.prazo) < new Date() ? "text-error" : "text-on-surface-variant"}`}>{new Date(t.prazo).toLocaleDateString("pt-BR")}</span>
                      </div>
                    ))}
                    {ct.length > 10 && <p className="text-[10px] text-outline text-center py-2">+{ct.length - 10} tarefas</p>}
                  </div>
                  <button onClick={() => setSelectedClientId(client.id)} className="w-full py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity">
                    Abrir Quadro Kanban
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
