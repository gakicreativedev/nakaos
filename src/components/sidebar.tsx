"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logout2 } from "@solar-icons/react";
import {
  HomeIcon,
  ClientsIcon,
  TasksIcon,
  FinanceIcon,
  SettingsIcon,
  BrandHubIcon,
  ProjectsIcon,
} from "./icons";
import { authClient } from "@/lib/auth/client";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "clients", label: "Clientes", href: "/clientes", icon: ClientsIcon },
  { id: "tarefas", label: "Tarefas", href: "/tarefas", icon: TasksIcon },
  { id: "brand-hub", label: "Brand Hub", href: "/brand-hub", icon: BrandHubIcon },
  { id: "financas", label: "Finanças", href: "/financas", icon: FinanceIcon },
  { id: "projetos", label: "Projetos", href: "/projetos", icon: ProjectsIcon },
  { id: "settings", label: "Configurações", href: "/configuracoes", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar — always expanded */}
      <aside className="hidden md:flex flex-col h-screen w-72 bg-surface border-r border-white/5 sticky top-0 shrink-0">
        {/* Logo */}
        <div className="px-8 py-8">
          <Image
            src="/logo-naka.svg"
            alt="Naka OS"
            width={80}
            height={41}
            priority
          />
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? "text-primary font-semibold bg-primary-container/20"
                    : "text-on-surface-variant/70 hover:bg-surface-container-lowest hover:text-on-surface"
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5 shrink-0">
                  <Icon />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={() => authClient.signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-on-surface-variant/70 hover:text-error hover:bg-error/10 w-full text-sm"
          >
            <Logout2 size={20} />
            <span className="whitespace-nowrap">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav — Floating Island */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 flex justify-around items-center py-3 rounded-full bg-surface-container-highest/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {NAV_ITEMS.filter((item) => item.id !== "settings").map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-primary after:content-[''] after:block after:w-1 after:h-1 after:bg-primary after:rounded-full after:mt-1"
                  : "text-on-surface/40 hover:text-on-surface"
              }`}
            >
              <Icon />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
