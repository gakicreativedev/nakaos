/**
 * Seed script — populates the Turso database with initial data.
 *
 * Run with:  npx tsx src/db/seed.ts
 *
 * Requires TURSO_DATABASE_URL (and optionally TURSO_AUTH_TOKEN) in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  /* ── Clients ── */
  await db.insert(schema.clients).values([
    {
      id: "1", nome: "Studio Zen", cnpj: "12.345.678/0001-90", responsavel: "Ana Martins",
      telefone: "(11) 99876-5432", email: "ana@studiozen.com.br", endereco: "Rua das Flores, 123 - São Paulo, SP",
      redesSociais: { instagram: "@studiozen", facebook: "studiozen" },
      status: "Ativo", servicosContratados: ["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"],
      valorMensal: 4500, dataInicio: "2025-09-01", dataRenovacao: "2026-09-01",
      observacoes: "Cliente premium. Reuniões semanais às terças.", criadoEm: "2025-08-15",
    },
    {
      id: "2", nome: "Café Origem", cnpj: "98.765.432/0001-10", responsavel: "Carlos Eduardo",
      telefone: "(11) 98765-1234", email: "carlos@cafeorigem.com.br", endereco: "Av. Paulista, 1000 - São Paulo, SP",
      redesSociais: { instagram: "@cafeorigem", tiktok: "@cafeorigem" },
      status: "Ativo", servicosContratados: ["Gestão de redes sociais", "Criação de conteúdo"],
      valorMensal: 3200, dataInicio: "2025-11-01", dataRenovacao: "2026-05-01",
      observacoes: "Foco em conteúdo para Instagram e TikTok.", criadoEm: "2025-10-20",
    },
    {
      id: "3", nome: "TechVida", cnpj: "11.222.333/0001-44", responsavel: "Fernanda Lima",
      telefone: "(21) 97654-3210", email: "fernanda@techvida.io", endereco: "Rua Tech, 500 - Rio de Janeiro, RJ",
      redesSociais: { instagram: "@techvida", linkedin: "techvida" },
      status: "Onboarding", servicosContratados: ["Tráfego pago"],
      valorMensal: 2800, dataInicio: "2026-03-01", dataRenovacao: "2027-03-01",
      observacoes: "Em fase de onboarding. Aguardando acesso às contas de anúncios.", criadoEm: "2026-02-28",
    },
    {
      id: "4", nome: "Floresta Verde", cnpj: "44.555.666/0001-77", responsavel: "Roberto Alves",
      telefone: "(31) 91234-5678", email: "roberto@florestaverde.eco.br", endereco: "Rua da Natureza, 42 - Belo Horizonte, MG",
      redesSociais: { instagram: "@florestaverde", facebook: "florestaverde" },
      status: "Ativo", servicosContratados: ["Gestão de redes sociais", "Tráfego pago", "Criação de conteúdo"],
      valorMensal: 5000, dataInicio: "2025-06-01", dataRenovacao: "2026-06-01",
      observacoes: "Contrato com renovação automática. Foco em sustentabilidade.", criadoEm: "2025-05-10",
    },
    {
      id: "5", nome: "Arte Nova", cnpj: "77.888.999/0001-22", responsavel: "Juliana Costa",
      telefone: "(41) 98877-6655", email: "juliana@artenova.com.br", endereco: "Rua das Artes, 88 - Curitiba, PR",
      redesSociais: { instagram: "@artenova" },
      status: "Pausado", servicosContratados: ["Criação de conteúdo"],
      valorMensal: 1800, dataInicio: "2025-07-01", dataRenovacao: "2026-01-01",
      observacoes: "Contrato pausado a pedido do cliente. Retorno previsto em abril.", criadoEm: "2025-06-20",
    },
  ]);
  console.log("  ✓ Clients");

  /* ── Brand Hubs ── */
  await db.insert(schema.brandHubs).values([
    { clientId: "1", nicho: "Bem-estar e meditação. Estúdio de yoga e práticas integrativas.", publicoAlvo: "Mulheres 25-45 anos, classe AB, urbanas, interessadas em bem-estar e autoconhecimento.", tomDeVoz: "Sereno, acolhedor e inspirador. Linguagem suave e positiva.", slogan: "Encontre sua paz interior.", concorrentes: "Espaço Nirvana, Yoga Flow Studio, Casa de Luz", restricoesVisuais: "Evitar cores vibrantes/neon. Não usar tipografias pesadas ou agressivas.", ultimaAtualizacao: "2026-03-10" },
    { clientId: "2", nicho: "Cafeteria artesanal e torrefação própria.", publicoAlvo: "Adultos 22-40 anos, apreciadores de café especial, urbanos e conectados.", tomDeVoz: "Autêntico, próximo e apaixonado. Comunicação quente e convidativa.", slogan: "Do grão à xícara, com alma.", concorrentes: "Coffee Lab, Suplicy Cafés, Isso é Café", restricoesVisuais: "Evitar tons frios (azul, roxo). Não usar imagens genéricas de banco de imagem.", ultimaAtualizacao: "2026-02-20" },
    { clientId: "4", nicho: "Produtos sustentáveis e ecológicos para o dia a dia.", publicoAlvo: "Consumidores conscientes 25-50 anos, preocupados com sustentabilidade e meio ambiente.", tomDeVoz: "Responsável, transparente e esperançoso. Tom educativo sem ser pedante.", slogan: "Viva verde, viva melhor.", concorrentes: "Positiv.a, Use Orgânico, Beleaf", restricoesVisuais: "Evitar plástico nas imagens. Não usar greenwashing. Manter autenticidade.", ultimaAtualizacao: "2026-01-15" },
  ]);
  console.log("  ✓ Brand Hubs");

  /* ── Brand Logos ── */
  await db.insert(schema.brandLogos).values([
    { id: "l1", clientId: "1", categoria: "Principal", url: "" },
    { id: "l2", clientId: "1", categoria: "Monocromática", url: "" },
    { id: "l3", clientId: "1", categoria: "Negativa", url: "" },
    { id: "l4", clientId: "1", categoria: "Ícone", url: "" },
    { id: "l5", clientId: "2", categoria: "Principal", url: "" },
    { id: "l6", clientId: "2", categoria: "Ícone", url: "" },
    { id: "l7", clientId: "4", categoria: "Principal", url: "" },
    { id: "l8", clientId: "4", categoria: "Horizontal", url: "" },
    { id: "l9", clientId: "4", categoria: "Negativa", url: "" },
  ]);
  console.log("  ✓ Brand Logos");

  /* ── Brand Colors ── */
  await db.insert(schema.brandColors).values([
    { id: "bc1", clientId: "1", nome: "Verde Zen", hex: "#4A7C59", rgb: "74, 124, 89", cmyk: "40, 0, 28, 51" },
    { id: "bc2", clientId: "1", nome: "Bege Suave", hex: "#F5F0E8", rgb: "245, 240, 232", cmyk: "0, 2, 5, 4" },
    { id: "bc3", clientId: "1", nome: "Cinza Pedra", hex: "#6B6B6B", rgb: "107, 107, 107", cmyk: "0, 0, 0, 58" },
    { id: "bc4", clientId: "1", nome: "Preto Zen", hex: "#1A1A1A", rgb: "26, 26, 26", cmyk: "0, 0, 0, 90" },
    { id: "bc5", clientId: "2", nome: "Marrom Café", hex: "#5C3D2E", rgb: "92, 61, 46", cmyk: "0, 34, 50, 64" },
    { id: "bc6", clientId: "2", nome: "Creme", hex: "#F2E8D5", rgb: "242, 232, 213", cmyk: "0, 4, 12, 5" },
    { id: "bc7", clientId: "2", nome: "Terracota", hex: "#C47B5A", rgb: "196, 123, 90", cmyk: "0, 37, 54, 23" },
    { id: "bc8", clientId: "2", nome: "Verde Folha", hex: "#5A7247", rgb: "90, 114, 71", cmyk: "21, 0, 38, 55" },
    { id: "bc9", clientId: "4", nome: "Verde Floresta", hex: "#2D5016", rgb: "45, 80, 22", cmyk: "44, 0, 72, 69" },
    { id: "bc10", clientId: "4", nome: "Verde Claro", hex: "#7CB342", rgb: "124, 179, 66", cmyk: "31, 0, 63, 30" },
    { id: "bc11", clientId: "4", nome: "Areia", hex: "#E8DCC8", rgb: "232, 220, 200", cmyk: "0, 5, 14, 9" },
    { id: "bc12", clientId: "4", nome: "Marrom Terra", hex: "#5D4037", rgb: "93, 64, 55", cmyk: "0, 31, 41, 64" },
  ]);
  console.log("  ✓ Brand Colors");

  /* ── Brand Fonts ── */
  await db.insert(schema.brandFonts).values([
    { id: "bf1", clientId: "1", nome: "Playfair Display", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Playfair+Display" },
    { id: "bf2", clientId: "1", nome: "Inter", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Inter" },
    { id: "bf3", clientId: "2", nome: "Lora", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Lora" },
    { id: "bf4", clientId: "2", nome: "Nunito", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Nunito" },
    { id: "bf5", clientId: "4", nome: "Montserrat", categoria: "Títulos", downloadUrl: "https://fonts.google.com/specimen/Montserrat" },
    { id: "bf6", clientId: "4", nome: "Open Sans", categoria: "Corpo", downloadUrl: "https://fonts.google.com/specimen/Open+Sans" },
  ]);
  console.log("  ✓ Brand Fonts");

  /* ── Brand Historico ── */
  await db.insert(schema.brandHistorico).values([
    { id: "bh1", clientId: "1", data: "2026-03-10", usuario: "Yuri", descricao: "Atualização do slogan" },
    { id: "bh2", clientId: "1", data: "2026-02-15", usuario: "Yuri", descricao: "Adição de nova variação de logo" },
    { id: "bh3", clientId: "1", data: "2025-09-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
    { id: "bh4", clientId: "2", data: "2026-02-20", usuario: "Yuri", descricao: "Atualização da paleta de cores" },
    { id: "bh5", clientId: "2", data: "2025-11-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
    { id: "bh6", clientId: "4", data: "2026-01-15", usuario: "Yuri", descricao: "Revisão do tom de voz" },
    { id: "bh7", clientId: "4", data: "2025-08-10", usuario: "Yuri", descricao: "Adição de fontes tipográficas" },
    { id: "bh8", clientId: "4", data: "2025-06-01", usuario: "Yuri", descricao: "Criação inicial do Brand Hub" },
  ]);
  console.log("  ✓ Brand Historico");

  /* ── Kanban Columns ── */
  await db.insert(schema.kanbanColumns).values([
    { id: "col-1", titulo: "Backlog", clientId: "1", ordem: 0 },
    { id: "col-2", titulo: "Em Produção", clientId: "1", ordem: 1 },
    { id: "col-3", titulo: "Revisão", clientId: "1", ordem: 2 },
    { id: "col-4", titulo: "Aprovado", clientId: "1", ordem: 3 },
    { id: "col-5", titulo: "A Fazer", clientId: "2", ordem: 0 },
    { id: "col-6", titulo: "Fazendo", clientId: "2", ordem: 1 },
    { id: "col-7", titulo: "Feito", clientId: "2", ordem: 2 },
    { id: "col-8", titulo: "Pendente", clientId: "4", ordem: 0 },
    { id: "col-9", titulo: "Em Andamento", clientId: "4", ordem: 1 },
    { id: "col-10", titulo: "Concluído", clientId: "4", ordem: 2 },
  ]);
  console.log("  ✓ Kanban Columns");

  /* ── Tasks ── */
  await db.insert(schema.tasks).values([
    { id: "t1", titulo: "Criar calendário editorial março", descricao: "Planejar e montar o calendário de posts para março com datas comemorativas e temas estratégicos.", responsavel: "Yuri", prazo: "2026-03-05", prioridade: "Alta", tags: ["Redes Sociais", "Conteúdo"], clientId: "1", colunaId: "col-2", recorrente: true, frequencia: "Mensal", criadoEm: "2026-02-25" },
    { id: "t2", titulo: "Configurar campanha Meta Ads", descricao: "Subir campanha de conversão no Meta Ads com público lookalike.", responsavel: "Yuri", prazo: "2026-03-10", prioridade: "Urgente", tags: ["Tráfego Pago"], clientId: "1", colunaId: "col-1", recorrente: false, criadoEm: "2026-03-01" },
    { id: "t3", titulo: "Revisão de diretrizes da marca", descricao: "Revisar brand guidelines e atualizar conforme feedback do cliente.", responsavel: "Yuri", prazo: "2026-03-15", prioridade: "Média", tags: ["Design", "Estratégia"], clientId: "1", colunaId: "col-3", recorrente: false, criadoEm: "2026-03-05" },
    { id: "t4", titulo: "Posts semana 11", descricao: "Criar 3 posts para a semana 11 de março.", responsavel: "Yuri", prazo: "2026-03-09", prioridade: "Alta", tags: ["Conteúdo", "Redes Sociais"], clientId: "1", colunaId: "col-4", recorrente: true, frequencia: "Semanal", criadoEm: "2026-03-03" },
    { id: "t5", titulo: "Fotos para feed", descricao: "Sessão de fotos dos novos produtos para o feed do Instagram.", responsavel: "Yuri", prazo: "2026-03-12", prioridade: "Alta", tags: ["Conteúdo"], clientId: "2", colunaId: "col-5", recorrente: false, criadoEm: "2026-03-02" },
    { id: "t6", titulo: "Roteiro Reels TikTok", descricao: "Escrever 5 roteiros de Reels/TikTok sobre café especial.", responsavel: "Yuri", prazo: "2026-03-14", prioridade: "Média", tags: ["Conteúdo", "Redes Sociais"], clientId: "2", colunaId: "col-6", recorrente: false, criadoEm: "2026-03-05" },
    { id: "t7", titulo: "Relatório mensal fevereiro", descricao: "Montar relatório de performance das redes sociais de fevereiro.", responsavel: "Yuri", prazo: "2026-03-07", prioridade: "Baixa", tags: ["Estratégia"], clientId: "2", colunaId: "col-7", recorrente: true, frequencia: "Mensal", criadoEm: "2026-03-01" },
    { id: "t8", titulo: "Campanha lançamento eco-bags", descricao: "Criar e subir campanha para o lançamento das novas eco-bags.", responsavel: "Yuri", prazo: "2026-03-20", prioridade: "Urgente", tags: ["Tráfego Pago", "Conteúdo", "Design"], clientId: "4", colunaId: "col-9", recorrente: false, criadoEm: "2026-03-08" },
  ]);
  console.log("  ✓ Tasks");

  /* ── Task Etapas ── */
  await db.insert(schema.taskEtapas).values([
    { id: "e1", taskId: "t1", titulo: "Pesquisa de datas comemorativas", responsavel: "Yuri", prazo: "2026-03-02", concluida: true },
    { id: "e2", taskId: "t1", titulo: "Definir temas semanais", responsavel: "Yuri", prazo: "2026-03-03", concluida: true },
    { id: "e3", taskId: "t1", titulo: "Montar grid visual", responsavel: "Yuri", prazo: "2026-03-05", concluida: false },
    { id: "e4", taskId: "t2", titulo: "Criar público lookalike", responsavel: "Yuri", prazo: "2026-03-07", concluida: false },
    { id: "e5", taskId: "t2", titulo: "Design dos criativos", responsavel: "Yuri", prazo: "2026-03-08", concluida: false },
    { id: "e6", taskId: "t2", titulo: "Subir campanha", responsavel: "Yuri", prazo: "2026-03-10", concluida: false },
    { id: "e7", taskId: "t3", titulo: "Levantar feedback do cliente", responsavel: "Yuri", prazo: "2026-03-12", concluida: true },
    { id: "e8", taskId: "t3", titulo: "Atualizar documento", responsavel: "Yuri", prazo: "2026-03-15", concluida: false },
    { id: "e9", taskId: "t5", titulo: "Agendar sessão", responsavel: "Yuri", prazo: "2026-03-08", concluida: true },
    { id: "e10", taskId: "t5", titulo: "Edição das fotos", responsavel: "Yuri", prazo: "2026-03-11", concluida: false },
    { id: "e11", taskId: "t8", titulo: "Briefing criativo", responsavel: "Yuri", prazo: "2026-03-12", concluida: true },
    { id: "e12", taskId: "t8", titulo: "Design dos criativos", responsavel: "Yuri", prazo: "2026-03-15", concluida: false },
    { id: "e13", taskId: "t8", titulo: "Copywriting", responsavel: "Yuri", prazo: "2026-03-16", concluida: false },
    { id: "e14", taskId: "t8", titulo: "Subir campanha", responsavel: "Yuri", prazo: "2026-03-18", concluida: false },
  ]);
  console.log("  ✓ Task Etapas");

  /* ── Task Comments ── */
  await db.insert(schema.taskComments).values([
    { id: "c1", taskId: "t1", usuario: "Yuri", texto: "Vou incluir o Dia da Mulher como destaque.", data: "2026-03-01" },
    { id: "c2", taskId: "t3", usuario: "Yuri", texto: "@Ana pediu para mudar a cor secundária.", data: "2026-03-10" },
    { id: "c3", taskId: "t8", usuario: "Yuri", texto: "Roberto quer foco em sustentabilidade na copy.", data: "2026-03-10" },
  ]);
  console.log("  ✓ Task Comments");

  /* ── Movimentações ── */
  await db.insert(schema.movimentacoes).values([
    { id: "m1", valor: 4500, categoria: "Receita", data: "2026-03-05", descricao: "Mensalidade Studio Zen - Março", clientId: "1", status: "Pago", criadoEm: "2026-03-01" },
    { id: "m2", valor: 3200, categoria: "Receita", data: "2026-03-05", descricao: "Mensalidade Café Origem - Março", clientId: "2", status: "Pago", criadoEm: "2026-03-01" },
    { id: "m3", valor: 5000, categoria: "Receita", data: "2026-03-05", descricao: "Mensalidade Floresta Verde - Março", clientId: "4", status: "Pago", criadoEm: "2026-03-01" },
    { id: "m4", valor: 2800, categoria: "Receita", data: "2026-03-10", descricao: "Mensalidade TechVida - Março", clientId: "3", status: "Pendente", criadoEm: "2026-03-01" },
    { id: "m5", valor: 350, categoria: "Despesa Operacional", data: "2026-03-01", descricao: "Canva Pro - Anual rateado", clientId: null, status: "Pago", criadoEm: "2026-03-01" },
    { id: "m6", valor: 199, categoria: "Despesa Operacional", data: "2026-03-01", descricao: "Meta Business Suite - Mensal", clientId: null, status: "Pago", criadoEm: "2026-03-01" },
    { id: "m7", valor: 89, categoria: "Despesa Operacional", data: "2026-03-01", descricao: "Google Workspace", clientId: null, status: "Pago", criadoEm: "2026-03-01" },
    { id: "m8", valor: 1200, categoria: "Fornecedor", data: "2026-03-08", descricao: "Fotógrafo - Sessão Café Origem", clientId: "2", status: "Pago", criadoEm: "2026-03-02" },
    { id: "m9", valor: 3000, categoria: "Pró-labore", data: "2026-03-15", descricao: "Pró-labore Yuri - Março", clientId: null, status: "Agendado", criadoEm: "2026-03-01" },
    { id: "m10", valor: 3000, categoria: "Pró-labore", data: "2026-03-15", descricao: "Pró-labore Sócio 2 - Março", clientId: null, status: "Agendado", criadoEm: "2026-03-01" },
    { id: "m11", valor: 500, categoria: "Investimento", data: "2026-03-02", descricao: "Curso de tráfego pago avançado", clientId: null, status: "Pago", criadoEm: "2026-02-28" },
    { id: "m12", valor: 800, categoria: "Fornecedor", data: "2026-03-20", descricao: "Designer freelancer - Floresta Verde", clientId: "4", status: "Agendado", criadoEm: "2026-03-10" },
    { id: "m13", valor: 12700, categoria: "Receita", data: "2026-02-05", descricao: "Receitas Fevereiro", clientId: null, status: "Pago", criadoEm: "2026-02-01" },
    { id: "m14", valor: 7800, categoria: "Despesa Operacional", data: "2026-02-28", descricao: "Despesas Fevereiro", clientId: null, status: "Pago", criadoEm: "2026-02-01" },
    { id: "m15", valor: 11500, categoria: "Receita", data: "2026-01-05", descricao: "Receitas Janeiro", clientId: null, status: "Pago", criadoEm: "2026-01-01" },
    { id: "m16", valor: 6900, categoria: "Despesa Operacional", data: "2026-01-31", descricao: "Despesas Janeiro", clientId: null, status: "Pago", criadoEm: "2026-01-01" },
  ]);
  console.log("  ✓ Movimentações");

  /* ── Usuários ── */
  const defaultPassword = await hash("gaki2026", 10);
  await db.insert(schema.usuarios).values([
    {
      id: "u1", nome: "Yuri", email: "yuri@gaki.com.br", senhaHash: defaultPassword, cargo: "Sócio / Diretor Criativo", role: "Admin",
      ativo: true, criadoEm: "2025-01-01", ultimoAcesso: "2026-03-15",
      alertas: { tarefasAtrasadas: true, renovacaoContratos: true, pagamentosPendentes: true, novosComentarios: true },
    },
    {
      id: "u2", nome: "Sócio 2", email: "socio2@gaki.com.br", senhaHash: defaultPassword, cargo: "Sócio / Diretor Comercial", role: "Admin",
      ativo: true, criadoEm: "2025-01-01", ultimoAcesso: "2026-03-14",
      alertas: { tarefasAtrasadas: true, renovacaoContratos: true, pagamentosPendentes: true, novosComentarios: false },
    },
  ]);
  console.log("  ✓ Usuários");

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
