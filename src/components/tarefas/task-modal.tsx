"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloseCircle, CheckCircle, Pen, TrashBinMinimalistic, AddCircle, Gallery, ChatRoundDots } from "@solar-icons/react";
import type { Client, Task, Etapa, TaskComment, TaskAnexo } from "@/lib/types";
import ImageAnnotator from "./image-annotator";

const PC: Record<string, { bg: string; text: string }> = {
  Urgente: { bg: "rgba(255,180,171,0.12)", text: "#ffb4ab" },
  Alta: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  Média: { bg: "rgba(108,211,252,0.12)", text: "#6cd3fc" },
  Baixa: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
};

interface Props { task: Task; client: Client; onClose: () => void; onDelete?: () => void; onUpdate?: (t: Task) => void }

export default function TaskModal({ task, client, onClose, onDelete, onUpdate }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(task.titulo);
  const [descricao, setDescricao] = useState(task.descricao);
  const [responsavel, setResponsavel] = useState(task.responsavel);
  const [prazo, setPrazo] = useState(task.prazo);
  const [prioridade, setPrioridade] = useState(task.prioridade);
  const [tagsStr, setTagsStr] = useState(task.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const [localEtapas, setLocalEtapas] = useState<Etapa[]>(task.etapas);
  const [localComments, setLocalComments] = useState<TaskComment[]>(task.comentarios);
  const [localAnexos, setLocalAnexos] = useState<TaskAnexo[]>(task.anexos);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [showNewEtapa, setShowNewEtapa] = useState(false);
  const [newEtapaTitulo, setNewEtapaTitulo] = useState("");
  const [showAddAnexo, setShowAddAnexo] = useState(false);
  const [newAnexoUrl, setNewAnexoUrl] = useState("");
  const [newAnexoNome, setNewAnexoNome] = useState("");
  const [annotatorAnexo, setAnnotatorAnexo] = useState<TaskAnexo | null>(null);

  // client is now passed directly as prop
  const etapasDone = localEtapas.filter((e) => e.concluida).length;
  const pc = PC[prioridade] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

  const handleSave = async () => {
    setSaving(true);
    const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const { updateTask } = await import("@/actions/tarefas");
    await updateTask(task.id, { titulo, descricao, responsavel, prazo, prioridade, tags });
    onUpdate?.({ ...task, titulo, descricao, responsavel, prazo, prioridade, tags, etapas: localEtapas, comentarios: localComments, anexos: localAnexos });
    setEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    const { deleteTask } = await import("@/actions/tarefas");
    await deleteTask(task.id);
    onDelete?.();
    onClose();
    router.refresh();
  };

  const handleToggleEtapa = async (id: string, cur: boolean | null) => {
    const v = !cur;
    setLocalEtapas((p) => p.map((e) => e.id === id ? { ...e, concluida: v } : e));
    const { toggleEtapa } = await import("@/actions/tarefas");
    await toggleEtapa(id, v);
  };

  const handleCreateEtapa = async () => {
    if (!newEtapaTitulo.trim()) return;
    const { createEtapa } = await import("@/actions/tarefas");
    const r = await createEtapa(task.id, newEtapaTitulo.trim(), "", prazo);
    if (r.success && r.id) setLocalEtapas((p) => [...p, { id: r.id!, taskId: task.id, titulo: newEtapaTitulo.trim(), responsavel: "", prazo, concluida: false }]);
    setNewEtapaTitulo("");
    setShowNewEtapa(false);
  };

  const handleDeleteEtapa = async (id: string) => {
    setLocalEtapas((p) => p.filter((e) => e.id !== id));
    const { deleteEtapa } = await import("@/actions/tarefas");
    await deleteEtapa(id);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || sendingComment) return;
    setSendingComment(true);
    const { addComment } = await import("@/actions/tarefas");
    const r = await addComment(task.id, "Eu", newComment.trim());
    if (r.success) setLocalComments((p) => [...p, { id: crypto.randomUUID(), taskId: task.id, usuario: "Eu", texto: newComment.trim(), data: new Date().toISOString().split("T")[0] }]);
    setNewComment("");
    setSendingComment(false);
  };

  const handleDeleteComment = async (id: string) => {
    setLocalComments((p) => p.filter((c) => c.id !== id));
    const { deleteComment } = await import("@/actions/tarefas");
    await deleteComment(id);
  };

  const handleAddAnexo = async () => {
    if (!newAnexoUrl.trim()) return;
    const tipo = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(newAnexoUrl) ? "imagem" : /\.(mp4|mov|webm)$/i.test(newAnexoUrl) ? "video" : "documento";
    const { addAnexo } = await import("@/actions/tarefas");
    const r = await addAnexo(task.id, newAnexoUrl.trim(), newAnexoNome.trim(), tipo);
    if (r.success && r.id) setLocalAnexos((p) => [...p, { id: r.id!, taskId: task.id, url: newAnexoUrl.trim(), nome: newAnexoNome.trim(), tipo }]);
    setNewAnexoUrl("");
    setNewAnexoNome("");
    setShowAddAnexo(false);
  };

  const handleDeleteAnexo = async (id: string) => {
    setLocalAnexos((p) => p.filter((a) => a.id !== id));
    const { deleteAnexo } = await import("@/actions/tarefas");
    await deleteAnexo(id);
  };

  const inputCls = "w-full bg-surface-container-lowest border-none rounded-xl px-3 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-surface-container border border-outline-variant/15 rounded-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-surface-container border-b border-outline-variant/10 p-5 flex items-start justify-between gap-3 z-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: pc.bg, color: pc.text }}>{prioridade}</span>
                {client && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant">{client.nome}</span>}
                {task.servico && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">{task.servico}</span>}
                {task.recorrente && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-medium">{task.frequencia}</span>}
              </div>
              {editing ? (
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={`${inputCls} text-lg font-semibold`} />
              ) : (
                <h2 className="text-lg font-semibold text-on-surface">{titulo}</h2>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"><Pen size={16} /></button>
              )}
              {!editing && (
                <button onClick={() => setConfirmDel(true)} className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-error/10 transition-colors"><TrashBinMinimalistic size={16} /></button>
              )}
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1"><CloseCircle size={18} /></button>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Meta */}
            {editing ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Responsável</label><input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className={inputCls} /></div>
                <div><label className="text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Prazo</label><input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className={inputCls} /></div>
                <div><label className="text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Prioridade</label>
                  <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} className={inputCls}><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
                </div>
                <div><label className="text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Tags</label><input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} placeholder="Tag1, Tag2" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoBlock label="Responsável" value={responsavel} />
                <InfoBlock label="Prazo" value={new Date(prazo).toLocaleDateString("pt-BR")} alert={new Date(prazo) < new Date()} />
                <InfoBlock label="Criado em" value={new Date(task.criadoEm).toLocaleDateString("pt-BR")} />
                <InfoBlock label="Etapas" value={localEtapas.length > 0 ? `${etapasDone}/${localEtapas.length}` : "Nenhuma"} />
              </div>
            )}

            {/* Description */}
            <div>
              <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-2">Descrição</p>
              {editing ? (
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
              ) : (
                <p className="text-sm text-on-surface leading-relaxed bg-surface-container-lowest rounded-xl p-4">{descricao || "Sem descrição"}</p>
              )}
            </div>

            {/* Save/Cancel */}
            {editing && (
              <div className="flex gap-3">
                <button onClick={() => { setEditing(false); setTitulo(task.titulo); setDescricao(task.descricao); setResponsavel(task.responsavel); setPrazo(task.prazo); setPrioridade(task.prioridade); setTagsStr(task.tags.join(", ")); }} className="flex-1 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-full bg-primary text-on-primary text-sm font-medium disabled:opacity-50">{saving ? "Salvando..." : "Salvar"}</button>
              </div>
            )}

            {/* Tags (view mode) */}
            {!editing && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant">{tag}</span>)}
              </div>
            )}

            {/* Etapas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Etapas</p>
                <div className="flex items-center gap-2">
                  {localEtapas.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-surface-container-lowest overflow-hidden"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${localEtapas.length > 0 ? (etapasDone / localEtapas.length) * 100 : 0}%` }} /></div>
                      <span className="text-[10px] text-on-surface-variant">{localEtapas.length > 0 ? Math.round((etapasDone / localEtapas.length) * 100) : 0}%</span>
                    </div>
                  )}
                  <button onClick={() => setShowNewEtapa(true)} className="text-on-surface-variant hover:text-primary p-1"><AddCircle size={14} /></button>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                {localEtapas.map((etapa) => (
                  <div key={etapa.id} className="flex items-center px-4 py-3 gap-3 group hover:bg-surface-container transition-colors">
                    <div onClick={() => handleToggleEtapa(etapa.id, etapa.concluida)} className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${etapa.concluida ? "bg-secondary/20 border-secondary" : "border-outline-variant"}`}>
                      {etapa.concluida && <CheckCircle size={10} color="#6cd3fc" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${etapa.concluida ? "text-on-surface-variant line-through" : "text-on-surface"}`}>{etapa.titulo}</p>
                      {etapa.responsavel && <p className="text-[10px] text-on-surface-variant mt-0.5">{etapa.responsavel} · {new Date(etapa.prazo).toLocaleDateString("pt-BR")}</p>}
                    </div>
                    <button onClick={() => handleDeleteEtapa(etapa.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error p-1 transition-opacity"><TrashBinMinimalistic size={12} /></button>
                  </div>
                ))}
                {localEtapas.length === 0 && !showNewEtapa && <p className="text-xs text-outline text-center py-4">Nenhuma etapa criada</p>}
              </div>
              {showNewEtapa && (
                <div className="flex gap-2 mt-2">
                  <input autoFocus value={newEtapaTitulo} onChange={(e) => setNewEtapaTitulo(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleCreateEtapa(); if (e.key === "Escape") setShowNewEtapa(false); }} placeholder="Título da etapa..." className={`flex-1 ${inputCls}`} />
                  <button onClick={handleCreateEtapa} className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-medium">Criar</button>
                </div>
              )}
            </div>

            {/* Anexos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Anexos ({localAnexos.length})</p>
                <button onClick={() => setShowAddAnexo(true)} className="text-on-surface-variant hover:text-primary p-1"><AddCircle size={14} /></button>
              </div>
              {localAnexos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {localAnexos.map((a) => (
                    <div key={a.id} className="relative group rounded-xl overflow-hidden bg-surface-container-lowest">
                      {a.tipo === "imagem" ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.url} alt={a.nome || "Anexo"} className="w-full h-24 object-cover cursor-pointer" onClick={() => setAnnotatorAnexo(a)} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <button onClick={() => setAnnotatorAnexo(a)} className="opacity-0 group-hover:opacity-100 text-white text-[10px] flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg"><Gallery size={12} /> Feedback</button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center"><p className="text-[10px] text-on-surface-variant truncate px-2">{a.nome || a.url}</p></div>
                      )}
                      <button onClick={() => handleDeleteAnexo(a.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-error/80 text-white p-1 rounded-lg transition-opacity"><TrashBinMinimalistic size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
              {localAnexos.length === 0 && !showAddAnexo && <p className="text-xs text-outline text-center py-4 bg-surface-container-lowest rounded-xl">Nenhum anexo</p>}
              {showAddAnexo && (
                <div className="flex flex-col gap-2 mt-2 bg-surface-container-lowest rounded-xl p-3">
                  <input value={newAnexoUrl} onChange={(e) => setNewAnexoUrl(e.target.value)} placeholder="URL do arquivo..." className={inputCls} />
                  <input value={newAnexoNome} onChange={(e) => setNewAnexoNome(e.target.value)} placeholder="Nome (opcional)" className={inputCls} />
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddAnexo(false); setNewAnexoUrl(""); setNewAnexoNome(""); }} className="flex-1 py-1.5 text-xs text-on-surface-variant rounded-lg">Cancelar</button>
                    <button onClick={handleAddAnexo} className="flex-1 py-1.5 text-xs bg-primary text-on-primary rounded-lg font-medium">Adicionar</button>
                  </div>
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-2">
                <ChatRoundDots size={12} className="inline mr-1" />Comentários ({localComments.length})
              </p>
              {localComments.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {localComments.map((c) => (
                    <div key={c.id} className="bg-surface-container-lowest rounded-xl p-3 group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-on-surface">{c.usuario}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-on-surface-variant">{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                          <button onClick={() => handleDeleteComment(c.id)} className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error p-0.5 transition-opacity"><TrashBinMinimalistic size={10} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{c.texto}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" placeholder="Adicionar comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }} className={`flex-1 ${inputCls}`} />
                <button onClick={handleAddComment} disabled={sendingComment || !newComment.trim()} className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 shrink-0 disabled:opacity-50">{sendingComment ? "..." : "Enviar"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDel && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDel(false)} />
          <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-sm font-semibold text-on-surface mb-2">Excluir tarefa?</h3>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(false)} className="flex-1 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-full bg-error/20 text-sm font-medium text-error hover:bg-error/30">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Annotator */}
      {annotatorAnexo && (
        <ImageAnnotator taskId={task.id} anexoId={annotatorAnexo.id} imageUrl={annotatorAnexo.url} onClose={() => setAnnotatorAnexo(null)} />
      )}
    </>
  );
}

function InfoBlock({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-3">
      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-medium ${alert ? "text-error" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}
