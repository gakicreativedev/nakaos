import AppShell from "@/components/app-shell";
import ProjetosGallery from "@/components/projetos/projetos-gallery";
import { getProjetos, getProjetosByUsuario } from "@/lib/queries";
import { requireAuth } from "@/lib/require-auth";

export default async function ProjetosPage() {
  const session = await requireAuth();

  const projetos = session.role === "Admin"
    ? await getProjetos()
    : await getProjetosByUsuario(session.userId);

  return (
    <AppShell>
      <ProjetosGallery projetos={projetos} userRole={session.role} />
    </AppShell>
  );
}
