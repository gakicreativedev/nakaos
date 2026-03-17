"use client";

import { useState, useRef } from "react";
import { Refresh, ChatRoundDots, AltArrowLeft, CloseCircle, AddCircle, Pen, TrashBinMinimalistic, MenuDots } from "@solar-icons/react";
import {
  MOCK_TAGS,
  type Client,
  type Task,
  type TaskPriority,
  type KanbanColumn,
} from "@/lib/types";
import TaskModal from "./task-modal";

const PRIORITY_COLORS: Record<string, string> = {
  Urgente: "bg-urgent",
  Alta: "bg-warning",
  Média: "bg-info",
  Baixa: "bg-success",
};

const PRIORITY_TEXT: Record<string, string> = {
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
          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.prioridade] ?? "bg-muted"} shrink-0`} />
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
            <Refresh size={12} className="text-muted-soft" />
          )}
          {/* Comments */}
          {task.comentarios.length > 0 && (
            <span className="text-[10px] text-muted-soft flex items-center gap-0.5">
              <ChatRoundDots size={10} />
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
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.titulo);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleRename = async () => {
    if (!newTitle.trim() || newTitle.trim() === column.titulo) {
      setRenaming(false);
      setNewTitle(column.titulo);
      return;
    }
    const { updateColumn } = await import("@/actions/kanban");
    await updateColumn(column.id, newTitle.trim());
    setRenaming(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    const { deleteColumn } = await import("@/actions/kanban");
    await deleteColumn(column.id);
    setConfirmDelete(false);
    window.location.reload();
  };

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
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {renaming ? (
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") { setRenaming(false); setNewTitle(column.titulo); } }}
              className="text-sm font-medium text-[#c8c8c8] bg-[#141414] border border-border rounded-lg px-2 py-0.5 outline-none focus:border-border-hover w-full"
            />
          ) : (
            <>
              <h3 className="text-sm font-medium text-[#c8c8c8] truncate">{column.titulo}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.05] text-muted-soft shrink-0">
                {tasks.length}
              </span>
            </>
          )}
        </div>
        {!renaming && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg text-muted-soft hover:text-muted hover:bg-white/[0.05] transition-colors">
              <MenuDots size={14} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-border rounded-xl overflow-hidden shadow-xl min-w-[130px]">
                  <button
                    onClick={() => { setShowMenu(false); setRenaming(true); }}
                    className="w-full px-3 py-2 text-left text-xs text-[#c8c8c8] hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Pen size={12} /> Renomear
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); setConfirmDelete(true); }}
                    className="w-full px-3 py-2 text-left text-xs text-urgent hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <TrashBinMinimalistic size={12} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        )}
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

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-[#1a1a1a] border border-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-sm font-semibold text-foreground mb-2">Excluir coluna &quot;{column.titulo}&quot;?</h3>
            <p className="text-xs text-muted-soft mb-4">
              {tasks.length > 0
                ? `Isso excluirá permanentemente ${tasks.length} tarefa${tasks.length > 1 ? "s" : ""} desta coluna.`
                : "Esta coluna está vazia e será removida."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-xl border border-border text-sm text-muted-soft hover:text-muted transition-all">
                Cancelar
              </button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-xl bg-urgent/20 border border-urgent/30 text-sm font-medium text-urgent hover:bg-urgent/30 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Kanban Board ── */
interface KanbanBoardProps {
  clients: Client[];
  tasks: Task[];
  columns: KanbanColumn[];
  initialClientId?: string;
  onBack?: () => void;
}

export default function KanbanBoard({
  clients,
  tasks: tasksProp,
  columns,
  initialClientId,
  onBack,
}: KanbanBoardProps) {
  const activeClients = clients.filter((c) => c.status === "Ativo" || c.status === "Onboarding");
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || activeClients[0]?.id || "");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState(tasksProp);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "Todas">("Todas");
  const [filterTag, setFilterTag] = useState<string | "Todas">("Todas");
  const [showNewTask, setShowNewTask] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clientColumns = columns
    .filter((col) => col.clientId === selectedClientId)
    .sort((a, b) => a.ordem - b.ordem);

  const filteredTasks = tasks.filter((t) => {
    if (t.clientId !== selectedClientId) return false;
    if (filterPriority !== "Todas" && t.prioridade !== filterPriority) return false;
    if (filterTag !== "Todas" && !t.tags.includes(filterTag)) return false;
    return true;
  });

  const handleDrop = async (taskId: string, columnId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, colunaId: columnId } : t))
    );
    const { moveTask } = await import("@/actions/tarefas");
    await moveTask(taskId, columnId);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-surface transition-colors text-muted hover:text-foreground"
            >
              <AltArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gradient tracking-tight">Tarefas</h1>
            <p className="text-muted text-xs sm:text-sm mt-1">
              {tasks.filter((t) => t.clientId === selectedClientId).length} tarefas para{" "}
              {clients.find((c) => c.id === selectedClientId)?.nome}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors"
        >
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
              {p !== "Todas" && <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLORS[p] ?? "bg-muted"}`} />}
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
        <AddColumnButton clientId={selectedClientId} />
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} clients={clients} onClose={() => setSelectedTask(null)} />
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <NewTaskModal
          clientId={selectedClientId}
          columns={clientColumns}
          onClose={() => setShowNewTask(false)}
        />
      )}
    </>
  );
}

/* ── Add Column Button ── */
function AddColumnButton({ clientId }: { clientId: string }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) { setAdding(false); return; }
    const { createColumn } = await import("@/actions/kanban");
    await createColumn(clientId, title.trim());
    setTitle("");
    setAdding(false);
    window.location.reload();
  };

  if (adding) {
    return (
      <div className="min-w-[270px] max-w-[300px] shrink-0">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleCreate}
          onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setTitle(""); } }}
          placeholder="Nome da coluna..."
          className="w-full text-sm font-medium text-[#c8c8c8] bg-[#141414] border border-border rounded-xl px-3 py-2 outline-none focus:border-border-hover placeholder:text-muted-soft"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setAdding(true)}
      className="min-w-[270px] max-w-[300px] shrink-0 h-10 rounded-2xl border border-dashed border-border hover:border-border-hover text-muted-soft hover:text-muted text-xs flex items-center justify-center gap-2 transition-colors"
    >
      <AddCircle size={14} /> Nova Coluna
    </button>
  );
}

/* ── New Task Modal ── */
function NewTaskModal({
  clientId,
  columns,
  onClose,
}: {
  clientId: string;
  columns: KanbanColumn[];
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("clientId", clientId);
    if (!formData.get("colunaId")) {
      formData.set("colunaId", columns[0]?.id || "");
    }
    const { createTask } = await import("@/actions/tarefas");
    const result = await createTask(formData);
    if (result.error) {
      setFormError(result.error);
      setSaving(false);
      return;
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gradient">Nova Tarefa</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Título <span className="text-urgent">*</span></label>
            <input name="titulo" type="text" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Descrição</label>
            <textarea name="descricao" rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Responsável <span className="text-urgent">*</span></label>
              <input name="responsavel" type="text" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Prazo <span className="text-urgent">*</span></label>
              <input name="prazo" type="date" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Prioridade</label>
              <select name="prioridade" defaultValue="Média" className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Coluna</label>
              <select name="colunaId" defaultValue={columns[0]?.id} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.titulo}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Tags (separadas por vírgula)</label>
            <input name="tags" type="text" placeholder="Redes Sociais, Design" className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-border-hover transition-colors" />
          </div>

          {formError && <p className="text-red-400 text-sm text-center">{formError}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {saving ? "Salvando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
