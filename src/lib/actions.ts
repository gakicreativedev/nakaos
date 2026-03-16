"use server";

import { db } from "@/db";
import { hash, compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { usuarios } from "@/db/schema";
import { createSession, destroySession } from "./auth";
import { requireAdmin } from "./require-auth";
import { getUsuarioByEmail, getUsuarioById } from "./queries";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* ── Auth ── */

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  if (!email || !senha) {
    return { error: "Preencha todos os campos." };
  }

  const [user] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (!user) {
    return { error: "E-mail ou senha incorretos." };
  }

  const valid = await compare(senha, user.senhaHash);
  if (!valid) {
    return { error: "E-mail ou senha incorretos." };
  }

  if (!user.ativo) {
    return { error: "Conta desativada. Contate o administrador." };
  }

  await createSession({
    userId: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  });

  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

/* ── User Management (Admin only) ── */

export async function createUserAction(formData: FormData) {
  await requireAdmin();

  const nome = (formData.get("nome") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const cargo = (formData.get("cargo") as string)?.trim();
  const role = formData.get("role") as string;

  if (!nome || !email || !cargo || !role) {
    return { error: "Preencha todos os campos." };
  }

  const validRoles = ["Admin", "Editor", "Visualizador"];
  if (!validRoles.includes(role)) {
    return { error: "Role inválida." };
  }

  const existing = await getUsuarioByEmail(email);
  if (existing) {
    return { error: "Já existe um usuário com este e-mail." };
  }

  // Generate temporary password
  const tempPassword = Math.random().toString(36).slice(2, 10);
  const senhaHash = await hash(tempPassword, 10);

  const id = crypto.randomUUID();
  const now = new Date().toISOString().slice(0, 10);

  await db.insert(usuarios).values({
    id,
    nome,
    email,
    senhaHash,
    cargo,
    role: role as "Admin" | "Editor" | "Visualizador",
    ativo: true,
    criadoEm: now,
    ultimoAcesso: "",
    alertas: {
      tarefasAtrasadas: true,
      renovacaoContratos: true,
      pagamentosPendentes: true,
      novosComentarios: true,
    },
  });

  revalidatePath("/configuracoes");
  return { success: true, tempPassword };
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  await requireAdmin();

  const validRoles = ["Admin", "Editor", "Visualizador"];
  if (!validRoles.includes(newRole)) {
    return { error: "Role inválida." };
  }

  await db
    .update(usuarios)
    .set({ role: newRole as "Admin" | "Editor" | "Visualizador" })
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
