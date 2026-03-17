"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
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

/* ── Helper: histórico + atualização ── */
async function logAndUpdate(clientId: string, descricao: string) {
  const now = new Date().toISOString().split("T")[0];
  await db.insert(schema.brandHistorico).values({ id: crypto.randomUUID(), clientId, data: now, usuario: "Sistema", descricao });
  await db.update(schema.brandHubs).set({ ultimaAtualizacao: now }).where(eq(schema.brandHubs.clientId, clientId));
  revalidatePath(`/brand-hub/${clientId}`);
}

/* ── Cores ── */
export async function addBrandColor(clientId: string, nome: string, hex: string, rgb?: string, cmyk?: string) {
  try {
    await db.insert(schema.brandColors).values({ id: crypto.randomUUID(), clientId, nome, hex, rgb: rgb || "", cmyk: cmyk || "" });
    await logAndUpdate(clientId, `Cor "${nome}" adicionada`);
    return { success: true };
  } catch (error) {
    console.error("[addBrandColor] Error:", error);
    return { error: "Falha ao adicionar cor." };
  }
}

export async function deleteBrandColor(colorId: string, clientId: string) {
  try {
    await db.delete(schema.brandColors).where(eq(schema.brandColors.id, colorId));
    await logAndUpdate(clientId, "Cor removida");
    return { success: true };
  } catch (error) {
    console.error("[deleteBrandColor] Error:", error);
    return { error: "Falha ao remover cor." };
  }
}

/* ── Fontes ── */
export async function addBrandFont(clientId: string, nome: string, categoria: string, downloadUrl?: string) {
  try {
    await db.insert(schema.brandFonts).values({ id: crypto.randomUUID(), clientId, nome, categoria, downloadUrl: downloadUrl || "" });
    await logAndUpdate(clientId, `Fonte "${nome}" adicionada`);
    return { success: true };
  } catch (error) {
    console.error("[addBrandFont] Error:", error);
    return { error: "Falha ao adicionar fonte." };
  }
}

export async function deleteBrandFont(fontId: string, clientId: string) {
  try {
    await db.delete(schema.brandFonts).where(eq(schema.brandFonts.id, fontId));
    await logAndUpdate(clientId, "Fonte removida");
    return { success: true };
  } catch (error) {
    console.error("[deleteBrandFont] Error:", error);
    return { error: "Falha ao remover fonte." };
  }
}

/* ── Logos ── */
export async function addBrandLogo(clientId: string, categoria: string, url: string) {
  try {
    await db.insert(schema.brandLogos).values({ id: crypto.randomUUID(), clientId, categoria, url });
    await logAndUpdate(clientId, `Logo "${categoria}" adicionado`);
    return { success: true };
  } catch (error) {
    console.error("[addBrandLogo] Error:", error);
    return { error: "Falha ao adicionar logo." };
  }
}

export async function deleteBrandLogo(logoId: string, clientId: string) {
  try {
    await db.delete(schema.brandLogos).where(eq(schema.brandLogos.id, logoId));
    await logAndUpdate(clientId, "Logo removido");
    return { success: true };
  } catch (error) {
    console.error("[deleteBrandLogo] Error:", error);
    return { error: "Falha ao remover logo." };
  }
}

/* ── Figma URL ── */
export async function updateBrandFigmaUrl(clientId: string, figmaUrl: string) {
  try {
    await db.update(schema.brandHubs).set({ figmaUrl: figmaUrl || null }).where(eq(schema.brandHubs.clientId, clientId));
    await logAndUpdate(clientId, figmaUrl ? "Link do Figma atualizado" : "Link do Figma removido");
    return { success: true };
  } catch (error) {
    console.error("[updateBrandFigmaUrl] Error:", error);
    return { error: "Falha ao salvar link do Figma." };
  }
}

/* ── Identidade ── */
export async function updateBrandIdentity(
  clientId: string,
  fields: { nicho?: string; publicoAlvo?: string; tomDeVoz?: string; slogan?: string; concorrentes?: string; restricoesVisuais?: string }
) {
  try {
    await db.update(schema.brandHubs).set(fields).where(eq(schema.brandHubs.clientId, clientId));
    await logAndUpdate(clientId, "Identidade da marca atualizada");
    return { success: true };
  } catch (error) {
    console.error("[updateBrandIdentity] Error:", error);
    return { error: "Falha ao salvar identidade." };
  }
}
