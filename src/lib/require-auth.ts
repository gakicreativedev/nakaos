import { redirect } from "next/navigation";
import { getSession } from "./auth";

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "Admin") {
    throw new Error("Acesso negado. Apenas administradores podem realizar esta ação.");
  }
  return session;
}
