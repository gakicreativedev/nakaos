"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";

/* ── Clients ── */
export async function getClients() {
  try {
    return await db.select().from(schema.clients);
  } catch (error) {
    console.error("[getClients] Database error:", error);
    return [];
  }
}

export async function getClientById(id: string) {
  try {
    const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, id)).limit(1);
    return client ?? null;
  } catch (error) {
    console.error("[getClientById] Database error:", error);
    return null;
  }
}

/* ── Brand Hub ── */
export async function getBrandHub(clientId: string) {
  try {
    const [hub] = await db.select().from(schema.brandHubs).where(eq(schema.brandHubs.clientId, clientId)).limit(1);
    if (!hub) return null;

    const logos = await db.select().from(schema.brandLogos).where(eq(schema.brandLogos.clientId, clientId));
    const cores = await db.select().from(schema.brandColors).where(eq(schema.brandColors.clientId, clientId));
    const fontes = await db.select().from(schema.brandFonts).where(eq(schema.brandFonts.clientId, clientId));
    const historico = await db.select().from(schema.brandHistorico).where(eq(schema.brandHistorico.clientId, clientId));

    return { ...hub, logos, cores, fontes, historico };
  } catch (error) {
    console.error("[getBrandHub] Database error:", error);
    return null;
  }
}

export async function getAllBrandHubs() {
  try {
    const hubs = await db.select().from(schema.brandHubs);
    const results = [];
    for (const hub of hubs) {
      const logos = await db.select().from(schema.brandLogos).where(eq(schema.brandLogos.clientId, hub.clientId));
      const cores = await db.select().from(schema.brandColors).where(eq(schema.brandColors.clientId, hub.clientId));
      const fontes = await db.select().from(schema.brandFonts).where(eq(schema.brandFonts.clientId, hub.clientId));
      const historico = await db.select().from(schema.brandHistorico).where(eq(schema.brandHistorico.clientId, hub.clientId));
      results.push({ ...hub, logos, cores, fontes, historico });
    }
    return results;
  } catch (error) {
    console.error("[getAllBrandHubs] Database error:", error);
    return [];
  }
}

/* ── Kanban ── */
export async function getKanbanColumns(clientId?: string) {
  try {
    if (clientId) {
      return await db.select().from(schema.kanbanColumns).where(eq(schema.kanbanColumns.clientId, clientId));
    }
    return await db.select().from(schema.kanbanColumns);
  } catch (error) {
    console.error("[getKanbanColumns] Database error:", error);
    return [];
  }
}

export async function getTasks(clientId?: string) {
  try {
    if (clientId) {
      return await db.select().from(schema.tasks).where(eq(schema.tasks.clientId, clientId));
    }
    return await db.select().from(schema.tasks);
  } catch (error) {
    console.error("[getTasks] Database error:", error);
    return [];
  }
}

export async function getTaskWithDetails(taskId: string) {
  try {
    const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, taskId)).limit(1);
    if (!task) return null;

    const etapas = await db.select().from(schema.taskEtapas).where(eq(schema.taskEtapas.taskId, taskId));
    const comentarios = await db.select().from(schema.taskComments).where(eq(schema.taskComments.taskId, taskId));
    const anexos = await db.select().from(schema.taskAnexos).where(eq(schema.taskAnexos.taskId, taskId));

    return { ...task, etapas, comentarios, anexos: anexos.map((a) => a.url) };
  } catch (error) {
    console.error("[getTaskWithDetails] Database error:", error);
    return null;
  }
}

export async function getAllTasksWithDetails() {
  try {
    const allTasks = await db.select().from(schema.tasks);
    const results = [];
    for (const task of allTasks) {
      const etapas = await db.select().from(schema.taskEtapas).where(eq(schema.taskEtapas.taskId, task.id));
      const comentarios = await db.select().from(schema.taskComments).where(eq(schema.taskComments.taskId, task.id));
      const anexos = await db.select().from(schema.taskAnexos).where(eq(schema.taskAnexos.taskId, task.id));
      results.push({ ...task, etapas, comentarios, anexos: anexos.map((a) => a.url) });
    }
    return results;
  } catch (error) {
    console.error("[getAllTasksWithDetails] Database error:", error);
    return [];
  }
}

