import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schemas/*",
  out: "./app/db/migrations",
} satisfies Config;
