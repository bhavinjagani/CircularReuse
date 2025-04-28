import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isRepairHero: boolean("is_repair_hero").default(false),
  co2Saved: integer("co2_saved").default(0),
  itemsListed: integer("items_listed").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Item Categories enum
export const itemCategories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Kitchen",
  "Tools",
  "Sports",
  "Toys",
  "Books",
  "Automotive",
  "Other",
] as const;

// Item Conditions enum
export const itemConditions = ["Ready-to-Use", "Repairable", "Parts Only"] as const;

// Item model
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  imageUrl: text("image_url").notNull(),
  weight: integer("weight").default(0), // in grams
  co2Saved: integer("co2_saved").default(0),
  location: text("location").notNull(),
  distance: integer("distance").default(0), // in miles
  created: timestamp("created").defaultNow(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true, 
  created: true,
  co2Saved: true,
});

// Messages model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  itemId: integer("item_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  created: timestamp("created").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  created: true,
});

// Repair tips model
export const repairTips = pgTable("repair_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // Related to itemCategories
  difficulty: integer("difficulty").default(1), // 1-5 scale
  userId: integer("user_id").notNull(),
  views: integer("views").default(0),
  imageUrl: text("image_url").notNull(),
  created: timestamp("created").defaultNow(),
});

export const insertRepairTipSchema = createInsertSchema(repairTips).omit({
  id: true,
  views: true,
  created: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type RepairTip = typeof repairTips.$inferSelect;
export type InsertRepairTip = z.infer<typeof insertRepairTipSchema>;

// CO2 calculation constants for different categories (grams of CO2 saved per gram of product)
export const CO2_MULTIPLIERS: Record<string, number> = {
  Electronics: 3.5,
  Furniture: 2.0,
  Clothing: 1.2,
  Kitchen: 1.8,
  Tools: 2.2,
  Sports: 1.5,
  Toys: 1.3,
  Books: 0.8,
  Automotive: 3.0,
  Other: 1.0,
};

// Helper function to calculate CO2 savings
export function calculateCO2Saved(category: string, weight: number): number {
  const multiplier = CO2_MULTIPLIERS[category] || 1.0;
  return Math.floor(weight * multiplier);
}
