"use client";

import { AuthView, getViewByPath, authViewPaths } from "@neondatabase/auth/react";
import { useParams } from "next/navigation";

export default function AuthPage() {
  const params = useParams<{ path: string }>();
  const path = params.path;
  const view = getViewByPath(authViewPaths, path);

  if (!view) return null;

  return (
    <div className="min-h-screen w-full flex bg-[#09090b]">
      {/* ── Esquerda: Branding & Visuals (Apenas Desktop) ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-zinc-950">
        {/* Background Gradients Modernos */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
             <span className="font-bold text-white text-xl">N</span>
          </div>
          <span className="font-semibold text-xl text-white tracking-tight">Naka OS</span>
        </div>

        <div className="relative z-10 max-w-md">
           <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
              Acelere o crescimento da sua marca.
           </h1>
           <p className="text-zinc-400 text-lg leading-relaxed">
             Painel de gestão projetado exclusivamente para operações da Gaki Marketing Digital.
           </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500">
           <span>© 2026 NakaOS.</span>
           <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
           <span>All rights reserved.</span>
        </div>
      </div>

      {/* ── Direita: Authentication Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[400px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Mobile Header (Sobe apenas em telas menores) */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md mb-4 shadow-xl">
               <span className="font-bold text-white text-2xl">N</span>
             </div>
             <h2 className="text-2xl font-semibold text-white tracking-tight">Naka OS</h2>
          </div>

          <div className="bg-zinc-950/40 p-1 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-3xl">
            <div className="bg-zinc-900/40 rounded-[1.35rem] p-6 lg:p-8">
               <AuthView view={view} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
