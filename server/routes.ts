import { Express, Request, Response } from "express";
import passport from "passport";
import { eq, desc, and, gte, lte, or, asc } from "drizzle-orm";
import { db } from "./db/index";
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
  miningOperations,
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
import { storage } from "./storage";

function getUserId(req: Request) {
  const user = req.user as any;
  return user?.id || "";
}

function isAuthenticated(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function registerRoutes(app: Express) {
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
      const alliances = await storage.getAlliances();
      res.json(alliances);
    } catch (error: any) {
      console.error("Error fetching alliances:", error);
      res.status(500).json({ message: "Failed to fetch alliances" });
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

  app.get("/api/battles", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const battles = await storage.getBattles(userId);
      res.json(battles);
    } catch (error: any) {
      console.error("Error fetching battles:", error);
      res.status(500).json({ message: "Failed to fetch battles" });
    }
  });

  app.post("/api/battles", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const battle = await storage.createBattle({ ...req.body, attackerId: userId });
      res.json(battle);
    } catch (error: any) {
      console.error("Error creating battle:", error);
      res.status(500).json({ message: "Failed to create battle" });
    }
  });

  // ==== COLONY ROUTES ====

  app.get("/api/colonies", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const colonies = await storage.getColonies(userId);
      res.json(colonies);
    } catch (error: any) {
      console.error("Error fetching colonies:", error);
      res.status(500).json({ message: "Failed to fetch colonies" });
    }
  });

  app.post("/api/colonies", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const colony = await storage.createColony({ ...req.body, userId });
      res.json(colony);
    } catch (error: any) {
      console.error("Error creating colony:", error);
      res.status(500).json({ message: "Failed to create colony" });
    }
  });

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
        .where(eq(playerResearchProgress.playerId, userId));

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

  // Return the app for use in server setup
  return app;
}
