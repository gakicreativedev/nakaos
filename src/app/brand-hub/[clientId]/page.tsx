import AppShell from "@/components/app-shell";
import BrandDetail from "@/components/brand-hub/brand-detail";
import { getClientById, getBrandHub, getClients } from "@/lib/queries";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/require-auth";

export default async function BrandHubClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  await requireAuth();
  const { clientId } = await params;
  const [client, brandHub, clients] = await Promise.all([
    getClientById(clientId),
    getBrandHub(clientId),
    getClients(),
  ]);
  if (!client) notFound();
  return (
    <AppShell>
      <BrandDetail client={client} brandHub={brandHub} clients={clients} />
    </AppShell>
  );
}
