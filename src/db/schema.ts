import { pgTable, text, integer, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";

/* ── Clientes ── */
export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  logo: text("logo"),
  cnpj: text("cnpj").notNull(),
  responsavel: text("responsavel").notNull(),
  telefone: text("telefone").notNull(),
  email: text("email").notNull(),
  endereco: text("endereco").notNull(),
  redesSociais: jsonb("redes_sociais").$type<{
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
  }>(),
  status: text("status").notNull(), // Ativo | Pausado | Encerrado | Onboarding
  servicosContratados: jsonb("servicos_contratados").$type<string[]>().notNull(),
  valorMensal: doublePrecision("valor_mensal").notNull(),
  dataInicio: text("data_inicio").notNull(),
  dataRenovacao: text("data_renovacao").notNull(),
  observacoes: text("observacoes").notNull().default(""),
  criadoEm: text("criado_em").notNull(),
});

/* ── Brand Hub ── */
export const brandLogos = pgTable("brand_logos", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  categoria: text("categoria").notNull(), // Principal | Monocromática | Negativa | Ícone | Horizontal | Vertical
  url: text("url").notNull().default(""),
  linkExterno: text("link_externo"),
});

export const brandColors = pgTable("brand_colors", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  hex: text("hex").notNull(),
  rgb: text("rgb").notNull(),
  cmyk: text("cmyk").notNull(),
});

export const brandFonts = pgTable("brand_fonts", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  downloadUrl: text("download_url").notNull(),
});

export const brandHubs = pgTable("brand_hubs", {
  clientId: text("client_id").primaryKey().references(() => clients.id, { onDelete: "cascade" }),
  nicho: text("nicho").notNull().default(""),
  publicoAlvo: text("publico_alvo").notNull().default(""),
  tomDeVoz: text("tom_de_voz").notNull().default(""),
  slogan: text("slogan").notNull().default(""),
  concorrentes: text("concorrentes").notNull().default(""),
  restricoesVisuais: text("restricoes_visuais").notNull().default(""),
  ultimaAtualizacao: text("ultima_atualizacao").notNull(),
});

export const brandHistorico = pgTable("brand_historico", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  usuario: text("usuario").notNull(),
  descricao: text("descricao").notNull(),
});

/* ── Kanban Columns ── */
export const kanbanColumns = pgTable("kanban_columns", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  ordem: integer("ordem").notNull(),
});

/* ── Tasks ── */
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull().default(""),
  responsavel: text("responsavel").notNull(),
  prazo: text("prazo").notNull(),
  prioridade: text("prioridade").notNull(), // Urgente | Alta | Média | Baixa
  tags: jsonb("tags").$type<string[]>().notNull(),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  colunaId: text("coluna_id").notNull().references(() => kanbanColumns.id, { onDelete: "cascade" }),
  recorrente: boolean("recorrente").notNull().default(false),
  frequencia: text("frequencia"),
  criadoEm: text("criado_em").notNull(),
});

export const taskEtapas = pgTable("task_etapas", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  responsavel: text("responsavel").notNull(),
  prazo: text("prazo").notNull(),
  concluida: boolean("concluida").notNull().default(false),
});

export const taskComments = pgTable("task_comments", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  usuario: text("usuario").notNull(),
  texto: text("texto").notNull(),
  data: text("data").notNull(),
});

export const taskAnexos = pgTable("task_anexos", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
});

/* ── Finanças (Movimentações) ── */
export const movimentacoes = pgTable("movimentacoes", {
  id: text("id").primaryKey(),
  valor: doublePrecision("valor").notNull(),
  categoria: text("categoria").notNull(), // Receita | Despesa Operacional | Fornecedor | Pró-labore | Investimento
  data: text("data").notNull(),
  descricao: text("descricao").notNull(),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  status: text("status").notNull(), // Agendado | Pago | Pendente | Atrasado | Cancelado
  criadoEm: text("criado_em").notNull(),
});

/* ── Configurações (Usuários) ── */
export const usuarios = pgTable("usuarios", {
  id: text("id").primaryKey(),
  authUserId: text("auth_user_id"), // Link to Neon Auth user
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  cargo: text("cargo").notNull(),
  role: text("role").notNull(), // Admin | Editor | Visualizador
  avatar: text("avatar"),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: text("criado_em").notNull(),
  ultimoAcesso: text("ultimo_acesso").notNull(),
  alertas: jsonb("alertas").$type<{
    tarefasAtrasadas: boolean;
    renovacaoContratos: boolean;
    pagamentosPendentes: boolean;
    novosComentarios: boolean;
  }>().notNull(),
});
