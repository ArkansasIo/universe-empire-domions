import type { Express, Request } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./basicAuth";

function getUserId(req: Request) {
  return (req.session as any)?.userId || "";
}

export function registerSettingsRoutes(app: Express) {
  // Get all system settings
  app.get("/api/settings", isAuthenticated, async (req: Request, res: any) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get specific setting
  app.get("/api/settings/:key", isAuthenticated, async (req: Request, res: any) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // Update setting (admin only)
  app.post("/api/settings/:key", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if user is admin (basic check - you might want to add proper admin role checking)
      if (user.username !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { value, description, category } = req.body;
      const setting = await storage.setSetting(req.params.key, value, description, category);
      res.json(setting);
    } catch (error: any) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Seed default settings (admin only, run once on startup)
  app.post("/api/settings/seed/defaults", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user || user.username !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.seedDefaultSettings();
      res.json({ message: "Default settings seeded successfully" });
    } catch (error: any) {
      console.error("Error seeding settings:", error);
      res.status(500).json({ message: "Failed to seed settings" });
    }
  });
}
