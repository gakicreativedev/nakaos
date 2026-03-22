"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Refresh, ChatRoundDots, AltArrowLeft, CloseCircle, AddCircle, Pen, TrashBinMinimalistic, MenuDots, Gallery } from "@solar-icons/react";
import { MOCK_TAGS, type Client, type Task, type TaskPriority, type KanbanColumn } from "@/lib/types";
import TaskModal from "./task-modal";

const PRI_BG: Record<string, string> = { Urgente: "bg-error", Alta: "bg-warning", Média: "bg-secondary", Baixa: "bg-success" };
const PRI_TEXT: Record<string, string> = { Urgente: "text-error", Alta: "text-warning", Média: "text-info", Baixa: "text-success" };

/* ── Task Card (enhanced) ── */
function TaskCard({ task, onClick, onDragStart }: { task: Task; onClick: () => void; onDragStart: (e: React.DragEvent) => void }) {
  const etapasDone = task.etapas.filter((e) => e.concluida).length;
  const etapasTotal = task.etapas.length;
  const isOverdue = new Date(task.prazo) < new Date();
  const coverImg = task.anexos.find((a) => a.tipo === "imagem");

  return (
    <div draggable onDragStart={onDragStart} onClick={onClick} className="bg-surface-container-low rounded-xl cursor-pointer transition-all duration-300 hover:bg-surface-container group overflow-hidden">
      {/* Cover image */}
      {coverImg && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={coverImg.url} alt="" className="w-full h-28 object-cover" />
      )}
      <div className="p-4">
        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 2).map((tag) => <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{tag}</span>)}
            {task.tags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{task.tags.length - 2}</span>}
          </div>
        )}
        {/* Title */}
        <p className="text-[13px] font-medium text-on-surface mb-2 leading-snug">{task.titulo}</p>
        {/* Etapas progress bar */}
        {etapasTotal > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 rounded-full bg-surface-container overflow-hidden"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${(etapasDone / etapasTotal) * 100}%` }} /></div>
            <span className="text-[10px] text-on-surface-variant">{etapasDone}/{etapasTotal}</span>
          </div>
        )}
        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${PRI_BG[task.prioridade] ?? "bg-muted"} shrink-0`} />
            <span className={`text-[10px] ${isOverdue ? "text-error font-medium" : "text-on-surface-variant"}`}>
              {new Date(task.prazo).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Responsavel avatar */}
            <span className="w-5 h-5 rounded-full bg-secondary-container/30 flex items-center justify-center text-[8px] font-bold text-secondary">{task.responsavel?.[0]?.toUpperCase()}</span>
            {task.recorrente && <Refresh size={12} className="text-on-surface-variant" />}
            {task.comentarios.length > 0 && <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5"><ChatRoundDots size={10} />{task.comentarios.length}</span>}
            {task.anexos.length > 0 && <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5"><Gallery size={10} />{task.anexos.length}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Column ── */
function Column({ column, tasks, onTaskClick, onDrop, onReorder }: {
  column: KanbanColumn; tasks: Task[]; onTaskClick: (t: Task) => void;
  onDrop: (taskId: string, colId: string) => void;
  onReorder: (taskId: string, colId: string, targetIndex: number) => void;
}) {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.titulo);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleRename = async () => {
    if (!newTitle.trim() || newTitle.trim() === column.titulo) { setRenaming(false); setNewTitle(column.titulo); return; }
    const { updateColumn } = await import("@/actions/kanban");
    await updateColumn(column.id, newTitle.trim());
    router.refresh();
  };

  const handleDelete = async () => {
    const { deleteColumn } = await import("@/actions/kanban");
    await deleteColumn(column.id);
    router.refresh();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    // Calculate target index based on mouse Y
    if (cardsRef.current) {
      const cards = Array.from(cardsRef.current.children) as HTMLElement[];
      let targetIdx = cards.length;
      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) { targetIdx = i; break; }
      }
      onReorder(taskId, column.id, targetIdx);
    } else {
      onDrop(taskId, column.id);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className={`flex flex-col min-w-[270px] max-w-[300px] rounded-xl transition-colors ${dragOver ? "bg-surface-container/50" : ""}`}
      onDragOver={handleDragOver} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {renaming ? (
            <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") { setRenaming(false); setNewTitle(column.titulo); } }}
              className="text-sm font-medium text-on-surface bg-surface-container-lowest border-none rounded-lg px-2 py-0.5 outline-none focus:ring-1 focus:ring-primary w-full" />
          ) : (
            <>
              <h3 className="text-sm font-medium text-on-surface truncate">{column.titulo}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">{tasks.length}</span>
            </>
          )}
        </div>
        {!renaming && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"><MenuDots size={14} /></button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-surface-container border border-outline-variant/15 rounded-xl overflow-hidden shadow-xl min-w-[130px]">
                  <button onClick={() => { setShowMenu(false); setRenaming(true); }} className="w-full px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container flex items-center gap-2"><Pen size={12} /> Renomear</button>
                  <button onClick={() => { setShowMenu(false); setConfirmDelete(true); }} className="w-full px-3 py-2 text-left text-xs text-error hover:bg-surface-container flex items-center gap-2"><TrashBinMinimalistic size={12} /> Excluir</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Cards */}
      <div ref={cardsRef} className="flex flex-col gap-2 flex-1 min-h-[100px]">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)}
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)} />
        ))}
      </div>
      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-sm font-semibold text-on-surface mb-2">Excluir coluna &quot;{column.titulo}&quot;?</h3>
            <p className="text-xs text-on-surface-variant mb-4">{tasks.length > 0 ? `Isso excluirá ${tasks.length} tarefa${tasks.length > 1 ? "s" : ""}.` : "Coluna vazia."}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-full bg-error/20 text-sm font-medium text-error hover:bg-error/30">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Kanban Board ── */
interface KanbanBoardProps {
  client: Client;
  tasks: Task[];
  columns: KanbanColumn[];
  onBack?: () => void;
}

export default function KanbanBoard({ client, tasks: tasksProp, columns, onBack }: KanbanBoardProps) {
  const router = useRouter();
  const clientId = client.id;
  const services = client.servicosContratados ?? [];
  const [selectedService, setSelectedService] = useState(services[0] || "");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState(tasksProp);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "Todas">("Todas");
  const [filterTag, setFilterTag] = useState<string | "Todas">("Todas");
  const [showNewTask, setShowNewTask] = useState(false);
  const [initializingService, setInitializingService] = useState(false);

  // Ensure columns exist for selected service
  const handleServiceChange = async (svc: string) => {
    setSelectedService(svc);
    const svcColumns = columns.filter((c) => c.clientId === clientId && c.servico === svc);
    if (svcColumns.length === 0) {
      setInitializingService(true);
      const { ensureServiceColumns } = await import("@/actions/kanban");
      await ensureServiceColumns(clientId, svc);
      router.refresh();
    }
  };

  // Filter columns and tasks by service
  const clientColumns = columns
    .filter((c) => c.clientId === clientId && c.servico === selectedService)
    .sort((a, b) => a.ordem - b.ordem);

  // Also show legacy columns (without servico) in a "Geral" virtual tab
  const legacyColumns = columns.filter((c) => c.clientId === clientId && !c.servico);
  const showLegacy = legacyColumns.length > 0;
  const isLegacyView = selectedService === "__geral__";
  const activeColumns = isLegacyView ? legacyColumns.sort((a, b) => a.ordem - b.ordem) : clientColumns;

  const filteredTasks = tasks.filter((t) => {
    if (t.clientId !== clientId) return false;
    if (isLegacyView) { if (t.servico) return false; }
    else { if (t.servico !== selectedService && t.servico !== null) return false; }
    if (filterPriority !== "Todas" && t.prioridade !== filterPriority) return false;
    if (filterTag !== "Todas" && !t.tags.includes(filterTag)) return false;
    return true;
  });

  const handleDrop = async (taskId: string, columnId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, colunaId: columnId } : t));
    const { moveTask } = await import("@/actions/tarefas");
    await moveTask(taskId, columnId);
  };

  const handleReorder = useCallback(async (taskId: string, colId: string, targetIndex: number) => {
    setTasks((prev) => {
      const updated = prev.map((t) => t.id === taskId ? { ...t, colunaId: colId } : t);
      const colTasks = updated.filter((t) => t.colunaId === colId && t.id !== taskId).sort((a, b) => a.ordem - b.ordem);
      const moved = updated.find((t) => t.id === taskId)!;
      colTasks.splice(targetIndex, 0, moved);
      const orders = colTasks.map((t, i) => ({ ...t, ordem: i }));
      return updated.map((t) => { const o = orders.find((x) => x.id === t.id); return o ? { ...t, ordem: o.ordem, colunaId: o.colunaId } : t; });
    });
    // Persist
    const { moveTask, reorderTasks } = await import("@/actions/tarefas");
    await moveTask(taskId, colId);
    const colTasks = tasks.filter((t) => t.colunaId === colId || t.id === taskId).sort((a, b) => a.ordem - b.ordem);
    const reordered = colTasks.map((t, i) => ({ id: t.id, ordem: i }));
    await reorderTasks(reordered);
  }, [tasks]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="p-2 rounded-xl hover:bg-surface transition-colors text-on-surface-variant hover:text-on-surface"><AltArrowLeft size={20} /></button>}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">Tarefas</h1>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
              {filteredTasks.length} tarefas · {client.nome} · {isLegacyView ? "Geral" : selectedService}
            </p>
          </div>
        </div>
        <button onClick={() => setShowNewTask(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90">+ Nova Tarefa</button>
      </div>

      {/* Service tabs */}
      {(services.length > 0 || showLegacy) && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {services.map((svc) => (
            <button key={svc} onClick={() => handleServiceChange(svc)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${selectedService === svc && !isLegacyView ? "bg-secondary-container/20 text-secondary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>
              {svc}
              <span className="ml-1.5 text-[10px] opacity-60">{tasks.filter((t) => t.clientId === clientId && t.servico === svc).length}</span>
            </button>
          ))}
          {showLegacy && (
            <button onClick={() => setSelectedService("__geral__")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${isLegacyView ? "bg-secondary-container/20 text-secondary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>
              Geral <span className="ml-1.5 text-[10px] opacity-60">{tasks.filter((t) => t.clientId === clientId && !t.servico).length}</span>
            </button>
          )}
        </div>
      )}

      {initializingService && <p className="text-xs text-on-surface-variant animate-pulse">Criando colunas padrão...</p>}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-1">
          {(["Todas", "Urgente", "Alta", "Média", "Baixa"] as const).map((p) => (
            <button key={p} onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1.5 text-[11px] font-medium transition-all flex items-center gap-1.5 rounded-full ${filterPriority === p ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant"}`}>
              {p !== "Todas" && <span className={`w-1.5 h-1.5 rounded-full ${PRI_BG[p] ?? "bg-muted"}`} />}{p}
            </button>
          ))}
        </div>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-1.5 bg-surface-container-low border-none rounded-full text-[11px] text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none">
          <option value="Todas">Todas as tags</option>
          {MOCK_TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto flex-1 min-h-0 pb-4">
        {activeColumns.map((col) => (
          <Column key={col.id} column={col}
            tasks={filteredTasks.filter((t) => t.colunaId === col.id)}
            onTaskClick={setSelectedTask} onDrop={handleDrop} onReorder={handleReorder} />
        ))}
        <AddColumnButton clientId={clientId} servico={isLegacyView ? undefined : selectedService} />
      </div>

      {selectedTask && <TaskModal task={selectedTask} client={client} onClose={() => setSelectedTask(null)} onUpdate={handleTaskUpdate} />}
      {showNewTask && <NewTaskModal clientId={clientId} servico={isLegacyView ? null : selectedService} columns={activeColumns} onClose={() => setShowNewTask(false)} />}
    </>
  );
}

