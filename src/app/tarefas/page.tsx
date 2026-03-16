import AppShell from "@/components/app-shell";
import TarefasOverview from "@/components/tarefas/tarefas-overview";
import { getClients, getAllTasksWithDetails, getKanbanColumns } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function TarefasPage() {
  await requireAuth();
  const [clients, tasks, columns] = await Promise.all([
    getClients(),
    getAllTasksWithDetails(),
    getKanbanColumns(),
  ]);
  return (
    <AppShell>
      <TarefasOverview clients={clients} tasks={tasks} columns={columns} />
    </AppShell>
  );
}
