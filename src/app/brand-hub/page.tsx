import AppShell from "@/components/app-shell";
import BrandGallery from "@/components/brand-hub/brand-gallery";
import { getClients, getAllBrandHubs } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function BrandHubPage() {
  await requireAuth();
  const [clients, brandHubs] = await Promise.all([
    getClients(),
    getAllBrandHubs(),
  ]);
  return (
    <AppShell>
      <BrandGallery clients={clients} brandHubs={brandHubs} />
    </AppShell>
  );
}
