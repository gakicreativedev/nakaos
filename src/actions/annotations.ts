"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAnnotation(taskId: string, anexoId: string, x: number, y: number, usuario: string, texto: string) {
  try {
    if (!texto.trim()) return { error: "Texto é obrigatório." };
    const id = crypto.randomUUID();
    await db.insert(schema.taskAnnotations).values({ id, taskId, anexoId, x, y, usuario, texto, resolved: false, criadoEm: new Date().toISOString().split("T")[0] });
    revalidatePath("/tarefas");
    return { success: true, id };
  } catch (error) {
    console.error("[createAnnotation] Error:", error);
    return { error: "Falha ao criar anotação." };
  }
}

export async function resolveAnnotation(annotationId: string, resolved: boolean) {
  try {
    await db.update(schema.taskAnnotations).set({ resolved }).where(eq(schema.taskAnnotations.id, annotationId));
    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[resolveAnnotation] Error:", error);
    return { error: "Falha ao resolver anotação." };
  }
}

export async function deleteAnnotation(annotationId: string) {
  try {
    await db.delete(schema.taskAnnotations).where(eq(schema.taskAnnotations.id, annotationId));
    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[deleteAnnotation] Error:", error);
    return { error: "Falha ao excluir anotação." };
  }
}
