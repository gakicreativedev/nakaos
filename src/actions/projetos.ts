"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProjeto(nome: string, descricao: string) {
  try {
    if (!nome.trim()) return { error: "Nome é obrigatório." };
    const id = crypto.randomUUID();
    const now = new Date().toISOString().split("T")[0];

    await db.insert(schema.projetos).values({
      id,
      nome: nome.trim(),
      descricao: descricao.trim(),
      status: "Ativo",
      criadoEm: now,
      atualizadoEm: now,
    });

    // Create default kanban columns
    const defaultCols = ["A Fazer", "Em Andamento", "Revisão", "Concluído"];
    for (let i = 0; i < defaultCols.length; i++) {
      await db.insert(schema.projetoKanbanColumns).values({
        id: crypto.randomUUID(),
        titulo: defaultCols[i],
        projetoId: id,
        ordem: i,
      });
    }

    revalidatePath("/projetos");
    return { success: true, projetoId: id };
  } catch (error) {
    console.error("[createProjeto] Error:", error);
    return { error: "Falha ao criar projeto." };
  }
}

export async function updateProjetoCoverImage(projetoId: string, coverImage: string) {
  try {
    await db.update(schema.projetos).set({ coverImage: coverImage || null, atualizadoEm: new Date().toISOString().split("T")[0] }).where(eq(schema.projetos.id, projetoId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[updateProjetoCoverImage] Error:", error);
    return { error: "Falha ao salvar Imagem de Capa." };
  }
}

export async function updateProjetoStatus(projetoId: string, status: string) {
  try {
    const valid = ["Ativo", "Pausado", "Concluído", "Arquivado"];
    if (!valid.includes(status)) return { error: "Status inválido." };

    await db.update(schema.projetos).set({ status, atualizadoEm: new Date().toISOString().split("T")[0] }).where(eq(schema.projetos.id, projetoId));
    revalidatePath(`/projetos/${projetoId}`);
    revalidatePath("/projetos");
    return { success: true };
  } catch (error) {
    console.error("[updateProjetoStatus] Error:", error);
    return { error: "Falha ao atualizar status." };
  }
}

/* ── Figma URL ── */
export async function updateProjetoFigmaUrl(projetoId: string, figmaUrl: string) {
  try {
    await db.update(schema.projetos).set({ figmaUrl: figmaUrl || null, atualizadoEm: new Date().toISOString().split("T")[0] }).where(eq(schema.projetos.id, projetoId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[updateProjetoFigmaUrl] Error:", error);
    return { error: "Falha ao salvar link do Figma." };
  }
}

/* ── Brand: Logos ── */
export async function addProjetoLogo(projetoId: string, categoria: string, url: string) {
  try {
    await db.insert(schema.projetoLogos).values({ id: crypto.randomUUID(), projetoId, categoria, url });
    await addProjetoHistorico(projetoId, `Logo "${categoria}" adicionado`);
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[addProjetoLogo] Error:", error);
    return { error: "Falha ao adicionar logo." };
  }
}

export async function deleteProjetoLogo(logoId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoLogos).where(eq(schema.projetoLogos.id, logoId));
    await addProjetoHistorico(projetoId, "Logo removido");
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteProjetoLogo] Error:", error);
    return { error: "Falha ao remover logo." };
  }
}

/* ── Brand: Identidade ── */
export async function upsertProjetoIdentidade(
  projetoId: string,
  fields: { nicho?: string; publicoAlvo?: string; tomDeVoz?: string; slogan?: string; concorrentes?: string; restricoesVisuais?: string }
) {
  try {
    const existing = await db.select().from(schema.projetoIdentidade).where(eq(schema.projetoIdentidade.projetoId, projetoId)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.projetoIdentidade).set(fields).where(eq(schema.projetoIdentidade.projetoId, projetoId));
    } else {
      await db.insert(schema.projetoIdentidade).values({ projetoId, nicho: "", publicoAlvo: "", tomDeVoz: "", slogan: "", concorrentes: "", restricoesVisuais: "", ...fields });
    }
    await addProjetoHistorico(projetoId, "Identidade da marca atualizada");
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[upsertProjetoIdentidade] Error:", error);
    return { error: "Falha ao salvar identidade." };
  }
}

/* ── Brand: Histórico ── */
async function addProjetoHistorico(projetoId: string, descricao: string) {
  try {
    await db.insert(schema.projetoHistorico).values({
      id: crypto.randomUUID(),
      projetoId,
      data: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
      descricao,
    });
  } catch (error) {
    console.error("[addProjetoHistorico] Error:", error);
  }
}

export async function addProjetoMembro(projetoId: string, usuarioId: string, papel: string) {
  try {
    const id = crypto.randomUUID();
    await db.insert(schema.projetoMembros).values({
      id,
      projetoId,
      usuarioId,
      papel: papel || "Membro",
      criadoEm: new Date().toISOString().split("T")[0],
    });
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[addProjetoMembro] Error:", error);
    return { error: "Falha ao adicionar membro." };
  }
}

