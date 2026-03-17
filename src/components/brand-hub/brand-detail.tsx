"use client";

import { useState } from "react";
import Link from "next/link";
import { AltArrowLeft, AddCircle, Gallery, Import, CloseCircle, TrashBinMinimalistic, Pen } from "@solar-icons/react";
import type { Client, BrandHubData, BrandColor } from "@/lib/types";
import CsvImportModal from "./csv-import-modal";
import EditIdentidadeModal from "../shared/edit-identidade-modal";

/* ── Section ── */
function Section({ title, count, action, children }: { title: string; count?: number; action?: { label: string; onClick: () => void; icon?: boolean }; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-gradient">{title}</h2>
          {count !== undefined && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface text-muted-soft">{count}</span>
          )}
        </div>
        {action && (
          <button onClick={action.onClick} className="text-muted-soft hover:text-muted transition-colors flex items-center gap-1 text-xs">
            {action.icon ? <Pen size={12} /> : <AddCircle size={14} />} {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Color Card with copy-on-click + delete ── */
function ColorCard({ cor, clientId }: { cor: BrandColor; clientId: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = async () => {
    const { deleteBrandColor } = await import("@/actions/brand-hub");
    await deleteBrandColor(cor.id, clientId);
    window.location.reload();
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden group relative">
      <div className="h-20 w-full" style={{ background: cor.hex }} />
      <div className="p-4">
        <p className="text-sm font-medium text-[#c8c8c8] mb-3">{cor.nome}</p>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "HEX", value: cor.hex },
            { label: "RGB", value: cor.rgb },
            { label: "CMYK", value: cor.cmyk },
          ].filter((item) => item.value).map((item) => (
            <button
              key={item.label}
              onClick={() => copyValue(item.label, item.value)}
              className="flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-[10px] font-medium text-muted uppercase tracking-wider">{item.label}</span>
              <span className="text-xs text-muted-soft font-mono">
                {copied === item.label ? "Copiado!" : item.value}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-muted-soft hover:text-urgent transition-all"
      >
        <TrashBinMinimalistic size={12} />
      </button>
    </div>
  );
}

/* ── Logo Card ── */
function LogoCard({ logo, clientId }: { logo: { id: string; categoria: string; url: string }; clientId: string }) {
  const handleDelete = async () => {
    const { deleteBrandLogo } = await import("@/actions/brand-hub");
    await deleteBrandLogo(logo.id, clientId);
    window.location.reload();
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden group relative">
      <div className="h-32 w-full bg-[#1a1a1a] flex items-center justify-center">
        {logo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.url} alt={logo.categoria} className="max-h-full max-w-full object-contain p-4" />
        ) : (
          <div className="text-muted-soft text-xs flex flex-col items-center gap-2">
            <Gallery size={24} />
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#c8c8c8]">{logo.categoria}</span>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-muted-soft hover:text-urgent transition-all"
      >
        <TrashBinMinimalistic size={12} />
      </button>
    </div>
  );
}

/* ── Font Card ── */
function FontCard({ font, clientId }: { font: { id: string; nome: string; categoria: string; downloadUrl: string }; clientId: string }) {
  const handleDelete = async () => {
    const { deleteBrandFont } = await import("@/actions/brand-hub");
    await deleteBrandFont(font.id, clientId);
    window.location.reload();
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-border p-5 group relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-[#c8c8c8]">{font.nome}</p>
          <p className="text-[11px] text-muted-soft">{font.categoria}</p>
        </div>
        {font.downloadUrl && (
          <a
            href={font.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-3 py-1.5 rounded-lg border border-border text-muted-soft hover:text-muted hover:border-border-hover transition-all"
          >
            Download
          </a>
        )}
      </div>
      <div className="text-2xl text-[#c8c8c8] mt-2 leading-relaxed" style={{ fontFamily: `'${font.nome}', sans-serif` }}>
        Aa Bb Cc 123
      </div>
      <p className="text-xs text-muted-soft mt-1" style={{ fontFamily: `'${font.nome}', sans-serif` }}>
        The quick brown fox jumps over the lazy dog.
      </p>
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-soft hover:text-urgent transition-all p-1"
      >
        <TrashBinMinimalistic size={14} />
      </button>
    </div>
  );
}

/* ── Text Section Block ── */
function TextSection({ label, value }: { label: string; value: string }) {
  const isEmpty = !value || value === "<p></p>" || value === "<p></p>\n";
  return (
    <div className="bg-[#141414] rounded-2xl border border-border p-5">
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      {isEmpty ? (
        <p className="text-sm text-[#c8c8c8] leading-relaxed">—</p>
      ) : (
        <div
          className="text-sm text-[#c8c8c8] leading-relaxed prose-display"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
}

/* ── Main Component ── */
interface BrandDetailProps {
  client: Client;
  brandHub: BrandHubData | null;
  clients: Client[];
}

export default function BrandDetail({ client, brandHub, clients }: BrandDetailProps) {
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [showAddColor, setShowAddColor] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [showAddLogo, setShowAddLogo] = useState(false);
  const [showEditIdentidade, setShowEditIdentidade] = useState(false);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-soft">
        <p className="text-lg">Cliente não encontrado</p>
        <Link href="/brand-hub" className="text-sm mt-2 text-info hover:underline">Voltar</Link>
      </div>
    );
  }

  if (!brandHub) {
    return (
      <>
        <BackHeader clientName={client.nome} />
        <EmptyBrandHub clientId={client.id} clientName={client.nome} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <BackHeader clientName={client.nome} />
        <button
          onClick={() => setShowCsvImport(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-xs font-medium text-foreground hover:border-[#3a3a3a] transition-colors flex items-center gap-2"
        >
          <Import size={14} /> Importar CSV
        </button>
      </div>

      {showCsvImport && <CsvImportModal clientId={client.id} onClose={() => setShowCsvImport(false)} />}

      {/* Logos */}
      <Section title="Logos" count={brandHub.logos.length}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brandHub.logos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} clientId={client.id} />
          ))}
          <button
            onClick={() => setShowAddLogo(true)}
            className="h-32 rounded-2xl border border-dashed border-border hover:border-border-hover text-muted-soft text-xs flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <AddCircle size={20} />
            Nova variação
          </button>
        </div>
      </Section>

      {/* Cores */}
      <Section title="Paleta de Cores" count={brandHub.cores.length} action={{ label: "Adicionar", onClick: () => setShowAddColor(true) }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brandHub.cores.map((cor) => (
            <ColorCard key={cor.id} cor={cor} clientId={client.id} />
          ))}
        </div>
      </Section>

      {/* Fontes */}
      <Section title="Tipografia" count={brandHub.fontes.length} action={{ label: "Adicionar", onClick: () => setShowAddFont(true) }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {brandHub.fontes.map((font) => (
            <FontCard key={font.id} font={font} clientId={client.id} />
          ))}
        </div>
      </Section>

      {/* Identidade */}
      <Section title="Identidade da Marca" action={{ label: "Editar", onClick: () => setShowEditIdentidade(true), icon: true }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextSection label="Nicho" value={brandHub.nicho} />
          <TextSection label="Público-alvo" value={brandHub.publicoAlvo} />
          <TextSection label="Tom de Voz" value={brandHub.tomDeVoz} />
          <TextSection label="Slogan" value={brandHub.slogan} />
          <TextSection label="Concorrentes" value={brandHub.concorrentes} />
          <TextSection label="Restrições Visuais" value={brandHub.restricoesVisuais} />
        </div>
      </Section>

      {/* Histórico */}
      {brandHub.historico.length > 0 && (
        <Section title="Histórico de Alterações">
          <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden">
            {brandHub.historico.map((entry, i) => (
              <div key={i} className="flex items-center px-5 py-3 border-b border-[#1a1a1a] last:border-b-0 gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-soft shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#c8c8c8]">{entry.descricao}</p>
                  <p className="text-[10px] text-muted-soft mt-0.5">
                    {entry.usuario} · {new Date(entry.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Modals */}
      {showAddColor && <AddColorModal clientId={client.id} onClose={() => setShowAddColor(false)} />}
      {showAddFont && <AddFontModal clientId={client.id} onClose={() => setShowAddFont(false)} />}
      {showAddLogo && <AddLogoModal clientId={client.id} onClose={() => setShowAddLogo(false)} />}
      {showEditIdentidade && (
        <EditIdentidadeModal
          initialValues={{
            nicho: brandHub.nicho || "",
            publicoAlvo: brandHub.publicoAlvo || "",
            tomDeVoz: brandHub.tomDeVoz || "",
            slogan: brandHub.slogan || "",
            concorrentes: brandHub.concorrentes || "",
            restricoesVisuais: brandHub.restricoesVisuais || "",
          }}
          onSave={async (fields) => {
            const { updateBrandIdentity } = await import("@/actions/brand-hub");
            await updateBrandIdentity(client.id, fields);
            setShowEditIdentidade(false);
            window.location.reload();
          }}
          onClose={() => setShowEditIdentidade(false)}
        />
      )}
    </>
  );
}

/* ── Shared Components ── */
function BackHeader({ clientName }: { clientName: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link href="/brand-hub" className="p-2 rounded-xl hover:bg-surface transition-colors text-muted">
        <AltArrowLeft size={18} />
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gradient tracking-tight">{clientName}</h1>
        <p className="text-muted text-sm mt-0.5">Brand Hub</p>
      </div>
    </div>
  );
}

function EmptyBrandHub({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    const { createBrandHub } = await import("@/actions/brand-hub");
    const result = await createBrandHub(clientId);
    if (result.success) {
      window.location.reload();
    } else {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#141414] flex items-center justify-center text-2xl font-semibold text-muted mb-4">
        {clientName[0]}
      </div>
      <p className="text-sm font-medium text-muted-soft mb-1">Nenhum Brand Hub criado</p>
      <p className="text-xs text-muted-soft mb-6">Crie a identidade visual de {clientName} para centralizar todas as diretrizes da marca.</p>
      <button
        onClick={handleCreate}
        disabled={creating}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50"
      >
        {creating ? "Criando..." : "+ Criar Brand Hub"}
      </button>
    </div>
  );
}

/* ── Add Color Modal ── */
function AddColorModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [hex, setHex] = useState("#");
  const [rgb, setRgb] = useState("");
  const [cmyk, setCmyk] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addBrandColor } = await import("@/actions/brand-hub");
    await addBrandColor(clientId, nome, hex, rgb, cmyk);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Adicionar Cor</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da cor" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          <div className="flex gap-2 items-center">
            <input type="color" value={hex.length === 7 ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} className="w-10 h-10 rounded-lg border border-border bg-transparent cursor-pointer" />
            <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000" required className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          </div>
          <input value={rgb} onChange={(e) => setRgb(e.target.value)} placeholder="RGB (ex: 255, 255, 255)" className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          <input value={cmyk} onChange={(e) => setCmyk(e.target.value)} placeholder="CMYK (ex: 0, 0, 0, 0)" className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
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

/* ── Add Font Modal ── */
function AddFontModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Sans-serif");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addBrandFont } = await import("@/actions/brand-hub");
    await addBrandFont(clientId, nome, categoria, downloadUrl);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Adicionar Fonte</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da fonte" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
            <option>Sans-serif</option>
            <option>Serif</option>
            <option>Display</option>
            <option>Monospace</option>
            <option>Handwriting</option>
          </select>
          <input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="URL de download (opcional)" className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
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

/* ── Add Logo Modal ── */
function AddLogoModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [categoria, setCategoria] = useState("Principal");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addBrandLogo } = await import("@/actions/brand-hub");
    await addBrandLogo(clientId, categoria, url);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gradient">Adicionar Logo</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors">
            <option>Principal</option>
            <option>Monocromática</option>
            <option>Negativa</option>
            <option>Ícone</option>
            <option>Horizontal</option>
            <option>Vertical</option>
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL do logo" required className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-border text-sm text-foreground focus:outline-none focus:border-border-hover transition-colors" />
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

