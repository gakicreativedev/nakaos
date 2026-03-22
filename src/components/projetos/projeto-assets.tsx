"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <p className="text-xs text-outline">{assets.length} asset{assets.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <button onClick={() => setShowAdd(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            + Adicionar Asset
          </button>
        )}
      </div>

      {assets.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-12 flex flex-col items-center text-center">
          <GalleryWide size={32} className="text-outline mb-3" />
          <p className="text-on-surface-variant text-sm font-medium mb-1">Nenhum asset</p>
          <p className="text-outline text-xs">Adicione imagens, vídeos ou documentos ao projeto.</p>
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
  const router = useRouter();
  const isImage = asset.tipo === "Imagem";

  const handleDelete = async () => {
    const { deleteProjetoAsset } = await import("@/actions/projetos");
    await deleteProjetoAsset(asset.id, projetoId);
    router.refresh();
  };

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden group relative">
      <div className="aspect-square bg-surface-container-lowest flex items-center justify-center">
        {isImage && asset.url ? (
          <img src={asset.url} alt={asset.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-outline">
            <GalleryWide size={24} />
            <span className="text-[10px]">{asset.tipo}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-on-surface truncate">{asset.nome}</p>
        <p className="text-[10px] text-outline mt-0.5">{new Date(asset.criadoEm).toLocaleDateString("pt-BR")}</p>
      </div>
      {canEdit && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-outline hover:text-error transition-all"
        >
          <TrashBinMinimalistic size={12} />
        </button>
      )}
    </div>
  );
}

function AddAssetModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Adicionar Asset</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do asset" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL do arquivo" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
            <option>Imagem</option>
            <option>Video</option>
            <option>Documento</option>
            <option>Outro</option>
          </select>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
