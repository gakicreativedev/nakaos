import AppShell from "@/components/app-shell";
import HomePage from "@/components/home-page";
import { getClients, getAllTasksWithDetails, getMovimentacoes } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function Home() {
  await requireAuth();
  const [clients, tasks, movimentacoes] = await Promise.all([
    getClients(),
    getAllTasksWithDetails(),
    getMovimentacoes(),
  ]);
  return (
    <AppShell>
      <HomePage clients={clients} tasks={tasks} movimentacoes={movimentacoes} />
    </AppShell>
  );
}
