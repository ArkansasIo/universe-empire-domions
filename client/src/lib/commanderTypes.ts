export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "weapon" | "armor" | "module" | "blueprint" | "material";

export type RaceId = "terran" | "aquarian" | "mechborn" | "lithoid" | "zypherian" | "vortexborn" | "silicate" | "ethereal";
export type ClassId = "admiral" | "industrialist" | "scientist" | "diplomat" | "explorer" | "merchant";
export type SubClassId = "tactician" | "corsair" | "logistician" | "geologist" | "technomancer" | "xenobiologist" | "negotiator" | "navigator" | "trader" | "archaeologist";

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
  },
  zypherian: {
    id: "zypherian",
    name: "Zypherian Collective",
    description: "Insectoid hive-mind species with incredible teamwork and coordination capabilities.",
    bonuses: ["+25% Fleet Coordination", "+10% Collective Research"]
  },
  vortexborn: {
    id: "vortexborn",
    name: "Vortexborn",
    description: "Energy beings from interdimensional rifts. Masters of exotic physics and cosmic phenomena.",
    bonuses: ["+20% Exotic Research", "+15% Warp Speed"]
  },
  silicate: {
    id: "silicate",
    name: "Silicate Constructs",
    description: "Living crystalline entities that think in geometric patterns and quantum states.",
    bonuses: ["+30% Crystal Production", "+20% Energy Efficiency"]
  },
  ethereal: {
    id: "ethereal",
    name: "Ethereal Beings",
    description: "Spiritual entities existing partially outside normal space. Mysterious and powerful.",
    bonuses: ["+20% Spiritual Research", "+15% Quantum Technology"]
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
  },
  diplomat: {
    id: "diplomat",
    name: "Diplomat",
    description: "Masters of negotiation and peaceful resolution. Expert traders and negotiators.",
    bonuses: ["+25% Diplomacy", "+15% Trade Revenue"],
    subClasses: ["negotiator"]
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    description: "Brave adventurers who chart unknown space and discover ancient secrets.",
    bonuses: ["+20% Exploration Speed", "+15% Archaeological Findings"],
    subClasses: ["navigator", "archaeologist"]
  },
  merchant: {
    id: "merchant",
    name: "Merchant",
    description: "Shrewd business operators who maximize profit and commerce.",
    bonuses: ["+30% Market Profits", "+20% Resource Trading"],
    subClasses: ["trader"]
  }
};

export const SUBCLASSES: Record<SubClassId, SubClass> = {
  tactician: { id: "tactician", name: "Grand Tactician", description: "Master of battlefield strategy and complex maneuvers.", bonuses: ["+10% Evasion", "+5% Crit Chance"] },
  corsair: { id: "corsair", name: "Void Corsair", description: "Expert raider and scavenger of the deep void.", bonuses: ["+20% Loot Capacity", "+10% Recycler Speed"] },
  logistician: { id: "logistician", name: "Master Logistician", description: "Optimizes supply chains and resource flow.", bonuses: ["+10% Energy Output", "-10% Ship Fuel Cost"] },
  geologist: { id: "geologist", name: "Deep Core Geologist", description: "Extracts rare minerals from planetary cores.", bonuses: ["+15% Crystal Production", "+5% Mine Depth"] },
  technomancer: { id: "technomancer", name: "Technomancer", description: "Melds machine and mind through technology.", bonuses: ["+10% Computer Tech", "-10% Research Cost"] },
  xenobiologist: { id: "xenobiologist", name: "Xenobiologist", description: "Unlocks secrets of alien life forms.", bonuses: ["+20% Pop Growth", "+10% Terraforming"] },
  negotiator: { id: "negotiator", name: "Master Negotiator", description: "Achieves impossible peace deals and treaties.", bonuses: ["+30% Alliance Bonus", "+15% Peace Treaty Stability"] },
  navigator: { id: "navigator", name: "Master Navigator", description: "Navigates through uncharted cosmic phenomena.", bonuses: ["+25% Exploration Speed", "+20% Warp Accuracy"] },
  trader: { id: "trader", name: "Black Market Trader", description: "Knows every merchant and smuggler route in the galaxy.", bonuses: ["+40% Market Profits", "+20% Black Market Access"] },
  archaeologist: { id: "archaeologist", name: "Archaeologist", description: "Uncovers ancient secrets and civilizations.", bonuses: ["+35% Ancient Discovery Rate", "+20% Artifact Value"] }
};


// Mock recipes
export const blueprints = [
  { id: "plasmaRifle", name: "Plasma Rifle Blueprint", resultId: "plasmaRifle", type: "weapon", cost: { metal: 5000, crystal: 2000 } },
  { id: "voidArmor", name: "Void Armor Blueprint", resultId: "voidArmor", type: "armor", cost: { metal: 10000, crystal: 5000 } },
  { id: "aiCore", name: "AI Core Blueprint", resultId: "aiCore", type: "module", cost: { metal: 5000, crystal: 10000, deuterium: 2000 } },
];
