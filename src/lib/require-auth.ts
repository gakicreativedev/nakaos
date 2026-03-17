import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ensureUsuario } from "./queries";

export async function requireAuth() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const usuario = await ensureUsuario({
    id: session.user.id,
    email: session.user.email ?? session.user.id,
    displayName: session.user.name ?? "",
  });

  if (!usuario || !usuario.ativo) {
    redirect("/auth/sign-in");
  }

  return {
    userId: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  };
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "Admin") {
    throw new Error("Acesso negado. Apenas administradores podem realizar esta ação.");
  }
  return session;
}
