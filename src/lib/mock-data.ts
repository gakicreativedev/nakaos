export type ClientStatus = "Ativo" | "Pausado" | "Encerrado" | "Onboarding";

export interface Client {
  id: string;
  nome: string;
  logo?: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  redesSociais: { instagram?: string; facebook?: string; linkedin?: string; tiktok?: string };
  status: ClientStatus;
  servicosContratados: string[];
  valorMensal: number;
  dataInicio: string;
  dataRenovacao: string;
  observacoes: string;
  criadoEm: string;
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    nome: "Studio Zen",
    cnpj: "12.345.678/0001-90",
    responsavel: "Ana Martins",
    telefone: "(11) 99876-5432",
    email: "ana@studiozen.com.br",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    redesSociais: { instagram: "@studiozen", facebook: "studiozen" },
    status: "Ativo",
    servicosContratados: ["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"],
    valorMensal: 4500,
    dataInicio: "2025-09-01",
    dataRenovacao: "2026-09-01",
    observacoes: "Cliente premium. Reuniões semanais às terças.",
    criadoEm: "2025-08-15",
  },
  {
    id: "2",
    nome: "Café Origem",
    cnpj: "98.765.432/0001-10",
    responsavel: "Carlos Eduardo",
    telefone: "(11) 98765-1234",
    email: "carlos@cafeorigem.com.br",
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    redesSociais: { instagram: "@cafeorigem", tiktok: "@cafeorigem" },
    status: "Ativo",
    servicosContratados: ["Gestão de redes sociais", "Criação de conteúdo"],
    valorMensal: 3200,
    dataInicio: "2025-11-01",
    dataRenovacao: "2026-05-01",
    observacoes: "Foco em conteúdo para Instagram e TikTok.",
    criadoEm: "2025-10-20",
  },
  {
    id: "3",
    nome: "TechVida",
    cnpj: "11.222.333/0001-44",
    responsavel: "Fernanda Lima",
    telefone: "(21) 97654-3210",
    email: "fernanda@techvida.io",
    endereco: "Rua Tech, 500 - Rio de Janeiro, RJ",
    redesSociais: { instagram: "@techvida", linkedin: "techvida" },
    status: "Onboarding",
    servicosContratados: ["Tráfego pago"],
    valorMensal: 2800,
    dataInicio: "2026-03-01",
    dataRenovacao: "2027-03-01",
    observacoes: "Em fase de onboarding. Aguardando acesso às contas de anúncios.",
    criadoEm: "2026-02-28",
  },
  {
    id: "4",
    nome: "Floresta Verde",
    cnpj: "44.555.666/0001-77",
    responsavel: "Roberto Alves",
    telefone: "(31) 91234-5678",
    email: "roberto@florestaverde.eco.br",
    endereco: "Rua da Natureza, 42 - Belo Horizonte, MG",
    redesSociais: { instagram: "@florestaverde", facebook: "florestaverde" },
    status: "Ativo",
    servicosContratados: ["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"],
    valorMensal: 5000,
    dataInicio: "2025-06-01",
    dataRenovacao: "2026-06-01",
    observacoes: "Contrato com renovação automática. Foco em sustentabilidade.",
    criadoEm: "2025-05-10",
  },
  {
    id: "5",
    nome: "Arte Nova",
    cnpj: "77.888.999/0001-22",
    responsavel: "Juliana Costa",
    telefone: "(41) 98877-6655",
    email: "juliana@artenova.com.br",
    endereco: "Rua das Artes, 88 - Curitiba, PR",
    redesSociais: { instagram: "@artenova" },
    status: "Pausado",
    servicosContratados: ["Criação de conteúdo"],
    valorMensal: 1800,
    dataInicio: "2025-07-01",
    dataRenovacao: "2026-01-01",
    observacoes: "Contrato pausado a pedido do cliente. Retorno previsto em abril.",
    criadoEm: "2025-06-20",
  },
];
