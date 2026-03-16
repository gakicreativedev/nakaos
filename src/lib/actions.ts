"use server";

import { db } from "@/db";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { usuarios } from "@/db/schema";
import { createSession, destroySession } from "./auth";
import { redirect } from "next/navigation";

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
