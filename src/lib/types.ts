/* ── Shared Types ── */

export type ClientStatus = "Ativo" | "Pausado" | "Encerrado" | "Onboarding";

export interface Client {
  id: string;
  nome: string;
  logo: string | null;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  redesSociais: { instagram?: string; facebook?: string; linkedin?: string; tiktok?: string } | null;
  status: string;
  servicosContratados: string[];
  valorMensal: number;
  dataInicio: string;
  dataRenovacao: string;
  observacoes: string;
  coverImage: string | null;
  criadoEm: string;
}

/* ── Brand Hub ── */
export interface BrandColor {
  id: string;
  clientId: string;
  nome: string;
  hex: string;
  rgb: string;
  cmyk: string;
}

export interface BrandFont {
  id: string;
  clientId: string;
  nome: string;
  categoria: string;
  downloadUrl: string;
}

export interface BrandLogo {
  id: string;
  clientId: string;
  categoria: string;
  url: string;
  linkExterno: string | null;
}

export interface BrandHistorico {
  id: string;
  clientId: string;
  data: string;
  usuario: string;
  descricao: string;
}

export interface BrandHubData {
  clientId: string;
  nicho: string;
  publicoAlvo: string;
  tomDeVoz: string;
  slogan: string;
  concorrentes: string;
  restricoesVisuais: string;
  figmaUrl: string | null;
  ultimaAtualizacao: string;
  logos: BrandLogo[];
  cores: BrandColor[];
  fontes: BrandFont[];
  historico: BrandHistorico[];
}

/* ── Tasks / Kanban ── */
export type TaskPriority = "Urgente" | "Alta" | "Média" | "Baixa";

export interface Etapa {
  id: string;
  taskId: string;
  titulo: string;
  responsavel: string;
  prazo: string;
  concluida: boolean | null;
}

export interface TaskComment {
  id: string;
  taskId: string;
  usuario: string;
  texto: string;
  data: string;
}

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  prioridade: string;
  tags: string[];
  clientId: string | null;
  colunaId: string;
  recorrente: boolean | null;
  frequencia: string | null;
  criadoEm: string;
  etapas: Etapa[];
  comentarios: TaskComment[];
  anexos: string[];
}

export interface KanbanColumn {
  id: string;
  titulo: string;
  clientId: string;
  ordem: number;
}

/* ── Finanças ── */
export type MovimentacaoCategoria = "Receita" | "Despesa Operacional" | "Fornecedor" | "Pró-labore" | "Investimento";
export type MovimentacaoStatus = "Agendado" | "Pago" | "Pendente" | "Atrasado" | "Cancelado";

export interface Movimentacao {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
  clientId: string | null;
  status: string;
  criadoEm: string;
}

/* ── Configurações ── */
export type UserRole = "Admin" | "Editor" | "Visualizador";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role: string;
  avatar: string | null;
  ativo: boolean | null;
  criadoEm: string;
  ultimoAcesso: string;
  alertas: {
    tarefasAtrasadas: boolean;
    renovacaoContratos: boolean;
    pagamentosPendentes: boolean;
    novosComentarios: boolean;
  } | null;
}

export const ROLE_PERMISSIONS: Record<string, { label: string; descricao: string; permissoes: string[] }> = {
  Admin: {
    label: "Administrador",
    descricao: "Acesso total ao sistema, incluindo configurações e gestão de usuários.",
    permissoes: ["Gerenciar usuários", "Editar configurações", "Acessar Finanças", "Gerenciar clientes", "Gerenciar tarefas", "Editar Brand Hub"],
  },
  Editor: {
    label: "Editor",
    descricao: "Pode criar e editar conteúdos, tarefas e clientes, mas sem acesso a financeiro e configurações.",
    permissoes: ["Gerenciar clientes", "Gerenciar tarefas", "Editar Brand Hub"],
  },
  Visualizador: {
    label: "Visualizador",
    descricao: "Acesso somente leitura. Pode visualizar informações mas não editar.",
    permissoes: ["Visualizar clientes", "Visualizar tarefas", "Visualizar Brand Hub"],
  },
};

export const MOCK_TAGS = ["Redes Sociais", "Tráfego Pago", "Conteúdo", "Design", "Estratégia", "Urgente", "Reunião"];

/* ── Projetos ── */
export type ProjetoStatus = "Ativo" | "Pausado" | "Concluído" | "Arquivado";

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  logo: string | null;
  figmaUrl: string | null;
  coverImage: string | null;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProjetoColor {
  id: string;
  projetoId: string;
  nome: string;
  hex: string;
  rgb: string;
  cmyk: string;
}

export interface ProjetoFont {
  id: string;
  projetoId: string;
  nome: string;
  categoria: string;
  downloadUrl: string;
}

export interface ProjetoLogo {
  id: string;
  projetoId: string;
  categoria: string;
  url: string;
  linkExterno: string | null;
}

export interface ProjetoIdentidade {
  projetoId: string;
  nicho: string;
  publicoAlvo: string;
  tomDeVoz: string;
  slogan: string;
  concorrentes: string;
  restricoesVisuais: string;
}

export interface ProjetoHistorico {
  id: string;
  projetoId: string;
  data: string;
  usuario: string;
  descricao: string;
}

export interface ProjetoAsset {
  id: string;
  projetoId: string;
  nome: string;
  url: string;
  tipo: string;
  criadoEm: string;
}

export interface ProjetoKanbanColumn {
  id: string;
  titulo: string;
  projetoId: string;
  ordem: number;
}

export interface ProjetoTask {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  prioridade: string;
  tags: string[];
  projetoId: string;
  colunaId: string;
  criadoEm: string;
}

export interface ProjetoMembro {
  id: string;
  projetoId: string;
  usuarioId: string;
  papel: string;
  criadoEm: string;
}
