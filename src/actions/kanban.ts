"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createColumn(clientId: string, titulo: string) {
  try {
    if (!titulo.trim()) return { error: "Nome da coluna é obrigatório." };

    // Get max ordem for this client
    const existing = await db.select().from(schema.kanbanColumns).where(eq(schema.kanbanColumns.clientId, clientId));
    const maxOrdem = existing.length > 0 ? Math.max(...existing.map((c) => c.ordem)) : -1;

    const id = crypto.randomUUID();
    await db.insert(schema.kanbanColumns).values({
      id,
      titulo: titulo.trim(),
      clientId,
      ordem: maxOrdem + 1,
    });

    revalidatePath("/tarefas");
    return { success: true, columnId: id };
  } catch (error) {
    console.error("[createColumn] Error:", error);
    return { error: "Falha ao criar coluna." };
  }
}

export async function updateColumn(columnId: string, titulo: string) {
  try {
    if (!titulo.trim()) return { error: "Nome da coluna é obrigatório." };

    await db.update(schema.kanbanColumns).set({ titulo: titulo.trim() }).where(eq(schema.kanbanColumns.id, columnId));
    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[updateColumn] Error:", error);
    return { error: "Falha ao renomear coluna." };
  }
}

export async function deleteColumn(columnId: string) {
  try {
    await db.delete(schema.kanbanColumns).where(eq(schema.kanbanColumns.id, columnId));
    revalidatePath("/tarefas");
    return { success: true };
  } catch (error) {
    console.error("[deleteColumn] Error:", error);
    return { error: "Falha ao excluir coluna." };
  }
}
