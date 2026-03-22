"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloseCircle, AddCircle, Pen, TrashBinMinimalistic, MenuDots, CheckCircle } from "@solar-icons/react";
import type { ProjetoKanbanColumn, ProjetoTask, ProjetoMembro, Usuario } from "@/lib/types";

const PRIORITY_COLORS: Record<string, string> = {
  Urgente: "bg-error",
  Alta: "bg-warning",
  Média: "bg-secondary",
  Baixa: "bg-success",
};

interface ProjetoKanbanProps {
  projetoId: string;
  columns: ProjetoKanbanColumn[];
  tasks: ProjetoTask[];
  membros: ProjetoMembro[];
  usuarios: Usuario[];
  canEdit: boolean;
}

export default function ProjetoKanban({ projetoId, columns, tasks: tasksProp, membros, usuarios, canEdit }: ProjetoKanbanProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(tasksProp);
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjetoTask | null>(null);

  const sortedColumns = [...columns].sort((a, b) => a.ordem - b.ordem);
  const memberUsers = usuarios.filter((u) => membros.some((m) => m.usuarioId === u.id));

  const handleDrop = async (taskId: string, columnId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, colunaId: columnId } : t)));
    const { moveProjetoTask } = await import("@/actions/projetos");
    await moveProjetoTask(taskId, columnId, projetoId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-outline">{tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <button onClick={() => setShowNewTask(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            + Nova Tarefa
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto flex-1 min-h-0 pb-4">
        {sortedColumns.map((col) => (
          <KanbanColumn key={col.id} column={col} tasks={tasks.filter((t) => t.colunaId === col.id)}
            onDrop={handleDrop} projetoId={projetoId} canEdit={canEdit} onTaskClick={setSelectedTask} />
        ))}
        {canEdit && <AddColumnButton projetoId={projetoId} />}
      </div>

      {showNewTask && <NewProjetoTaskModal projetoId={projetoId} columns={sortedColumns} memberUsers={memberUsers} onClose={() => setShowNewTask(false)} />}
      {selectedTask && <ProjetoTaskModal task={selectedTask} projetoId={projetoId} columns={sortedColumns} canEdit={canEdit}
        onClose={() => setSelectedTask(null)} onUpdate={(t) => { setTasks((prev) => prev.map((x) => x.id === t.id ? t : x)); setSelectedTask(t); }}
        onDelete={() => { setTasks((prev) => prev.filter((x) => x.id !== selectedTask.id)); setSelectedTask(null); router.refresh(); }} />}
    </div>
  );
}

