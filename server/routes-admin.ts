import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { adminUsers, users } from "../shared/schema";

type ModerationStatus = "active" | "muted" | "banned";

type ModerationMap = Record<string, ModerationStatus>;

type AuditEntry = {
  id: string;
  timestamp: number;
  actorId: string;
  action: string;
  targetUserId?: string;
  details?: string;
};

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

async function isAdminUser(userId: string): Promise<boolean> {
  if (!userId) return false;

  const [adminRecord] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);

  return Boolean(adminRecord);
}

function getModerationKey(): string {
  return "admin_user_moderation";
}

function getAuditKey(): string {
  return "admin_audit_log";
}

async function loadModerationMap(): Promise<ModerationMap> {
  const setting = await storage.getSetting(getModerationKey());
  if (!setting || !setting.value || typeof setting.value !== "object") {
    return {};
  }

  return setting.value as ModerationMap;
}

async function saveModerationMap(value: ModerationMap): Promise<void> {
  await storage.setSetting(
    getModerationKey(),
    value,
    "Per-user moderation status for admin panel",
    "admin"
  );
}

async function loadAuditLog(): Promise<AuditEntry[]> {
  const setting = await storage.getSetting(getAuditKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }
  return (setting.value as AuditEntry[]).slice(-200);
}

async function appendAudit(entry: Omit<AuditEntry, "id" | "timestamp">): Promise<void> {
  const audit = await loadAuditLog();
  const nextEntry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    ...entry,
  };

  await storage.setSetting(
    getAuditKey(),
    [...audit, nextEntry].slice(-200),
    "Admin panel audit trail",
    "admin"
  );
}

export function registerAdminRoutes(app: Express) {
  app.get("/api/admin/users", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const moderationMap = await loadModerationMap();

      const rows = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .orderBy(desc(users.updatedAt));

      const adminRows = await db
        .select({ userId: adminUsers.userId, role: adminUsers.role })
        .from(adminUsers);

      const roleMap = new Map(adminRows.map((row) => [row.userId, row.role]));

      const formatted = rows.map((row) => ({
        id: row.id,
        name: row.username || "Unknown",
        email: row.email || "",
        role: roleMap.has(row.id) ? roleMap.get(row.id) : "user",
        status: moderationMap[row.id] || "active",
        lastLogin: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
        ip: "n/a",
      }));

      res.json({ users: formatted });
    } catch (error) {
      console.error("Failed to load admin users:", error);
      res.status(500).json({ message: "Failed to load users" });
    }
  });

  app.post("/api/admin/users/:userId/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const nextStatus = String(req.body?.status || "").toLowerCase() as ModerationStatus;
      if (!["active", "muted", "banned"].includes(nextStatus)) {
        return res.status(400).json({ message: "Invalid moderation status" });
      }

      const moderationMap = await loadModerationMap();
      moderationMap[userId] = nextStatus;
      await saveModerationMap(moderationMap);

      await appendAudit({
        actorId,
        action: "set_user_status",
        targetUserId: userId,
        details: `status=${nextStatus}`,
      });

      res.json({ success: true, userId, status: nextStatus });
    } catch (error) {
      console.error("Failed to update moderation status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.get("/api/admin/audit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const logs = await loadAuditLog();
      res.json({ logs: logs.slice().reverse().slice(0, 100) });
    } catch (error) {
      console.error("Failed to load audit log:", error);
      res.status(500).json({ message: "Failed to load audit log" });
    }
  });

  app.get("/api/admin/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const moderationMap = await loadModerationMap();
      const usersRows = await db.select({ id: users.id }).from(users);
      const totalUsers = usersRows.length;
      const bannedUsers = Object.values(moderationMap).filter((status) => status === "banned").length;
      const mutedUsers = Object.values(moderationMap).filter((status) => status === "muted").length;

      res.json({
        totalUsers,
        bannedUsers,
        mutedUsers,
        activeUsersEstimate: Math.max(0, totalUsers - bannedUsers),
      });
    } catch (error) {
      console.error("Failed to load admin overview:", error);
      res.status(500).json({ message: "Failed to load admin overview" });
    }
  });
}
