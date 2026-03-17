"use client";

import { useState } from "react";
import { CloseCircle, TrashBinMinimalistic, AddCircle, GalleryWide } from "@solar-icons/react";
import type { ProjetoAsset } from "@/lib/types";

interface ProjetoAssetsProps {
  projetoId: string;
  assets: ProjetoAsset[];
  canEdit: boolean;
}

export default function ProjetoAssets({ projetoId, assets, canEdit }: ProjetoAssetsProps) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-soft">{assets.length} asset{assets.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
            + Adicionar Asset
          </button>
        )}
      </div>

      {assets.length === 0 ? (
        <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
          <GalleryWide size={32} className="text-muted-soft mb-3" />
          <p className="text-muted text-sm font-medium mb-1">Nenhum asset</p>
          <p className="text-muted-soft text-xs">Adicione imagens, vídeos ou documentos ao projeto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} projetoId={projetoId} canEdit={canEdit} />
          ))}
        </div>
      )}

      {showAdd && <AddAssetModal projetoId={projetoId} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AssetCard({ asset, projetoId, canEdit }: { asset: ProjetoAsset; projetoId: string; canEdit: boolean }) {
  const isImage = asset.tipo === "Imagem";

  const handleDelete = async () => {
    const { deleteProjetoAsset } = await import("@/actions/projetos");
    await deleteProjetoAsset(asset.id, projetoId);
    window.location.reload();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-border overflow-hidden group relative">
      <div className="aspect-square bg-[#141414] flex items-center justify-center">
        {isImage && asset.url ? (
          <img src={asset.url} alt={asset.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-soft">
            <GalleryWide size={24} />
            <span className="text-[10px]">{asset.tipo}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-[#c8c8c8] truncate">{asset.nome}</p>
        <p className="text-[10px] text-muted-soft mt-0.5">{new Date(asset.criadoEm).toLocaleDateString("pt-BR")}</p>
      </div>
      {canEdit && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-muted-soft hover:text-urgent transition-all"
        >
          <TrashBinMinimalistic size={12} />
        </button>
      )}
    </div>
  );
}

function AddAssetModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState("Imagem");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addProjetoAsset } = await import("@/actions/projetos");
    await addProjetoAsset(projetoId, nome, url, tipo);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Adicionar Asset</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do asset" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL do arquivo" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
            <option>Imagem</option>
            <option>Video</option>
            <option>Documento</option>
            <option>Outro</option>
          </select>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50">
              {saving ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
