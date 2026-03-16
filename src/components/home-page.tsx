"use client";

import { useMemo } from "react";
import type { Client, Task, Movimentacao } from "@/lib/types";

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    "Em Andamento": { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
    Pendente: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
    Concluído: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    Ativo: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    Onboarding: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  };
  const c = colors[status] || colors.Pendente;
  return (
    <span
      className="px-3 py-1 rounded-lg text-xs font-medium tracking-wide"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

/* ── Priority Dot ── */
function PriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const colors = { high: "bg-urgent", medium: "bg-warning", low: "bg-success" };
  return <span className={`w-2 h-2 rounded-full ${colors[priority]} shrink-0`} />;
}

/* ── Client Avatar Colors ── */
const AVATAR_GRADIENTS = [
  "from-[#2a2a3a] to-[#1a1a1a]",
  "from-[#2a3a2a] to-[#1a1a1a]",
  "from-[#3a2a2a] to-[#1a1a1a]",
  "from-[#2a3a3a] to-[#1a1a1a]",
];

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gradient tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Aqui está o que está acontecendo com seus projetos hoje.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-3.5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 border transition-colors cursor-default ${
              stat.accent
                ? "bg-gradient-to-b from-[#1d1518] to-[#141012] border-[#2e1c1c] hover:border-[#3a2222]"
                : "bg-gradient-to-b from-surface to-[#141414] border-border hover:border-border-hover"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {stat.accent && (
                <span className="w-1.5 h-1.5 rounded-full bg-urgent shrink-0" />
              )}
              <p
                className={`text-[11px] font-medium uppercase tracking-wider ${
                  stat.accent ? "text-[#7a4a4a]" : "text-muted"
                }`}
              >
                {stat.label}
              </p>
            </div>
            <p
              className={`text-[28px] font-semibold mt-2 mb-1 tracking-tight ${
                stat.accent ? "text-urgent" : "text-gradient"
              }`}
            >
              {stat.value}
            </p>
            <p
              className={`text-[11px] ${
                stat.accent ? "text-[#5a3535]" : "text-muted-soft"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 flex-1 min-h-0">
        {/* Tasks Panel */}
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-sm font-medium text-gradient">Tarefas Recentes</h2>
            <span className="text-muted-soft text-[11px] cursor-pointer hover:text-muted transition-colors">
              Ver Todas
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center px-5 py-3.5 border-b border-[#1a1a1a] gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <PriorityDot priority={task.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#c8c8c8] truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-soft mt-0.5">
                    {task.client}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Clients Panel */}
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-sm font-medium text-gradient">Clientes</h2>
            <span className="text-muted-soft text-[11px] cursor-pointer hover:text-muted transition-colors">
              Ver Todos
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {recentClients.map((client, i) => (
              <div
                key={i}
                className="flex items-center px-5 py-3.5 border-b border-[#1a1a1a] gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div
                  className={`w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br ${AVATAR_GRADIENTS[i]} flex items-center justify-center text-[13px] font-semibold text-muted shrink-0`}
                >
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#c8c8c8]">
                    {client.name}
                  </p>
                  <p className="text-[11px] text-muted-soft mt-0.5">
                    {client.projects} projeto{client.projects > 1 ? "s" : ""}
                  </p>
                </div>
                <StatusBadge status={client.status} />
              </div>
            ))}
          </div>
          <div className="p-3.5 px-5">
            <button className="w-full py-2.5 rounded-[10px] border border-dashed border-border-hover bg-transparent text-muted-soft text-xs font-medium cursor-pointer hover:border-[#3a3a3a] hover:text-muted transition-all">
              + Adicionar Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
