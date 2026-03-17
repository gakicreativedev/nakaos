"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "login") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          setError(error.message || "Erro ao entrar");
          setLoading(false);
          return;
        }
        router.push("/");
      } else {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) {
          setError(error.message || "Erro ao solicitar acesso");
          setLoading(false);
          return;
        }
        router.push("/");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800">
      
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-6xl text-zinc-200 tracking-tight" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Naka
        </h1>
      </div>

      {/* Card Principal */}
      <div className="w-full max-w-[420px] bg-[#111111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-2xl relative">
        
        {/* Tabs */}
        <div className="flex bg-[#0a0a0a] rounded-2xl p-1 mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => { setActiveTab("login"); setError(""); }}
            className={`flex-1 text-sm font-medium py-2.5 rounded-xl transition-all duration-300 ${activeTab === "login" ? 'bg-[#1a1a1a] text-zinc-100 shadow-sm border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("register"); setError(""); }}
            className={`flex-1 text-sm font-medium py-2.5 rounded-xl transition-all duration-300 ${activeTab === "register" ? 'bg-[#1a1a1a] text-zinc-100 shadow-sm border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Solicitar Acesso
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {activeTab === "register" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium pl-1 text-zinc-300">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1e1e1e] border border-transparent focus:border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium pl-1 text-zinc-300">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1e1e1e] border border-transparent focus:border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium pl-1 text-zinc-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1e1e1e] border border-transparent focus:border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
          
          {activeTab === "login" && (
            <div className="flex justify-end mt-[-12px]">
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Esqueci minha senha
              </a>
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="mt-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#222222] border border-white/10 text-white text-sm font-medium transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white/100 rounded-full animate-spin" />
              ) : activeTab === "login" ? "Entrar" : "Solicitar Acesso"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
