"use client";

import Link from "next/link";
import type { Client, BrandHubData } from "@/lib/types";

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
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Brand Hub</h1>
        <p className="text-on-surface-variant text-sm mt-1">
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
              className="group relative rounded-xl overflow-hidden bg-surface-container-low hover:bg-surface-container transition-all duration-300 cursor-pointer"
              style={{ aspectRatio: "1/1" }}
            >
              {/* Visual top area — background image if coverImage exists, otherwise gradient */}
              <div
                className="absolute inset-0 rounded-xl bg-center bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: client.coverImage
                    ? `url(${client.coverImage})`
                    : `radial-gradient(ellipse at 70% 30%, ${primaryColor}44, transparent 60%), radial-gradient(ellipse at 30% 70%, ${secondaryColor}33, transparent 60%), linear-gradient(180deg, ${primaryColor}22 0%, #0f0f0f 70%)`,
                }}
              />
              {/* Dark gradient overlay to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

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
                <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{brandHub.nicho.split(".")[0]}</p>
                      <p className="text-[11px] text-outline mt-0.5">{brandHub.fontes[0]?.nome}</p>
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
                    <p className="text-xs text-outline">
                      <span className="text-lg font-semibold text-on-surface">{String(brandHub.logos.length).padStart(2, "0")}</span>{" "}
                      Logos
                    </p>
                    <p className="text-xs text-outline">
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
            className="relative rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/20 hover:border-outline/30 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center"
            style={{ aspectRatio: "1/1" }}
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-lg font-semibold text-on-surface-variant mb-3">
              {client.nome[0]}
            </div>
            <p className="text-sm font-medium text-outline">{client.nome}</p>
            <p className="text-[11px] text-outline mt-1 mb-4">Sem Brand Hub</p>
            <Link
              href={`/brand-hub/${client.id}`}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Criar Brand
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
