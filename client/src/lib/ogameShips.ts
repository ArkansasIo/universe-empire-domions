export interface Ship {
  id: string;
  name: string;
  description: string;
  type: "fighter" | "cargo" | "support" | "capital" | "probe" | "special";
  cost: { metal: number; crystal: number; deuterium: number };
  capacity?: number;
  speed: number; // relative 1-10
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  consumption: number; // deuterium per unit distance
  requirements?: { [key: string]: number };
}

export const OGAME_SHIPS: Ship[] = [
  // Fighters
  {
    id: "lightFighter",
    name: "Light Fighter",
    description: "Fast and cheap fighter.",
    type: "fighter",
    cost: { metal: 1000, crystal: 400, deuterium: 0 },
    speed: 10,
    attack: 50,
    defense: 10,
    shield: 10,
    hull: 400,
    consumption: 20,
    requirements: { combustionDrive: 1 }
  },
  {
    id: "heavyFighter",
    name: "Heavy Fighter",
    description: "Powerful fighter.",
    type: "fighter",
    cost: { metal: 6000, crystal: 4000, deuterium: 0 },
    speed: 8,
    attack: 150,
    defense: 25,
    shield: 25,
    hull: 1000,
    consumption: 75,
    requirements: { impulseDrive: 2 }
  },

  // Cargo Ships
  {
    id: "smallCargo",
    name: "Small Cargo Ship",
    description: "Transports resources.",
    type: "cargo",
    cost: { metal: 2000, crystal: 2000, deuterium: 0 },
    capacity: 5000,
    speed: 5,
    attack: 5,
    defense: 5,
    shield: 5,
    hull: 400,
    consumption: 50,
    requirements: { combustionDrive: 2 }
  },
  {
    id: "largeCargo",
    name: "Large Cargo Ship",
    description: "High capacity transport.",
    type: "cargo",
    cost: { metal: 6000, crystal: 6000, deuterium: 0 },
    capacity: 25000,
    speed: 5,
    attack: 5,
    defense: 5,
    shield: 5,
    hull: 1200,
    consumption: 300,
    requirements: { combustionDrive: 3 }
  },

  // Support
  {
    id: "colonyShip",
    name: "Colony Ship",
    description: "Colonizes planets.",
    type: "support",
    cost: { metal: 30000, crystal: 40000, deuterium: 10000 },
    capacity: 0,
    speed: 4,
    attack: 50,
    defense: 20,
    shield: 20,
    hull: 30000,
    consumption: 1000,
    requirements: { impulseDrive: 3 }
  },
  {
    id: "recycler",
    name: "Recycler",
    description: "Harvests debris fields.",
    type: "support",
    cost: { metal: 3000, crystal: 0, deuterium: 1000 },
    capacity: 20000,
    speed: 4,
    attack: 1,
    defense: 10,
    shield: 10,
    hull: 400,
    consumption: 300,
    requirements: { combustionDrive: 6 }
  },
  {
    id: "espionageProbe",
    name: "Espionage Probe",
    description: "Spies on targets.",
    type: "probe",
    cost: { metal: 0, crystal: 1000, deuterium: 0 },
    speed: 100,
    attack: 0,
    defense: 1,
    shield: 1,
    hull: 1,
    consumption: 1,
    requirements: { espionageTech: 3 }
  },

  // Capital Ships
  {
    id: "battleship",
    name: "Battleship",
    description: "Massive warship.",
    type: "capital",
    cost: { metal: 45000, crystal: 15000, deuterium: 0 },
    speed: 6,
    attack: 1000,
    defense: 200,
    shield: 200,
    hull: 6000,
    consumption: 500,
    requirements: { hyperspaceTech: 4 }
  },
  {
    id: "battlecruiser",
    name: "Battlecruiser",
    description: "Fast capital ship.",
    type: "capital",
    cost: { metal: 30000, crystal: 40000, deuterium: 15000 },
    speed: 10,
    attack: 700,
    defense: 250,
    shield: 250,
    hull: 7000,
    consumption: 700,
    requirements: { hyperspaceTech: 5 }
  },
  {
    id: "cruiser",
    name: "Cruiser",
    description: "Balanced capital ship.",
    type: "capital",
    cost: { metal: 20000, crystal: 7000, deuterium: 2000 },
    speed: 15,
    attack: 400,
    defense: 150,
    shield: 150,
    hull: 4000,
    consumption: 300,
    requirements: { impulseDrive: 4 }
  },
  {
    id: "destroyer",
    name: "Destroyer",
    description: "Specialized warship.",
    type: "capital",
    cost: { metal: 60000, crystal: 50000, deuterium: 15000 },
    speed: 5,
    attack: 2000,
    defense: 500,
    shield: 500,
    hull: 11000,
    consumption: 1000,
    requirements: { hyperspaceTech: 8 }
  },
  {
    id: "deathstar",
    name: "Death Star",
    description: "Ultimate weapon platform.",
    type: "capital",
    cost: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
    speed: 1,
    attack: 100000,
    defense: 50000,
    shield: 50000,
    hull: 900000,
    consumption: 1,
    requirements: { hyperspaceTech: 12 }
  },

  // Special
  {
    id: "bomber",
    name: "Bomber",
    description: "Targets defense structures.",
    type: "special",
    cost: { metal: 50000, crystal: 25000, deuterium: 15000 },
    speed: 4,
    attack: 1000,
    defense: 100,
    shield: 100,
    hull: 7000,
    consumption: 1000,
    requirements: { plasmaTech: 5 }
  },
  {
    id: "transporterShip",
    name: "Transporter Ship",
    description: "Fast cargo transport.",
    type: "special",
    cost: { metal: 12000, crystal: 6000, deuterium: 6000 },
    capacity: 50000,
    speed: 24,
    attack: 10,
    defense: 50,
    shield: 50,
    hull: 3000,
    consumption: 1000,
    requirements: { hyperspaceDrive: 10 }
  },
  {
    id: "pathfinder",
    name: "Pathfinder",
    description: "Scout vessel.",
    type: "special",
    cost: { metal: 8000, crystal: 15000, deuterium: 8000 },
    capacity: 10000,
    speed: 25,
    attack: 30,
    defense: 60,
    shield: 60,
    hull: 6000,
    consumption: 300,
    requirements: { plasmaTech: 1 }
  },
];

export const getShipCost = (ship: Ship, quantity: number = 1) => {
  return {
    metal: ship.cost.metal * quantity,
    crystal: ship.cost.crystal * quantity,
    deuterium: ship.cost.deuterium * quantity,
  };
};

export const getShipBuildTime = (ship: Ship, quantity: number = 1, shipyardLevel: number = 1) => {
  const baseTime = (ship.cost.metal + ship.cost.crystal) / 2500;
  const buildTime = Math.ceil(baseTime * quantity / (shipyardLevel * 2));
  return Math.max(60, buildTime);
};
