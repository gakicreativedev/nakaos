/**
 * Drops all tables, recreates them, and seeds the database.
 * Run with: npx tsx src/db/reset-and-seed.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function resetDb() {
  console.log("🗑️  Dropping all tables...");

  // Drop in reverse dependency order
  const tables = [
    "task_anexos", "task_comments", "task_etapas", "tasks",
    "kanban_columns", "movimentacoes",
    "brand_historico", "brand_fonts", "brand_colors", "brand_logos", "brand_hubs",
    "usuarios", "clients",
  ];

  for (const table of tables) {
    await client.execute(`DROP TABLE IF EXISTS "${table}"`);
  }

  console.log("  ✓ All tables dropped");
}

resetDb()
  .then(() => {
    console.log("Now run: npm run db:push && npm run db:seed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  });