/* ── Finanças ── */
export async function getMovimentacoes() {
  try {
    return await db.select().from(schema.movimentacoes);
  } catch (error) {
    console.error("[getMovimentacoes] Database error:", error);
    return [];
  }
}

export async function getMovimentacoesByClient(clientId: string) {
  try {
    return await db.select().from(schema.movimentacoes).where(eq(schema.movimentacoes.clientId, clientId));
  } catch (error) {
    console.error("[getMovimentacoesByClient] Database error:", error);
    return [];
  }
}

/* ── Usuarios ── */
export async function getUsuarios() {
  try {
    return await db.select({
      id: schema.usuarios.id,
      authUserId: schema.usuarios.authUserId,
      nome: schema.usuarios.nome,
      email: schema.usuarios.email,
      cargo: schema.usuarios.cargo,
      role: schema.usuarios.role,
      avatar: schema.usuarios.avatar,
      ativo: schema.usuarios.ativo,
      criadoEm: schema.usuarios.criadoEm,
      ultimoAcesso: schema.usuarios.ultimoAcesso,
      alertas: schema.usuarios.alertas,
    }).from(schema.usuarios);
  } catch (error) {
    console.error("[getUsuarios] Database error:", error);
    return [];
  }
}

export async function getUsuarioByEmail(email: string) {
  try {
    const [user] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email)).limit(1);
    return user ?? null;
  } catch (error) {
    console.error("[getUsuarioByEmail] Database error:", error);
    return null;
  }
}

export async function getUsuarioById(id: string) {
  try {
    const [user] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, id)).limit(1);
    return user ?? null;
  } catch (error) {
    console.error("[getUsuarioById] Database error:", error);
    return null;
  }
}

export async function getUsuarioByAuthId(authUserId: string) {
  try {
    const [user] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.authUserId, authUserId)).limit(1);
    return user ?? null;
  } catch (error) {
    console.error("[getUsuarioByAuthId] Database error:", error);
    return null;
  }
}

/* ── Projetos ── */
export async function getProjetos() {
  try {
    return await db.select().from(schema.projetos);
  } catch (error) {
    console.error("[getProjetos] Database error:", error);
    return [];
  }
}

export async function getProjetoById(id: string) {
  try {
    const [projeto] = await db.select().from(schema.projetos).where(eq(schema.projetos.id, id)).limit(1);
    return projeto ?? null;
  } catch (error) {
    console.error("[getProjetoById] Database error:", error);
    return null;
  }
}

export async function getProjetosByUsuario(usuarioId: string) {
  try {
    const memberships = await db.select().from(schema.projetoMembros).where(eq(schema.projetoMembros.usuarioId, usuarioId));
    if (memberships.length === 0) return [];
    const projetoIds = memberships.map((m) => m.projetoId);
    const all = await db.select().from(schema.projetos);
    return all.filter((p) => projetoIds.includes(p.id));
  } catch (error) {
    console.error("[getProjetosByUsuario] Database error:", error);
    return [];
  }
}

