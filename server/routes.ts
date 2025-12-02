import type { Express, Request, Response, NextFunction } from "express";
import { eq, desc, and, gte, lte, or, asc } from "drizzle-orm";
import { db } from "./db/index";
import { storage } from "./storage";
import { isAuthenticated } from "./basicAuth";
import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  queueItems,
  playerColonies,
  resourceFields,
  equipmentDurability,
  fleetDurability,
  buildingDurability,
  battles,
  battleLogs,
  researchAreas,
  researchSubcategories,
  researchTechnologies,
  playerResearchProgress,
  expeditions,
  expeditionTeams,
  expeditionEncounters,
} from "@shared/schema";

function getUserId(req: Request) {
  return (req.session as any)?.userId || "";
}

export function registerRoutes(app: Express) {
  // ==== GAME STATE ROUTES (aliases for player state) ====
  
  app.get("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      res.json(playerState || { resources: { metal: 1000, crystal: 500, deuterium: 0, energy: 0 }, lastUpdated: new Date() });
    } catch (error: any) {
      console.error("Error fetching game state:", error);
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  app.patch("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      // Check if player state exists, create if not
      let playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        playerState = await storage.createPlayerState({ userId, resources: updates.resources || {}, ...updates });
        return res.json(playerState);
      }
      
      const updatedState = await storage.updatePlayerState(userId, updates);
      res.json(updatedState);
    } catch (error: any) {
      console.error("Error updating game state:", error);
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  // ==== PLAYER STATE ROUTES ====

  app.get("/api/player/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      res.json(playerState || { resources: {}, lastUpdated: new Date() });
    } catch (error: any) {
      console.error("Error fetching player state:", error);
      res.status(500).json({ message: "Failed to fetch player state" });
    }
  });

  app.put("/api/player/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      const updatedState = await storage.updatePlayerState(userId, updates);
      res.json(updatedState);
    } catch (error: any) {
      console.error("Error updating player state:", error);
      res.status(500).json({ message: "Failed to update player state" });
    }
  });

  // ==== MISSION ROUTES ====

  app.get("/api/missions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const missions = await storage.getMissionsByUser(userId);
      res.json(missions);
    } catch (error: any) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get("/api/missions/active", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const missions = await storage.getMissionsByUser(userId);
      const activeMissions = missions.filter((m: any) => m.status === 'active' || m.status === 'in_progress');
      res.json(activeMissions);
    } catch (error: any) {
      console.error("Error fetching active missions:", error);
      res.status(500).json({ message: "Failed to fetch active missions" });
    }
  });

  app.post("/api/missions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const mission = await storage.createMission({ ...req.body, userId });
      res.json(mission);
    } catch (error: any) {
      console.error("Error creating mission:", error);
      res.status(500).json({ message: "Failed to create mission" });
    }
  });

  // ==== MESSAGE ROUTES ====

  app.get("/api/messages", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getMessagesByUser(userId, limit);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages/:id/read", isAuthenticated, async (req: Request, res: any) => {
    try {
      const { id } = req.params;
      await storage.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // ==== ALLIANCE ROUTES ====

  app.get("/api/alliances", async (req: Request, res: any) => {
    try {
      const alliances = await storage.getAllAlliances();
      res.json(alliances);
    } catch (error: any) {
      console.error("Error fetching alliances:", error);
      res.status(500).json({ message: "Failed to fetch alliances" });
    }
  });

  app.get("/api/alliances/mine", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const allAlliances = await storage.getAllAlliances();
      const myAlliance = allAlliances.find((a: any) => a.leaderId === userId);
      res.json(myAlliance || null);
    } catch (error: any) {
      console.error("Error fetching user alliance:", error);
      res.status(500).json({ message: "Failed to fetch user alliance" });
    }
  });

  app.post("/api/alliances", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const alliance = await storage.createAlliance({ ...req.body, leaderId: userId });
      res.json(alliance);
    } catch (error: any) {
      console.error("Error creating alliance:", error);
      res.status(500).json({ message: "Failed to create alliance" });
    }
  });

  // ==== BATTLE ROUTES ====
  // Battles are stored in memory in gameContext for now

  // ==== COLONY ROUTES ====
  // Colonies are stored in memory in gameContext for now

  // ==== DURABILITY ROUTES ====

  app.get("/api/durability/equipment/:equipmentId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { equipmentId } = req.params;
      const durability = await storage.getEquipmentDurability(userId, equipmentId);
      res.json(durability || { message: "Equipment not found" });
    } catch (error) {
      console.error("Error fetching equipment durability:", error);
      res.status(500).json({ message: "Failed to fetch equipment durability" });
    }
  });

  app.get("/api/durability/fleet/:fleetId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { fleetId } = req.params;
      const durability = await storage.getFleetDurability(userId, fleetId);
      res.json(durability || { message: "Fleet not found" });
    } catch (error) {
      console.error("Error fetching fleet durability:", error);
      res.status(500).json({ message: "Failed to fetch fleet durability" });
    }
  });

  app.get("/api/durability/building/:buildingId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { buildingId } = req.params;
      const durability = await storage.getBuildingDurability(userId, buildingId);
      res.json(durability || { message: "Building not found" });
    } catch (error) {
      console.error("Error fetching building durability:", error);
      res.status(500).json({ message: "Failed to fetch building durability" });
    }
  });

  // ==== LOGGING ROUTES ====

  app.get("/api/logs", isAuthenticated, async (req: any, res) => {
    try {
      const { logger } = await import("./logger");
      const level = req.query.level as string | undefined;
      const category = req.query.category as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;

      const logs = logger.getLogs(level as any, category as any, limit);
      const stats = logger.getStats();

      res.json({ logs, stats });
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // ==== RESEARCH TECHNOLOGY TREE ROUTES ====

  app.get("/api/research/areas", async (req: Request, res: any) => {
    try {
      const areas = await db.select().from(researchAreas);
      res.json(areas);
    } catch (error: any) {
      console.error("Error fetching research areas:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/research/subcategories", async (req: Request, res: any) => {
    try {
      const { areaId } = req.query;
      const subs = await db
        .select()
        .from(researchSubcategories)
        .where(eq(researchSubcategories.areaId, areaId as string));
      res.json(subs);
    } catch (error: any) {
      console.error("Error fetching research subcategories:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/research/technologies", async (req: Request, res: any) => {
    try {
      const { subcategoryIds } = req.query;
      const ids = (subcategoryIds as string).split(",");
      const techs = await db
        .select()
        .from(researchTechnologies)
        .where(eq(researchTechnologies.subcategoryId, ids[0]));
      res.json(techs);
    } catch (error: any) {
      console.error("Error fetching research technologies:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/research/progress", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const progress = await db
        .select()
        .from(playerResearchProgress)
        .where(eq(playerResearchProgress.userId, userId));

      const progressMap = Object.fromEntries(
        progress.map((p: any) => [p.technologyId, { status: p.status, progress: p.progress, startedAt: p.startedAt, completedAt: p.completedAt }])
      );
      res.json(progressMap);
    } catch (error: any) {
      console.error("Error fetching research progress:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==== EXPEDITION ROUTES ====

  app.get("/api/expeditions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const exps = await storage.getExpeditions(userId);
      res.json(exps);
    } catch (error: any) {
      console.error("Error fetching expeditions:", error);
      res.status(500).json({ message: "Failed to fetch expeditions" });
    }
  });

  app.post("/api/expeditions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { name, type, targetCoordinates, fleetComposition, troopComposition } = req.body;
      const expedition = await storage.createExpedition(userId, name, type, targetCoordinates, fleetComposition, troopComposition);
      res.json(expedition);
    } catch (error: any) {
      console.error("Error creating expedition:", error);
      res.status(500).json({ message: "Failed to create expedition" });
    }
  });

  app.get("/api/expeditions/:id/team", isAuthenticated, async (req: Request, res: any) => {
    try {
      const { id } = req.params;
      const team = await storage.getExpeditionTeams(id);
      res.json(team);
    } catch (error: any) {
      console.error("Error fetching expedition team:", error);
      res.status(500).json({ message: "Failed to fetch expedition team" });
    }
  });

  app.post("/api/expeditions/:id/team", isAuthenticated, async (req: Request, res: any) => {
    try {
      const { id } = req.params;
      const { unitId, role } = req.body;
      const member = await storage.addTeamMember(id, unitId, role);
      res.json(member);
    } catch (error: any) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Failed to add team member" });
    }
  });

  app.get("/api/expeditions/:id/encounters", isAuthenticated, async (req: Request, res: any) => {
    try {
      const { id } = req.params;
      const encounters = await storage.getExpeditionEncounters(id);
      res.json(encounters);
    } catch (error: any) {
      console.error("Error fetching encounters:", error);
      res.status(500).json({ message: "Failed to fetch encounters" });
    }
  });

  // ==== TURN SYSTEM ROUTES ====

  app.get("/api/turns", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const turnData = await storage.accrueAndGetTurns(userId);
      res.json({
        currentTurns: turnData.currentTurns,
        totalTurns: turnData.totalTurns,
        turnsAccrued: turnData.turnsAccrued,
        lastTurnUpdate: turnData.lastTurnUpdate,
        ratePerMinute: 6,
        maxTurns: 1000
      });
    } catch (error: any) {
      console.error("Error fetching turns:", error);
      res.status(500).json({ message: "Failed to fetch turns" });
    }
  });

  app.post("/api/turns/spend", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Invalid turn amount" });
      }
      
      const result = await storage.spendTurns(userId, amount);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Insufficient turns",
          currentTurns: result.currentTurns,
          totalTurns: result.totalTurns
        });
      }
      
      res.json({
        success: true,
        currentTurns: result.currentTurns,
        totalTurns: result.totalTurns,
        spent: amount
      });
    } catch (error: any) {
      console.error("Error spending turns:", error);
      res.status(500).json({ message: "Failed to spend turns" });
    }
  });

  // ==== AUCTION HOUSE ROUTES ====

  // Get active auctions with optional filters
  app.get("/api/auctions", async (req: Request, res: any) => {
    try {
      const { itemType, search, sortBy } = req.query;
      const auctions = await storage.getActiveAuctions({
        itemType: itemType as string,
        search: search as string,
        sortBy: sortBy as string
      });
      res.json(auctions);
    } catch (error: any) {
      console.error("Error fetching auctions:", error);
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });

  // Get single auction by ID
  app.get("/api/auctions/:id", async (req: Request, res: any) => {
    try {
      const auction = await storage.getAuctionById(req.params.id);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      res.json(auction);
    } catch (error: any) {
      console.error("Error fetching auction:", error);
      res.status(500).json({ message: "Failed to fetch auction" });
    }
  });

  // Get user's own auctions
  app.get("/api/auctions/user/listings", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const auctions = await storage.getUserAuctions(userId);
      res.json(auctions);
    } catch (error: any) {
      console.error("Error fetching user auctions:", error);
      res.status(500).json({ message: "Failed to fetch user auctions" });
    }
  });

  // Get auctions user has bid on
  app.get("/api/auctions/user/bids", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const auctions = await storage.getUserBids(userId);
      res.json(auctions);
    } catch (error: any) {
      console.error("Error fetching user bids:", error);
      res.status(500).json({ message: "Failed to fetch user bids" });
    }
  });

  // Get bid history for an auction
  app.get("/api/auctions/:id/bids", async (req: Request, res: any) => {
    try {
      const bids = await storage.getAuctionBidHistory(req.params.id);
      res.json(bids);
    } catch (error: any) {
      console.error("Error fetching auction bids:", error);
      res.status(500).json({ message: "Failed to fetch auction bids" });
    }
  });

  // Create new auction
  app.post("/api/auctions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const { itemType, itemId, itemName, itemDescription, itemRarity, itemData, quantity, startingPrice, buyoutPrice, bidIncrement, duration } = req.body;
      
      if (!itemType || !itemId || !itemName || !startingPrice) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const durationHours = duration || 24;
      const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
      
      const auction = await storage.createAuction({
        sellerId: userId,
        sellerName: user.username,
        itemType,
        itemId,
        itemName,
        itemDescription,
        itemRarity: itemRarity || "common",
        itemData,
        quantity: quantity || 1,
        startingPrice,
        buyoutPrice,
        bidIncrement: bidIncrement || 10,
        duration: durationHours,
        expiresAt
      });
      
      res.status(201).json(auction);
    } catch (error: any) {
      console.error("Error creating auction:", error);
      res.status(500).json({ message: "Failed to create auction" });
    }
  });

  // Place a bid
  app.post("/api/auctions/:id/bid", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const { bidAmount } = req.body;
      
      if (typeof bidAmount !== 'number' || bidAmount <= 0) {
        return res.status(400).json({ message: "Invalid bid amount" });
      }
      
      const result = await storage.placeBid(req.params.id, userId, user.username, bidAmount);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json(result.auction);
    } catch (error: any) {
      console.error("Error placing bid:", error);
      res.status(500).json({ message: "Failed to place bid" });
    }
  });

  // Buyout an auction
  app.post("/api/auctions/:id/buyout", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const result = await storage.buyoutAuction(req.params.id, userId, user.username);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json(result.auction);
    } catch (error: any) {
      console.error("Error buying out auction:", error);
      res.status(500).json({ message: "Failed to buyout auction" });
    }
  });

  // Cancel an auction
  app.delete("/api/auctions/:id", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const result = await storage.cancelAuction(req.params.id, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json({ message: "Auction cancelled" });
    } catch (error: any) {
      console.error("Error cancelling auction:", error);
      res.status(500).json({ message: "Failed to cancel auction" });
    }
  });

  // ==== PLAYER TRADE ROUTES (Mail-Integrated) ====

  // Get all trade offers (incoming and outgoing)
  app.get("/api/trades", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const trades = await storage.getTradeOffers(userId);
      res.json(trades);
    } catch (error: any) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });

  // Get incoming trade offers
  app.get("/api/trades/incoming", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const trades = await storage.getIncomingTradeOffers(userId);
      res.json(trades);
    } catch (error: any) {
      console.error("Error fetching incoming trades:", error);
      res.status(500).json({ message: "Failed to fetch incoming trades" });
    }
  });

  // Get outgoing trade offers
  app.get("/api/trades/outgoing", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const trades = await storage.getOutgoingTradeOffers(userId);
      res.json(trades);
    } catch (error: any) {
      console.error("Error fetching outgoing trades:", error);
      res.status(500).json({ message: "Failed to fetch outgoing trades" });
    }
  });

  // Get trade history
  app.get("/api/trades/history", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const history = await storage.getTradeHistory(userId);
      res.json(history);
    } catch (error: any) {
      console.error("Error fetching trade history:", error);
      res.status(500).json({ message: "Failed to fetch trade history" });
    }
  });

  // Get specific trade offer
  app.get("/api/trades/:id", isAuthenticated, async (req: Request, res: any) => {
    try {
      const trade = await storage.getTradeOfferById(req.params.id);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error: any) {
      console.error("Error fetching trade:", error);
      res.status(500).json({ message: "Failed to fetch trade" });
    }
  });

  // Create a new trade offer
  app.post("/api/trades", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Find receiver by username
      const receiver = await storage.getUserByUsername(req.body.receiverName);
      if (!receiver) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      if (receiver.id === userId) {
        return res.status(400).json({ message: "You cannot trade with yourself" });
      }
      
      const tradeOffer = {
        senderId: userId,
        senderName: user.username || "Unknown",
        receiverId: receiver.id,
        receiverName: receiver.username || "Unknown",
        offerMetal: req.body.offerMetal || 0,
        offerCrystal: req.body.offerCrystal || 0,
        offerDeuterium: req.body.offerDeuterium || 0,
        offerItems: req.body.offerItems || [],
        requestMetal: req.body.requestMetal || 0,
        requestCrystal: req.body.requestCrystal || 0,
        requestDeuterium: req.body.requestDeuterium || 0,
        requestItems: req.body.requestItems || [],
        message: req.body.message
      };
      
      const trade = await storage.createTradeOffer(tradeOffer);
      res.status(201).json(trade);
    } catch (error: any) {
      console.error("Error creating trade offer:", error);
      res.status(500).json({ message: "Failed to create trade offer" });
    }
  });

  // Accept a trade offer
  app.post("/api/trades/:id/accept", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const result = await storage.acceptTradeOffer(req.params.id, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json(result.trade);
    } catch (error: any) {
      console.error("Error accepting trade:", error);
      res.status(500).json({ message: "Failed to accept trade" });
    }
  });

  // Decline a trade offer
  app.post("/api/trades/:id/decline", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const result = await storage.declineTradeOffer(req.params.id, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json({ message: "Trade declined" });
    } catch (error: any) {
      console.error("Error declining trade:", error);
      res.status(500).json({ message: "Failed to decline trade" });
    }
  });

  // Cancel a trade offer
  app.delete("/api/trades/:id", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const result = await storage.cancelTradeOffer(req.params.id, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json({ message: "Trade cancelled" });
    } catch (error: any) {
      console.error("Error cancelling trade:", error);
      res.status(500).json({ message: "Failed to cancel trade" });
    }
  });

  // Create counter offer
  app.post("/api/trades/:id/counter", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const originalTrade = await storage.getTradeOfferById(req.params.id);
      if (!originalTrade) {
        return res.status(404).json({ message: "Original trade not found" });
      }
      
      const counterOffer = {
        senderId: userId,
        senderName: user.username || "Unknown",
        receiverId: originalTrade.senderId,
        receiverName: originalTrade.senderName,
        offerMetal: req.body.offerMetal || 0,
        offerCrystal: req.body.offerCrystal || 0,
        offerDeuterium: req.body.offerDeuterium || 0,
        offerItems: req.body.offerItems || [],
        requestMetal: req.body.requestMetal || 0,
        requestCrystal: req.body.requestCrystal || 0,
        requestDeuterium: req.body.requestDeuterium || 0,
        requestItems: req.body.requestItems || [],
        message: req.body.message
      };
      
      const result = await storage.counterTradeOffer(req.params.id, counterOffer);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.status(201).json(result.trade);
    } catch (error: any) {
      console.error("Error creating counter offer:", error);
      res.status(500).json({ message: "Failed to create counter offer" });
    }
  });
}
