"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { Client, BrandHubData, Task, Movimentacao, Usuario } from "./types";

/* ── Clients ── */
export async function getClients(): Promise<Client[]> {
  const rows = await db.select().from(schema.clients);
  return rows as unknown as Client[];
}

export async function getClientById(id: string): Promise<Client | null> {
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, id)).limit(1);
  return (client as unknown as Client) ?? null;
}

/* ── Brand Hub ── */
export async function getBrandHub(clientId: string) {
  const [hub] = await db.select().from(schema.brandHubs).where(eq(schema.brandHubs.clientId, clientId)).limit(1);
  if (!hub) return null;

  const logos = await db.select().from(schema.brandLogos).where(eq(schema.brandLogos.clientId, clientId));
  const cores = await db.select().from(schema.brandColors).where(eq(schema.brandColors.clientId, clientId));
  const fontes = await db.select().from(schema.brandFonts).where(eq(schema.brandFonts.clientId, clientId));
  const historico = await db.select().from(schema.brandHistorico).where(eq(schema.brandHistorico.clientId, clientId));

  return { ...hub, logos, cores, fontes, historico };
}

export async function getAllBrandHubs() {
  const hubs = await db.select().from(schema.brandHubs);
  const results = [];
  for (const hub of hubs) {
    const logos = await db.select().from(schema.brandLogos).where(eq(schema.brandLogos.clientId, hub.clientId));
    const cores = await db.select().from(schema.brandColors).where(eq(schema.brandColors.clientId, hub.clientId));
    const fontes = await db.select().from(schema.brandFonts).where(eq(schema.brandFonts.clientId, hub.clientId));
    const historico = await db.select().from(schema.brandHistorico).where(eq(schema.brandHistorico.clientId, hub.clientId));
    results.push({ ...hub, logos, cores, fontes, historico });
  }
  return results;
}

/* ── Kanban ── */
export async function getKanbanColumns(clientId?: string) {
  if (clientId) {
    return db.select().from(schema.kanbanColumns).where(eq(schema.kanbanColumns.clientId, clientId));
  }
  return db.select().from(schema.kanbanColumns);
}

export async function getTasks(clientId?: string) {
  if (clientId) {
    return db.select().from(schema.tasks).where(eq(schema.tasks.clientId, clientId));
  }
  return db.select().from(schema.tasks);
}

export async function getTaskWithDetails(taskId: string) {
  const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId)).limit(1);
  if (!task) return null;

  const etapas = await db.select().from(schema.taskEtapas).where(eq(schema.taskEtapas.taskId, taskId));
  const comentarios = await db.select().from(schema.taskComments).where(eq(schema.taskComments.taskId, taskId));
  const anexos = await db.select().from(schema.taskAnexos).where(eq(schema.taskAnexos.taskId, taskId));

  return { ...task, etapas, comentarios, anexos: anexos.map((a) => a.url) };
}

export async function getAllTasksWithDetails() {
  const allTasks = await db.select().from(schema.tasks);
  const results = [];
  for (const task of allTasks) {
    const etapas = await db.select().from(schema.taskEtapas).where(eq(schema.taskEtapas.taskId, task.id));
    const comentarios = await db.select().from(schema.taskComments).where(eq(schema.taskComments.taskId, task.id));
    const anexos = await db.select().from(schema.taskAnexos).where(eq(schema.taskAnexos.taskId, task.id));
    results.push({ ...task, etapas, comentarios, anexos: anexos.map((a) => a.url) });
  }
  return results;
}

/* ── Finanças ── */
export async function getMovimentacoes() {
  return db.select().from(schema.movimentacoes);
}

export async function getMovimentacoesByClient(clientId: string) {
  return db.select().from(schema.movimentacoes).where(eq(schema.movimentacoes.clientId, clientId));
}

/* ── Usuarios ── */
export async function getUsuarios() {
  return db.select({
    id: schema.usuarios.id,
    nome: schema.usuarios.nome,
    email: schema.usuarios.email,
    cargo: schema.usuarios.cargo,
    role: schema.usuarios.role,
    avatar: schema.usuarios.avatar,
    ativo: schema.usuarios.ativo,
    criadoEm: schema.usuarios.criadoEm,
    ultimoAcesso: schema.usuarios.ultimoAcesso,
    alertas: schema.usuarios.alertas,
  }).from(schema.usuarios);
}
