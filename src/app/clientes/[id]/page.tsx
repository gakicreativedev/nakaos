import AppShell from "@/components/app-shell";
import ClienteDetail from "@/components/clientes/cliente-detail";
import { getClientById, getBrandHub, getTasksWithDetailsByClient, getMovimentacoesByClient } from "@/lib/queries";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/require-auth";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;
  const [client, brandHub, tasks, movimentacoes] = await Promise.all([
    getClientById(id),
    getBrandHub(id),
    getTasksWithDetailsByClient(id),
    getMovimentacoesByClient(id),
  ]);
  if (!client) notFound();
  return (
    <AppShell>
      <ClienteDetail client={client} brandHub={brandHub} tasks={tasks} movimentacoes={movimentacoes} userRole={session.role} />
    </AppShell>
  );
}
