import { Router, Request, Response } from "express";
import { eq, desc } from "drizzle-orm";
import { createHash } from "crypto";
import { db } from "./db";
import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  auctionListings,
  auctionBids,
  playerCurrency,
  currencyTransactions,
  bankAccounts,
  bankTransactions,
  empireValues,
  playerItems,
} from "@shared/schema";
import { storage } from "./storage";

// Augment express-session types
declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

export function registerRoutes(app: any) {
  // ==== AUTHENTICATION ====

  app.post("/api/auth/register", async (req: Request, res: any) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (existing.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hash = createHash("sha256")
        .update(password)
        .digest("hex");
      const [user] = await db
        .insert(users)
        .values({ username, passwordHash: hash })
        .returning();

      req.session.userId = user.id;
      res.json({ userId: user.id, username });
    } catch (error: any) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: any) => {
    try {
      const { username, password } = req.body;
      const hash = createHash("sha256")
        .update(password)
        .digest("hex");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (!user || user.passwordHash !== hash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ userId: user.id, username });
    } catch (error: any) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: any) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // ==== PLAYER STATE ====

  app.get("/api/player/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json(state || {});
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch player state" });
    }
  });

  // Backward-compatible game state routes used by the client game context.
  app.get("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json(state || {});
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  app.patch("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const updates = req.body || {};
      const updated = await storage.updatePlayerState(userId, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  // ==== PROGRESSION ====

  app.get("/api/progression/tier", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json({ tier: state?.tier || 1, tierExperience: state?.tierExperience || 0 });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tier" });
    }
  });

  app.post("/api/progression/tier/add-xp", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      const updated = await storage.addTierExperience(userId, amount || 0);
      res.json({ tier: updated.tier, tierExperience: updated.tierExperience });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add tier XP" });
    }
  });

  app.get("/api/progression/empire", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json({ empireLevel: state?.empireLevel || 1, empireExperience: state?.empireExperience || 0 });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch empire level" });
    }
  });

  app.post("/api/progression/empire/add-xp", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      const updated = await storage.addEmpireExperience(userId, amount || 0);
      res.json({ empireLevel: updated.empireLevel, empireExperience: updated.empireExperience });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add empire XP" });
    }
  });

  // ==== CURRENCY ====

  app.get("/api/currency/balance", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const currency = await storage.getPlayerCurrency(userId);
      res.json(currency);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch currency" });
    }
  });

  app.post("/api/currency/add", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { silver = 0, gold = 0, platinum = 0, reason = "unknown" } = req.body;
      const updated = await storage.addCurrency(userId, silver, gold, platinum, reason);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add currency" });
    }
  });

  app.get("/api/currency/transactions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const transactions = await db
        .select()
        .from(currencyTransactions)
        .where(eq(currencyTransactions.userId, userId))
        .orderBy(desc(currencyTransactions.createdAt))
        .limit(50);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ==== BANK ====

  app.get("/api/bank/account", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const account = await storage.getBankAccount(userId);
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch bank account" });
    }
  });

  app.post("/api/bank/deposit", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
      const updated = await storage.depositToBankAccount(userId, amount);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to deposit" });
    }
  });

  app.post("/api/bank/withdraw", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
      // Withdraw functionality to be implemented
      res.status(501).json({ message: "Withdraw functionality not implemented" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to withdraw" });
    }
  });

  app.get("/api/bank/transactions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const transactions = await db
        .select()
        .from(bankTransactions)
        .where(eq(bankTransactions.userId, userId))
        .orderBy(desc(bankTransactions.createdAt))
        .limit(50);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ==== EMPIRE VALUE ====

  app.get("/api/empire/value", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const value = await storage.calculateEmpireValue(userId);
      res.json(value);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to calculate empire value" });
    }
  });

  app.get("/api/empire/rankings", async (req: Request, res: any) => {
    try {
      const rankings = await storage.getEmpireRankings();
      res.json(rankings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  });

  // ==== INVENTORY ====

  app.get("/api/inventory", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const items = await db
        .select()
        .from(playerItems)
        .where(eq(playerItems.playerId, userId));
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // ==== FACILITIES ====

  app.get("/api/facilities/types", async (req: Request, res: any) => {
    const types = ["resource", "energy", "storage", "military", "research", "civilian", "special"];
    res.json({ types, totalFacilities: 120 });
  });

  // ==== COMBAT ====

  app.get("/api/combat/formations", async (req: Request, res: any) => {
    const formations = [
      { name: "Balanced", bonus: 1.0, offense: 1.0, defense: 1.0 },
      { name: "Aggressive", bonus: 1.5, offense: 1.4, defense: 0.8 },
      { name: "Defensive", bonus: 0.7, offense: 0.7, defense: 1.5 },
      { name: "Flanking", bonus: 1.8, offense: 1.8, defense: 0.6 },
      { name: "Pincer", bonus: 2.0, offense: 2.0, defense: 0.7 },
    ];
    res.json(formations);
  });

  // ==== KNOWLEDGE ====

  app.get("/api/knowledge/types", async (req: Request, res: any) => {
    const types = ["Military", "Engineering", "Science", "Agriculture", "Commerce", "Diplomacy", "Exploration", "Arcane", "Medicine", "Espionage"];
    res.json({ types, total: types.length });
  });

  app.get("/api/knowledge/progress/:type", isAuthenticated, async (req: Request, res: any) => {
    res.json({ type: req.params.type, level: 1, progress: 0, mastery: 0 });
  });
}

export default registerRoutes;
