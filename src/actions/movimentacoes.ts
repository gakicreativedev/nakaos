"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createMovimentacao(formData: FormData) {
  try {
    const valorRaw = formData.get("valor") as string || "0";
    const valor = parseFloat(valorRaw.replace("R$", "").replace(/\./g, "").replace(",", ".")) || 0;
    const categoria = formData.get("categoria") as string;
    const data = formData.get("data") as string;
    const descricao = formData.get("descricao") as string || "";
    const clientId = formData.get("clientId") as string || null;
    const status = formData.get("status") as string || "Pendente";

    if (!categoria || !data || valor === 0) {
      return { error: "Preencha os campos obrigatórios." };
    }

    const id = crypto.randomUUID();
    const criadoEm = new Date().toISOString().split("T")[0];

    await db.insert(schema.movimentacoes).values({
      id,
      valor,
      categoria,
      data,
      descricao,
      clientId: clientId || null,
      status,
      criadoEm,
    });

    revalidatePath("/financas");
    return { success: true };
  } catch (error) {
    console.error("[createMovimentacao] Error:", error);
    return { error: "Falha ao criar movimentação." };
  }
}
