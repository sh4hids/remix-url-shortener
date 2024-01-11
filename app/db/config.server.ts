import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { singleton } from "~/utils/singleton.server";

const sqlite = new Database("sqlite.db");

export const db = singleton("drizzle", () => {
  const client = drizzle(sqlite);

  return client;
});

migrate(db, { migrationsFolder: "./app/db/migrations" });
