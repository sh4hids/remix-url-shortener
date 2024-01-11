import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const links = sqliteTable("links", {
  id: integer("id").primaryKey(),
  url: text("url").notNull(),
  shortUrl: text("short_url"),
  creatdeAt: text("created_at").$defaultFn(() => new Date().toJSON()),
});

export type UrlData = typeof links.$inferSelect;
export type NewUrlData = typeof links.$inferInsert;
