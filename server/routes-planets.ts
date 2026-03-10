import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

// Sample planet database (in production, this would be in a database)
const PLANET_DATABASE: {[key: string]: any} = {
  "P001": {
    id: "P001",
    name: "Kepler-452b",
    type: "temperate",
    size: "large",
    class: "M",
    coordinates: "1:1:1",
    temperature: 288,
    habitability: 95,
    resources: { metal: 50000, crystal: 30000, deuterium: 20000 },
    colonized: false,
    waterPercentage: 65,
  },
  "P002": {
    id: "P002",
    name: "Mars Prime",
    type: "desert",
    size: "medium",
    class: "D",
    coordinates: "1:1:2",
    temperature: 210,
    habitability: 45,
    resources: { metal: 100000, crystal: 50000, deuterium: 0 },
    colonized: true,
    waterPercentage: 5,
    owner: "Player",
    population: 50000,
    defenses: 250,
    buildings: {
      metalMine: 3,
      crystalMine: 2,
      deuteriumSynthesizer: 1,
      solarPlant: 4,
      roboticsFactory: 2,
    },
  },
  // Add more default planets
  "1": {
    id: "1",
    name: "Homeworld",
    type: "temperate",
    size: "large",
    class: "M",
    coordinates: "1:1:100:3",
    temperature: 295,
    habitability: 98,
    resources: { metal: 80000, crystal: 50000, deuterium: 30000 },
    colonized: true,
    waterPercentage: 70,
    owner: "Player",
    population: 120000,
    defenses: 500,
    buildings: {
      metalMine: 5,
      crystalMine: 4,
      deuteriumSynthesizer: 3,
      solarPlant: 6,
      roboticsFactory: 4,
    },
  },
  "2": {
    id: "2",
    name: "Luna Station",
    type: "barren",
    size: "small",
    class: "R",
    coordinates: "1:1:100:4",
    temperature: 150,
    habitability: 20,
    resources: { metal: 120000, crystal: 80000, deuterium: 5000 },
    colonized: true,
    waterPercentage: 0,
    owner: "Player",
    population: 15000,
    defenses: 150,
    buildings: {
      metalMine: 6,
      crystalMine: 5,
      deuteriumSynthesizer: 1,
      solarPlant: 3,
      roboticsFactory: 2,
    },
  },
};

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function registerPlanetRoutes(app: Express) {
  // Get planet by ID
  app.get("/api/planets/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      // If planet is colonized, check if it belongs to the player
      if (planet.colonized && req.session?.userId) {
        const playerState = await db.query.playerStates.findFirst({
          where: eq(playerStates.userId, req.session.userId),
        });

        if (playerState) {
          planet.owner = playerState.planetName || "Player";
        }
      }

      res.json(planet);
    } catch (error) {
      console.error("Error fetching planet:", error);
      res.status(500).json({ error: "Failed to fetch planet data" });
    }
  });

  // Colonize a planet
  app.post("/api/planets/:id/colonize", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (planet.colonized) {
        return res.status(400).json({ error: "Planet is already colonized" });
      }

      // Check if player has enough resources (simplified - in production, check actual resources)
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const colonizationCost = {
        metal: 10000,
        crystal: 5000,
        deuterium: 2000,
      };

      if (
        resources.metal < colonizationCost.metal ||
        resources.crystal < colonizationCost.crystal ||
        resources.deuterium < colonizationCost.deuterium
      ) {
        return res.status(400).json({ 
          error: "Insufficient resources for colonization",
          required: colonizationCost,
          available: resources,
        });
      }

      // Deduct resources and colonize planet
      const newResources = {
        ...resources,
        metal: resources.metal - colonizationCost.metal,
        crystal: resources.crystal - colonizationCost.crystal,
        deuterium: resources.deuterium - colonizationCost.deuterium,
      };

      await db.update(playerStates)
        .set({ 
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Update planet data
      planet.colonized = true;
      planet.owner = playerState.planetName || "Player";
      planet.population = 5000;
      planet.defenses = 50;
      planet.buildings = {
        metalMine: 1,
        crystalMine: 1,
        deuteriumSynthesizer: 0,
        solarPlant: 1,
        roboticsFactory: 0,
      };

      res.json({ 
        message: "Planet colonized successfully",
        planet,
        newResources,
      });
    } catch (error) {
      console.error("Error colonizing planet:", error);
      res.status(500).json({ error: "Failed to colonize planet" });
    }
  });

  // Build/upgrade structure on planet
  app.post("/api/planets/:id/build", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const { buildingType } = req.body;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be colonized first" });
      }

      if (!buildingType) {
        return res.status(400).json({ error: "Building type is required" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const currentLevel = planet.buildings[buildingType] || 0;
      const nextLevel = currentLevel + 1;

      // Calculate building cost (increases with level)
      const baseCosts: {[key: string]: any} = {
        metalMine: { metal: 60, crystal: 15, deuterium: 0 },
        crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
        deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
        solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
        roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
      };

      const baseCost = baseCosts[buildingType];
      if (!baseCost) {
        return res.status(400).json({ error: "Invalid building type" });
      }

      // Cost increases exponentially with level
      const cost = {
        metal: Math.floor(baseCost.metal * Math.pow(1.5, currentLevel)),
        crystal: Math.floor(baseCost.crystal * Math.pow(1.5, currentLevel)),
        deuterium: Math.floor(baseCost.deuterium * Math.pow(1.5, currentLevel)),
      };

      // Check if player has enough resources
      if (
        resources.metal < cost.metal ||
        resources.crystal < cost.crystal ||
        resources.deuterium < cost.deuterium
      ) {
        return res.status(400).json({ 
          error: "Insufficient resources",
          required: cost,
          available: resources,
        });
      }

      // Deduct resources and upgrade building
      const newResources = {
        ...resources,
        metal: resources.metal - cost.metal,
        crystal: resources.crystal - cost.crystal,
        deuterium: resources.deuterium - cost.deuterium,
      };

      await db.update(playerStates)
        .set({ 
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Update building level
      planet.buildings[buildingType] = nextLevel;

      res.json({ 
        message: `${buildingType} upgraded to level ${nextLevel}`,
        planet,
        newResources,
        cost,
      });
    } catch (error) {
      console.error("Error building structure:", error);
      res.status(500).json({ error: "Failed to build structure" });
    }
  });

  // Get all planets (for browsing)
  app.get("/api/planets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planets = Object.values(PLANET_DATABASE);
      res.json({ planets, count: planets.length });
    } catch (error) {
      console.error("Error fetching planets:", error);
      res.status(500).json({ error: "Failed to fetch planets" });
    }
  });
}