export async function removeProjetoMembro(membroId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoMembros).where(eq(schema.projetoMembros.id, membroId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[removeProjetoMembro] Error:", error);
    return { error: "Falha ao remover membro." };
  }
}

export async function createProjetoTask(formData: FormData) {
  try {
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string || "";
    const responsavel = formData.get("responsavel") as string;
    const prazo = formData.get("prazo") as string;
    const prioridade = formData.get("prioridade") as string || "Média";
    const projetoId = formData.get("projetoId") as string;
    const colunaId = formData.get("colunaId") as string;
    const tagsRaw = formData.get("tags") as string || "";
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    if (!titulo || !responsavel || !prazo || !colunaId) return { error: "Preencha os campos obrigatórios." };

    const id = crypto.randomUUID();
    await db.insert(schema.projetoTasks).values({
      id,
      titulo,
      descricao,
      responsavel,
      prazo,
      prioridade,
      tags,
      projetoId,
      colunaId,
      criadoEm: new Date().toISOString().split("T")[0],
    });

    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[createProjetoTask] Error:", error);
    return { error: "Falha ao criar tarefa." };
  }
}

export async function moveProjetoTask(taskId: string, newColunaId: string, projetoId: string) {
  try {
    await db.update(schema.projetoTasks).set({ colunaId: newColunaId }).where(eq(schema.projetoTasks.id, taskId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[moveProjetoTask] Error:", error);
    return { error: "Falha ao mover tarefa." };
  }
}

export async function addProjetoColor(projetoId: string, nome: string, hex: string, rgb?: string, cmyk?: string) {
  try {
    await db.insert(schema.projetoColors).values({ id: crypto.randomUUID(), projetoId, nome, hex, rgb: rgb || "", cmyk: cmyk || "" });
    await addProjetoHistorico(projetoId, `Cor "${nome}" adicionada`);
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[addProjetoColor] Error:", error);
    return { error: "Falha ao adicionar cor." };
  }
}

export async function deleteProjetoColor(colorId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoColors).where(eq(schema.projetoColors.id, colorId));
    await addProjetoHistorico(projetoId, "Cor removida");
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteProjetoColor] Error:", error);
    return { error: "Falha ao remover cor." };
  }
}

export async function addProjetoFont(projetoId: string, nome: string, categoria: string, downloadUrl?: string) {
  try {
    await db.insert(schema.projetoFonts).values({ id: crypto.randomUUID(), projetoId, nome, categoria, downloadUrl: downloadUrl || "" });
    await addProjetoHistorico(projetoId, `Fonte "${nome}" adicionada`);
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[addProjetoFont] Error:", error);
    return { error: "Falha ao adicionar fonte." };
  }
}

export async function deleteProjetoFont(fontId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoFonts).where(eq(schema.projetoFonts.id, fontId));
    await addProjetoHistorico(projetoId, "Fonte removida");
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteProjetoFont] Error:", error);
    return { error: "Falha ao remover fonte." };
  }
}

export async function addProjetoAsset(projetoId: string, nome: string, url: string, tipo: string) {
  try {
    await db.insert(schema.projetoAssets).values({ id: crypto.randomUUID(), projetoId, nome, url, tipo, criadoEm: new Date().toISOString().split("T")[0] });
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[addProjetoAsset] Error:", error);
    return { error: "Falha ao adicionar asset." };
  }
}

export async function deleteProjetoAsset(assetId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoAssets).where(eq(schema.projetoAssets.id, assetId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteProjetoAsset] Error:", error);
    return { error: "Falha ao remover asset." };
  }
}

export async function updateProjetoColumn(columnId: string, titulo: string, projetoId: string) {
  try {
    await db.update(schema.projetoKanbanColumns).set({ titulo }).where(eq(schema.projetoKanbanColumns.id, columnId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[updateProjetoColumn] Error:", error);
    return { error: "Falha ao renomear coluna." };
  }
}

export async function deleteProjetoColumn(columnId: string, projetoId: string) {
  try {
    await db.delete(schema.projetoTasks).where(eq(schema.projetoTasks.colunaId, columnId));
    await db.delete(schema.projetoKanbanColumns).where(eq(schema.projetoKanbanColumns.id, columnId));
    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteProjetoColumn] Error:", error);
    return { error: "Falha ao excluir coluna." };
  }
}

export async function createProjetoColumn(projetoId: string, titulo: string) {
  try {
    if (!titulo.trim()) return { error: "Nome da coluna é obrigatório." };
    const existing = await db.select().from(schema.projetoKanbanColumns).where(eq(schema.projetoKanbanColumns.projetoId, projetoId));
    const maxOrdem = existing.length > 0 ? Math.max(...existing.map((c) => c.ordem)) : -1;

    await db.insert(schema.projetoKanbanColumns).values({
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      projetoId,
      ordem: maxOrdem + 1,
    });

    revalidatePath(`/projetos/${projetoId}`);
    return { success: true };
  } catch (error) {
    console.error("[createProjetoColumn] Error:", error);
    return { error: "Falha ao criar coluna." };
  }
}
