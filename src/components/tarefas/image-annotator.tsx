"use client";

import { useState, useEffect, useRef } from "react";
import { CloseCircle, CheckCircle, TrashBinMinimalistic } from "@solar-icons/react";
import type { TaskAnnotation } from "@/lib/types";

interface Props {
  taskId: string;
  anexoId: string;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageAnnotator({ taskId, anexoId, imageUrl, onClose }: Props) {
  const [annotations, setAnnotations] = useState<TaskAnnotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    (async () => {
      const { getAnnotationsByAnexo } = await import("@/lib/queries");
      const data = await getAnnotationsByAnexo(anexoId);
      setAnnotations(data as TaskAnnotation[]);
      setLoading(false);
    })();
  }, [anexoId]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickPos({ x, y });
    setActivePin(null);
    setNewText("");
  };

  const handleCreate = async () => {
    if (!clickPos || !newText.trim() || saving) return;
    setSaving(true);
    const { createAnnotation } = await import("@/actions/annotations");
    const result = await createAnnotation(taskId, anexoId, clickPos.x, clickPos.y, "Eu", newText.trim());
    if (result.success && result.id) {
      setAnnotations((prev) => [...prev, { id: result.id!, taskId, anexoId, x: clickPos.x, y: clickPos.y, usuario: "Eu", texto: newText.trim(), resolved: false, criadoEm: new Date().toISOString().split("T")[0] }]);
    }
    setClickPos(null);
    setNewText("");
    setSaving(false);
  };

  const handleResolve = async (id: string, current: boolean | null) => {
    const newVal = !current;
    setAnnotations((prev) => prev.map((a) => a.id === id ? { ...a, resolved: newVal } : a));
    const { resolveAnnotation } = await import("@/actions/annotations");
    await resolveAnnotation(id, newVal);
  };

  const handleDelete = async (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    const { deleteAnnotation } = await import("@/actions/annotations");
    await deleteAnnotation(id);
    setActivePin(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface-container/80">
        <div>
          <h3 className="text-sm font-semibold text-on-surface">Feedback Visual</h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Clique na imagem para adicionar um ponto de feedback</p>
        </div>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1"><CloseCircle size={20} /></button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Image area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
          <div className="relative inline-block max-w-full max-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={imageUrl} alt="Anexo" onClick={handleImageClick} className="max-w-full max-h-[75vh] object-contain cursor-crosshair rounded-xl" />

            {/* Pins */}
            {annotations.map((a, i) => (
              <button
                key={a.id}
                onClick={(e) => { e.stopPropagation(); setActivePin(activePin === a.id ? null : a.id); setClickPos(null); }}
                className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg transition-transform hover:scale-110 ${a.resolved ? "bg-success" : "bg-warning"}`}
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
              >
                {i + 1}
              </button>
            ))}

            {/* New pin */}
            {clickPos && (
              <div className="absolute -ml-3.5 -mt-3.5" style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-on-primary animate-pulse shadow-lg">+</div>
                <div className="absolute top-8 left-0 w-64 bg-surface-container rounded-xl p-3 shadow-xl border border-outline-variant/15 z-10" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    autoFocus
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCreate(); } if (e.key === "Escape") setClickPos(null); }}
                    placeholder="Descreva a alteração..."
                    className="w-full bg-surface-container-lowest rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline/40 outline-none resize-none focus:ring-1 focus:ring-primary"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setClickPos(null)} className="flex-1 py-1.5 text-[10px] text-on-surface-variant rounded-lg hover:bg-surface-container-low">Cancelar</button>
                    <button onClick={handleCreate} disabled={saving || !newText.trim()} className="flex-1 py-1.5 text-[10px] bg-primary text-on-primary rounded-lg font-medium disabled:opacity-50">{saving ? "..." : "Criar"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Active pin popover */}
            {activePin && (() => {
              const a = annotations.find((x) => x.id === activePin);
              if (!a) return null;
              return (
                <div className="absolute z-10 w-64 bg-surface-container rounded-xl p-3 shadow-xl border border-outline-variant/15" style={{ left: `${a.x}%`, top: `${a.y}%`, marginTop: 20, marginLeft: -14 }} onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-on-surface mb-1">{a.texto}</p>
                  <p className="text-[10px] text-on-surface-variant mb-2">{a.usuario} · {a.criadoEm}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(a.id, a.resolved)} className={`flex-1 py-1.5 text-[10px] rounded-lg flex items-center justify-center gap-1 ${a.resolved ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                      <CheckCircle size={10} /> {a.resolved ? "Reabrir" : "Resolver"}
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="py-1.5 px-2 text-[10px] rounded-lg bg-error/20 text-error flex items-center gap-1">
                      <TrashBinMinimalistic size={10} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Sidebar - annotation list */}
        <div className="w-72 bg-surface-container border-l border-outline-variant/10 overflow-y-auto p-4 flex flex-col gap-2">
          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">
            {loading ? "Carregando..." : `${annotations.length} anotação(ões)`}
          </p>
          {annotations.map((a, i) => (
            <div key={a.id} className={`rounded-xl p-3 cursor-pointer transition-colors ${activePin === a.id ? "bg-surface-container-high" : "bg-surface-container-lowest hover:bg-surface-container-low"}`} onClick={() => setActivePin(a.id)}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${a.resolved ? "bg-success" : "bg-warning"}`}>{i + 1}</span>
                <span className="text-[10px] text-on-surface-variant">{a.usuario} · {a.criadoEm}</span>
              </div>
              <p className={`text-xs ${a.resolved ? "text-on-surface-variant line-through" : "text-on-surface"}`}>{a.texto}</p>
            </div>
          ))}
          {!loading && annotations.length === 0 && (
            <p className="text-xs text-outline text-center py-8">Clique na imagem para criar a primeira anotação.</p>
          )}
        </div>
      </div>
    </div>
  );
}