function KanbanColumn({
  column, tasks, onDrop, projetoId, canEdit, onTaskClick,
}: {
  column: ProjetoKanbanColumn; tasks: ProjetoTask[];
  onDrop: (taskId: string, columnId: string) => void;
  projetoId: string; canEdit: boolean;
  onTaskClick: (t: ProjetoTask) => void;
}) {
  const router = useRouter();
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
    const { updateProjetoColumn } = await import("@/actions/projetos");
    await updateProjetoColumn(column.id, newTitle.trim(), projetoId);
    setRenaming(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const { deleteProjetoColumn } = await import("@/actions/projetos");
    await deleteProjetoColumn(column.id, projetoId);
    setConfirmDelete(false);
    router.refresh();
  };

  return (
    <div
      className={`flex flex-col min-w-[270px] max-w-[300px] rounded-xl transition-colors ${dragOver ? "bg-surface-container" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const taskId = e.dataTransfer.getData("taskId"); if (taskId) onDrop(taskId, column.id); }}
    >
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {renaming ? (
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") { setRenaming(false); setNewTitle(column.titulo); } }}
              className="text-sm font-medium text-on-surface bg-surface-container-lowest rounded-lg px-2 py-0.5 outline-none focus:ring-1 focus:ring-primary w-full"
            />
          ) : (
            <>
              <h3 className="text-sm font-medium text-on-surface truncate">{column.titulo}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container text-outline shrink-0">{tasks.length}</span>
            </>
          )}
        </div>
        {canEdit && !renaming && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg text-outline hover:text-on-surface-variant hover:bg-surface-container transition-colors">
              <MenuDots size={14} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-surface-container border border-outline-variant/15 rounded-xl overflow-hidden shadow-xl min-w-[130px]">
                  <button onClick={() => { setShowMenu(false); setRenaming(true); }} className="w-full px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2">
                    <Pen size={12} /> Renomear
                  </button>
                  <button onClick={() => { setShowMenu(false); setConfirmDelete(true); }} className="w-full px-3 py-2 text-left text-xs text-error hover:bg-surface-container transition-colors flex items-center gap-2">
                    <TrashBinMinimalistic size={12} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-[100px]">
        {tasks.map((task) => (
          <div key={task.id} draggable onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)} onClick={() => onTaskClick(task)}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-on-surface mb-2">Excluir coluna &quot;{column.titulo}&quot;?</h3>
            <p className="text-xs text-outline mb-4">
              {tasks.length > 0
                ? `Isso excluirá permanentemente ${tasks.length} tarefa${tasks.length > 1 ? "s" : ""} desta coluna.`
                : "Esta coluna está vazia e será removida."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-full bg-error/20 border border-error/30 text-sm font-medium text-error hover:bg-error/30 transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: ProjetoTask }) {
  const isOverdue = new Date(task.prazo) < new Date();
  return (
    <div className="bg-surface-container-low rounded-xl p-3.5 cursor-grab transition-all hover:bg-surface-container hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] group">
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-outline">{tag}</span>
          ))}
        </div>
      )}
      <p className="text-[13px] font-medium text-on-surface mb-2 leading-snug group-hover:text-on-surface transition-colors">{task.titulo}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.prioridade] ?? "bg-on-surface-variant"} shrink-0`} />
          <span className={`text-[10px] ${isOverdue ? "text-error font-medium" : "text-outline"}`}>
            {new Date(task.prazo).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
        </div>
        <span className="text-[10px] text-outline">{task.responsavel}</span>
      </div>
    </div>
  );
}

function AddColumnButton({ projetoId }: { projetoId: string }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) { setAdding(false); return; }
    const { createProjetoColumn } = await import("@/actions/projetos");
    await createProjetoColumn(projetoId, title.trim());
    setTitle("");
    setAdding(false);
    router.refresh();
  };

  if (adding) {
    return (
      <div className="min-w-[270px] max-w-[300px] shrink-0">
        <input
          autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
          onBlur={handleCreate}
          onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setTitle(""); } }}
          placeholder="Nome da coluna..."
          className="w-full text-sm font-medium text-on-surface bg-surface-container-lowest rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/40"
        />
      </div>
    );
  }

  return (
    <button onClick={() => setAdding(true)} className="min-w-[270px] max-w-[300px] shrink-0 h-10 border-2 border-dashed border-outline-variant/20 rounded-xl hover:border-outline/30 text-outline hover:text-on-surface-variant text-xs flex items-center justify-center gap-2 transition-colors">
      <AddCircle size={14} /> Nova Coluna
    </button>
  );
}

