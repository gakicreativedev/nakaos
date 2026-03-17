"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function importBrandColors(clientId: string, rows: { nome: string; hex: string; rgb: string; cmyk: string }[]) {
  try {
    if (!rows.length) return { error: "Nenhum dado para importar." };

    const values = rows.map((r) => ({
      id: crypto.randomUUID(),
      clientId,
      nome: r.nome,
      hex: r.hex,
      rgb: r.rgb,
      cmyk: r.cmyk,
    }));

    await db.insert(schema.brandColors).values(values);
    await db.insert(schema.brandHistorico).values({
      id: crypto.randomUUID(),
      clientId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: ${rows.length} cor${rows.length > 1 ? "es" : ""} adicionada${rows.length > 1 ? "s" : ""}`,
    });
    await db.update(schema.brandHubs).set({ ultimaAtualizacao: new Date().toISOString().split("T")[0] }).where(eq(schema.brandHubs.clientId, clientId));

    revalidatePath(`/brand-hub/${clientId}`);
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("[importBrandColors] Error:", error);
    return { error: "Falha ao importar cores." };
  }
}

export async function importBrandFonts(clientId: string, rows: { nome: string; categoria: string; downloadUrl: string }[]) {
  try {
    if (!rows.length) return { error: "Nenhum dado para importar." };

    const values = rows.map((r) => ({
      id: crypto.randomUUID(),
      clientId,
      nome: r.nome,
      categoria: r.categoria,
      downloadUrl: r.downloadUrl,
    }));

    await db.insert(schema.brandFonts).values(values);
    await db.insert(schema.brandHistorico).values({
      id: crypto.randomUUID(),
      clientId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: ${rows.length} fonte${rows.length > 1 ? "s" : ""} adicionada${rows.length > 1 ? "s" : ""}`,
    });
    await db.update(schema.brandHubs).set({ ultimaAtualizacao: new Date().toISOString().split("T")[0] }).where(eq(schema.brandHubs.clientId, clientId));

    revalidatePath(`/brand-hub/${clientId}`);
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("[importBrandFonts] Error:", error);
    return { error: "Falha ao importar fontes." };
  }
}

export async function importBrandIdentity(clientId: string, fields: Record<string, string>) {
  try {
    const allowedFields = ["nicho", "publicoAlvo", "tomDeVoz", "slogan", "concorrentes", "restricoesVisuais"] as const;
    const update: Record<string, string> = {};
    for (const key of allowedFields) {
      if (fields[key] !== undefined) update[key] = fields[key];
    }
    if (!Object.keys(update).length) return { error: "Nenhum campo válido encontrado." };

    update.ultimaAtualizacao = new Date().toISOString().split("T")[0];
    await db.update(schema.brandHubs).set(update).where(eq(schema.brandHubs.clientId, clientId));

    await db.insert(schema.brandHistorico).values({
      id: crypto.randomUUID(),
      clientId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: identidade da marca atualizada (${Object.keys(update).length - 1} campos)`,
    });

    revalidatePath(`/brand-hub/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("[importBrandIdentity] Error:", error);
    return { error: "Falha ao importar identidade." };
  }
}
