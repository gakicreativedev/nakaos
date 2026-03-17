"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usuarios } from "@/db/schema";
import { requireAdmin } from "./require-auth";
import { getUsuarioById } from "./queries";
import { revalidatePath } from "next/cache";

/* ── User Management (Admin only) ── */

export async function updateUserRoleAction(userId: string, newRole: string) {
  await requireAdmin();

  const validRoles = ["Admin", "Editor", "Visualizador"];
  if (!validRoles.includes(newRole)) {
    return { error: "Role inválida." };
  }

  await db
    .update(usuarios)
    .set({ role: newRole })
    .where(eq(usuarios.id, userId));

  revalidatePath("/configuracoes");
  return { success: true };
}

export async function toggleUserActiveAction(userId: string) {
  const session = await requireAdmin();

  if (session.userId === userId) {
    return { error: "Você não pode desativar sua própria conta." };
  }

  const user = await getUsuarioById(userId);
  if (!user) {
    return { error: "Usuário não encontrado." };
  }

  await db
    .update(usuarios)
    .set({ ativo: !user.ativo })
    .where(eq(usuarios.id, userId));

  revalidatePath("/configuracoes");
  return { success: true };
}
