"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const rv = () => revalidatePath("/tarefas");

export async function createTask(formData: FormData) {
  try {
    const titulo = formData.get("titulo") as string;
    const descricao = (formData.get("descricao") as string) || "";
    const responsavel = formData.get("responsavel") as string;
    const prazo = formData.get("prazo") as string;
    const prioridade = (formData.get("prioridade") as string) || "Média";
    const clientId = (formData.get("clientId") as string) || null;
    const colunaId = formData.get("colunaId") as string;
    const servico = (formData.get("servico") as string) || null;
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    if (!titulo || !responsavel || !prazo || !colunaId) return { error: "Preencha os campos obrigatórios." };
    const id = crypto.randomUUID();
    await db.insert(schema.tasks).values({ id, titulo, descricao, responsavel, prazo, prioridade, tags, clientId: clientId || null, colunaId, servico, ordem: 0, recorrente: false, frequencia: null, criadoEm: new Date().toISOString().split("T")[0] });
    rv();
    return { success: true, taskId: id };
  } catch (error) {
    console.error("[createTask] Error:", error);
    return { error: "Falha ao criar tarefa." };
  }
}

export async function updateTask(taskId: string, data: { titulo?: string; descricao?: string; responsavel?: string; prazo?: string; prioridade?: string; tags?: string[]; servico?: string | null }) {
  try {
    await db.update(schema.tasks).set(data).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[updateTask] Error:", error);
    return { error: "Falha ao atualizar tarefa." };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[deleteTask] Error:", error);
    return { error: "Falha ao excluir tarefa." };
  }
}

export async function completeTask(taskId: string) {
  try {
    const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId));
    if (!task) return { error: "Tarefa não encontrada." };
    const cols = await db.select().from(schema.kanbanColumns).where(eq(schema.kanbanColumns.clientId, task.clientId!));
    const concluido = cols.find((c) => c.servico === task.servico && /conclu[íi]d/i.test(c.titulo));
    if (!concluido) return { error: "Coluna 'Concluído' não encontrada." };
    await db.update(schema.tasks).set({ colunaId: concluido.id, arquivada: true }).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true, colunaId: concluido.id };
  } catch (error) {
    console.error("[completeTask] Error:", error);
    return { error: "Falha ao concluir tarefa." };
  }
}

export async function archiveTask(taskId: string) {
  try {
    await db.update(schema.tasks).set({ arquivada: true }).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[archiveTask] Error:", error);
    return { error: "Falha ao arquivar tarefa." };
  }
}

export async function unarchiveTask(taskId: string) {
  try {
    await db.update(schema.tasks).set({ arquivada: false }).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[unarchiveTask] Error:", error);
    return { error: "Falha ao desarquivar tarefa." };
  }
}

export async function moveTask(taskId: string, newColunaId: string) {
  try {
    await db.update(schema.tasks).set({ colunaId: newColunaId }).where(eq(schema.tasks.id, taskId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[moveTask] Error:", error);
    return { error: "Falha ao mover tarefa." };
  }
}

export async function reorderTasks(orders: { id: string; ordem: number }[]) {
  try {
    await Promise.all(orders.map((o) => db.update(schema.tasks).set({ ordem: o.ordem }).where(eq(schema.tasks.id, o.id))));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[reorderTasks] Error:", error);
    return { error: "Falha ao reordenar." };
  }
}

export async function addComment(taskId: string, usuario: string, texto: string) {
  try {
    if (!texto.trim()) return { error: "Comentário vazio." };
    await db.insert(schema.taskComments).values({ id: crypto.randomUUID(), taskId, usuario, texto, data: new Date().toISOString().split("T")[0] });
    rv();
    return { success: true };
  } catch (error) {
    console.error("[addComment] Error:", error);
    return { error: "Falha ao adicionar comentário." };
  }
}

export async function deleteComment(commentId: string) {
  try {
    await db.delete(schema.taskComments).where(eq(schema.taskComments.id, commentId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[deleteComment] Error:", error);
    return { error: "Falha ao excluir comentário." };
  }
}

export async function toggleEtapa(etapaId: string, concluida: boolean) {
  try {
    await db.update(schema.taskEtapas).set({ concluida }).where(eq(schema.taskEtapas.id, etapaId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[toggleEtapa] Error:", error);
    return { error: "Falha ao atualizar etapa." };
  }
}

export async function createEtapa(taskId: string, titulo: string, responsavel: string, prazo: string) {
  try {
    if (!titulo.trim()) return { error: "Título é obrigatório." };
    const id = crypto.randomUUID();
    await db.insert(schema.taskEtapas).values({ id, taskId, titulo, responsavel: responsavel || "", prazo: prazo || new Date().toISOString().split("T")[0], concluida: false });
    rv();
    return { success: true, id };
  } catch (error) {
    console.error("[createEtapa] Error:", error);
    return { error: "Falha ao criar etapa." };
  }
}

export async function updateEtapa(etapaId: string, data: { titulo?: string; responsavel?: string; prazo?: string }) {
  try {
    await db.update(schema.taskEtapas).set(data).where(eq(schema.taskEtapas.id, etapaId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[updateEtapa] Error:", error);
    return { error: "Falha ao atualizar etapa." };
  }
}

export async function deleteEtapa(etapaId: string) {
  try {
    await db.delete(schema.taskEtapas).where(eq(schema.taskEtapas.id, etapaId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[deleteEtapa] Error:", error);
    return { error: "Falha ao excluir etapa." };
  }
}

export async function addAnexo(taskId: string, url: string, nome: string, tipo: string) {
  try {
    if (!url.trim()) return { error: "URL é obrigatória." };
    const id = crypto.randomUUID();
    await db.insert(schema.taskAnexos).values({ id, taskId, url, nome: nome || "", tipo: tipo || "imagem" });
    rv();
    return { success: true, id };
  } catch (error) {
    console.error("[addAnexo] Error:", error);
    return { error: "Falha ao adicionar anexo." };
  }
}

export async function deleteAnexo(anexoId: string) {
  try {
    await db.delete(schema.taskAnexos).where(eq(schema.taskAnexos.id, anexoId));
    rv();
    return { success: true };
  } catch (error) {
    console.error("[deleteAnexo] Error:", error);
    return { error: "Falha ao excluir anexo." };
  }
}
