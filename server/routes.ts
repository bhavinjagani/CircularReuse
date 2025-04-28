import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, type ItemFilters } from "./storage";
import { 
  insertUserSchema, 
  insertItemSchema, 
  insertMessageSchema, 
  insertRepairTipSchema,
  calculateCO2Saved
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // USERS
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });
  
  // ITEMS
  app.get("/api/items", async (req: Request, res: Response) => {
    try {
      const filters: ItemFilters = {};
      
      // Parse filters from query parameters
      if (req.query.category) {
        filters.category = Array.isArray(req.query.category) 
          ? req.query.category as string[]
          : [req.query.category as string];
      }
      
      if (req.query.condition) {
        filters.condition = Array.isArray(req.query.condition)
          ? req.query.condition as string[]
          : [req.query.condition as string];
      }
      
      if (req.query.priceMin) {
        filters.priceMin = parseInt(req.query.priceMin as string);
      }
      
      if (req.query.priceMax) {
        filters.priceMax = parseInt(req.query.priceMax as string);
      }
      
      if (req.query.distance) {
        filters.distance = parseInt(req.query.distance as string);
      }
      
      if (req.query.search) {
        filters.search = req.query.search as string;
      }
      
      const items = await storage.getItems(filters);
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch items" });
    }
  });
  
  app.get("/api/items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    
    const item = await storage.getItem(itemId);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    return res.json(item);
  });
  
  app.post("/api/items", async (req: Request, res: Response) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      
      // Calculate CO2 saved
      if (itemData.weight) {
        const co2Saved = calculateCO2Saved(itemData.category, itemData.weight);
        // Note: We don't set co2Saved here, it's calculated in storage.createItem
      }
      
      const item = await storage.createItem(itemData);
      return res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid item data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create item" });
    }
  });
  
  app.put("/api/items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    
    try {
      const updatedItem = await storage.updateItem(itemId, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      return res.json(updatedItem);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update item" });
    }
  });
  
  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    
    const success = await storage.deleteItem(itemId);
    
    if (!success) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    return res.status(204).end();
  });
  
  // MESSAGES
  app.get("/api/messages/user/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const messages = await storage.getMessages(userId);
    return res.json(messages);
  });
  
  app.get("/api/messages/conversation", async (req: Request, res: Response) => {
    const user1Id = parseInt(req.query.user1 as string);
    const user2Id = parseInt(req.query.user2 as string);
    const itemId = parseInt(req.query.item as string);
    
    if (isNaN(user1Id) || isNaN(user2Id) || isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid user or item IDs" });
    }
    
    const messages = await storage.getConversation(user1Id, user2Id, itemId);
    return res.json(messages);
  });
  
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create message" });
    }
  });
  
  app.put("/api/messages/:id/read", async (req: Request, res: Response) => {
    const messageId = parseInt(req.params.id);
    
    if (isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    
    const success = await storage.markMessageAsRead(messageId);
    
    if (!success) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    return res.status(204).end();
  });
  
  // REPAIR TIPS
  app.get("/api/repair-tips", async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const tips = await storage.getRepairTips(category);
    return res.json(tips);
  });
  
  app.get("/api/repair-tips/:id", async (req: Request, res: Response) => {
    const tipId = parseInt(req.params.id);
    
    if (isNaN(tipId)) {
      return res.status(400).json({ message: "Invalid tip ID" });
    }
    
    const tip = await storage.getRepairTip(tipId);
    
    if (!tip) {
      return res.status(404).json({ message: "Repair tip not found" });
    }
    
    // Increment views
    await storage.updateRepairTipViews(tipId);
    
    return res.json(tip);
  });
  
  app.post("/api/repair-tips", async (req: Request, res: Response) => {
    try {
      const tipData = insertRepairTipSchema.parse(req.body);
      const tip = await storage.createRepairTip(tipData);
      return res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid repair tip data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create repair tip" });
    }
  });
  
  // STATS
  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const [co2Saved, activeListings, repairHeroes] = await Promise.all([
        storage.getTotalCO2Saved(),
        storage.getTotalActiveListings(),
        storage.getTotalRepairHeroes()
      ]);
      
      return res.json({
        co2Saved,
        activeListings,
        repairHeroes
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
