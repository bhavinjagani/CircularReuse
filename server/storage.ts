import { 
  users, type User, type InsertUser,
  items, type Item, type InsertItem,
  messages, type Message, type InsertMessage,
  repairTips, type RepairTip, type InsertRepairTip,
  calculateCO2Saved
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Items
  getItem(id: number): Promise<Item | undefined>;
  getItems(filters?: ItemFilters): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(userId: number): Promise<Message[]>;
  getConversation(user1Id: number, user2Id: number, itemId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Repair Tips
  getRepairTip(id: number): Promise<RepairTip | undefined>;
  getRepairTips(category?: string): Promise<RepairTip[]>;
  createRepairTip(tip: InsertRepairTip): Promise<RepairTip>;
  updateRepairTipViews(id: number): Promise<RepairTip | undefined>;
  
  // Stats
  getTotalCO2Saved(): Promise<number>;
  getTotalActiveListings(): Promise<number>;
  getTotalRepairHeroes(): Promise<number>;
}

// Filters for item queries
export interface ItemFilters {
  category?: string[];
  condition?: string[];
  priceMin?: number;
  priceMax?: number;
  distance?: number;
  search?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, Item>;
  private messages: Map<number, Message>;
  private repairTips: Map<number, RepairTip>;
  private currentUserId: number;
  private currentItemId: number;
  private currentMessageId: number;
  private currentRepairTipId: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.messages = new Map();
    this.repairTips = new Map();
    this.currentUserId = 1;
    this.currentItemId = 1;
    this.currentMessageId = 1;
    this.currentRepairTipId = 1;
    
    // Add some initial users
    this.seedData();
  }
  
  // USERS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isRepairHero: false, 
      co2Saved: 0, 
      itemsListed: 0 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // ITEMS
  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }
  
  async getItems(filters?: ItemFilters): Promise<Item[]> {
    let allItems = Array.from(this.items.values());
    
    if (!filters) return allItems;
    
    // Apply filters
    if (filters.category && filters.category.length > 0) {
      allItems = allItems.filter(item => filters.category!.includes(item.category));
    }
    
    if (filters.condition && filters.condition.length > 0) {
      allItems = allItems.filter(item => filters.condition!.includes(item.condition));
    }
    
    if (filters.priceMin !== undefined) {
      allItems = allItems.filter(item => item.price >= filters.priceMin!);
    }
    
    if (filters.priceMax !== undefined) {
      allItems = allItems.filter(item => item.price <= filters.priceMax!);
    }
    
    if (filters.distance !== undefined) {
      allItems = allItems.filter(item => item.distance <= filters.distance!);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allItems = allItems.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    return allItems;
  }
  
  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.currentItemId++;
    const now = new Date();
    
    // Calculate CO2 saved based on category and weight
    const co2Saved = calculateCO2Saved(insertItem.category, insertItem.weight || 0);
    
    const item: Item = {
      ...insertItem,
      id,
      co2Saved,
      created: now,
    };
    
    this.items.set(id, item);
    
    // Update user stats
    const user = await this.getUser(item.userId);
    if (user) {
      await this.updateUser(user.id, {
        itemsListed: user.itemsListed + 1,
        co2Saved: user.co2Saved + co2Saved
      });
    }
    
    return item;
  }
  
  async updateItem(id: number, itemData: Partial<Item>): Promise<Item | undefined> {
    const item = await this.getItem(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemData };
    this.items.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id);
  }
  
  // MESSAGES
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      message => message.senderId === userId || message.receiverId === userId
    );
  }
  
  async getConversation(user1Id: number, user2Id: number, itemId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => 
        ((message.senderId === user1Id && message.receiverId === user2Id) ||
         (message.senderId === user2Id && message.receiverId === user1Id)) &&
        message.itemId === itemId
      )
      .sort((a, b) => a.created.getTime() - b.created.getTime());
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    
    const message: Message = {
      ...insertMessage,
      id,
      created: now,
      read: false,
    };
    
    this.messages.set(id, message);
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<boolean> {
    const message = await this.getMessage(id);
    if (!message) return false;
    
    message.read = true;
    this.messages.set(id, message);
    return true;
  }
  
  // REPAIR TIPS
  async getRepairTip(id: number): Promise<RepairTip | undefined> {
    return this.repairTips.get(id);
  }
  
  async getRepairTips(category?: string): Promise<RepairTip[]> {
    let tips = Array.from(this.repairTips.values());
    
    if (category) {
      tips = tips.filter(tip => tip.category === category);
    }
    
    return tips;
  }
  
  async createRepairTip(insertTip: InsertRepairTip): Promise<RepairTip> {
    const id = this.currentRepairTipId++;
    const now = new Date();
    
    const tip: RepairTip = {
      ...insertTip,
      id,
      views: 0,
      created: now,
    };
    
    this.repairTips.set(id, tip);
    return tip;
  }
  
  async updateRepairTipViews(id: number): Promise<RepairTip | undefined> {
    const tip = await this.getRepairTip(id);
    if (!tip) return undefined;
    
    tip.views += 1;
    this.repairTips.set(id, tip);
    return tip;
  }
  
  // STATS
  async getTotalCO2Saved(): Promise<number> {
    return Array.from(this.users.values()).reduce(
      (total, user) => total + user.co2Saved, 0
    );
  }
  
  async getTotalActiveListings(): Promise<number> {
    return this.items.size;
  }
  
  async getTotalRepairHeroes(): Promise<number> {
    return Array.from(this.users.values()).filter(
      user => user.isRepairHero
    ).length;
  }
  
  // SEED DATA
  private seedData() {
    // Create demo users
    const user1 = this.createUser({ username: "sarah_k", password: "pass123" });
    const user2 = this.createUser({ username: "miguel_r", password: "pass123" });
    const user3 = this.createUser({ username: "tom_w", password: "pass123" });
    
    // Make some repair heroes
    Promise.all([user1, user3]).then(users => {
      users.forEach(user => {
        this.updateUser(user.id, { isRepairHero: true });
      });
    });
  }
}

export const storage = new MemStorage();
