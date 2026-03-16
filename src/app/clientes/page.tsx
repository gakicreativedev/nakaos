import AppShell from "@/components/app-shell";
import ClientesList from "@/components/clientes/clientes-list";
import { getClients } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function ClientesPage() {
  await requireAuth();
  const clients = await getClients();
  return (
    <AppShell>
      <ClientesList clients={clients} />
    </AppShell>
  );
}
