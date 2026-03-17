"use client";

import { useState } from "react";
import { AddCircle, CloseCircle, TrashBinMinimalistic, Gallery, Pen, Import } from "@solar-icons/react";
import type { ProjetoColor, ProjetoFont, ProjetoLogo, ProjetoIdentidade, ProjetoHistorico } from "@/lib/types";
import ProjetoCsvImportModal from "./projeto-csv-import-modal";
import EditIdentidadeModal from "../shared/edit-identidade-modal";

interface ProjetoBrandProps {
  projetoId: string;
  colors: ProjetoColor[];
  fonts: ProjetoFont[];
  logos: ProjetoLogo[];
  identidade: ProjetoIdentidade | null;
  historico: ProjetoHistorico[];
  canEdit: boolean;
}

export default function ProjetoBrand({ projetoId, colors, fonts, logos, identidade, historico, canEdit }: ProjetoBrandProps) {
  const [showAddColor, setShowAddColor] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [showAddLogo, setShowAddLogo] = useState(false);
  const [showEditIdentidade, setShowEditIdentidade] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* CSV Import button */}
      {canEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCsvImport(true)}
            className="flex items-center gap-1.5 text-xs text-muted-soft hover:text-muted transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-border-hover"
          >
            <Import size={14} />
            Importar CSV
          </button>
        </div>
      )}
      {/* Logos */}
      <Section title="Logos" count={logos.length}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {logos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} projetoId={projetoId} canEdit={canEdit} />
          ))}
          {canEdit && (
            <button
              onClick={() => setShowAddLogo(true)}
              className="h-32 rounded-2xl border border-dashed border-border hover:border-border-hover text-muted-soft text-xs flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <AddCircle size={20} />
              Nova variação
            </button>
          )}
        </div>
        {logos.length === 0 && !canEdit && <p className="text-xs text-muted-soft">Nenhum logo adicionado.</p>}
      </Section>

      {/* Cores */}
      <Section title="Paleta de Cores" count={colors.length} action={canEdit ? { label: "Adicionar", onClick: () => setShowAddColor(true) } : undefined}>
        {colors.length === 0 ? (
          <p className="text-xs text-muted-soft">Nenhuma cor adicionada.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colors.map((cor) => (
              <ColorCard key={cor.id} cor={cor} projetoId={projetoId} canEdit={canEdit} />
            ))}
          </div>
        )}
      </Section>

      {/* Fontes */}
      <Section title="Tipografia" count={fonts.length} action={canEdit ? { label: "Adicionar", onClick: () => setShowAddFont(true) } : undefined}>
        {fonts.length === 0 ? (
          <p className="text-xs text-muted-soft">Nenhuma fonte adicionada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fonts.map((font) => (
              <FontCard key={font.id} font={font} projetoId={projetoId} canEdit={canEdit} />
            ))}
          </div>
        )}
      </Section>

      {/* Identidade da Marca */}
      <Section title="Identidade da Marca" action={canEdit ? { label: "Editar", onClick: () => setShowEditIdentidade(true), icon: true } : undefined}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextSection label="Nicho" value={identidade?.nicho || ""} />
          <TextSection label="Público-alvo" value={identidade?.publicoAlvo || ""} />
          <TextSection label="Tom de Voz" value={identidade?.tomDeVoz || ""} />
          <TextSection label="Slogan" value={identidade?.slogan || ""} />
          <TextSection label="Concorrentes" value={identidade?.concorrentes || ""} />
          <TextSection label="Restrições Visuais" value={identidade?.restricoesVisuais || ""} />
        </div>
      </Section>

      {/* Histórico */}
      {historico.length > 0 && (
        <Section title="Histórico de Alterações">
          <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden">
            {historico.map((entry) => (
              <div key={entry.id} className="flex items-center px-5 py-3 border-b border-[#1a1a1a] last:border-b-0 gap-3">
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
      {showAddColor && <AddColorModal projetoId={projetoId} onClose={() => setShowAddColor(false)} />}
      {showAddFont && <AddFontModal projetoId={projetoId} onClose={() => setShowAddFont(false)} />}
      {showAddLogo && <AddLogoModal projetoId={projetoId} onClose={() => setShowAddLogo(false)} />}
      {showEditIdentidade && (
        <EditIdentidadeModal
          initialValues={{
            nicho: identidade?.nicho || "",
            publicoAlvo: identidade?.publicoAlvo || "",
            tomDeVoz: identidade?.tomDeVoz || "",
            slogan: identidade?.slogan || "",
            concorrentes: identidade?.concorrentes || "",
            restricoesVisuais: identidade?.restricoesVisuais || "",
          }}
          onSave={async (fields) => {
            const { upsertProjetoIdentidade } = await import("@/actions/projetos");
            await upsertProjetoIdentidade(projetoId, fields);
            setShowEditIdentidade(false);
            window.location.reload();
          }}
          onClose={() => setShowEditIdentidade(false)}
        />
      )}
      {showCsvImport && <ProjetoCsvImportModal projetoId={projetoId} onClose={() => setShowCsvImport(false)} />}
    </div>
  );
}

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

/* ── Logo Card ── */
function LogoCard({ logo, projetoId, canEdit }: { logo: ProjetoLogo; projetoId: string; canEdit: boolean }) {
  const handleDelete = async () => {
    const { deleteProjetoLogo } = await import("@/actions/projetos");
    await deleteProjetoLogo(logo.id, projetoId);
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
            Upload
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#c8c8c8]">{logo.categoria}</span>
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

/* ── Color Card with copy-on-click ── */
function ColorCard({ cor, projetoId, canEdit }: { cor: ProjetoColor; projetoId: string; canEdit: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = async () => {
    const { deleteProjetoColor } = await import("@/actions/projetos");
    await deleteProjetoColor(cor.id, projetoId);
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

/* ── Font Card with preview ── */
function FontCard({ font, projetoId, canEdit }: { font: ProjetoFont; projetoId: string; canEdit: boolean }) {
  const handleDelete = async () => {
    const { deleteProjetoFont } = await import("@/actions/projetos");
    await deleteProjetoFont(font.id, projetoId);
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
      {/* Font preview */}
      <div
        className="text-2xl text-[#c8c8c8] mt-2 leading-relaxed"
        style={{ fontFamily: `'${font.nome}', sans-serif` }}
      >
        Aa Bb Cc 123
      </div>
      <p
        className="text-xs text-muted-soft mt-1"
        style={{ fontFamily: `'${font.nome}', sans-serif` }}
      >
        The quick brown fox jumps over the lazy dog.
      </p>
      {canEdit && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-soft hover:text-urgent transition-all p-1"
        >
          <TrashBinMinimalistic size={14} />
        </button>
      )}
    </div>
  );
}

/* ── Add Logo Modal ── */
function AddLogoModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const [categoria, setCategoria] = useState("Principal");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addProjetoLogo } = await import("@/actions/projetos");
    await addProjetoLogo(projetoId, categoria, url);
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

/* ── Add Color Modal ── */
function AddColorModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [hex, setHex] = useState("#");
  const [rgb, setRgb] = useState("");
  const [cmyk, setCmyk] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addProjetoColor } = await import("@/actions/projetos");
    await addProjetoColor(projetoId, nome, hex, rgb, cmyk);
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
function AddFontModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Sans-serif");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addProjetoFont } = await import("@/actions/projetos");
    await addProjetoFont(projetoId, nome, categoria, downloadUrl);
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

