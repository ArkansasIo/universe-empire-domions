import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "../shared/schema";

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

export function registerAllianceRoutes(app: Express) {
  app.get("/api/alliances", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const alliances = await storage.getAllAlliances();
      res.json(alliances);
    } catch (error) {
      console.error("Failed to load alliances:", error);
      res.status(500).json({ message: "Failed to load alliances" });
    }
  });

  app.get("/api/alliances/mine", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const membership = await storage.getUserAlliance(userId);

      if (!membership) {
        return res.json(null);
      }

      const members = await storage.getAllianceMembers(membership.alliance.id);
      const memberUsers = members.length
        ? await db.select({ id: users.id, username: users.username }).from(users)
        : [];

      const userMap = new Map(memberUsers.map((user) => [user.id, user.username || "Commander"]));

      res.json({
        ...membership.alliance,
        member: membership.member,
        members: members.map((member) => ({
          id: member.userId,
          name: userMap.get(member.userId) || "Commander",
          rank: member.rank,
          points: member.points,
          status: "online",
        })),
      });
    } catch (error) {
      console.error("Failed to load player alliance:", error);
      res.status(500).json({ message: "Failed to load player alliance" });
    }
  });

  app.post("/api/alliances", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const name = String(req.body?.name || "").trim();
      const tag = String(req.body?.tag || "").trim().toUpperCase();
      const description = String(req.body?.description || "A new alliance rises.").trim();

      if (name.length < 3 || tag.length < 2) {
        return res.status(400).json({ message: "Alliance name and tag are required" });
      }

      const existingMembership = await storage.getUserAlliance(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "Leave your current alliance first" });
      }

      const existingByTag = await storage.getAllianceByTag(tag);
      if (existingByTag) {
        return res.status(409).json({ message: "Alliance tag already exists" });
      }

      const alliance = await storage.createAlliance({
        name,
        tag,
        description,
        announcement: "Welcome to the alliance.",
        resources: { metal: 0, crystal: 0, deuterium: 0 },
      });

      await storage.addAllianceMember({
        allianceId: alliance.id,
        userId,
        rank: "leader",
        points: 0,
      });

      res.status(201).json(alliance);
    } catch (error) {
      console.error("Failed to create alliance:", error);
      res.status(500).json({ message: "Failed to create alliance" });
    }
  });

  app.post("/api/alliances/:id/join", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const allianceId = req.params.id;

      const existingMembership = await storage.getUserAlliance(userId);
      if (existingMembership) {
        return res.status(409).json({ message: "You are already in an alliance" });
      }

      const alliance = await storage.getAllianceById(allianceId);
      if (!alliance) {
        return res.status(404).json({ message: "Alliance not found" });
      }

      await storage.addAllianceMember({
        allianceId,
        userId,
        rank: "recruit",
        points: 0,
      });

      res.json({ joined: true, allianceId });
    } catch (error) {
      console.error("Failed to join alliance:", error);
      res.status(500).json({ message: "Failed to join alliance" });
    }
  });

  app.post("/api/alliances/:id/leave", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const allianceId = req.params.id;

      const membership = await storage.getUserAlliance(userId);
      if (!membership || membership.alliance.id !== allianceId) {
        return res.status(404).json({ message: "Alliance membership not found" });
      }

      await storage.removeAllianceMember(allianceId, userId);
      res.json({ left: true });
    } catch (error) {
      console.error("Failed to leave alliance:", error);
      res.status(500).json({ message: "Failed to leave alliance" });
    }
  });

  app.get("/api/alliances/:id/members", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allianceId = req.params.id;
      const members = await storage.getAllianceMembers(allianceId);
      res.json(members);
    } catch (error) {
      console.error("Failed to load alliance members:", error);
      res.status(500).json({ message: "Failed to load alliance members" });
    }
  });
}
