import {
  users,
  characters,
  environments,
  props,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export const storage = new DatabaseStorage();
