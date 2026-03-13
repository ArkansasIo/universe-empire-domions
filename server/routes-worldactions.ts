import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

function getExchangeRate(from: string, to: string): number {
  const rates: Record<string, number> = {
    "metal:crystal": 0.67,
    "metal:deuterium": 0.33,
    "crystal:metal": 1.5,
    "crystal:deuterium": 0.5,
    "deuterium:metal": 3,
    "deuterium:crystal": 2,
  };

  return rates[`${from}:${to}`] ?? 0;
}

router.post("/api/army/deploy", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const troopId = String(req.body?.troopId || "");
    const troopName = String(req.body?.troopName || "Unknown Troop");
    const deploymentType = String(req.body?.deploymentType || "field");

    if (!troopId) {
      return res.status(400).json({ error: "Troop ID is required" });
    }

    const missionId = `army_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      missionId,
      userId,
      troopId,
      troopName,
      deploymentType,
      status: "deployed",
      deployedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[army/deploy]", error);
    res.status(500).json({ error: "Failed to deploy troop" });
  }
});

router.post("/api/army/manage", isAuthenticated, async (req, res) => {
  try {
    const troopId = String(req.body?.troopId || "");
    const troopName = String(req.body?.troopName || "Unknown Troop");
    const action = String(req.body?.action || "equip");

    if (!troopId) {
      return res.status(400).json({ error: "Troop ID is required" });
    }

    res.json({
      success: true,
      troopId,
      troopName,
      action,
      message: `Management action '${action}' prepared for ${troopName}`,
    });
  } catch (error) {
    console.error("[army/manage]", error);
    res.status(500).json({ error: "Failed to manage troop" });
  }
});

router.post("/api/exploration/scan", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const anomalyId = String(req.body?.anomalyId || "");
    const anomalyName = String(req.body?.anomalyName || "Unknown Anomaly");
    const hazardLevel = Number(req.body?.hazardLevel ?? 0);
    const rewards = req.body?.rewards || { metal: 0, crystal: 0, deuterium: 0 };

    if (!anomalyId) {
      return res.status(400).json({ error: "Anomaly ID is required" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    const rewardScale = Math.max(0.2, 1 - hazardLevel * 0.04);
    const gained = {
      metal: Math.floor(Number(rewards.metal || 0) * rewardScale),
      crystal: Math.floor(Number(rewards.crystal || 0) * rewardScale),
      deuterium: Math.floor(Number(rewards.deuterium || 0) * rewardScale),
    };

    const updatedResources = {
      ...currentResources,
      metal: Number(currentResources.metal || 0) + gained.metal,
      crystal: Number(currentResources.crystal || 0) + gained.crystal,
      deuterium: Number(currentResources.deuterium || 0) + gained.deuterium,
      energy: Number(currentResources.energy || 0),
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    res.json({
      success: true,
      anomalyId,
      anomalyName,
      gained,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[exploration/scan]", error);
    res.status(500).json({ error: "Failed to scan anomaly" });
  }
});

router.post("/api/exploration/warp-action", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const gateId = String(req.body?.gateId || "");
    const gateName = String(req.body?.gateName || "Unknown Gate");
    const action = String(req.body?.action || "jump");
    const energyCost = Math.max(0, Number(req.body?.energyCost || 0));

    if (!gateId) {
      return res.status(400).json({ error: "Gate ID is required" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    if (Number(currentResources.deuterium || 0) < energyCost) {
      return res.status(400).json({ error: "Insufficient deuterium" });
    }

    const updatedResources = {
      ...currentResources,
      deuterium: Number(currentResources.deuterium || 0) - energyCost,
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    res.json({
      success: true,
      gateId,
      gateName,
      action,
      energyCost,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[exploration/warp-action]", error);
    res.status(500).json({ error: "Failed warp action" });
  }
});

router.post("/api/market/exchange", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const from = String(req.body?.from || "");
    const to = String(req.body?.to || "");
    const amount = Math.floor(Number(req.body?.amount || 0));

    if (!from || !to || from === to) {
      return res.status(400).json({ error: "Invalid exchange pair" });
    }

    if (!["metal", "crystal", "deuterium"].includes(from) || !["metal", "crystal", "deuterium"].includes(to)) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    const rate = getExchangeRate(from, to);
    if (rate <= 0) {
      return res.status(400).json({ error: "Unsupported exchange route" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    if (Number(currentResources[from] || 0) < amount) {
      return res.status(400).json({ error: `Insufficient ${from}` });
    }

    const fee = Math.floor(amount * 0.1);
    const converted = Math.floor((amount - fee) * rate);

    const updatedResources = {
      ...currentResources,
      [from]: Number(currentResources[from] || 0) - amount,
      [to]: Number(currentResources[to] || 0) + converted,
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    res.json({
      success: true,
      from,
      to,
      amount,
      fee,
      rate,
      converted,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[market/exchange]", error);
    res.status(500).json({ error: "Failed resource exchange" });
  }
});

export default router;