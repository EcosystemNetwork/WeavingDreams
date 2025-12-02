import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Characters table
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  archetype: varchar("archetype", { length: 100 }).notNull(),
  background: text("background").notNull(),
  personality: text("personality").notNull(),
  motivation: text("motivation").notNull(),
  flaw: text("flaw").notNull(),
  trait: text("trait").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
});
export const updateCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type UpdateCharacter = z.infer<typeof updateCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// Environments table
export const environments = pgTable("environments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  atmosphere: text("atmosphere").notNull(),
  keyDetails: text("key_details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEnvironmentSchema = createInsertSchema(environments).omit({
  id: true,
  createdAt: true,
});
export const updateEnvironmentSchema = createInsertSchema(environments).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();
export type InsertEnvironment = z.infer<typeof insertEnvironmentSchema>;
export type UpdateEnvironment = z.infer<typeof updateEnvironmentSchema>;
export type Environment = typeof environments.$inferSelect;

// Props table
export const props = pgTable("props", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  appearance: text("appearance").notNull(),
  significance: text("significance").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropSchema = createInsertSchema(props).omit({
  id: true,
  createdAt: true,
});
export const updatePropSchema = createInsertSchema(props).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();
export type InsertProp = z.infer<typeof insertPropSchema>;
export type UpdateProp = z.infer<typeof updatePropSchema>;
export type Prop = typeof props.$inferSelect;
