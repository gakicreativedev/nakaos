"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextBold,
  TextItalic,
  TextUnderline,
  TextCross,
  ListCheck,
  List,
  AlignLeft,
  AlignHorizontalCenter,
  AlignRight,
  Eraser,
  Palette,
} from "@solar-icons/react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Comece a escrever..." }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[180px] max-h-[350px] overflow-y-auto px-4 py-3 text-sm text-on-surface focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-surface-container rounded-t-xl flex-wrap">
        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Título"
          >
            <span className="text-[11px] font-bold">H2</span>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Subtítulo"
          >
            <span className="text-[11px] font-bold">H3</span>
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Text formatting */}
        <ToolbarGroup>
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrito"
          >
            <TextBold size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Itálico"
          >
            <TextItalic size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Sublinhado"
          >
            <TextUnderline size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Tachado"
          >
            <TextCross size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Destaque"
          >
            <Palette size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Lista"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Lista numerada"
          >
            <ListCheck size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Alinhar à esquerda"
          >
            <AlignLeft size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Centralizar"
          >
            <AlignHorizontalCenter size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Alinhar à direita"
          >
            <AlignRight size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Clear */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Limpar formatação"
        >
          <Eraser size={14} />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <div className="bg-surface-container-low rounded-b-xl">
        <EditorContent editor={editor} />
      </div>

      {/* Styles for the editor */}
      <style jsx global>{`
        .prose-editor h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #e0e0e0;
          margin: 0.5rem 0;
        }
        .prose-editor h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #d0d0d0;
          margin: 0.4rem 0;
        }
        .prose-editor p {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        .prose-editor strong {
          font-weight: 600;
          color: #e0e0e0;
        }
        .prose-editor em {
          font-style: italic;
        }
        .prose-editor u {
          text-decoration: underline;
        }
        .prose-editor s {
          text-decoration: line-through;
        }
        .prose-editor mark {
          background-color: rgba(250, 204, 21, 0.3);
          color: inherit;
          border-radius: 2px;
          padding: 0 2px;
        }
        .prose-editor ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.25rem 0;
        }
        .prose-editor ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.25rem 0;
        }
        .prose-editor li {
          margin: 0.1rem 0;
        }
        .prose-editor blockquote {
          border-left: 3px solid #333;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #999;
        }
        .prose-editor .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #555;
          pointer-events: none;
          height: 0;
        }
        .prose-editor:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-surface-container-high text-on-surface"
          : "text-outline hover:text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <div className="w-px h-4 bg-outline-variant/15 mx-1" />;
}
