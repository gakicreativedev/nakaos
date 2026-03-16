"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#2d6b1e]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#4a9e2f]/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#141414]/80 backdrop-blur-xl overflow-hidden">
          {/* Green accent top */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#4a9e2f] to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image src="/logo-naka.svg" alt="Naka OS" width={120} height={40} priority />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-muted-soft mt-1.5">
                Entre com suas credenciais
              </p>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {state.error}
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">E-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-[#4a9e2f]/40 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Senha</label>
                <input
                  name="senha"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-soft focus:outline-none focus:border-[#4a9e2f]/40 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#2d6b1e] to-[#4a9e2f] text-white text-sm font-semibold hover:from-[#357f23] hover:to-[#55b336] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-soft/50 mt-6">
          Naka OS &middot; Gaki Marketing Digital
        </p>
      </div>
    </div>
  );
}
