import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

// Lazy singleton — only created when first accessed at runtime
let _db: ReturnType<typeof getDb> | null = null;
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    if (!_db) _db = getDb();
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export * from "./schema";
