"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AltArrowLeft, AddCircle, Gallery, Import, CloseCircle, TrashBinMinimalistic, Pen, Figma } from "@solar-icons/react";
import type { Client, BrandHubData, BrandColor } from "@/lib/types";
import CsvImportModal from "./csv-import-modal";
import EditIdentidadeModal from "../shared/edit-identidade-modal";

/* ── Section ── */
function Section({ title, count, action, children }: { title: string; count?: number; action?: { label: string; onClick: () => void; icon?: boolean }; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-on-surface">{title}</h2>
          {count !== undefined && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-outline">{count}</span>
          )}
        </div>
        {action && (
          <button onClick={action.onClick} className="text-outline hover:text-on-surface-variant transition-colors flex items-center gap-1 text-xs">
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

  const router = useRouter();

  const handleDelete = async () => {
    const { deleteBrandColor } = await import("@/actions/brand-hub");
    await deleteBrandColor(cor.id, clientId);
    router.refresh();
  };

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden group relative">
      <div className="h-20 w-full" style={{ background: cor.hex }} />
      <div className="p-4">
        <p className="text-sm font-medium text-on-surface mb-3">{cor.nome}</p>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "HEX", value: cor.hex },
            { label: "RGB", value: cor.rgb },
            { label: "CMYK", value: cor.cmyk },
          ].filter((item) => item.value).map((item) => (
            <button
              key={item.label}
              onClick={() => copyValue(item.label, item.value)}
              className="flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">{item.label}</span>
              <span className="text-xs text-outline font-mono">
                {copied === item.label ? "Copiado!" : item.value}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-outline hover:text-error transition-all"
      >
        <TrashBinMinimalistic size={12} />
      </button>
    </div>
  );
}

/* ── Logo Card ── */
function LogoCard({ logo, clientId }: { logo: { id: string; categoria: string; url: string }; clientId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const { deleteBrandLogo } = await import("@/actions/brand-hub");
    await deleteBrandLogo(logo.id, clientId);
    router.refresh();
  };

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden group relative">
      <div className="h-32 w-full bg-surface-container flex items-center justify-center">
        {logo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.url} alt={logo.categoria} className="max-h-full max-w-full object-contain p-4" />
        ) : (
          <div className="text-outline text-xs flex flex-col items-center gap-2">
            <Gallery size={24} />
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface">{logo.categoria}</span>
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-black/60 text-outline hover:text-error transition-all"
      >
        <TrashBinMinimalistic size={12} />
      </button>
    </div>
  );
}

