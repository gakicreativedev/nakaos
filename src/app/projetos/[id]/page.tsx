import AppShell from "@/components/app-shell";
import ProjetoDetail from "@/components/projetos/projeto-detail";
import {
  getProjetoById,
  getProjetoColors,
  getProjetoFonts,
  getProjetoAssets,
  getProjetoKanbanColumns,
  getProjetoTasks,
  getProjetoMembros,
  getProjetoLogos,
  getProjetoIdentidade,
  getProjetoHistorico,
  getUsuarios,
} from "@/lib/queries";
import { notFound } from "next/navigation";
import { requireProjetoAccess } from "@/lib/require-auth";

export default async function ProjetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireProjetoAccess(id);

  const [projeto, colors, fonts, assets, columns, tasks, membros, logos, identidade, historico, usuarios] = await Promise.all([
    getProjetoById(id),
    getProjetoColors(id),
    getProjetoFonts(id),
    getProjetoAssets(id),
    getProjetoKanbanColumns(id),
    getProjetoTasks(id),
    getProjetoMembros(id),
    getProjetoLogos(id),
    getProjetoIdentidade(id),
    getProjetoHistorico(id),
    getUsuarios(),
  ]);

  if (!projeto) notFound();

  return (
    <AppShell>
      <ProjetoDetail
        projeto={projeto}
        colors={colors}
        fonts={fonts}
        assets={assets}
        columns={columns}
        tasks={tasks}
        membros={membros}
        logos={logos}
        identidade={identidade}
        historico={historico}
        usuarios={usuarios}
        userRole={session.role}
      />
    </AppShell>
  );
}
