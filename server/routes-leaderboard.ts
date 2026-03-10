import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if ((req as any).session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export const LEADERBOARD_CONFIG = {
  // Leaderboard types
  LEADERBOARD_TYPES: {
    EMPIRE_VALUE: "empireValue",
    FLEET_POWER: "fleetPower",
    RESEARCH_PROGRESS: "researchProgress",
    RESOURCE_PRODUCTION: "resourceProduction",
    COMBAT_VICTORIES: "combatVictories",
    EXPLORATION_DISCOVERIES: "explorationDiscoveries",
  },

  // Max entries per leaderboard
  MAX_ENTRIES: 100,

  // Ranking thresholds
  RANK_THRESHOLDS: {
    legendary: 0.95,
    elite: 0.80,
    advanced: 0.60,
    intermediate: 0.40,
    novice: 0,
  },
};

/**
 * Calculate player's empire value (total wealth)
 * @param playerState The player's state
 * @returns Total empire value
 */
export function calculateEmpireValue(playerState: any): number {
  const resources = playerState.resources as any || {};
  const units = playerState.units as any || {};
  const buildings = playerState.buildings as any || {};

  // Resource values
  const metalValue = (resources.metal || 0) * 1;
  const crystalValue = (resources.crystal || 0) * 1.5;
  const deuteriumValue = (resources.deuterium || 0) * 2;

  // Unit values (estimated)
  const unitValues: any = {
    lightFighter: 10,
    heavyFighter: 20,
    battleship: 100,
    dreadnought: 500,
    carrier: 300,
    scout: 5,
    bomber: 80,
    frigate: 40,
    destroyer: 200,
    corvette: 30,
  };

  let unitValue = 0;
  for (const [type, count] of Object.entries(units)) {
    unitValue += ((unitValues[type] || 50) * (count as number));
  }

  // Building values
  const buildingValues: any = {
    metalMine: 100,
    crystalMine: 150,
    deuteriumSynthesizer: 200,
    solarPlant: 80,
    roboticsFactory: 500,
    shipyard: 1000,
    researchLab: 800,
  };

  let buildingValue = 0;
  for (const [type, level] of Object.entries(buildings)) {
    buildingValue += ((buildingValues[type] || 100) * (level as number) * 50);
  }

  return metalValue + crystalValue + deuteriumValue + unitValue + buildingValue;
}

/**
 * Calculate player's fleet power
 * @param playerState The player's state
 * @param researchState The player's research
 * @returns Total fleet power
 */
export function calculateFleetPower(playerState: any, researchState: any = {}): number {
  const units = playerState.units as any || {};

  // Unit combat power (attack + defense)
  const unitPower: any = {
    lightFighter: 5,
    heavyFighter: 15,
    battleship: 100,
    dreadnought: 500,
    carrier: 200,
    scout: 3,
    bomber: 60,
    frigate: 30,
    destroyer: 150,
    corvette: 20,
  };

  let totalPower = 0;
  for (const [type, count] of Object.entries(units)) {
    totalPower += ((unitPower[type] || 25) * (count as number));
  }

  // Apply research bonuses
  const weaponsBonus = (researchState.weaponsTech || 1) * 0.05;
  const armourBonus = (researchState.armourTech || 1) * 0.03;

  return Math.round(totalPower * (1 + weaponsBonus + armourBonus));
}

/**
 * Calculate research progress score
 * @param researchState The player's research
 * @returns Research progress score (0-1000)
 */
export function calculateResearchProgress(researchState: any = {}): number {
  const maxLevel = 10; // Max research level per tech
  const techTypes = [
    "metalExtraction",
    "crystalProcessing",
    "deuteriumSynthesis",
    "armour",
    "weapons",
    "shielding",
    "combustionDrive",
    "computer",
    "astrophysics",
    "intergalacticResearch",
  ];

  let total = 0;
  for (const tech of techTypes) {
    const level = Math.min(researchState[tech] || 1, maxLevel);
    total += (level / maxLevel) * 100;
  }

  return Math.round(total / techTypes.length);
}

export function registerLeaderboardRoutes(app: Express) {
  
  // Get specific leaderboard
  app.get("/api/leaderboard/:type", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const { limit = 50 } = req.query;

      if (!Object.values(LEADERBOARD_CONFIG.LEADERBOARD_TYPES).includes(type)) {
        return res.status(400).json({ 
          error: "Invalid leaderboard type",
          types: Object.values(LEADERBOARD_CONFIG.LEADERBOARD_TYPES),
        });
      }

      // Fetch all players
      const allPlayers = await db.query.playerStates.findMany();

      // Calculate scores based on leaderboard type
      const rankings = allPlayers
        .map((player: any) => {
          let score = 0;
          let displayName = player.userId?.substring(0, 10) || "Unknown";

          switch (type) {
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EMPIRE_VALUE:
              score = calculateEmpireValue(player);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.FLEET_POWER:
              score = calculateFleetPower(player, player.research);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESEARCH_PROGRESS:
              score = calculateResearchProgress(player.research);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESOURCE_PRODUCTION:
              const resources = player.resources as any || {};
              score = (resources.metal || 0) + (resources.crystal || 0) + (resources.deuterium || 0);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.COMBAT_VICTORIES:
              const combatStats = player.combatStats as any || {};
              score = combatStats.victories || 0;
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EXPLORATION_DISCOVERIES:
              const travelState = player.travelState as any || {};
              score = (travelState.discoveredPlanets || []).length;
              break;
          }

          // Determine rank badge
          let rank = "novice";
          const maxScore = allPlayers
            .map((p: any) => calculateEmpireValue(p))
            .reduce((max: number, curr: number) => Math.max(max, curr), 1);
          const percentile = score / maxScore;

          for (const [rankName, threshold] of Object.entries(LEADERBOARD_CONFIG.RANK_THRESHOLDS)) {
            if (percentile >= threshold) {
              rank = rankName;
              break;
            }
          }

          return {
            userId: player.userId,
            displayName,
            score,
            rank,
            createdAt: player.createdAt,
          };
        })
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, parseInt(limit as string) || 50);

      // Add ranking position
      const rankedResults = rankings.map((item: any, index: number) => ({
        position: index + 1,
        ...item,
      }));

      res.json({
        leaderboard: rankedResults,
        type,
        totalPlayers: allPlayers.length,
        count: rankedResults.length,
      });
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Get player rank in all categories
  app.get("/api/leaderboard/ranks/all", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      // Fetch all players for rankings
      const allPlayers = await db.query.playerStates.findMany();

      const ranks: any = {};

      // Calculate rank for each leaderboard type
      for (const [typeKey, typeValue] of Object.entries(LEADERBOARD_CONFIG.LEADERBOARD_TYPES)) {
        const scores = allPlayers.map((player: any) => {
          let score = 0;

          switch (typeValue) {
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EMPIRE_VALUE:
              score = calculateEmpireValue(player);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.FLEET_POWER:
              score = calculateFleetPower(player, player.research);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESEARCH_PROGRESS:
              score = calculateResearchProgress(player.research);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESOURCE_PRODUCTION:
              const resources = player.resources as any || {};
              score = (resources.metal || 0) + (resources.crystal || 0) + (resources.deuterium || 0);
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.COMBAT_VICTORIES:
              const combatStats = player.combatStats as any || {};
              score = combatStats.victories || 0;
              break;
            case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EXPLORATION_DISCOVERIES:
              const travelState = player.travelState as any || {};
              score = (travelState.discoveredPlanets || []).length;
              break;
          }

          return { userId: player.userId, score };
        });

        // Sort and find player's rank
        const sorted = scores.sort((a, b) => b.score - a.score);
        const playerRank = sorted.findIndex((s: any) => s.userId === userId) + 1;
        const playerScore = scores.find((s: any) => s.userId === userId)?.score || 0;

        ranks[typeValue] = {
          rank: playerRank,
          score: playerScore,
          outOf: sorted.length,
          percentile: Math.round((playerRank / sorted.length) * 100),
        };
      }

      res.json({
        userId,
        ranks,
        overallRank: Object.values(ranks).reduce((sum: number, r: any) => sum + r.rank, 0) /
          Object.keys(ranks).length,
      });
    } catch (error) {
      console.error("Error getting player ranks:", error);
      res.status(500).json({ error: "Failed to get player ranks" });
    }
  });

  // Get all leaderboards summary
  app.get("/api/leaderboard/all", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leaderboards: any = {};

      for (const [typeKey, typeValue] of Object.entries(LEADERBOARD_CONFIG.LEADERBOARD_TYPES)) {
        const allPlayers = await db.query.playerStates.findMany();

        const rankings = allPlayers
          .map((player: any) => {
            let score = 0;

            switch (typeValue) {
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EMPIRE_VALUE:
                score = calculateEmpireValue(player);
                break;
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.FLEET_POWER:
                score = calculateFleetPower(player, player.research);
                break;
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESEARCH_PROGRESS:
                score = calculateResearchProgress(player.research);
                break;
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.RESOURCE_PRODUCTION:
                const resources = player.resources as any || {};
                score = (resources.metal || 0) + (resources.crystal || 0) + (resources.deuterium || 0);
                break;
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.COMBAT_VICTORIES:
                const combatStats = player.combatStats as any || {};
                score = combatStats.victories || 0;
                break;
              case LEADERBOARD_CONFIG.LEADERBOARD_TYPES.EXPLORATION_DISCOVERIES:
                const travelState = player.travelState as any || {};
                score = (travelState.discoveredPlanets || []).length;
                break;
            }

            return {
              userId: player.userId,
              score,
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Top 10

        leaderboards[typeValue] = rankings.map((item: any, index: number) => ({
          position: index + 1,
          ...item,
        }));
      }

      res.json({
        leaderboards,
        categories: Object.keys(LEADERBOARD_CONFIG.LEADERBOARD_TYPES).length,
      });
    } catch (error) {
      console.error("Error getting all leaderboards:", error);
      res.status(500).json({ error: "Failed to get leaderboards" });
    }
  });
}
