import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usuarios } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        name: { label: "Nome", type: "text" },
        mode: { label: "Mode", type: "text" }, // "login" | "register"
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const mode = credentials.mode as string;

        if (mode === "register") {
          const [existing] = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.email, email))
            .limit(1);
          if (existing) throw new Error("E-mail já cadastrado");

          const hash = await bcrypt.hash(password, 12);
          const id = crypto.randomUUID();
          const now = new Date().toISOString().slice(0, 10);
          await db.insert(usuarios).values({
            id,
            authUserId: id,
            nome: (credentials.name as string) || email.split("@")[0],
            email,
            passwordHash: hash,
            cargo: "",
            role: "Visualizador",
            ativo: true,
            criadoEm: now,
            ultimoAcesso: now,
            alertas: {
              tarefasAtrasadas: true,
              renovacaoContratos: true,
              pagamentosPendentes: true,
              novosComentarios: true,
            },
          });
          return { id, email, name: credentials.name as string };
        }

        // Login
        const [user] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.email, email))
          .limit(1);
        if (!user || !user.passwordHash) throw new Error("E-mail ou senha inválidos");
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error("E-mail ou senha inválidos");
        if (!user.ativo) throw new Error("Conta desativada");

        return { id: user.id, email: user.email, name: user.nome };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { ensureUsuario } = await import("@/lib/queries");
        await ensureUsuario({
          id: user.id!,
          email: user.email!,
          displayName: user.name ?? "",
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});
