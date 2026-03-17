"use client";

import { useState } from "react";
import { CloseCircle } from "@solar-icons/react";

type ImportType = "cores" | "fontes" | "identidade";

interface ParsedRow {
  [key: string]: string;
}

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line);
    const row: ParsedRow = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] || "").trim();
    });
    return row;
  }).filter((r) => Object.values(r).some((v) => v));

  return { headers: headers.map((h) => h.trim()), rows };
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { result.push(current); current = ""; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

const FIELD_MAP: Record<string, string> = {
  nicho: "nicho",
  publicoalvo: "publicoAlvo",
  "publico-alvo": "publicoAlvo",
  "público-alvo": "publicoAlvo",
  "publicoAlvo": "publicoAlvo",
  tomdevoz: "tomDeVoz",
  "tom de voz": "tomDeVoz",
  "tomDeVoz": "tomDeVoz",
  slogan: "slogan",
  concorrentes: "concorrentes",
  restricoesvisuais: "restricoesVisuais",
  "restrições visuais": "restricoesVisuais",
  "restricoes visuais": "restricoesVisuais",
  "restricoesVisuais": "restricoesVisuais",
};

export default function ProjetoCsvImportModal({ projetoId, onClose }: { projetoId: string; onClose: () => void }) {
  const [importType, setImportType] = useState<ImportType>("cores");
  const [parsed, setParsed] = useState<{ headers: string[]; rows: ParsedRow[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseCSV(text);
      if (result.rows.length === 0) {
        setError("Arquivo vazio ou formato inválido.");
        return;
      }
      setParsed(result);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsed || parsed.rows.length === 0) return;
    setSaving(true);
    setError("");

    try {
      if (importType === "cores") {
        const { importProjetoColors } = await import("@/actions/projeto-brand-import");
        const rows = parsed.rows.map((r) => ({
          nome: r.nome || r.Nome || "",
          hex: r.hex || r.HEX || r.Hex || "",
          rgb: r.rgb || r.RGB || r.Rgb || "",
          cmyk: r.cmyk || r.CMYK || r.Cmyk || "",
        }));
        const invalid = rows.filter((r) => !r.nome || !r.hex);
        if (invalid.length > 0) { setError(`${invalid.length} linha(s) sem nome ou hex.`); setSaving(false); return; }
        const result = await importProjetoColors(projetoId, rows);
        if (result.error) { setError(result.error); setSaving(false); return; }
        setSuccess(`${result.count} cor(es) importada(s)!`);
      } else if (importType === "fontes") {
        const { importProjetoFonts } = await import("@/actions/projeto-brand-import");
        const rows = parsed.rows.map((r) => ({
          nome: r.nome || r.Nome || "",
          categoria: r.categoria || r.Categoria || "",
          downloadUrl: r.downloadUrl || r.DownloadUrl || r.download_url || r.url || r.URL || "",
        }));
        const invalid = rows.filter((r) => !r.nome || !r.categoria);
        if (invalid.length > 0) { setError(`${invalid.length} linha(s) sem nome ou categoria.`); setSaving(false); return; }
        const result = await importProjetoFonts(projetoId, rows);
        if (result.error) { setError(result.error); setSaving(false); return; }
        setSuccess(`${result.count} fonte(s) importada(s)!`);
      } else {
        const { importProjetoIdentidade } = await import("@/actions/projeto-brand-import");
        const fields: Record<string, string> = {};
        for (const row of parsed.rows) {
          const campo = (row.campo || row.Campo || "").toLowerCase();
          const valor = row.valor || row.Valor || "";
          const mapped = FIELD_MAP[campo];
          if (mapped) fields[mapped] = valor;
        }
        if (!Object.keys(fields).length) { setError("Nenhum campo reconhecido. Use: nicho, publicoAlvo, tomDeVoz, slogan, concorrentes, restricoesVisuais"); setSaving(false); return; }
        const result = await importProjetoIdentidade(projetoId, fields);
        if (result.error) { setError(result.error); setSaving(false); return; }
        setSuccess("Identidade da marca atualizada!");
      }
    } catch {
      setError("Erro inesperado na importação.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gradient">Importar CSV</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        {/* Type selector */}
        <div className="flex bg-[#0a0a0a] rounded-xl p-1 mb-5 border border-white/5">
          {([
            { id: "cores" as const, label: "Cores" },
            { id: "fontes" as const, label: "Fontes" },
            { id: "identidade" as const, label: "Identidade" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setImportType(t.id); setParsed(null); setError(""); setSuccess(""); }}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${importType === t.id ? "bg-[#1a1a1a] text-foreground shadow-sm" : "text-muted-soft hover:text-muted"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Format hint */}
        <div className="bg-[#141414] rounded-xl border border-border p-3 mb-4">
          <p className="text-[10px] text-muted-soft font-medium uppercase tracking-wider mb-1">Formato esperado</p>
          <code className="text-[11px] text-muted-soft block whitespace-pre">
            {importType === "cores" && "nome,hex,rgb,cmyk\nAzul,#1E40AF,\"30,64,175\",\"89,64,0,31\""}
            {importType === "fontes" && "nome,categoria,downloadUrl\nMontserrat,Display,https://..."}
            {importType === "identidade" && "campo,valor\nnicho,Marketing Digital\npublicoAlvo,PMEs"}
          </code>
        </div>

        {/* File input */}
        <div className="mb-4">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFile}
            className="w-full text-sm text-muted-soft file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-border file:bg-[#141414] file:text-sm file:text-muted-soft file:cursor-pointer hover:file:bg-white/[0.05] file:transition-colors"
          />
        </div>

        {/* Preview */}
        {parsed && parsed.rows.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-soft mb-2">{parsed.rows.length} linha(s) encontrada(s)</p>
            <div className="bg-[#141414] rounded-xl border border-border overflow-x-auto max-h-[200px] overflow-y-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    {parsed.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-muted-soft font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-[#1a1a1a] last:border-b-0">
                      {parsed.headers.map((h) => (
                        <td key={h} className="px-3 py-1.5 text-[#c8c8c8] max-w-[150px] truncate">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                  {parsed.rows.length > 10 && (
                    <tr><td colSpan={parsed.headers.length} className="px-3 py-1.5 text-muted-soft text-center">... e mais {parsed.rows.length - 10} linha(s)</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mb-3">{success}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all">
            {success ? "Fechar" : "Cancelar"}
          </button>
          {!success && (
            <button
              onClick={handleImport}
              disabled={saving || !parsed || parsed.rows.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50"
            >
              {saving ? "Importando..." : "Importar"}
            </button>
          )}
          {success && (
            <button onClick={() => window.location.reload()} className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors">
              Recarregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
