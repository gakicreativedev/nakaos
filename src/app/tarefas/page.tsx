import AppShell from "@/components/app-shell";
import KanbanBoard from "@/components/tarefas/kanban-board";

export default function TarefasPage() {
  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  );
}
