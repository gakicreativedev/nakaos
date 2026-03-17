/**
 * Seed script — cleans the database and inserts the admin user.
 *
 * Run with:  npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🧹 Cleaning database...");

  // Delete in order respecting foreign keys (children first)
  await db.delete(schema.taskAnexos);
  await db.delete(schema.taskComments);
  await db.delete(schema.taskEtapas);
  await db.delete(schema.tasks);
  await db.delete(schema.kanbanColumns);
  await db.delete(schema.brandHistorico);
  await db.delete(schema.brandFonts);
  await db.delete(schema.brandColors);
  await db.delete(schema.brandLogos);
  await db.delete(schema.brandHubs);
  await db.delete(schema.movimentacoes);
  await db.delete(schema.clients);
  await db.delete(schema.usuarios);

  console.log("  ✓ All tables cleared");

  /* ── Admin user ── */
  // No password hash needed — Neon Auth handles authentication.
  // When Yuri signs up via Neon Auth with this email, ensureUsuario()
  // will link his auth account to this pre-seeded Admin record.
  await db.insert(schema.usuarios).values({
    id: "u1",
    nome: "Yuri",
    email: "gakicreativegroup@gmail.com",
    cargo: "Sócio / Diretor Criativo",
    role: "Admin",
    ativo: true,
    criadoEm: "2025-01-01",
    ultimoAcesso: "2026-03-16",
    alertas: {
      tarefasAtrasadas: true,
      renovacaoContratos: true,
      pagamentosPendentes: true,
      novosComentarios: true,
    },
  });
  console.log("  ✓ Admin user created (gakicreativegroup@gmail.com)");

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
