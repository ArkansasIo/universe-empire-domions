export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "weapon" | "armor" | "module" | "blueprint" | "material";

export interface CommanderStats {
  level: number;
  xp: number;
  warfare: number;    // Boosts ship damage
  logistics: number;  // Boosts resource production
  science: number;    // Boosts research speed
  engineering: number;// Boosts build speed
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  stats?: {
    warfare?: number;
    logistics?: number;
    science?: number;
    engineering?: number;
  };
  tempering?: number; // 0-10
  masterwork?: boolean;
}

export interface CommanderState {
  stats: CommanderStats;
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    module: Item | null;
  };
  inventory: Item[];
}

// Mock recipes
export const blueprints = [
  { id: "plasmaRifle", name: "Plasma Rifle Blueprint", resultId: "plasmaRifle", type: "weapon", cost: { metal: 5000, crystal: 2000 } },
  { id: "voidArmor", name: "Void Armor Blueprint", resultId: "voidArmor", type: "armor", cost: { metal: 10000, crystal: 5000 } },
  { id: "aiCore", name: "AI Core Blueprint", resultId: "aiCore", type: "module", cost: { metal: 5000, crystal: 10000, deuterium: 2000 } },
];
