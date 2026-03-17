"use client";

import { useState } from "react";
import { CloseCircle } from "@solar-icons/react";
import RichTextEditor from "./rich-text-editor";

const TABS = [
  { id: "nicho", label: "Nicho" },
  { id: "publicoAlvo", label: "Público-alvo" },
  { id: "tomDeVoz", label: "Tom de Voz" },
  { id: "slogan", label: "Slogan" },
  { id: "concorrentes", label: "Concorrentes" },
  { id: "restricoesVisuais", label: "Restrições Visuais" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface IdentidadeFields {
  nicho: string;
  publicoAlvo: string;
  tomDeVoz: string;
  slogan: string;
  concorrentes: string;
  restricoesVisuais: string;
}

interface EditIdentidadeModalProps {
  title?: string;
  initialValues: IdentidadeFields;
  onSave: (fields: IdentidadeFields) => Promise<void>;
  onClose: () => void;
}

export default function EditIdentidadeModal({
  title = "Identidade da Marca",
  initialValues,
  onSave,
  onClose,
}: EditIdentidadeModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("nicho");
  const [fields, setFields] = useState<IdentidadeFields>({ ...initialValues });
  const [saving, setSaving] = useState(false);

  const updateField = (key: TabId, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(fields);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-border rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-gradient">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <CloseCircle size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-[#141414] px-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? "text-foreground" : "text-muted-soft hover:text-muted"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#ebebeb] to-[#a2a2a2] rounded-full" />
              )}
              {/* Indicator dot when field has content */}
              {fields[tab.id] && fields[tab.id] !== "<p></p>" && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-500/60" />
              )}
            </button>
          ))}
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-3">
            {TABS.find((t) => t.id === activeTab)?.label}
          </p>
          {TABS.map((tab) => (
            <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
              <RichTextEditor
                content={fields[tab.id]}
                onChange={(html) => updateField(tab.id, html)}
                placeholder={`Descreva ${tab.label.toLowerCase()}...`}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-soft hover:text-muted hover:border-border-hover transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] border border-border-hover text-sm font-medium text-foreground hover:border-[#3a3a3a] transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
