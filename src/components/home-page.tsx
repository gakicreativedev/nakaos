"use client";

import { useMemo } from "react";
import type { Client, Task, Movimentacao } from "@/lib/types";

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    "Em Andamento": { bg: "rgba(108,211,252,0.12)", text: "#6cd3fc" },
    Pendente: { bg: "rgba(234,179,8,0.12)", text: "#f59e0b" },
    Concluído: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
    Ativo: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
    Onboarding: { bg: "rgba(183,196,255,0.12)", text: "#b7c4ff" },
  };
  const c = colors[status] || colors.Pendente;
  return (
    <span
      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

/* ── Priority Dot ── */
function PriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const colors = { high: "bg-error", medium: "bg-warning", low: "bg-success" };
  return <span className={`w-2 h-2 rounded-full ${colors[priority]} shrink-0`} />;
}

/* ── Main Component ── */
interface HomePageProps {
  clients: Client[];
  tasks: Task[];
  movimentacoes: Movimentacao[];
}

export default function HomePage({ clients, tasks, movimentacoes }: HomePageProps) {
  const priorityMap: Record<string, "high" | "medium" | "low"> = {
    Urgente: "high",
    Alta: "high",
    "Média": "medium",
    Baixa: "low",
  };

  const statusMap: Record<string, string> = {
    "em-andamento": "Em Andamento",
    "a-fazer": "Pendente",
    concluido: "Concluído",
    revisao: "Em Revisão",
  };

  const stats = useMemo(() => {
    const urgentTasks = tasks.filter((t) => t.prioridade === "Urgente" || t.prioridade === "Alta").length;
    const activeClients = clients.filter((c) => c.status === "Ativo" || c.status === "Onboarding").length;
    const pendingTasks = tasks.filter((t) => t.colunaId === "a-fazer" || t.colunaId === "em-andamento").length;
    const today = new Date().toISOString().slice(0, 10);
    const dueTodayCount = tasks.filter((t) => t.prazo === today).length;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthRevenue = movimentacoes
      .filter((m) => m.data.startsWith(currentMonth) && m.categoria === "Receita" && m.status !== "Cancelado")
      .reduce((sum, m) => sum + m.valor, 0);
    const revenueStr = monthRevenue >= 1000 ? `R$ ${(monthRevenue / 1000).toFixed(1)}k` : `R$ ${monthRevenue.toLocaleString("pt-BR")}`;
    const uniqueClients = new Set(tasks.filter((t) => t.clientId).map((t) => t.clientId)).size;

    return [
      { label: "Tarefas Urgentes", value: String(urgentTasks), change: urgentTasks > 0 ? "Requer atenção" : "Tudo em dia", accent: urgentTasks > 0 },
      { label: "Clientes Ativos", value: String(activeClients), change: "", accent: false },
      { label: "Tarefas Pendentes", value: String(pendingTasks), change: dueTodayCount > 0 ? `${dueTodayCount} vencem hoje` : "", accent: false },
      { label: "Receita (Mês)", value: revenueStr, change: "", accent: false },
      { label: "Projetos", value: String(uniqueClients), change: "", accent: false },
    ];
  }, [clients, tasks, movimentacoes]);

  const recentTasks = useMemo(() => {
    return tasks.slice(0, 5).map((t) => ({
      id: t.id,
      title: t.titulo,
      client: clients.find((c) => c.id === t.clientId)?.nome || "",
      status: statusMap[t.colunaId] || t.colunaId,
      priority: priorityMap[t.prioridade] || ("medium" as const),
    }));
  }, [tasks, clients]);

  const recentClients = useMemo(() => {
    return clients
      .filter((c) => c.status === "Ativo" || c.status === "Onboarding")
      .slice(0, 4)
      .map((c) => ({
        name: c.nome,
        status: c.status,
        projects: tasks.filter((t) => t.clientId === c.id).length,
      }));
  }, [clients, tasks]);

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
          Aqui está o que está acontecendo com seus projetos hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 transition-colors cursor-default ${
              stat.accent
                ? "bg-error-container/10"
                : "bg-surface-container-lowest"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {stat.accent && (
                <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
              )}
              <p className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </p>
            </div>
            <p
              className={`text-3xl font-semibold mt-3 mb-1 tracking-tight ${
                stat.accent ? "text-error" : "text-on-surface"
              }`}
            >
              {stat.value}
            </p>
            {stat.change && (
              <p className={`text-[11px] ${stat.accent ? "text-error/50" : "text-on-surface-variant/60"}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1 min-h-0">
        {/* Tasks Panel */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface">Tarefas Recentes</h2>
            <span className="text-primary text-xs cursor-pointer hover:opacity-80 transition-opacity">
              Ver Todas
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center px-6 py-4 gap-3 hover:bg-surface-container transition-colors cursor-pointer"
              >
                <PriorityDot priority={task.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {task.client}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Clients Panel */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface">Clientes</h2>
            <span className="text-primary text-xs cursor-pointer hover:opacity-80 transition-opacity">
              Ver Todos
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {recentClients.map((client, i) => (
              <div
                key={i}
                className="flex items-center px-6 py-4 gap-3 hover:bg-surface-container transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">
                    {client.name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {client.projects} projeto{client.projects > 1 ? "s" : ""}
                  </p>
                </div>
                <StatusBadge status={client.status} />
              </div>
            ))}
          </div>
          <div className="p-4 px-6">
            <button className="w-full py-3 rounded-full border border-dashed border-outline-variant/20 bg-transparent text-on-surface-variant text-xs font-medium cursor-pointer hover:border-primary/40 hover:text-primary transition-all">
              + Adicionar Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
