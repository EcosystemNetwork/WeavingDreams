import {
  users,
  characters,
  environments,
  props,
  creditAccounts,
  creditTransactions,
  questTemplates,
  userDailyQuests,
  badges,
  userBadges,
  type User,
  type UpsertUser,
  type Character,
  type InsertCharacter,
  type UpdateCharacter,
  type Environment,
  type InsertEnvironment,
  type UpdateEnvironment,
  type Prop,
  type InsertProp,
  type UpdateProp,
  type CreditAccount,
  type CreditTransaction,
  type QuestTemplate,
  type UserDailyQuest,
  type Badge,
  type UserBadgeWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: { bio?: string; profileImageUrl?: string }): Promise<User | undefined>;
  getUserBadges(userId: string): Promise<UserBadgeWithDetails[]>;
  
  // Character operations
  getCharacters(userId: string): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, userId: string, character: UpdateCharacter): Promise<Character | undefined>;
  deleteCharacter(id: number, userId: string): Promise<void>;
  
  // Environment operations
  getEnvironments(userId: string): Promise<Environment[]>;
  getEnvironment(id: number): Promise<Environment | undefined>;
  createEnvironment(environment: InsertEnvironment): Promise<Environment>;
  updateEnvironment(id: number, userId: string, environment: UpdateEnvironment): Promise<Environment | undefined>;
  deleteEnvironment(id: number, userId: string): Promise<void>;
  
  // Prop operations
  getProps(userId: string): Promise<Prop[]>;
  getProp(id: number): Promise<Prop | undefined>;
  createProp(prop: InsertProp): Promise<Prop>;
  updateProp(id: number, userId: string, prop: UpdateProp): Promise<Prop | undefined>;
  deleteProp(id: number, userId: string): Promise<void>;
  
  // Credit operations
  getOrCreateCreditAccount(userId: string): Promise<CreditAccount>;
  getCreditBalance(userId: string): Promise<number>;
  adjustCredits(userId: string, amount: number, type: string, source: string, description?: string): Promise<CreditAccount>;
  getCreditTransactions(userId: string, limit?: number): Promise<CreditTransaction[]>;
  getLeaderboard(limit?: number): Promise<(CreditAccount & { user?: { firstName: string | null; lastName: string | null; email: string | null } })[]>;
  
  // Quest operations
  getActiveQuestTemplates(): Promise<QuestTemplate[]>;
  getDailyQuests(userId: string, date: string): Promise<(UserDailyQuest & { quest: QuestTemplate })[]>;
  assignDailyQuests(userId: string, date: string): Promise<void>;
  updateQuestProgress(userId: string, questType: string, increment?: number): Promise<void>;
  claimQuestReward(userId: string, questId: number): Promise<CreditAccount>;
  claimDailyLoginReward(userId: string): Promise<{ credits: number; streak: number } | null>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: { bio?: string; profileImageUrl?: string }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserBadges(userId: string): Promise<UserBadgeWithDetails[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .then((rows) =>
        rows.map((row) => ({
          ...row.user_badges,
          badge: row.badges!,
        }))
      );
  }

  // Character operations
  async getCharacters(userId: string): Promise<Character[]> {
    return await db
      .select()
      .from(characters)
      .where(eq(characters.userId, userId))
      .orderBy(desc(characters.createdAt));
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db
      .select()
      .from(characters)
      .where(eq(characters.id, id));
    return character;
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db
      .insert(characters)
      .values(character)
      .returning();
    return newCharacter;
  }

  async updateCharacter(id: number, userId: string, character: UpdateCharacter): Promise<Character | undefined> {
    const [updated] = await db
      .update(characters)
      .set(character)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)))
      .returning();
    return updated;
  }

  async deleteCharacter(id: number, userId: string): Promise<void> {
    await db
      .delete(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)));
  }

  // Environment operations
  async getEnvironments(userId: string): Promise<Environment[]> {
    return await db
      .select()
      .from(environments)
      .where(eq(environments.userId, userId))
      .orderBy(desc(environments.createdAt));
  }

  async getEnvironment(id: number): Promise<Environment | undefined> {
    const [environment] = await db
      .select()
      .from(environments)
      .where(eq(environments.id, id));
    return environment;
  }

  async createEnvironment(environment: InsertEnvironment): Promise<Environment> {
    const [newEnvironment] = await db
      .insert(environments)
      .values(environment)
      .returning();
    return newEnvironment;
  }

  async updateEnvironment(id: number, userId: string, environment: UpdateEnvironment): Promise<Environment | undefined> {
    const [updated] = await db
      .update(environments)
      .set(environment)
      .where(and(eq(environments.id, id), eq(environments.userId, userId)))
      .returning();
    return updated;
  }

  async deleteEnvironment(id: number, userId: string): Promise<void> {
    await db
      .delete(environments)
      .where(and(eq(environments.id, id), eq(environments.userId, userId)));
  }

  // Prop operations
  async getProps(userId: string): Promise<Prop[]> {
    return await db
      .select()
      .from(props)
      .where(eq(props.userId, userId))
      .orderBy(desc(props.createdAt));
  }

  async getProp(id: number): Promise<Prop | undefined> {
    const [prop] = await db
      .select()
      .from(props)
      .where(eq(props.id, id));
    return prop;
  }

  async createProp(prop: InsertProp): Promise<Prop> {
    const [newProp] = await db
      .insert(props)
      .values(prop)
      .returning();
    return newProp;
  }

  async updateProp(id: number, userId: string, prop: UpdateProp): Promise<Prop | undefined> {
    const [updated] = await db
      .update(props)
      .set(prop)
      .where(and(eq(props.id, id), eq(props.userId, userId)))
      .returning();
    return updated;
  }

  async deleteProp(id: number, userId: string): Promise<void> {
    await db
      .delete(props)
      .where(and(eq(props.id, id), eq(props.userId, userId)));
  }

  // Credit operations
  async getOrCreateCreditAccount(userId: string): Promise<CreditAccount> {
    const [existing] = await db
      .select()
      .from(creditAccounts)
      .where(eq(creditAccounts.userId, userId));
    
    if (existing) {
      return existing;
    }

    const [newAccount] = await db
      .insert(creditAccounts)
      .values({ userId, balance: 100, totalEarned: 100, totalSpent: 0, loginStreak: 0 })
      .returning();
    
    await db.insert(creditTransactions).values({
      userId,
      amount: 100,
      type: 'earn',
      source: 'welcome_bonus',
      description: 'Welcome bonus for new users',
      balanceAfter: 100,
    });

    return newAccount;
  }

  async getCreditBalance(userId: string): Promise<number> {
    const account = await this.getOrCreateCreditAccount(userId);
    return account.balance;
  }

  async adjustCredits(
    userId: string,
    amount: number,
    type: string,
    source: string,
    description?: string
  ): Promise<CreditAccount> {
    const account = await this.getOrCreateCreditAccount(userId);
    const newBalance = account.balance + amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient credits');
    }

    const [updated] = await db
      .update(creditAccounts)
      .set({
        balance: newBalance,
        totalEarned: amount > 0 ? account.totalEarned + amount : account.totalEarned,
        totalSpent: amount < 0 ? account.totalSpent + Math.abs(amount) : account.totalSpent,
        updatedAt: new Date(),
      })
      .where(eq(creditAccounts.userId, userId))
      .returning();

    await db.insert(creditTransactions).values({
      userId,
      amount,
      type,
      source,
      description,
      balanceAfter: newBalance,
    });

    return updated;
  }

  async getCreditTransactions(userId: string, limit = 50): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
  }

  async getLeaderboard(limit = 100): Promise<(CreditAccount & { user?: { firstName: string | null; lastName: string | null; email: string | null } })[]> {
    return await db
      .select({
        id: creditAccounts.id,
        userId: creditAccounts.userId,
        balance: creditAccounts.balance,
        totalEarned: creditAccounts.totalEarned,
        totalSpent: creditAccounts.totalSpent,
        lastDailyReward: creditAccounts.lastDailyReward,
        loginStreak: creditAccounts.loginStreak,
        createdAt: creditAccounts.createdAt,
        updatedAt: creditAccounts.updatedAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(creditAccounts)
      .innerJoin(users, eq(creditAccounts.userId, users.id))
      .orderBy(desc(creditAccounts.totalEarned))
      .limit(limit);
  }

  // Quest operations
  async getActiveQuestTemplates(): Promise<QuestTemplate[]> {
    return await db
      .select()
      .from(questTemplates)
      .where(eq(questTemplates.isActive, true));
  }

  async getDailyQuests(userId: string, date: string): Promise<(UserDailyQuest & { quest: QuestTemplate })[]> {
    const quests = await db
      .select({
        id: userDailyQuests.id,
        userId: userDailyQuests.userId,
        questTemplateId: userDailyQuests.questTemplateId,
        questDate: userDailyQuests.questDate,
        progress: userDailyQuests.progress,
        isCompleted: userDailyQuests.isCompleted,
        isClaimed: userDailyQuests.isClaimed,
        claimedAt: userDailyQuests.claimedAt,
        createdAt: userDailyQuests.createdAt,
        quest: questTemplates,
      })
      .from(userDailyQuests)
      .innerJoin(questTemplates, eq(userDailyQuests.questTemplateId, questTemplates.id))
      .where(
        and(
          eq(userDailyQuests.userId, userId),
          eq(userDailyQuests.questDate, date)
        )
      );

    return quests;
  }

  async assignDailyQuests(userId: string, date: string): Promise<void> {
    const existingQuests = await this.getDailyQuests(userId, date);
    if (existingQuests.length > 0) {
      return;
    }

    const templates = await this.getActiveQuestTemplates();
    
    for (const template of templates) {
      await db.insert(userDailyQuests).values({
        userId,
        questTemplateId: template.id,
        questDate: date,
        progress: 0,
        isCompleted: false,
        isClaimed: false,
      }).onConflictDoNothing();
    }
  }

  async updateQuestProgress(userId: string, questType: string, increment = 1): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const templates = await db
      .select()
      .from(questTemplates)
      .where(and(eq(questTemplates.type, questType), eq(questTemplates.isActive, true)));

    for (const template of templates) {
      const [quest] = await db
        .select()
        .from(userDailyQuests)
        .where(
          and(
            eq(userDailyQuests.userId, userId),
            eq(userDailyQuests.questTemplateId, template.id),
            eq(userDailyQuests.questDate, today)
          )
        );

      if (quest && !quest.isCompleted) {
        const newProgress = quest.progress + increment;
        const isCompleted = newProgress >= template.requirement;
        
        await db
          .update(userDailyQuests)
          .set({
            progress: newProgress,
            isCompleted,
          })
          .where(eq(userDailyQuests.id, quest.id));
      }
    }
  }

  async claimQuestReward(userId: string, questId: number): Promise<CreditAccount> {
    const [quest] = await db
      .select({
        id: userDailyQuests.id,
        userId: userDailyQuests.userId,
        isCompleted: userDailyQuests.isCompleted,
        isClaimed: userDailyQuests.isClaimed,
        questName: questTemplates.name,
        rewardCredits: questTemplates.rewardCredits,
      })
      .from(userDailyQuests)
      .innerJoin(questTemplates, eq(userDailyQuests.questTemplateId, questTemplates.id))
      .where(and(eq(userDailyQuests.id, questId), eq(userDailyQuests.userId, userId)));

    if (!quest) {
      throw new Error('Quest not found');
    }

    if (!quest.isCompleted) {
      throw new Error('Quest not completed');
    }

    if (quest.isClaimed) {
      throw new Error('Reward already claimed');
    }

    await db
      .update(userDailyQuests)
      .set({ isClaimed: true, claimedAt: new Date() })
      .where(eq(userDailyQuests.id, questId));

    return await this.adjustCredits(
      userId,
      quest.rewardCredits,
      'earn',
      'quest_reward',
      `Completed quest: ${quest.questName}`
    );
  }

  async claimDailyLoginReward(userId: string): Promise<{ credits: number; streak: number } | null> {
    const account = await this.getOrCreateCreditAccount(userId);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (account.lastDailyReward) {
      const lastRewardDate = new Date(account.lastDailyReward).toISOString().split('T')[0];
      if (lastRewardDate === today) {
        return null;
      }
      
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const isConsecutive = lastRewardDate === yesterdayStr;
      const newStreak = isConsecutive ? account.loginStreak + 1 : 1;
      
      const baseReward = 10;
      const streakBonus = Math.min(newStreak - 1, 6) * 5;
      const totalReward = baseReward + streakBonus;
      
      await db
        .update(creditAccounts)
        .set({
          lastDailyReward: now,
          loginStreak: newStreak,
          balance: account.balance + totalReward,
          totalEarned: account.totalEarned + totalReward,
          updatedAt: now,
        })
        .where(eq(creditAccounts.userId, userId));

      await db.insert(creditTransactions).values({
        userId,
        amount: totalReward,
        type: 'earn',
        source: 'daily_login',
        description: `Daily login reward (${newStreak} day streak)`,
        balanceAfter: account.balance + totalReward,
      });

      return { credits: totalReward, streak: newStreak };
    } else {
      const reward = 10;
      
      await db
        .update(creditAccounts)
        .set({
          lastDailyReward: now,
          loginStreak: 1,
          balance: account.balance + reward,
          totalEarned: account.totalEarned + reward,
          updatedAt: now,
        })
        .where(eq(creditAccounts.userId, userId));

      await db.insert(creditTransactions).values({
        userId,
        amount: reward,
        type: 'earn',
        source: 'daily_login',
        description: 'Daily login reward (1 day streak)',
        balanceAfter: account.balance + reward,
      });

      return { credits: reward, streak: 1 };
    }
  }
}

export const storage = new DatabaseStorage();
