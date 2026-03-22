"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CsvImportModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const router = useRouter();
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
        const { importBrandColors } = await import("@/actions/brand-hub-import");
        const rows = parsed.rows.map((r) => ({
          nome: r.nome || r.Nome || "",
          hex: r.hex || r.HEX || r.Hex || "",
          rgb: r.rgb || r.RGB || r.Rgb || "",
          cmyk: r.cmyk || r.CMYK || r.Cmyk || "",
        }));
        const invalid = rows.filter((r) => !r.nome || !r.hex);
        if (invalid.length > 0) { setError(`${invalid.length} linha(s) sem nome ou hex.`); setSaving(false); return; }
        const result = await importBrandColors(clientId, rows);
        if (result.error) { setError(result.error); setSaving(false); return; }
        setSuccess(`${result.count} cor(es) importada(s)!`);
      } else if (importType === "fontes") {
        const { importBrandFonts } = await import("@/actions/brand-hub-import");
        const rows = parsed.rows.map((r) => ({
          nome: r.nome || r.Nome || "",
          categoria: r.categoria || r.Categoria || "",
          downloadUrl: r.downloadUrl || r.DownloadUrl || r.download_url || r.url || r.URL || "",
        }));
        const invalid = rows.filter((r) => !r.nome || !r.categoria);
        if (invalid.length > 0) { setError(`${invalid.length} linha(s) sem nome ou categoria.`); setSaving(false); return; }
        const result = await importBrandFonts(clientId, rows);
        if (result.error) { setError(result.error); setSaving(false); return; }
        setSuccess(`${result.count} fonte(s) importada(s)!`);
      } else {
        const { importBrandIdentity } = await import("@/actions/brand-hub-import");
        const fields: Record<string, string> = {};
        for (const row of parsed.rows) {
          const campo = (row.campo || row.Campo || "").toLowerCase();
          const valor = row.valor || row.Valor || "";
          const mapped = FIELD_MAP[campo];
          if (mapped) fields[mapped] = valor;
        }
        if (!Object.keys(fields).length) { setError("Nenhum campo reconhecido. Use: nicho, publicoAlvo, tomDeVoz, slogan, concorrentes, restricoesVisuais"); setSaving(false); return; }
        const result = await importBrandIdentity(clientId, fields);
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
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/15 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Importar CSV</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        {/* Type selector */}
        <div className="flex bg-surface-container-lowest rounded-xl p-1 mb-5 border border-outline-variant/10">
          {([
            { id: "cores" as const, label: "Cores" },
            { id: "fontes" as const, label: "Fontes" },
            { id: "identidade" as const, label: "Identidade" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setImportType(t.id); setParsed(null); setError(""); setSuccess(""); }}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${importType === t.id ? "bg-surface-container-low text-on-surface shadow-sm" : "text-outline hover:text-on-surface-variant"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Format hint */}
        <div className="bg-surface-container-lowest rounded-xl p-3 mb-4">
          <p className="text-[10px] text-outline font-medium uppercase tracking-wider mb-1">Formato esperado</p>
          <code className="text-[11px] text-outline block whitespace-pre">
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
            className="w-full text-sm text-outline file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-outline-variant/15 file:bg-surface-container-lowest file:text-sm file:text-outline file:cursor-pointer hover:file:bg-surface-container file:transition-colors"
          />
        </div>

        {/* Preview */}
        {parsed && parsed.rows.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-outline mb-2">{parsed.rows.length} linha(s) encontrada(s)</p>
            <div className="bg-surface-container-lowest rounded-xl overflow-x-auto max-h-[200px] overflow-y-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr>
                    {parsed.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-outline font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container">
                      {parsed.headers.map((h) => (
                        <td key={h} className="px-3 py-1.5 text-on-surface max-w-[150px] truncate">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                  {parsed.rows.length > 10 && (
                    <tr><td colSpan={parsed.headers.length} className="px-3 py-1.5 text-outline text-center">... e mais {parsed.rows.length - 10} linha(s)</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && <p className="text-error text-sm text-center mb-3">{error}</p>}
        {success && <p className="text-success text-sm text-center mb-3">{success}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">
            {success ? "Fechar" : "Cancelar"}
          </button>
          {!success && (
            <button
              onClick={handleImport}
              disabled={saving || !parsed || parsed.rows.length === 0}
              className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Importando..." : "Importar"}
            </button>
          )}
          {success && (
            <button onClick={() => router.refresh()} className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity">
              Recarregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
