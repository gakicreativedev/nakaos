import AppShell from "@/components/app-shell";
import BrandDetail from "@/components/brand-hub/brand-detail";

export default async function BrandHubClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return (
    <AppShell>
      <BrandDetail clientId={clientId} />
    </AppShell>
  );
}
