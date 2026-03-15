import AppShell from "@/components/app-shell";
import ClienteDetail from "@/components/clientes/cliente-detail";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell>
      <ClienteDetail clientId={id} />
    </AppShell>
  );
}
