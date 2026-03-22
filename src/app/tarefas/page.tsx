import AppShell from "@/components/app-shell";
import TarefasOverview from "@/components/tarefas/tarefas-overview";
import { getClients, getAllTasksWithDetails, getKanbanColumns, getArchivedTasksWithDetails } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function TarefasPage() {
  await requireAuth();
  const [clients, tasks, columns, archivedTasks] = await Promise.all([
    getClients(),
    getAllTasksWithDetails(),
    getKanbanColumns(),
    getArchivedTasksWithDetails(),
  ]);
  return (
    <AppShell>
      <TarefasOverview clients={clients} tasks={tasks} columns={columns} archivedTasks={archivedTasks} />
    </AppShell>
  );
}
