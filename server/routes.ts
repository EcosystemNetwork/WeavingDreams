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

  const httpServer = createServer(app);
  return httpServer;
}
