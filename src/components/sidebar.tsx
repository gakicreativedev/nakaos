"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ClientsIcon,
  TasksIcon,
  FinanceIcon,
  SettingsIcon,
  ChevronLeftIcon,
  BrandHubIcon,
} from "./icons";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "clients", label: "Clientes", href: "/clientes", icon: ClientsIcon },
  { id: "tarefas", label: "Tarefas", href: "/tarefas", icon: TasksIcon },
  { id: "brand-hub", label: "Brand Hub", href: "/brand-hub", icon: BrandHubIcon },
  { id: "saude", label: "Saúde", href: "/saude", icon: FinanceIcon },
  { id: "settings", label: "Configurações", href: "/configuracoes", icon: SettingsIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
          collapsed ? "w-[68px] px-2.5" : "w-[210px] px-5"
        } py-5`}
      >
        {/* Logo + toggle */}
        <div
          className={`flex items-center mb-5 min-h-[40px] ${
            collapsed ? "justify-center" : "justify-between pl-1"
          }`}
        >
          {!collapsed && (
            <span className="text-gradient text-2xl font-light italic tracking-tight">
              Naka
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 flex items-center justify-center rounded-lg text-muted hover:bg-white/5 transition-colors"
            title={collapsed ? "Expandir" : "Recolher"}
          >
            <ChevronLeftIcon
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
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
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-[14px] transition-all duration-200 ${
                  collapsed ? "justify-center py-3" : "px-4 py-3"
                } ${
                  isActive
                    ? "bg-gradient-to-t from-[#191919] to-[#2a2a2a] shadow-[0_3px_3px_rgba(0,0,0,0.25)]"
                    : "hover:bg-gradient-to-t hover:from-[#191919] hover:to-[#222]"
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5 shrink-0 text-gradient">
                  <Icon />
                </span>
                {!collapsed && (
                  <span className="text-sm font-normal text-gradient whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#191919] border-t border-border flex justify-around py-2 px-1">
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                isActive ? "text-foreground" : "text-muted"
              }`}
            >
              <Icon />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