/* ── Font Card ── */
function FontCard({ font, clientId }: { font: { id: string; nome: string; categoria: string; downloadUrl: string }; clientId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const { deleteBrandFont } = await import("@/actions/brand-hub");
    await deleteBrandFont(font.id, clientId);
    router.refresh();
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-5 group relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-on-surface">{font.nome}</p>
          <p className="text-[11px] text-outline">{font.categoria}</p>
        </div>
        {font.downloadUrl && (
          <a
            href={font.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-3 py-1.5 rounded-lg border border-outline-variant/15 text-outline hover:text-on-surface-variant hover:border-outline/30 transition-all"
          >
            Download
          </a>
        )}
      </div>
      <div className="text-2xl text-on-surface mt-2 leading-relaxed" style={{ fontFamily: `'${font.nome}', sans-serif` }}>
        Aa Bb Cc 123
      </div>
      <p className="text-xs text-outline mt-1" style={{ fontFamily: `'${font.nome}', sans-serif` }}>
        The quick brown fox jumps over the lazy dog.
      </p>
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all p-1"
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
    <div className="bg-surface-container-low rounded-xl p-5">
      <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-2">{label}</p>
      {isEmpty ? (
        <p className="text-sm text-on-surface leading-relaxed">—</p>
      ) : (
        <div
          className="text-sm text-on-surface leading-relaxed prose-display"
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
  const router = useRouter();
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [showAddColor, setShowAddColor] = useState(false);
  const [showAddFont, setShowAddFont] = useState(false);
  const [showAddLogo, setShowAddLogo] = useState(false);
  const [showEditIdentidade, setShowEditIdentidade] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-outline">
        <p className="text-lg">Cliente não encontrado</p>
        <Link href="/brand-hub" className="text-sm mt-2 text-secondary hover:underline">Voltar</Link>
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
          className="px-4 py-2 rounded-xl bg-surface-container border border-outline/30 text-xs font-medium text-on-surface hover:border-[#3a3a3a] transition-colors flex items-center gap-2"
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
            className="h-32 rounded-xl border border-dashed border-outline-variant/20 hover:border-outline/30 text-outline text-xs flex flex-col items-center justify-center gap-2 transition-colors"
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

      {/* Figma */}
      <FigmaSection
        figmaUrl={brandHub.figmaUrl}
        onEdit={() => setShowFigmaModal(true)}
      />

      {/* Histórico */}
      {brandHub.historico.length > 0 && (
        <Section title="Histórico de Alterações">
          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            {brandHub.historico.map((entry, i) => (
              <div key={i} className="flex items-center px-5 py-3 gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface">{entry.descricao}</p>
                  <p className="text-[10px] text-outline mt-0.5">
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
      {showFigmaModal && (
        <FigmaLinkModal
          clientId={client.id}
          currentUrl={brandHub.figmaUrl || ""}
          onClose={() => setShowFigmaModal(false)}
        />
      )}
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
            router.refresh();
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
      <Link href="/brand-hub" className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
        <AltArrowLeft size={18} />
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">{clientName}</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Brand Hub</p>
      </div>
    </div>
  );
}

function EmptyBrandHub({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setCreating(true);
    const { createBrandHub } = await import("@/actions/brand-hub");
    const result = await createBrandHub(clientId);
    if (result.success) {
      router.refresh();
      setTimeout(() => router.refresh(), 100);
    } else {
      setCreating(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20 p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center text-2xl font-semibold text-on-surface-variant mb-4">
        {clientName[0]}
      </div>
      <p className="text-sm font-medium text-outline mb-1">Nenhuma Marca criada</p>
      <p className="text-xs text-outline mb-6">Crie a identidade visual de {clientName} para centralizar todas as diretrizes da marca.</p>
      <button
        onClick={handleCreate}
        disabled={creating}
        className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {creating ? "Criando..." : "+ Criar Brand"}
      </button>
    </div>
  );
}

/* ── Add Color Modal ── */
function AddColorModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Adicionar Cor</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da cor" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          <div className="flex gap-2 items-center">
            <input type="color" value={hex.length === 7 ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} className="w-10 h-10 rounded-lg border border-outline-variant/15 bg-transparent cursor-pointer" />
            <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000" required className="flex-1 px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <input value={rgb} onChange={(e) => setRgb(e.target.value)} placeholder="RGB (ex: 255, 255, 255)" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          <input value={cmyk} onChange={(e) => setCmyk(e.target.value)} placeholder="CMYK (ex: 0, 0, 0, 0)" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
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

/* ── Add Font Modal ── */
function AddFontModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const router = useRouter();
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
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Adicionar Fonte</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da fonte" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
            <option>Sans-serif</option>
            <option>Serif</option>
            <option>Display</option>
            <option>Monospace</option>
            <option>Handwriting</option>
          </select>
          <input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="URL de download (opcional)" className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
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

/* ── Add Logo Modal ── */
function AddLogoModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const router = useRouter();
  const [categoria, setCategoria] = useState("Principal");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { addBrandLogo } = await import("@/actions/brand-hub");
    await addBrandLogo(clientId, categoria, url);
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Adicionar Logo</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
            <option>Principal</option>
            <option>Monocromática</option>
            <option>Negativa</option>
            <option>Ícone</option>
            <option>Horizontal</option>
            <option>Vertical</option>
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL do logo" required className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
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

/* ── Figma Section ── */
function FigmaSection({ figmaUrl, onEdit }: { figmaUrl: string | null; onEdit: () => void }) {
  const embedUrl = figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`
    : null;

  return (
    <div className="bg-surface-container-low rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Figma size={16} className="text-on-surface-variant" />
          <h3 className="text-sm font-medium text-on-surface">Figma</h3>
        </div>
        <button
          onClick={onEdit}
          className="text-outline hover:text-on-surface-variant transition-colors flex items-center gap-1 text-xs"
        >
          <Pen size={12} /> {figmaUrl ? "Editar" : "Adicionar link"}
        </button>
      </div>

      {embedUrl ? (
        <div className="rounded-xl overflow-hidden border border-outline-variant/15 bg-surface-container-lowest">
          <iframe
            src={embedUrl}
            className="w-full border-0"
            style={{ height: "480px" }}
            allowFullScreen
          />
          <div className="px-4 py-2.5 flex items-center justify-between">
            <p className="text-[11px] text-outline truncate max-w-[70%]">{figmaUrl}</p>
            <a
              href={figmaUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-outline hover:text-on-surface-variant transition-colors px-2.5 py-1 rounded-lg border border-outline-variant/15 hover:border-outline/30"
            >
              Abrir no Figma
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest flex flex-col items-center justify-center py-12 gap-3">
          <Figma size={32} className="text-outline" />
          <p className="text-xs text-outline">Nenhum link do Figma adicionado.</p>
          <button
            onClick={onEdit}
            className="text-xs text-outline hover:text-on-surface-variant transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/15 hover:border-outline/30"
          >
            Adicionar link
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Figma Link Modal ── */
function FigmaLinkModal({ clientId, currentUrl, onClose }: { clientId: string; currentUrl: string; onClose: () => void }) {
  const router = useRouter();
  const [url, setUrl] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !url.includes("figma.com")) {
      setError("O link deve ser do Figma (figma.com).");
      return;
    }
    setSaving(true);
    const { updateBrandFigmaUrl } = await import("@/actions/brand-hub");
    const result = await updateBrandFigmaUrl(clientId, url);
    if (result.error) { setError(result.error); setSaving(false); return; }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant/15 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Link do Figma</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1"><CloseCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1.5">URL do arquivo no Figma</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.figma.com/design/..."
              className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <p className="text-[10px] text-outline">Cole o link do arquivo, frame ou protótipo do Figma. A pré-visualização será carregada automaticamente.</p>
          {error && <p className="text-error text-xs">{error}</p>}
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
