import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCharacterSchema, insertEnvironmentSchema, insertPropSchema,
  updateCharacterSchema, updateEnvironmentSchema, updatePropSchema,
  insertGalleryItemSchema, insertNarrativeProjectSchema
} from "@shared/schema";
import { GENERATION_TIME_BADGES } from "./badgeConstants";
import { generateCharacterImage, generateCharacterProfile } from "./kieAi";

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
      
      // Track generation time (10 seconds for character generation)
      await storage.logGenerationSession(userId, 'character', 10);
      
      // Check for badge milestones
      const totalSeconds = await storage.getTotalGenerationSeconds(userId);
      for (const badge of Object.values(GENERATION_TIME_BADGES)) {
        if (totalSeconds >= badge.threshold) {
          await storage.awardBadgeIfEarned(userId, badge.id);
        }
      }
      
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

  // Kie AI - Generate character profile
  app.post('/api/kie-ai/generate-character', isAuthenticated, async (req: any, res) => {
    try {
      const profile = await generateCharacterProfile();
      res.json(profile);
    } catch (error) {
      console.error("Error generating character profile:", error);
      res.status(500).json({ message: "Failed to generate character profile" });
    }
  });

  // Kie AI - Generate character image
  app.post('/api/kie-ai/generate-image', isAuthenticated, async (req: any, res) => {
    try {
      const { name, archetype, personality, background } = req.body;
      
      if (!name || !archetype) {
        return res.status(400).json({ message: "Name and archetype are required" });
      }

      const imageUrl = await generateCharacterImage({
        name,
        archetype,
        personality: personality || "",
        background: background || "",
      });

      res.json({ imageUrl });
    } catch (error) {
      console.error("Error generating character image:", error);
      res.status(500).json({ message: "Failed to generate character image" });
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

  // Profile routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bio, profileImageUrl } = req.body;
      
      const updated = await storage.updateUserProfile(userId, { bio, profileImageUrl });
      res.json(updated);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/profile/badges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Community Gallery routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const items = await storage.getPublicGalleryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.get('/api/gallery/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getUserGalleryItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching user gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  app.get('/api/gallery/likes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  app.post('/api/gallery', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertGalleryItemSchema.parse({ ...req.body, userId });
      const item = await storage.createGalleryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error publishing to gallery:", error);
      res.status(400).json({ message: "Failed to publish to gallery" });
    }
  });

  app.delete('/api/gallery/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  app.post('/api/gallery/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.likeGalleryItem(userId, id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking gallery item:", error);
      res.status(500).json({ message: "Failed to like item" });
    }
  });

  app.delete('/api/gallery/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.unlikeGalleryItem(userId, id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking gallery item:", error);
      res.status(500).json({ message: "Failed to unlike item" });
    }
  });

  app.post('/api/gallery/:id/view', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementGalleryViews(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing views:", error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Narrative Projects (Dimensions) routes
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getAllNarrativeProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserNarrativeProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/contributions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contributions = await storage.getUserContributions(userId);
      res.json(contributions);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      res.status(500).json({ message: "Failed to fetch contributions" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNarrativeProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createNarrativeProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.post('/api/projects/:id/contribute', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectId = parseInt(req.params.id);
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid contribution amount" });
      }
      
      const project = await storage.contributeToProject(userId, projectId, amount);
      res.json(project);
    } catch (error: any) {
      console.error("Error contributing to project:", error);
      if (error.message === 'Insufficient credits') {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      res.status(500).json({ message: "Failed to contribute to project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
