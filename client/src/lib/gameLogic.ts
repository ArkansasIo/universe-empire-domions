import { UnitItem, unitData } from "./unitData";

type Units = { [key: string]: number };

export interface BattleReport {
  winner: "attacker" | "defender" | "draw";
  rounds: number;
  attackerLosses: number; // Total metal + crystal
  defenderLosses: number;
  debris: { metal: number; crystal: number };
  loot: { metal: number; crystal: number; deuterium: number };
  log: string[];
}

export function simulateCombat(attackerFleet: Units, defenderFleet: Units): BattleReport {
  // 1. Initialize fleets
  let attackers = expandFleet(attackerFleet);
  let defenders = expandFleet(defenderFleet);
  
  const log: string[] = [];
  let rounds = 0;
  const maxRounds = 6;

  log.push(`Battle initiated. Attackers: ${attackers.length}, Defenders: ${defenders.length}`);

  // 2. Combat Loop (Simplified OGame style)
  while (rounds < maxRounds && attackers.length > 0 && defenders.length > 0) {
    rounds++;
    
    // Each ship picks a target
    // Attackers shoot
    attackers.forEach(att => {
      if (defenders.length === 0) return;
      const targetIndex = Math.floor(Math.random() * defenders.length);
      const target = defenders[targetIndex];
      
      // Shield check
      if (att.attack > target.currentShield) {
        const damage = att.attack - target.currentShield; // Simplified shield penetration
        target.currentHull -= damage;
        target.currentShield = 0; // Shields collapse
      } else {
        target.currentShield -= att.attack; // Shields absorb
      }
    });

    // Defenders shoot
    defenders.forEach(def => {
      if (attackers.length === 0) return;
      const targetIndex = Math.floor(Math.random() * attackers.length);
      const target = attackers[targetIndex];
      
      if (def.attack > target.currentShield) {
        const damage = def.attack - target.currentShield;
        target.currentHull -= damage;
        target.currentShield = 0;
      } else {
        target.currentShield -= def.attack;
      }
    });

    // Remove destroyed ships & Restore shields
    const survivingAttackers = attackers.filter(s => s.currentHull > 0).map(restoreShields);
    const survivingDefenders = defenders.filter(s => s.currentHull > 0).map(restoreShields);

    log.push(`Round ${rounds}: Att lost ${attackers.length - survivingAttackers.length}, Def lost ${defenders.length - survivingDefenders.length}`);

    attackers = survivingAttackers;
    defenders = survivingDefenders;
  }

  // 3. Calculate Results
  const winner = attackers.length > 0 && defenders.length === 0 ? "attacker" : 
                 defenders.length > 0 && attackers.length === 0 ? "defender" : "draw";

  const initialAttCost = calculateFleetCost(attackerFleet);
  const finalAttCost = calculateFleetCost(compressFleet(attackers));
  const initialDefCost = calculateFleetCost(defenderFleet);
  const finalDefCost = calculateFleetCost(compressFleet(defenders));

  const attackerLosses = initialAttCost - finalAttCost;
  const defenderLosses = initialDefCost - finalDefCost;

  // Debris = 30% of metal/crystal lost
  // This is an approximation since we only track total cost here for brevity
  // A real impl would track metal/crystal separately per ship lost
  const debris = {
    metal: Math.floor((attackerLosses + defenderLosses) * 0.3 * 0.6), // 60% of cost is usually metal
    crystal: Math.floor((attackerLosses + defenderLosses) * 0.3 * 0.4)
  };

  // Loot (Mocked based on cargo capacity of survivors)
  let loot = { metal: 0, crystal: 0, deuterium: 0 };
  if (winner === "attacker") {
    const cargo = attackers.reduce((sum, ship) => sum + ship.cargo, 0);
    const mockPlanetResources = 50000; // Assume target had 50k of each
    const lootAmount = Math.min(cargo, mockPlanetResources); // Take what fits
    loot = {
      metal: Math.floor(lootAmount / 3),
      crystal: Math.floor(lootAmount / 3),
      deuterium: Math.floor(lootAmount / 3)
    };
  }

  return {
    winner,
    rounds,
    attackerLosses,
    defenderLosses,
    debris,
    loot,
    log
  };
}

// Helpers
interface CombatShip {
  id: string;
  attack: number;
  hull: number;
  shield: number;
  cargo: number;
  currentHull: number;
  currentShield: number;
}

function expandFleet(fleet: Units): CombatShip[] {
  const result: CombatShip[] = [];
  Object.entries(fleet).forEach(([id, count]) => {
    const stats = unitData.find(u => u.id === id)?.stats;
    if (!stats) return;
    for (let i = 0; i < count; i++) {
      result.push({
        id,
        attack: stats.attack,
        hull: stats.structure,
        shield: stats.shield,
        cargo: stats.cargo,
        currentHull: stats.structure,
        currentShield: stats.shield
      });
    }
  });
  return result;
}

function compressFleet(ships: CombatShip[]): Units {
  const fleet: Units = {};
  ships.forEach(s => {
    fleet[s.id] = (fleet[s.id] || 0) + 1;
  });
  return fleet;
}

function restoreShields(ship: CombatShip): CombatShip {
  return { ...ship, currentShield: ship.shield };
}

function calculateFleetCost(fleet: Units): number {
  let total = 0;
  Object.entries(fleet).forEach(([id, count]) => {
    const cost = unitData.find(u => u.id === id)?.cost;
    if (cost) {
      total += (cost.metal + cost.crystal + cost.deuterium) * count;
    }
  });
  return total;
}
