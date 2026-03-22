"use client";

import Sidebar from "./sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto px-6 pt-8 pb-32 md:px-10 md:pt-10 md:pb-10 flex flex-col gap-6 md:gap-8">
        {children}
      </main>
    </div>
  );
}
