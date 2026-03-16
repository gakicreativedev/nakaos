import AppShell from "@/components/app-shell";
import FinancasDashboard from "@/components/financas/financas-dashboard";
import { getMovimentacoes, getClients } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function FinancasPage() {
  await requireAuth();
  const [movimentacoes, clients] = await Promise.all([
    getMovimentacoes(),
    getClients(),
  ]);
  return (
    <AppShell>
      <FinancasDashboard movimentacoes={movimentacoes} clients={clients} />
    </AppShell>
  );
}
