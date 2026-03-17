"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createBrandHub(clientId: string) {
  try {
    if (!clientId) return { error: "Cliente não informado." };

    const now = new Date().toISOString().split("T")[0];

    await db.insert(schema.brandHubs).values({
      clientId,
      nicho: "",
      publicoAlvo: "",
      tomDeVoz: "",
      slogan: "",
      concorrentes: "",
      restricoesVisuais: "",
      ultimaAtualizacao: now,
    });

    await db.insert(schema.brandHistorico).values({
      id: crypto.randomUUID(),
      clientId,
      data: now,
      usuario: "Sistema",
      descricao: "Brand Hub criado",
    });

    revalidatePath(`/brand-hub/${clientId}`);
    revalidatePath("/brand-hub");
    return { success: true };
  } catch (error) {
    console.error("[createBrandHub] Error:", error);
    return { error: "Falha ao criar Brand Hub." };
  }
}
