"use client";

import { useState, useRef } from "react";
import {
  MOCK_CLIENTS,
  MOCK_KANBAN_COLUMNS,
  MOCK_TASKS,
  MOCK_TAGS,
  type Task,
  type TaskPriority,
  type KanbanColumn,
} from "@/lib/mock-data";
import TaskModal from "./task-modal";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  Urgente: "bg-urgent",
  Alta: "bg-warning",
  Média: "bg-info",
  Baixa: "bg-success",
};

const PRIORITY_TEXT: Record<TaskPriority, string> = {
  Urgente: "text-urgent",
  Alta: "text-warning",
  Média: "text-info",
  Baixa: "text-success",
};

/* ── Tag Badge ── */
function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-muted-soft">
      {tag}
    </span>
  );
}

/* ── Task Card ── */
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const etapasDone = task.etapas.filter((e) => e.concluida).length;
  const etapasTotal = task.etapas.length;
  const isOverdue = new Date(task.prazo) < new Date() && task.colunaId !== "col-4" && task.colunaId !== "col-7" && task.colunaId !== "col-10";

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] rounded-xl border border-border hover:border-border-hover p-3.5 cursor-pointer transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] group"
    >
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {task.tags.length > 2 && (
            <span className="text-[10px] text-muted-soft">+{task.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Title */}
      <p className="text-[13px] font-medium text-[#c8c8c8] mb-2 leading-snug group-hover:text-foreground transition-colors">
        {task.titulo}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Priority dot */}
          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.prioridade]} shrink-0`} />
          {/* Due date */}
          <span className={`text-[10px] ${isOverdue ? "text-urgent font-medium" : "text-muted-soft"}`}>
            {new Date(task.prazo).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Etapas progress */}
          {etapasTotal > 0 && (
            <span className="text-[10px] text-muted-soft">
              {etapasDone}/{etapasTotal}
            </span>
          )}
          {/* Recurrent indicator */}
          {task.recorrente && (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted-soft">
              <path d="M1 8C1 4.13 4.13 1 8 1C11.87 1 15 4.13 15 8C15 11.87 11.87 15 8 15C5.95 15 4.1 14.1 2.85 12.65" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1 13V9.5H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {/* Comments */}
          {task.comentarios.length > 0 && (
            <span className="text-[10px] text-muted-soft flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M13 10C13 10.35 12.86 10.69 12.6 10.95C12.35 11.2 12 11.35 11.65 11.35H5.35L3 13.7V4.7C3 4.35 3.14 4.01 3.4 3.75C3.65 3.5 4 3.35 4.35 3.35H11.65C12 3.35 12.35 3.5 12.6 3.75C12.86 4.01 13 4.35 13 4.7V10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {task.comentarios.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Column ── */
function Column({
  column,
  tasks,
  onTaskClick,
  onDrop,
}: {
  column: KanbanColumn;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDrop: (taskId: string, columnId: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-[270px] max-w-[300px] rounded-2xl transition-colors ${
        dragOver ? "bg-white/[0.02]" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onDrop(taskId, column.id);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#c8c8c8]">{column.titulo}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.05] text-muted-soft">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1 min-h-[100px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("taskId", task.id);
            }}
          >
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Kanban Board ── */
export default function KanbanBoard() {
  const activeClients = MOCK_CLIENTS.filter((c) => c.status === "Ativo" || c.status === "Onboarding");
  const [selectedClientId, setSelectedClientId] = useState(activeClients[0]?.id || "");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "Todas">("Todas");
  const [filterTag, setFilterTag] = useState<string | "Todas">("Todas");
  const scrollRef = useRef<HTMLDivElement>(null);

  const clientColumns = MOCK_KANBAN_COLUMNS
    .filter((col) => col.clientId === selectedClientId)
    .sort((a, b) => a.ordem - b.ordem);

  const filteredTasks = tasks.filter((t) => {
    if (t.clientId !== selectedClientId) return false;
    if (filterPriority !== "Todas" && t.prioridade !== filterPriority) return false;
    if (filterTag !== "Todas" && !t.tags.includes(filterTag)) return false;
    return true;
  });

  const handleDrop = (taskId: string, columnId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, colunaId: columnId } : t))
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gradient tracking-tight">Tarefas</h1>
          <p className="text-muted text-sm mt-1">
            {tasks.filter((t) => t.clientId === selectedClientId).length} tarefas para{" "}
            {MOCK_CLIENTS.find((c) => c.id === selectedClientId)?.nome}
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
          + Nova Tarefa
        </button>
      </div>

      {/* Client selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {activeClients.map((client) => {
          const count = tasks.filter((t) => t.clientId === client.id).length;
          return (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedClientId === client.id
                  ? "bg-gradient-to-t from-[#191919] to-[#2a2a2a] text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  : "text-muted-soft hover:text-muted hover:bg-surface"
              }`}
            >
              {client.nome}
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.05]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {/* Priority filter */}
        <div className="flex gap-1">
          {(["Todas", "Urgente", "Alta", "Média", "Baixa"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                filterPriority === p
                  ? "bg-surface text-foreground"
                  : "text-muted-soft hover:text-muted"
              }`}
            >
              {p !== "Todas" && <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLORS[p]}`} />}
              {p}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] text-muted-soft focus:outline-none focus:border-border-hover"
        >
          <option value="Todas">Todas as tags</option>
          {MOCK_TAGS.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Kanban columns */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto flex-1 min-h-0 pb-4">
        {clientColumns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={filteredTasks.filter((t) => t.colunaId === col.id)}
            onTaskClick={setSelectedTask}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