/* ── Task Edit Modal ── */
function ProjetoTaskModal({ task, projetoId, columns, canEdit, onClose, onUpdate, onDelete }: {
  task: ProjetoTask; projetoId: string; columns: ProjetoKanbanColumn[]; canEdit: boolean;
  onClose: () => void; onUpdate: (t: ProjetoTask) => void; onDelete: () => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(task.titulo);
  const [descricao, setDescricao] = useState(task.descricao);
  const [responsavel, setResponsavel] = useState(task.responsavel);
  const [prazo, setPrazo] = useState(task.prazo);
  const [prioridade, setPrioridade] = useState(task.prioridade);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const inputCls = "w-full bg-surface-container-low border-none rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary";

  const handleSave = async () => {
    setSaving(true);
    const { updateProjetoTask } = await import("@/actions/projetos");
    await updateProjetoTask(task.id, projetoId, { titulo, descricao, responsavel, prazo, prioridade });
    const updated = { ...task, titulo, descricao, responsavel, prazo, prioridade };
    onUpdate(updated);
    setEditing(false);
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const { deleteProjetoTask } = await import("@/actions/projetos");
    await deleteProjetoTask(task.id, projetoId);
    onDelete();
  };

  const handleMove = async (colunaId: string) => {
    const { moveProjetoTask } = await import("@/actions/projetos");
    await moveProjetoTask(task.id, colunaId, projetoId);
    onUpdate({ ...task, colunaId });
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface truncate flex-1">{editing ? "Editar Tarefa" : task.titulo}</h2>
          <div className="flex items-center gap-1">
            {canEdit && !editing && (
              <>
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"><Pen size={14} /></button>
                <button onClick={() => setConfirmDel(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error"><TrashBinMinimalistic size={14} /></button>
              </>
            )}
            <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface"><CloseCircle size={18} /></button>
          </div>
        </div>

        {editing ? (
          <div className="flex flex-col gap-3">
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Título</label><input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputCls} /></div>
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Descrição</label><textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={`${inputCls} resize-none`} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Responsável</label><input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className={inputCls} /></div>
              <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Prazo</label><input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className={`${inputCls} [color-scheme:dark]`} /></div>
            </div>
            <div><label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Prioridade</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} className={inputCls}><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setEditing(false); setTitulo(task.titulo); setDescricao(task.descricao); setResponsavel(task.responsavel); setPrazo(task.prazo); setPrioridade(task.prioridade); }} className="flex-1 py-2.5 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"><CheckCircle size={14} /> {saving ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {task.descricao && <p className="text-sm text-on-surface-variant leading-relaxed">{task.descricao}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Responsável</p><p className="text-sm text-on-surface">{task.responsavel}</p></div>
              <div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Prazo</p><p className={`text-sm ${new Date(task.prazo) < new Date() ? "text-error" : "text-on-surface"}`}>{new Date(task.prazo).toLocaleDateString("pt-BR")}</p></div>
              <div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Prioridade</p><p className="text-sm text-on-surface flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.prioridade] ?? "bg-outline"}`} />{task.prioridade}</p></div>
              <div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Coluna</p>
                {canEdit ? (
                  <select value={task.colunaId} onChange={(e) => handleMove(e.target.value)} className="text-sm text-on-surface bg-surface-container-low border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary">
                    {columns.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                  </select>
                ) : <p className="text-sm text-on-surface">{columns.find((c) => c.id === task.colunaId)?.titulo}</p>}
              </div>
            </div>
            {task.tags.length > 0 && (
              <div><p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Tags</p><div className="flex flex-wrap gap-1">{task.tags.map((t) => <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{t}</span>)}</div></div>
            )}
          </div>
        )}

        {confirmDel && (
          <div className="mt-4 p-4 bg-error/5 border border-error/20 rounded-xl">
            <p className="text-xs text-error mb-3">Excluir tarefa &quot;{task.titulo}&quot;? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(false)} className="flex-1 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-full bg-error/20 text-sm font-medium text-error hover:bg-error/30">Excluir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NewProjetoTaskModal({
  projetoId,
  columns,
  memberUsers,
  onClose,
}: {
  projetoId: string;
  columns: ProjetoKanbanColumn[];
  memberUsers: { id: string; nome: string }[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("projetoId", projetoId);
    if (!formData.get("colunaId")) formData.set("colunaId", columns[0]?.id || "");
    const { createProjetoTask } = await import("@/actions/projetos");
    const result = await createProjetoTask(formData);
    if (result.error) { setFormError(result.error); setSaving(false); return; }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Nova Tarefa</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Título <span className="text-error">*</span></label>
            <input name="titulo" type="text" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Descrição</label>
            <textarea name="descricao" rows={3} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Responsável <span className="text-error">*</span></label>
              <input name="responsavel" type="text" required list="membros-list" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
              <datalist id="membros-list">
                {memberUsers.map((u) => <option key={u.id} value={u.nome} />)}
              </datalist>
            </div>
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Prazo <span className="text-error">*</span></label>
              <input name="prazo" type="date" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Prioridade</label>
              <select name="prioridade" defaultValue="Média" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Coluna</label>
              <select name="colunaId" defaultValue={columns[0]?.id} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
                {columns.map((col) => <option key={col.id} value={col.id}>{col.titulo}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">Tags (separadas por vírgula)</label>
            <input name="tags" type="text" placeholder="Design, Revisão" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          {formError && <p className="text-error text-sm text-center">{formError}</p>}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
