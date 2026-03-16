"use client";

import Link from "next/link";
import type { Client, BrandHubData } from "@/lib/types";

/* Gradient backgrounds for cards that don't have a cover image yet */
const CARD_GRADIENTS = [
  "from-[#4A7C59]/60 via-[#2a4a33]/40 to-transparent",
  "from-[#C47B5A]/60 via-[#6a3d28]/40 to-transparent",
  "from-[#5b8def]/60 via-[#2a3a6a]/40 to-transparent",
  "from-[#7CB342]/60 via-[#3a5a1a]/40 to-transparent",
  "from-[#a855f7]/60 via-[#4a2a6a]/40 to-transparent",
];

interface BrandGalleryProps {
  clients: Client[];
  brandHubs: BrandHubData[];
}

export default function BrandGallery({ clients, brandHubs }: BrandGalleryProps) {
  const clientsWithBrandHub = clients.filter((c) =>
    brandHubs.some((bh) => bh.clientId === c.id)
  );

  const clientsWithoutBrandHub = clients.filter(
    (c) => !brandHubs.some((bh) => bh.clientId === c.id)
  );

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gradient tracking-tight">Brand Hub</h1>
        <p className="text-muted text-sm mt-1">
          Identidade visual e diretrizes de marca dos seus clientes.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientsWithBrandHub.map((client, i) => {
          const brandHub = brandHubs.find((bh) => bh.clientId === client.id)!;
          const primaryColor = brandHub.cores[0]?.hex || "#333";
          const secondaryColor = brandHub.cores[1]?.hex || "#222";

          return (
            <Link
              key={client.id}
              href={`/brand-hub/${client.id}`}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-border-hover transition-all duration-300 cursor-pointer"
              style={{ aspectRatio: "1/1" }}
            >
              {/* Visual top area — gradient with brand colors */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at 70% 30%, ${primaryColor}44, transparent 60%), radial-gradient(ellipse at 30% 70%, ${secondaryColor}33, transparent 60%), linear-gradient(180deg, ${primaryColor}22 0%, #0f0f0f 70%)`,
                }}
              />

              {/* Top layer — brand name */}
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                {/* Top right — client brand name */}
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-base font-semibold text-white/90 leading-tight">
                      {client.nome}
                    </p>
                    <p className="text-[11px] text-white/50 mt-0.5">Brand Hub</p>
                  </div>
                </div>

                {/* Bottom card overlay — like the reference image */}
                <div className="bg-[#141414]/90 backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-[#c8c8c8]">{brandHub.nicho.split(".")[0]}</p>
                      <p className="text-[11px] text-muted-soft mt-0.5">{brandHub.fontes[0]?.nome}</p>
                    </div>
                  </div>

                  {/* Color palette preview */}
                  <div className="flex gap-1.5 mb-3">
                    {brandHub.cores.map((cor) => (
                      <div
                        key={cor.hex}
                        className="w-6 h-6 rounded-lg border border-white/10"
                        style={{ background: cor.hex }}
                        title={cor.nome}
                      />
                    ))}
                  </div>

                  {/* Bottom stats */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-soft">
                      <span className="text-lg font-semibold text-[#c8c8c8]">{String(brandHub.logos.length).padStart(2, "0")}</span>{" "}
                      Logos
                    </p>
                    <p className="text-xs text-muted-soft">
                      {brandHub.cores.length} Cores · {brandHub.fontes.length} Fontes
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Empty state cards for clients without brand hub */}
        {clientsWithoutBrandHub.map((client) => (
          <div
            key={client.id}
            className="relative rounded-2xl overflow-hidden border border-dashed border-border hover:border-border-hover transition-all duration-300 flex flex-col items-center justify-center p-6 text-center"
            style={{ aspectRatio: "1/1" }}
          >
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-lg font-semibold text-muted mb-3">
              {client.nome[0]}
            </div>
            <p className="text-sm font-medium text-muted-soft">{client.nome}</p>
            <p className="text-[11px] text-muted-soft mt-1 mb-4">Sem Brand Hub</p>
            <Link
              href={`/brand-hub/${client.id}`}
              className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-soft hover:text-muted hover:border-border-hover transition-all"
            >
              + Criar Brand Hub
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
