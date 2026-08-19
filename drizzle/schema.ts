import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Encrypted, user-owned OpenAI connection metadata. The raw key is never
 * returned through the API and is stored only as AES-GCM ciphertext.
 */
export const userOpenAIConnections = mysqlTable(
  "user_openai_connections",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    encryptedApiKey: text("encrypted_api_key").notNull(),
    keyHint: varchar("key_hint", { length: 16 }).notNull(),
    model: varchar("model", { length: 64 }).notNull().default("gpt-5.6"),
    validatedAt: timestamp("validated_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("user_openai_connections_user_id_unique").on(table.userId)],
);

export type UserOpenAIConnection = typeof userOpenAIConnections.$inferSelect;
