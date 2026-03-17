"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function importProjetoColors(projetoId: string, rows: { nome: string; hex: string; rgb: string; cmyk: string }[]) {
  try {
    if (!rows.length) return { error: "Nenhum dado para importar." };

    const values = rows.map((r) => ({
      id: crypto.randomUUID(),
      projetoId,
      nome: r.nome,
      hex: r.hex,
      rgb: r.rgb,
      cmyk: r.cmyk,
    }));

    await db.insert(schema.projetoColors).values(values);
    await db.insert(schema.projetoHistorico).values({
      id: crypto.randomUUID(),
      projetoId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: ${rows.length} cor${rows.length > 1 ? "es" : ""} adicionada${rows.length > 1 ? "s" : ""}`,
    });

    revalidatePath(`/projetos/${projetoId}`);
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("[importProjetoColors] Error:", error);
    return { error: "Falha ao importar cores." };
  }
}

export async function importProjetoFonts(projetoId: string, rows: { nome: string; categoria: string; downloadUrl: string }[]) {
  try {
    if (!rows.length) return { error: "Nenhum dado para importar." };

    const values = rows.map((r) => ({
      id: crypto.randomUUID(),
      projetoId,
      nome: r.nome,
      categoria: r.categoria,
      downloadUrl: r.downloadUrl,
    }));

    await db.insert(schema.projetoFonts).values(values);
    await db.insert(schema.projetoHistorico).values({
      id: crypto.randomUUID(),
      projetoId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: ${rows.length} fonte${rows.length > 1 ? "s" : ""} adicionada${rows.length > 1 ? "s" : ""}`,
    });

    revalidatePath(`/projetos/${projetoId}`);
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("[importProjetoFonts] Error:", error);
    return { error: "Falha ao importar fontes." };
  }
}

export async function importProjetoIdentidade(projetoId: string, fields: Record<string, string>) {
  try {
    const allowedFields = ["nicho", "publicoAlvo", "tomDeVoz", "slogan", "concorrentes", "restricoesVisuais"] as const;
    const update: Record<string, string> = {};
    for (const key of allowedFields) {
      if (fields[key] !== undefined) update[key] = fields[key];
    }
    if (!Object.keys(update).length) return { error: "Nenhum campo válido encontrado." };

    // Upsert: try update first, insert if not exists
    const existing = await db.select().from(schema.projetoIdentidade).where(eq(schema.projetoIdentidade.projetoId, projetoId));
    if (existing.length > 0) {
      await db.update(schema.projetoIdentidade).set(update).where(eq(schema.projetoIdentidade.projetoId, projetoId));
    } else {
      await db.insert(schema.projetoIdentidade).values({
        projetoId,
        nicho: "",
        publicoAlvo: "",
        tomDeVoz: "",
        slogan: "",
        concorrentes: "",
        restricoesVisuais: "",
        ...update,
      });
    }

    await db.insert(schema.projetoHistorico).values({
      id: crypto.randomUUID(),
      projetoId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao: `Importação CSV: identidade da marca atualizada (${Object.keys(update).length} campos)`,
    });

    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[importProjetoIdentidade] Error:", error);
    return { error: "Falha ao importar identidade." };
  }
}
