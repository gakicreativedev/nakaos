"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  try {
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string || "";
    const responsavel = formData.get("responsavel") as string;
    const prazo = formData.get("prazo") as string;
    const prioridade = formData.get("prioridade") as string || "Média";
    const clientId = formData.get("clientId") as string || null;
    const colunaId = formData.get("colunaId") as string;
    const tagsRaw = formData.get("tags") as string || "";
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    if (!titulo || !responsavel || !prazo || !colunaId) {
      return { error: "Preencha os campos obrigatórios." };
    }

    const id = crypto.randomUUID();
    const criadoEm = new Date().toISOString().split("T")[0];

    await db.insert(schema.tasks).values({
      id,
      titulo,
      descricao,
      responsavel,
      prazo,
      prioridade,
      tags,
      clientId: clientId || null,
      colunaId,
      recorrente: false,
      frequencia: null,
      criadoEm,
    });

    revalidatePath("/tarefas");
    return { success: true, taskId: id };
  } catch (error) {
    console.error("[createTask] Error:", error);
    return { error: "Falha ao criar tarefa." };
  }
}

export async function moveTask(taskId: string, newColunaId: string) {
  try {
    await db
      .update(schema.tasks)
      .set({ colunaId: newColunaId })
      .where(eq(schema.tasks.id, taskId));

    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[moveTask] Error:", error);
    return { error: "Falha ao mover tarefa." };
  }
}

export async function addComment(taskId: string, usuario: string, texto: string) {
  try {
    if (!texto.trim()) return { error: "Comentário vazio." };

    const id = crypto.randomUUID();
    const data = new Date().toISOString().split("T")[0];

    await db.insert(schema.taskComments).values({
      id,
      taskId,
      usuario,
      texto,
      data,
    });

    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[addComment] Error:", error);
    return { error: "Falha ao adicionar comentário." };
  }
}

export async function toggleEtapa(etapaId: string, concluida: boolean) {
  try {
    await db
      .update(schema.taskEtapas)
      .set({ concluida })
      .where(eq(schema.taskEtapas.id, etapaId));

    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[toggleEtapa] Error:", error);
    return { error: "Falha ao atualizar etapa." };
  }
}
