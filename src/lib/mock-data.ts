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

/* ── Brand Hub Types ── */
export interface BrandColor {
  nome: string;
  hex: string;
  rgb: string;
  cmyk: string;
}

export interface BrandFont {
  nome: string;
  categoria: string;
  downloadUrl: string;
}

export interface BrandLogo {
  id: string;
  categoria: "Principal" | "Monocromática" | "Negativa" | "Ícone" | "Horizontal" | "Vertical";
  url: string;
  linkExterno?: string;
}

export interface BrandHubData {
  clientId: string;
  logos: BrandLogo[];
  cores: BrandColor[];
  fontes: BrandFont[];
  nicho: string;
  publicoAlvo: string;
  tomDeVoz: string;
  slogan: string;
  concorrentes: string;
  restricoesVisuais: string;
  ultimaAtualizacao: string;
  historico: { data: string; usuario: string; descricao: string }[];
}

export const MOCK_BRAND_HUBS: BrandHubData[] = [
  {
    clientId: "1",
    logos: [
      { id: "l1", categoria: "Principal", url: "" },
      { id: "l2", categoria: "Monocromática", url: "" },
      { id: "l3", categoria: "Negativa", url: "" },
      { id: "l4", categoria: "Ícone", url: "" },
    ],
    cores: [
      { nome: "Verde Zen", hex: "#4A7C59", rgb: "74, 124, 89", cmyk: "40, 0, 28, 51" },
      { nome: "Bege Suave", hex: "#F5F0E8", rgb: "245, 240, 232", cmyk: "0, 2, 5, 4" },
      { nome: "Cinza Pedra", hex: "#6B6B6B", rgb: "107, 107, 107", cmyk: "0, 0, 0, 58" },
      { nome: "Preto Zen", hex: "#1A1A1A", rgb: "26, 26, 26", cmyk: "0, 0, 0, 90" },
    ],
    fontes: [
      { nome: "Playfair Display", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Playfair+Display" },
      { nome: "Inter", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Inter" },
    ],
    nicho: "Bem-estar e meditação. Estúdio de yoga e práticas integrativas.",
    publicoAlvo: "Mulheres 25-45 anos, classe AB, urbanas, interessadas em bem-estar e autoconhecimento.",
    tomDeVoz: "Sereno, acolhedor e inspirador. Linguagem suave e positiva.",
    slogan: "Encontre sua paz interior.",
    concorrentes: "Espaço Nirvana, Yoga Flow Studio, Casa de Luz",
    restricoesVisuais: "Evitar cores vibrantes/neon. Não usar tipografias pesadas ou agressivas.",
    ultimaAtualizacao: "2026-03-10",
    historico: [
      { data: "2026-03-10", usuario: "Yuri", descricao: "Atualização do slogan" },
      { data: "2026-02-15", usuario: "Yuri", descricao: "Adição de nova variação de logo" },
      { data: "2025-09-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
    ],
  },
  {
    clientId: "2",
    logos: [
      { id: "l5", categoria: "Principal", url: "" },
      { id: "l6", categoria: "Ícone", url: "" },
    ],
    cores: [
      { nome: "Marrom Café", hex: "#5C3D2E", rgb: "92, 61, 46", cmyk: "0, 34, 50, 64" },
      { nome: "Creme", hex: "#F2E8D5", rgb: "242, 232, 213", cmyk: "0, 4, 12, 5" },
      { nome: "Terracota", hex: "#C47B5A", rgb: "196, 123, 90", cmyk: "0, 37, 54, 23" },
      { nome: "Verde Folha", hex: "#5A7247", rgb: "90, 114, 71", cmyk: "21, 0, 38, 55" },
    ],
    fontes: [
      { nome: "Lora", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Lora" },
      { nome: "Nunito", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Nunito" },
    ],
    nicho: "Cafeteria artesanal e torrefação própria.",
    publicoAlvo: "Adultos 22-40 anos, apreciadores de café especial, urbanos e conectados.",
    tomDeVoz: "Autêntico, próximo e apaixonado. Comunicação quente e convidativa.",
    slogan: "Do grão à xícara, com alma.",
    concorrentes: "Coffee Lab, Suplicy Cafés, Isso é Café",
    restricoesVisuais: "Evitar tons frios (azul, roxo). Não usar imagens genéricas de banco de imagem.",
    ultimaAtualizacao: "2026-02-20",
    historico: [
      { data: "2026-02-20", usuario: "Yuri", descricao: "Atualização da paleta de cores" },
      { data: "2025-11-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
    ],
  },
  {
    clientId: "4",
    logos: [
      { id: "l7", categoria: "Principal", url: "" },
      { id: "l8", categoria: "Horizontal", url: "" },
      { id: "l9", categoria: "Negativa", url: "" },
    ],
    cores: [
      { nome: "Verde Floresta", hex: "#2D5016", rgb: "45, 80, 22", cmyk: "44, 0, 72, 69" },
      { nome: "Verde Claro", hex: "#7CB342", rgb: "124, 179, 66", cmyk: "31, 0, 63, 30" },
      { nome: "Areia", hex: "#E8DCC8", rgb: "232, 220, 200", cmyk: "0, 5, 14, 9" },
      { nome: "Marrom Terra", hex: "#5D4037", rgb: "93, 64, 55", cmyk: "0, 31, 41, 64" },
    ],
    fontes: [
      { nome: "Montserrat", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Montserrat" },
      { nome: "Open Sans", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Open+Sans" },
    ],
    nicho: "Produtos sustentáveis e ecológicos para o dia a dia.",
    publicoAlvo: "Consumidores conscientes 25-50 anos, preocupados com sustentabilidade e meio ambiente.",
    tomDeVoz: "Responsável, transparente e esperançoso. Tom educativo sem ser pedante.",
    slogan: "Viva verde, viva melhor.",
    concorrentes: "Positiv.a, Use Orgânico, Beleaf",
    restricoesVisuais: "Evitar plástico nas imagens. Não usar greenwashing. Manter autenticidade.",
    ultimaAtualizacao: "2026-01-15",
    historico: [
      { data: "2026-01-15", usuario: "Yuri", descricao: "Revisão do tom de voz" },
      { data: "2025-08-10", usuario: "Yuri", descricao: "Adição de fontes tipográficas" },
      { data: "2025-06-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
    ],
  },
];

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