export async function getProjetoMembros(projetoId: string) {
  try {
    return await db.select().from(schema.projetoMembros).where(eq(schema.projetoMembros.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoMembros] Database error:", error);
    return [];
  }
}

export async function getProjetoMembro(projetoId: string, usuarioId: string) {
  try {
    const [member] = await db.select().from(schema.projetoMembros)
      .where(eq(schema.projetoMembros.projetoId, projetoId)).limit(100);
    const found = (await db.select().from(schema.projetoMembros))
      .find((m) => m.projetoId === projetoId && m.usuarioId === usuarioId);
    return found ?? null;
  } catch (error) {
    console.error("[getProjetoMembro] Database error:", error);
    return null;
  }
}

export async function getProjetoLogos(projetoId: string) {
  try {
    return await db.select().from(schema.projetoLogos).where(eq(schema.projetoLogos.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoLogos] Database error:", error);
    return [];
  }
}

export async function getProjetoIdentidade(projetoId: string) {
  try {
    const [ident] = await db.select().from(schema.projetoIdentidade).where(eq(schema.projetoIdentidade.projetoId, projetoId)).limit(1);
    return ident ?? null;
  } catch (error) {
    console.error("[getProjetoIdentidade] Database error:", error);
    return null;
  }
}

export async function getProjetoHistorico(projetoId: string) {
  try {
    return await db.select().from(schema.projetoHistorico).where(eq(schema.projetoHistorico.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoHistorico] Database error:", error);
    return [];
  }
}

export async function getProjetoColors(projetoId: string) {
  try {
    return await db.select().from(schema.projetoColors).where(eq(schema.projetoColors.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoColors] Database error:", error);
    return [];
  }
}

export async function getProjetoFonts(projetoId: string) {
  try {
    return await db.select().from(schema.projetoFonts).where(eq(schema.projetoFonts.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoFonts] Database error:", error);
    return [];
  }
}

export async function getProjetoAssets(projetoId: string) {
  try {
    return await db.select().from(schema.projetoAssets).where(eq(schema.projetoAssets.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoAssets] Database error:", error);
    return [];
  }
}

export async function getProjetoKanbanColumns(projetoId: string) {
  try {
    return await db.select().from(schema.projetoKanbanColumns).where(eq(schema.projetoKanbanColumns.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoKanbanColumns] Database error:", error);
    return [];
  }
}

export async function getProjetoTasks(projetoId: string) {
  try {
    return await db.select().from(schema.projetoTasks).where(eq(schema.projetoTasks.projetoId, projetoId));
  } catch (error) {
    console.error("[getProjetoTasks] Database error:", error);
    return [];
  }
}

/**
 * Ensures a usuario record exists for the given Neon Auth user.
 * On first login, creates with default role "Visualizador".
 * If the email matches a pre-seeded admin, links by email.
 */
export async function ensureUsuario(authUser: { id: string; email: string; displayName: string }) {
  try {
    // First check by authUserId
    let usuario = await getUsuarioByAuthId(authUser.id);
    if (usuario) {
      // Update last access
      await db
        .update(schema.usuarios)
        .set({ ultimoAcesso: new Date().toISOString().slice(0, 10) })
        .where(eq(schema.usuarios.id, usuario.id));
      return usuario;
    }

    // Check if there's a pre-seeded user with this email (e.g. admin)
    const byEmail = await getUsuarioByEmail(authUser.email);
    if (byEmail) {
      // Link the existing record to this auth user
      await db
        .update(schema.usuarios)
        .set({
          authUserId: authUser.id,
          ultimoAcesso: new Date().toISOString().slice(0, 10),
        })
        .where(eq(schema.usuarios.id, byEmail.id));
      return { ...byEmail, authUserId: authUser.id };
    }

    // New user — create with default role
    const now = new Date().toISOString().slice(0, 10);
    const id = crypto.randomUUID();
    await db.insert(schema.usuarios).values({
      id,
      authUserId: authUser.id,
      nome: authUser.displayName || authUser.email.split("@")[0],
      email: authUser.email,
      cargo: "",
      role: "Visualizador",
      ativo: true,
      criadoEm: now,
      ultimoAcesso: now,
      alertas: {
        tarefasAtrasadas: true,
        renovacaoContratos: true,
        pagamentosPendentes: true,
        novosComentarios: true,
      },
    });

    return await getUsuarioById(id);
  } catch (error) {
    console.error("[ensureUsuario] Database error:", error);
    return null;
  }
}
