"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    const result = await signIn("credentials", {
      email,
      password,
      name,
      mode: activeTab === "login" ? "login" : "register",
      redirect: false,
    });

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "E-mail ou senha inválidos" : result.error);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800">

      {/* Logo */}
      <div className="mb-10 text-center flex justify-center">
        <Image
          src="/logo-naka.svg"
          alt="Naka Logo"
          width={180}
          height={60}
          priority
          className="object-contain drop-shadow-md"
        />
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

        {/* Divisor */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-zinc-600">ou</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Botão Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#1a1a1a] hover:bg-[#222222] border border-white/10 text-zinc-300 text-sm font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
      </div>

    </div>
  );
}
