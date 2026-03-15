"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CLIENTS, MOCK_BRAND_HUBS, type BrandHubData, type BrandColor } from "@/lib/mock-data";

/* ── Color Card with copy-on-click ── */
function ColorCard({ cor }: { cor: BrandColor }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden group">
      <div
        className="h-20 w-full"
        style={{ background: cor.hex }}
      />
      <div className="p-4">
        <p className="text-sm font-medium text-[#c8c8c8] mb-3">{cor.nome}</p>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "HEX", value: cor.hex },
            { label: "RGB", value: cor.rgb },
            { label: "CMYK", value: cor.cmyk },
          ].map((item) => (
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
    </div>
  );
}

/* ── Logo Card ── */
function LogoCard({ logo }: { logo: { id: string; categoria: string; url: string } }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden">
      <div className="h-32 w-full bg-[#1a1a1a] flex items-center justify-center">
        {logo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.url} alt={logo.categoria} className="max-h-full max-w-full object-contain p-4" />
        ) : (
          <div className="text-muted-soft text-xs flex flex-col items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#c8c8c8]">{logo.categoria}</span>
        <button className="text-[10px] text-muted-soft hover:text-muted transition-colors">
          Upload
        </button>
      </div>
    </div>
  );
}

/* ── Font Card ── */
function FontCard({ font }: { font: { nome: string; categoria: string; downloadUrl: string } }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-[#c8c8c8]">{font.nome}</p>
          <p className="text-[11px] text-muted-soft">{font.categoria}</p>
        </div>
        <a
          href={font.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] px-3 py-1.5 rounded-lg border border-border text-muted-soft hover:text-muted hover:border-border-hover transition-all"
        >
          Download
        </a>
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
    </div>
  );
}

/* ── Text Section Block ── */
function TextSection({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-border p-5">
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-[#c8c8c8] leading-relaxed">{value || "—"}</p>
    </div>
  );
}

/* ── Main Component ── */
export default function BrandDetail({ clientId }: { clientId: string }) {
  const client = MOCK_CLIENTS.find((c) => c.id === clientId);
  const brandHub = MOCK_BRAND_HUBS.find((bh) => bh.clientId === clientId);

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
        <EmptyBrandHub clientName={client.nome} />
      </>
    );
  }

  return (
    <>
      <BackHeader clientName={client.nome} />

      {/* Logos */}
      <Section title="Logos" count={brandHub.logos.length}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brandHub.logos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} />
          ))}
          <button className="h-32 rounded-2xl border border-dashed border-border hover:border-border-hover text-muted-soft text-xs flex flex-col items-center justify-center gap-2 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Nova variação
          </button>
        </div>
      </Section>

      {/* Cores */}
      <Section title="Paleta de Cores" count={brandHub.cores.length}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brandHub.cores.map((cor) => (
            <ColorCard key={cor.hex} cor={cor} />
          ))}
        </div>
      </Section>

      {/* Fontes */}
      <Section title="Tipografia" count={brandHub.fontes.length}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {brandHub.fontes.map((font) => (
            <FontCard key={font.nome} font={font} />
          ))}
        </div>
      </Section>

      {/* Text Sections */}
      <Section title="Identidade da Marca">
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
      <Section title="Histórico de Alterações">
        <div className="bg-[#141414] rounded-2xl border border-border overflow-hidden">
          {brandHub.historico.map((entry, i) => (
            <div
              key={i}
              className="flex items-center px-5 py-3 border-b border-[#1a1a1a] last:border-b-0 gap-3"
            >
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
    </>
  );
}

/* ── Shared Components ── */
function BackHeader({ clientName }: { clientName: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link href="/brand-hub" className="p-2 rounded-xl hover:bg-surface transition-colors text-muted">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M13 15L8 10L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gradient tracking-tight">{clientName}</h1>
        <p className="text-muted text-sm mt-0.5">Brand Hub</p>
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium text-gradient">{title}</h2>
        {count !== undefined && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface text-muted-soft">{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyBrandHub({ clientName }: { clientName: string }) {
  return (
    <div className="bg-gradient-to-b from-surface to-[#141414] rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#141414] flex items-center justify-center text-2xl font-semibold text-muted mb-4">
        {clientName[0]}
      </div>
      <p className="text-sm font-medium text-muted-soft mb-1">Nenhum Brand Hub criado</p>
      <p className="text-xs text-muted-soft mb-6">Crie a identidade visual de {clientName} para centralizar todas as diretrizes da marca.</p>
      <button className="px-5 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
        + Criar Brand Hub
      </button>
    </div>
  );
}
