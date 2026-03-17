"use client";

import {
  Home2,
  UsersGroupRounded,
  ChecklistMinimalistic,
  PaletteRound,
  WalletMoney,
  Settings,
  AltArrowLeft,
  Folder2,
} from "@solar-icons/react";

export function HomeIcon({ className }: { className?: string }) {
  return <Home2 size={20} className={className} />;
}

export function ClientsIcon({ className }: { className?: string }) {
  return <UsersGroupRounded size={20} className={className} />;
}

export function TasksIcon({ className }: { className?: string }) {
  return <ChecklistMinimalistic size={20} className={className} />;
}

export function BrandHubIcon({ className }: { className?: string }) {
  return <PaletteRound size={20} className={className} />;
}

export function FinanceIcon({ className }: { className?: string }) {
  return <WalletMoney size={20} className={className} />;
}

export function SettingsIcon({ className }: { className?: string }) {
  return <Settings size={20} className={className} />;
}

export function ProjectsIcon({ className }: { className?: string }) {
  return <Folder2 size={20} className={className} />;
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return <AltArrowLeft size={18} className={className} />;
}
