import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/* ── Clientes ── */
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  logo: text("logo"),
  cnpj: text("cnpj").notNull(),
  responsavel: text("responsavel").notNull(),
  telefone: text("telefone").notNull(),
  email: text("email").notNull(),
  endereco: text("endereco").notNull(),
  redesSociais: text("redes_sociais", { mode: "json" }).$type<{
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
  }>(),
  status: text("status", { enum: ["Ativo", "Pausado", "Encerrado", "Onboarding"] }).notNull(),
  servicosContratados: text("servicos_contratados", { mode: "json" }).$type<string[]>().notNull(),
  valorMensal: real("valor_mensal").notNull(),
  dataInicio: text("data_inicio").notNull(),
  dataRenovacao: text("data_renovacao").notNull(),
  observacoes: text("observacoes").notNull().default(""),
  criadoEm: text("criado_em").notNull(),
});

/* ── Brand Hub ── */
export const brandLogos = sqliteTable("brand_logos", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  categoria: text("categoria", {
    enum: ["Principal", "Monocromática", "Negativa", "Ícone", "Horizontal", "Vertical"],
  }).notNull(),
  url: text("url").notNull().default(""),
  linkExterno: text("link_externo"),
});

export const brandColors = sqliteTable("brand_colors", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  hex: text("hex").notNull(),
  rgb: text("rgb").notNull(),
  cmyk: text("cmyk").notNull(),
});

export const brandFonts = sqliteTable("brand_fonts", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  downloadUrl: text("download_url").notNull(),
});

export const brandHubs = sqliteTable("brand_hubs", {
  clientId: text("client_id").primaryKey().references(() => clients.id, { onDelete: "cascade" }),
  nicho: text("nicho").notNull().default(""),
  publicoAlvo: text("publico_alvo").notNull().default(""),
  tomDeVoz: text("tom_de_voz").notNull().default(""),
  slogan: text("slogan").notNull().default(""),
  concorrentes: text("concorrentes").notNull().default(""),
  restricoesVisuais: text("restricoes_visuais").notNull().default(""),
  ultimaAtualizacao: text("ultima_atualizacao").notNull(),
});

export const brandHistorico = sqliteTable("brand_historico", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  usuario: text("usuario").notNull(),
  descricao: text("descricao").notNull(),
});

/* ── Kanban Columns ── */
export const kanbanColumns = sqliteTable("kanban_columns", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  ordem: integer("ordem").notNull(),
});

/* ── Tasks ── */
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull().default(""),
  responsavel: text("responsavel").notNull(),
  prazo: text("prazo").notNull(),
  prioridade: text("prioridade", { enum: ["Urgente", "Alta", "Média", "Baixa"] }).notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  colunaId: text("coluna_id").notNull().references(() => kanbanColumns.id, { onDelete: "cascade" }),
  recorrente: integer("recorrente", { mode: "boolean" }).notNull().default(false),
  frequencia: text("frequencia"),
  criadoEm: text("criado_em").notNull(),
});

export const taskEtapas = sqliteTable("task_etapas", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  responsavel: text("responsavel").notNull(),
  prazo: text("prazo").notNull(),
  concluida: integer("concluida", { mode: "boolean" }).notNull().default(false),
});

export const taskComments = sqliteTable("task_comments", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  usuario: text("usuario").notNull(),
  texto: text("texto").notNull(),
  data: text("data").notNull(),
});

export const taskAnexos = sqliteTable("task_anexos", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
});

/* ── Finanças (Movimentações) ── */
export const movimentacoes = sqliteTable("movimentacoes", {
  id: text("id").primaryKey(),
  valor: real("valor").notNull(),
  categoria: text("categoria", {
    enum: ["Receita", "Despesa Operacional", "Fornecedor", "Pró-labore", "Investimento"],
  }).notNull(),
  data: text("data").notNull(),
  descricao: text("descricao").notNull(),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  status: text("status", {
    enum: ["Agendado", "Pago", "Pendente", "Atrasado", "Cancelado"],
  }).notNull(),
  criadoEm: text("criado_em").notNull(),
});

/* ── Configurações (Usuários) ── */
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  cargo: text("cargo").notNull(),
  role: text("role", { enum: ["Admin", "Editor", "Visualizador"] }).notNull(),
  avatar: text("avatar"),
  ativo: integer("ativo", { mode: "boolean" }).notNull().default(true),
  criadoEm: text("criado_em").notNull(),
  ultimoAcesso: text("ultimo_acesso").notNull(),
  alertas: text("alertas", { mode: "json" }).$type<{
    tarefasAtrasadas: boolean;
    renovacaoContratos: boolean;
    pagamentosPendentes: boolean;
    novosComentarios: boolean;
  }>().notNull(),
});
