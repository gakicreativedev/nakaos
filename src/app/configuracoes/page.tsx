import AppShell from "@/components/app-shell";
import ConfiguracoesDashboard from "@/components/configuracoes/configuracoes-dashboard";
import { getUsuarios } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function ConfiguracoesPage() {
  const session = await requireAuth();
  const usuarios = await getUsuarios();
  return (
    <AppShell>
      <ConfiguracoesDashboard usuarios={usuarios} currentUserRole={session.role} currentUserId={session.userId} />
    </AppShell>
  );
}
