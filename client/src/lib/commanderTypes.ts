export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "weapon" | "armor" | "module" | "blueprint" | "material";

export type RaceId = "terran" | "aquarian" | "mechborn" | "lithoid";
export type ClassId = "admiral" | "industrialist" | "scientist";
export type SubClassId = "tactician" | "corsair" | "logistician" | "geologist" | "technomancer" | "xenobiologist";

export interface Race {
  id: RaceId;
  name: string;
  description: string;
  bonuses: string[];
}

export interface Class {
  id: ClassId;
  name: string;
  description: string;
  bonuses: string[];
  subClasses: SubClassId[];
}

export interface SubClass {
  id: SubClassId;
  name: string;
  description: string;
  bonuses: string[];
}

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
  name: string;
  race: RaceId;
  class: ClassId;
  subClass: SubClassId | null;
  stats: CommanderStats;
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    module: Item | null;
  };
  inventory: Item[];
}

// Data Definitions
export const RACES: Record<RaceId, Race> = {
  terran: {
    id: "terran",
    name: "Terran Union",
    description: "Adaptable and ambitious, Terrans are jacks-of-all-trades with balanced growth.",
    bonuses: ["+5% All Resource Production", "+5% Research Speed"]
  },
  aquarian: {
    id: "aquarian",
    name: "Aquarian Dominion",
    description: "Masters of fluid dynamics and biology, they excel at deuterium extraction and food production.",
    bonuses: ["+20% Deuterium Production", "+10% Biological Research"]
  },
  mechborn: {
    id: "mechborn",
    name: "The Mechborn",
    description: "Cybernetic organisms that value efficiency above all else. Excellent builders.",
    bonuses: ["+20% Construction Speed", "-10% Building Cost"]
  },
  lithoid: {
    id: "lithoid",
    name: "Lithoid Crag",
    description: "Silicone-based lifeforms that consume minerals. Extremely tough ships.",
    bonuses: ["+15% Metal/Crystal Production", "+10% Ship Armor"]
  }
};

export const CLASSES: Record<ClassId, Class> = {
  admiral: {
    id: "admiral",
    name: "Fleet Admiral",
    description: "Specializes in military command and fleet maneuvers.",
    bonuses: ["+10% Ship Attack", "+10% Fleet Speed"],
    subClasses: ["tactician", "corsair"]
  },
  industrialist: {
    id: "industrialist",
    name: "Industrialist",
    description: "Focuses on economic growth and massive infrastructure.",
    bonuses: ["+15% Resource Production", "+10% Cargo Capacity"],
    subClasses: ["logistician", "geologist"]
  },
  scientist: {
    id: "scientist",
    name: "Chief Scientist",
    description: "Dedicated to technological advancement and discovery.",
    bonuses: ["+20% Research Speed", "+5% Shield Tech"],
    subClasses: ["technomancer", "xenobiologist"]
  }
};

export const SUBCLASSES: Record<SubClassId, SubClass> = {
  tactician: { id: "tactician", name: "Grand Tactician", description: "Master of battlefield strategy.", bonuses: ["+10% Evasion", "+5% Crit Chance"] },
  corsair: { id: "corsair", name: "Void Corsair", description: "Expert raider and scavenger.", bonuses: ["+20% Loot Capacity", "+10% Recycler Speed"] },
  logistician: { id: "logistician", name: "Master Logistician", description: "Optimizes supply chains.", bonuses: ["+10% Energy Output", "-10% Ship Fuel Cost"] },
  geologist: { id: "geologist", name: "Deep Core Geologist", description: "Extracts rare minerals.", bonuses: ["+15% Crystal Production", "+5% Mine Depth"] },
  technomancer: { id: "technomancer", name: "Technomancer", description: "Melds machine and mind.", bonuses: ["+10% Computer Tech", "-10% Research Cost"] },
  xenobiologist: { id: "xenobiologist", name: "Xenobiologist", description: "Unlocks secrets of life.", bonuses: ["+20% Pop Growth", "+10% Terraforming"] }
};


// Mock recipes
export const blueprints = [
  { id: "plasmaRifle", name: "Plasma Rifle Blueprint", resultId: "plasmaRifle", type: "weapon", cost: { metal: 5000, crystal: 2000 } },
  { id: "voidArmor", name: "Void Armor Blueprint", resultId: "voidArmor", type: "armor", cost: { metal: 10000, crystal: 5000 } },
  { id: "aiCore", name: "AI Core Blueprint", resultId: "aiCore", type: "module", cost: { metal: 5000, crystal: 10000, deuterium: 2000 } },
];
