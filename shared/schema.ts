import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const updateUserProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  profileImageUrl: z.string().url().optional(),
});
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

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
  bio: text("bio").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Badges table - catalog of achievements
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Badge = typeof badges.$inferSelect;

// User badges - earned by users
export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    badgeId: integer("badge_id").notNull().references(() => badges.id),
    earnedAt: timestamp("earned_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("user_badge_idx").on(table.userId, table.badgeId),
  ]
);

export type UserBadge = typeof userBadges.$inferSelect;
export type UserBadgeWithDetails = UserBadge & { badge: Badge };

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
  imageUrl: text("image_url"),
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

// Credit accounts table - stores user credit balance
export const creditAccounts = pgTable("credit_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  balance: integer("balance").notNull().default(100),
  totalEarned: integer("total_earned").notNull().default(100),
  totalSpent: integer("total_spent").notNull().default(0),
  lastDailyReward: timestamp("last_daily_reward"),
  loginStreak: integer("login_streak").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCreditAccountSchema = createInsertSchema(creditAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCreditAccount = z.infer<typeof insertCreditAccountSchema>;
export type CreditAccount = typeof creditAccounts.$inferSelect;

// Credit transactions table - ledger of all credit changes
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  description: text("description"),
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;

// Quest templates - catalog of available quests
export const questTemplates = pgTable("quest_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  requirement: integer("requirement").notNull().default(1),
  rewardCredits: integer("reward_credits").notNull(),
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuestTemplateSchema = createInsertSchema(questTemplates).omit({
  id: true,
  createdAt: true,
});
export type InsertQuestTemplate = z.infer<typeof insertQuestTemplateSchema>;
export type QuestTemplate = typeof questTemplates.$inferSelect;

// User daily quests - per-user quest assignments
export const userDailyQuests = pgTable(
  "user_daily_quests",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    questTemplateId: integer("quest_template_id").notNull().references(() => questTemplates.id),
    questDate: date("quest_date").notNull(),
    progress: integer("progress").notNull().default(0),
    isCompleted: boolean("is_completed").notNull().default(false),
    isClaimed: boolean("is_claimed").notNull().default(false),
    claimedAt: timestamp("claimed_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("user_quest_date_idx").on(table.userId, table.questTemplateId, table.questDate),
  ]
);

export const insertUserDailyQuestSchema = createInsertSchema(userDailyQuests).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});
export type InsertUserDailyQuest = z.infer<typeof insertUserDailyQuestSchema>;
export type UserDailyQuest = typeof userDailyQuests.$inferSelect;

// Generation sessions table - tracks AI generation time
export const generationSessions = pgTable("generation_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(), // 'character', 'environment', 'prop'
  durationSeconds: integer("duration_seconds").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type GenerationSession = typeof generationSessions.$inferSelect;

// Community Gallery - published works for sharing
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'character', 'environment', 'prop'
  itemId: integer("item_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  isPublic: boolean("is_public").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  likes: true,
  views: true,
  createdAt: true,
});
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

// Gallery likes - track who liked what
export const galleryLikes = pgTable(
  "gallery_likes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    galleryItemId: integer("gallery_item_id").notNull().references(() => galleryItems.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("gallery_like_idx").on(table.userId, table.galleryItemId),
  ]
);

export type GalleryLike = typeof galleryLikes.$inferSelect;

// Dimensions - Narrative marketplace for crowdfunding
export const narrativeProjects = pgTable("narrative_projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  narrativeType: varchar("narrative_type", { length: 50 }).notNull(), // 'film', 'game'
  fundingGoal: integer("funding_goal").notNull(),
  currentFunding: integer("current_funding").notNull().default(0),
  backerCount: integer("backer_count").notNull().default(0),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'funded', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNarrativeProjectSchema = createInsertSchema(narrativeProjects).omit({
  id: true,
  currentFunding: true,
  backerCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNarrativeProject = z.infer<typeof insertNarrativeProjectSchema>;
export type NarrativeProject = typeof narrativeProjects.$inferSelect;

// Narrative contributions - investments in projects
export const narrativeContributions = pgTable("narrative_contributions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => narrativeProjects.id),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNarrativeContributionSchema = createInsertSchema(narrativeContributions).omit({
  id: true,
  createdAt: true,
});
export type InsertNarrativeContribution = z.infer<typeof insertNarrativeContributionSchema>;
export type NarrativeContribution = typeof narrativeContributions.$inferSelect;
