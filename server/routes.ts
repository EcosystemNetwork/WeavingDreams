import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCharacterSchema, insertEnvironmentSchema, insertPropSchema,
  updateCharacterSchema, updateEnvironmentSchema, updatePropSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Character routes
  app.get('/api/characters', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const characters = await storage.getCharacters(userId);
      res.json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.post('/api/characters', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCharacterSchema.parse({ ...req.body, userId });
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      res.status(400).json({ message: "Failed to create character" });
    }
  });

  app.patch('/api/characters/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = updateCharacterSchema.parse(req.body);
      const updated = await storage.updateCharacter(id, userId, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating character:", error);
      res.status(400).json({ message: "Failed to update character" });
    }
  });

  app.delete('/api/characters/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteCharacter(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting character:", error);
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  // Environment routes
  app.get('/api/environments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const environments = await storage.getEnvironments(userId);
      res.json(environments);
    } catch (error) {
      console.error("Error fetching environments:", error);
      res.status(500).json({ message: "Failed to fetch environments" });
    }
  });

  app.post('/api/environments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEnvironmentSchema.parse({ ...req.body, userId });
      const environment = await storage.createEnvironment(validatedData);
      res.status(201).json(environment);
    } catch (error) {
      console.error("Error creating environment:", error);
      res.status(400).json({ message: "Failed to create environment" });
    }
  });

  app.patch('/api/environments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = updateEnvironmentSchema.parse(req.body);
      const updated = await storage.updateEnvironment(id, userId, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Environment not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating environment:", error);
      res.status(400).json({ message: "Failed to update environment" });
    }
  });

  app.delete('/api/environments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteEnvironment(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting environment:", error);
      res.status(500).json({ message: "Failed to delete environment" });
    }
  });

  // Prop routes
  app.get('/api/props', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const props = await storage.getProps(userId);
      res.json(props);
    } catch (error) {
      console.error("Error fetching props:", error);
      res.status(500).json({ message: "Failed to fetch props" });
    }
  });

  app.post('/api/props', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPropSchema.parse({ ...req.body, userId });
      const prop = await storage.createProp(validatedData);
      res.status(201).json(prop);
    } catch (error) {
      console.error("Error creating prop:", error);
      res.status(400).json({ message: "Failed to create prop" });
    }
  });

  app.patch('/api/props/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = updatePropSchema.parse(req.body);
      const updated = await storage.updateProp(id, userId, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Prop not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating prop:", error);
      res.status(400).json({ message: "Failed to update prop" });
    }
  });

  app.delete('/api/props/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteProp(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prop:", error);
      res.status(500).json({ message: "Failed to delete prop" });
    }
  });

  // Get all creations for history page
  app.get('/api/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [characters, environments, props] = await Promise.all([
        storage.getCharacters(userId),
        storage.getEnvironments(userId),
        storage.getProps(userId),
      ]);
      res.json({ characters, environments, props });
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Credit routes
  app.get('/api/credits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const account = await storage.getOrCreateCreditAccount(userId);
      res.json(account);
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ message: "Failed to fetch credits" });
    }
  });

  app.get('/api/credits/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getCreditTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/credits/spend', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, source, description } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const account = await storage.adjustCredits(
        userId,
        -amount,
        'spend',
        source || 'ai_generation',
        description
      );
      res.json(account);
    } catch (error: any) {
      console.error("Error spending credits:", error);
      if (error.message === 'Insufficient credits') {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      res.status(500).json({ message: "Failed to spend credits" });
    }
  });

  app.post('/api/credits/daily-login', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await storage.claimDailyLoginReward(userId);
      
      if (!result) {
        return res.status(400).json({ message: "Daily reward already claimed", claimed: true });
      }
      
      res.json({ 
        success: true, 
        credits: result.credits, 
        streak: result.streak,
        message: `Claimed ${result.credits} credits! (${result.streak} day streak)`
      });
    } catch (error) {
      console.error("Error claiming daily login:", error);
      res.status(500).json({ message: "Failed to claim daily login reward" });
    }
  });

  app.get('/api/leaderboard', isAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Quest routes
  app.get('/api/quests/daily', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const today = new Date().toISOString().split('T')[0];
      
      await storage.assignDailyQuests(userId, today);
      const quests = await storage.getDailyQuests(userId, today);
      
      res.json(quests);
    } catch (error) {
      console.error("Error fetching daily quests:", error);
      res.status(500).json({ message: "Failed to fetch daily quests" });
    }
  });

  app.post('/api/quests/:id/claim', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questId = parseInt(req.params.id);
      
      const account = await storage.claimQuestReward(userId, questId);
      res.json({ success: true, account });
    } catch (error: any) {
      console.error("Error claiming quest reward:", error);
      res.status(400).json({ message: error.message || "Failed to claim reward" });
    }
  });

  app.post('/api/quests/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { questType, increment } = req.body;
      
      await storage.updateQuestProgress(userId, questType, increment || 1);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating quest progress:", error);
      res.status(500).json({ message: "Failed to update quest progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
