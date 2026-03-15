"use client";

import Sidebar from "./sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#191919] to-[#0f0f0f] flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-[#0f0f0f] md:rounded-tl-[34px] overflow-auto p-6 md:p-8 flex flex-col gap-6 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