/* ── Add Column Button ── */
function AddColumnButton({ clientId, servico }: { clientId: string; servico?: string }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) { setAdding(false); return; }
    const { createColumn } = await import("@/actions/kanban");
    await createColumn(clientId, title.trim(), servico);
    setTitle("");
    setAdding(false);
    router.refresh();
  };

  if (adding) return (
    <div className="min-w-[270px] max-w-[300px] shrink-0">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleCreate}
        onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setTitle(""); } }}
        placeholder="Nome da coluna..." className="w-full text-sm font-medium bg-surface-container-low border-none rounded-xl px-3 py-2 text-on-surface outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant" />
    </div>
  );

  return (
    <button onClick={() => setAdding(true)} className="min-w-[270px] max-w-[300px] shrink-0 h-10 rounded-xl border-2 border-dashed border-outline-variant/20 hover:border-primary/40 text-on-surface-variant hover:text-primary text-xs flex items-center justify-center gap-2 transition-colors">
      <AddCircle size={14} /> Nova Coluna
    </button>
  );
}

/* ── New Task Modal ── */
function NewTaskModal({ clientId, servico, columns, onClose }: { clientId: string; servico: string | null; columns: KanbanColumn[]; onClose: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const inputCls = "w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary outline-none [color-scheme:dark]";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const fd = new FormData(e.currentTarget);
    fd.set("clientId", clientId);
    if (servico) fd.set("servico", servico);
    if (!fd.get("colunaId")) fd.set("colunaId", columns[0]?.id || "");
    const { createTask } = await import("@/actions/tarefas");
    const r = await createTask(fd);
    if (r.error) { setFormError(r.error); setSaving(false); return; }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Nova Tarefa</h2>
            {servico && <p className="text-xs text-on-surface-variant mt-0.5">Serviço: {servico}</p>}
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1"><CloseCircle size={18} /></button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Título <span className="text-error">*</span></label><input name="titulo" required className={inputCls} /></div>
          <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Descrição</label><textarea name="descricao" rows={3} className={`${inputCls} resize-none`} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Responsável <span className="text-error">*</span></label><input name="responsavel" required className={inputCls} /></div>
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Prazo <span className="text-error">*</span></label><input name="prazo" type="date" required className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Prioridade</label>
              <select name="prioridade" defaultValue="Média" className={inputCls}><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
            </div>
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Coluna</label>
              <select name="colunaId" defaultValue={columns[0]?.id} className={inputCls}>{columns.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}</select>
            </div>
          </div>
          <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Tags</label><input name="tags" placeholder="Tag1, Tag2" className={inputCls} /></div>
          {formError && <p className="text-error text-sm text-center">{formError}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50">{saving ? "Salvando..." : "Criar Tarefa"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
