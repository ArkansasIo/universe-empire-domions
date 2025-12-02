// Mega Structures - Sci-Fi Mega Constructs for Stellar Dominion
export interface MegaStructureStats {
  energyOutput: number;
  productionBonus: number;
  researchBonus: number;
  defenseRating: number;
  populationCapacity: number;
  constructionTime: number;
  maintenanceCost: { metal: number; crystal: number; deuterium: number; energy: number };
}

export interface SubStat {
  name: string;
  value: number;
  icon: string;
  description: string;
}

export interface MegaStructure {
  id: string;
  name: string;
  type: string;
  class: string;
  tier: number;
  description: string;
  icon: string;
  stats: MegaStructureStats;
  subStats: SubStat[];
  researchRequired: string[];
  buildingRequirements: { name: string; level: number }[];
  constructionBonus: number;
  specialAbility: string;
}

// MEGA STRUCTURE TYPES
export const MEGA_STRUCTURE_TYPES = [
  "orbital_megastructure",
  "stellar_engineering",
  "space_anchor",
  "dimensional_gateway",
  "matter_converter"
];

// MEGA STRUCTURE CLASSES (Levels of sophistication)
export const MEGA_STRUCTURE_CLASSES = [
  "class_1",  // Basic - Dyson Swarms
  "class_2",  // Advanced - Ring Worlds
  "class_3",  // Elite - Dyson Spheres
  "class_4",  // Legendary - Matrioshka Brains
  "class_5"   // Ascendant - Megastructure Networks
];

// DETAILED MEGA STRUCTURES CATALOG
export const MEGA_STRUCTURES: Record<string, MegaStructure> = {
  // TIER 1: DYSON SWARM VARIANTS
  dyson_swarm_alpha: {
    id: "dyson_swarm_alpha",
    name: "Dyson Swarm Alpha",
    type: "stellar_engineering",
    class: "class_1",
    tier: 1,
    description: "A collection of solar collectors in orbital mechanics around a star, harvesting stellar radiation.",
    icon: "☀️",
    stats: {
      energyOutput: 50000,
      productionBonus: 15,
      researchBonus: 10,
      defenseRating: 20,
      populationCapacity: 100000,
      constructionTime: 3600,
      maintenanceCost: { metal: 500, crystal: 300, deuterium: 200, energy: 100 }
    },
    subStats: [
      { name: "Solar Efficiency", value: 85, icon: "⚡", description: "Capture rate of stellar energy" },
      { name: "Structural Integrity", value: 75, icon: "🔗", description: "Resistance to cosmic radiation" },
      { name: "Collection Surface", value: 90, icon: "📡", description: "Total collector area in millions of km²" },
      { name: "Heat Dissipation", value: 70, icon: "❄️", description: "Waste heat management capability" }
    ],
    researchRequired: ["Stellar Engineering Basics", "Advanced Materials"],
    buildingRequirements: [
      { name: "Advanced Shipyard", level: 5 },
      { name: "Orbital Lab", level: 3 }
    ],
    constructionBonus: 15,
    specialAbility: "Harvest - Generates 50,000 energy per turn, +15% production"
  },

  dyson_swarm_beta: {
    id: "dyson_swarm_beta",
    name: "Dyson Swarm Beta",
    type: "stellar_engineering",
    class: "class_1",
    tier: 1,
    description: "Enhanced solar collector swarm with improved efficiency and expanded capability.",
    icon: "☀️✨",
    stats: {
      energyOutput: 75000,
      productionBonus: 22,
      researchBonus: 15,
      defenseRating: 30,
      populationCapacity: 250000,
      constructionTime: 5400,
      maintenanceCost: { metal: 800, crystal: 500, deuterium: 300, energy: 150 }
    },
    subStats: [
      { name: "Solar Efficiency", value: 92, icon: "⚡", description: "Capture rate of stellar energy" },
      { name: "Structural Integrity", value: 85, icon: "🔗", description: "Resistance to cosmic radiation" },
      { name: "Collection Surface", value: 95, icon: "📡", description: "Total collector area in millions of km²" },
      { name: "Self-Repair Systems", value: 78, icon: "🔧", description: "Autonomous maintenance capability" }
    ],
    researchRequired: ["Advanced Stellar Engineering", "Exotic Materials"],
    buildingRequirements: [
      { name: "Advanced Shipyard", level: 8 },
      { name: "Orbital Lab", level: 5 }
    ],
    constructionBonus: 22,
    specialAbility: "Enhanced Harvest - 75,000 energy/turn, +22% production, repairs itself"
  },

  // TIER 2: RING WORLDS
  ring_world_genesis: {
    id: "ring_world_genesis",
    name: "Ring World Genesis",
    type: "stellar_engineering",
    class: "class_2",
    tier: 2,
    description: "A massive rotating ring orbiting a star. The inner surface provides habitable land equivalent to millions of Earths.",
    icon: "💍",
    stats: {
      energyOutput: 150000,
      productionBonus: 45,
      researchBonus: 35,
      defenseRating: 60,
      populationCapacity: 10000000,
      constructionTime: 14400,
      maintenanceCost: { metal: 3000, crystal: 2000, deuterium: 1500, energy: 500 }
    },
    subStats: [
      { name: "Habitable Surface", value: 100, icon: "🌍", description: "Land area equivalent (Earth = 1)" },
      { name: "Rotational Stability", value: 88, icon: "⚙️", description: "Spin consistency and balance" },
      { name: "Atmospheric System", value: 92, icon: "💨", description: "Life support efficiency" },
      { name: "Gravity Simulation", value: 85, icon: "⬆️", description: "Artificial gravity field strength" }
    ],
    researchRequired: ["Megastructure Theory", "Advanced Terraforming", "Exotic Materials"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 10 },
      { name: "Deep Space Lab", level: 8 }
    ],
    constructionBonus: 45,
    specialAbility: "Endless Habitat - Supports 10M population, +45% production, 150k energy"
  },

  ring_world_equilibrium: {
    id: "ring_world_equilibrium",
    name: "Ring World Equilibrium",
    type: "stellar_engineering",
    class: "class_2",
    tier: 2,
    description: "A stabilized ring world with advanced ecological management and perfect day-night cycles.",
    icon: "💍🌟",
    stats: {
      energyOutput: 200000,
      productionBonus: 60,
      researchBonus: 50,
      defenseRating: 80,
      populationCapacity: 25000000,
      constructionTime: 18000,
      maintenanceCost: { metal: 4500, crystal: 3000, deuterium: 2000, energy: 700 }
    },
    subStats: [
      { name: "Habitable Surface", value: 120, icon: "🌍", description: "Land area equivalent (Earth = 1)" },
      { name: "Biosphere Control", value: 95, icon: "🌿", description: "Ecosystem management capability" },
      { name: "Climate Regulation", value: 93, icon: "🌡️", description: "Temperature/weather control" },
      { name: "Self-Maintenance", value: 90, icon: "🔧", description: "Autonomous repair systems" }
    ],
    researchRequired: ["Megastructure Theory", "Advanced Terraforming", "Quantum Engineering", "Exotic Materials"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 12 },
      { name: "Deep Space Lab", level: 10 }
    ],
    constructionBonus: 60,
    specialAbility: "Perfect World - 25M population, +60% production, self-healing, 200k energy"
  },

  // TIER 3: DYSON SPHERES
  dyson_sphere_omega: {
    id: "dyson_sphere_omega",
    name: "Dyson Sphere Omega",
    type: "stellar_engineering",
    class: "class_3",
    tier: 3,
    description: "A complete solid shell surrounding a star, capturing all its stellar radiation.",
    icon: "⚫",
    stats: {
      energyOutput: 500000,
      productionBonus: 100,
      researchBonus: 80,
      defenseRating: 120,
      populationCapacity: 50000000,
      constructionTime: 36000,
      maintenanceCost: { metal: 10000, crystal: 8000, deuterium: 5000, energy: 2000 }
    },
    subStats: [
      { name: "Energy Capture", value: 100, icon: "⚡", description: "Percentage of star's output captured" },
      { name: "Structural Density", value: 98, icon: "🔩", description: "Material integrity rating" },
      { name: "Computational Power", value: 94, icon: "🧠", description: "Processing capability for maintenance" },
      { name: "Stability Index", value: 96, icon: "⚖️", description: "Orbital stability and equilibrium" }
    ],
    researchRequired: ["Kardashev Theory", "Megastructure Engineering", "Quantum Materials", "Exotic Materials"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 15 },
      { name: "Deep Space Lab", level: 12 }
    ],
    constructionBonus: 100,
    specialAbility: "Total Energy Capture - 500k energy/turn, +100% production, Kardashev Type II"
  },

  // TIER 4: MATRIOSHKA BRAIN
  matrioshka_brain: {
    id: "matrioshka_brain",
    name: "Matrioshka Brain",
    type: "space_anchor",
    class: "class_4",
    tier: 4,
    description: "Multiple nested Dyson spheres harvesting a star's energy for massive computational capacity.",
    icon: "🧠",
    stats: {
      energyOutput: 1000000,
      productionBonus: 180,
      researchBonus: 150,
      defenseRating: 180,
      populationCapacity: 100000000,
      constructionTime: 72000,
      maintenanceCost: { metal: 20000, crystal: 15000, deuterium: 10000, energy: 5000 }
    },
    subStats: [
      { name: "Computational Layers", value: 99, icon: "🧠", description: "Number of nested processing spheres" },
      { name: "Thinking Speed", value: 100, icon: "⚡", description: "Computational operations per second" },
      { name: "Memory Capacity", value: 97, icon: "💾", description: "Exabytes of storage available" },
      { name: "Quantum Computing", value: 95, icon: "⚛️", description: "Quantum processing capability" }
    ],
    researchRequired: ["Kardashev Theory", "Artificial Intelligence", "Quantum Computing", "Exotic Materials"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 20 },
      { name: "Deep Space Lab", level: 15 }
    ],
    constructionBonus: 180,
    specialAbility: "Computational Ascension - 1M energy, +180% production, +150% research, AI governance"
  },

  // TIER 5: MEGASTRUCTURE NETWORK
  megastructure_nexus: {
    id: "megastructure_nexus",
    name: "Megastructure Nexus",
    type: "dimensional_gateway",
    class: "class_5",
    tier: 5,
    description: "A transcendent network connecting multiple megastructures across space-time.",
    icon: "🌌",
    stats: {
      energyOutput: 2000000,
      productionBonus: 300,
      researchBonus: 250,
      defenseRating: 250,
      populationCapacity: 500000000,
      constructionTime: 144000,
      maintenanceCost: { metal: 50000, crystal: 40000, deuterium: 30000, energy: 15000 }
    },
    subStats: [
      { name: "Dimensional Links", value: 100, icon: "🌀", description: "Connected megastructure count" },
      { name: "Reality Warping", value: 92, icon: "✨", description: "Space-time manipulation capability" },
      { name: "Energy Redistribution", value: 98, icon: "📡", description: "Cross-dimensional power transfer" },
      { name: "Temporal Stability", value: 96, icon: "⏰", description: "Time consistency throughout network" }
    ],
    researchRequired: ["Kardashev Type III", "Dimensional Engineering", "Exotic Materials", "Reality Manipulation"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 25 },
      { name: "Deep Space Lab", level: 20 }
    ],
    constructionBonus: 300,
    specialAbility: "Transcendent Network - 2M energy, +300% production, Kardashev Type III civilization"
  },

  // SPECIAL STRUCTURES
  stellar_engine: {
    id: "stellar_engine",
    name: "Stellar Engine",
    type: "space_anchor",
    class: "class_3",
    tier: 3,
    description: "A massive engine that can move stars across the galaxy.",
    icon: "🚀",
    stats: {
      energyOutput: 300000,
      productionBonus: 70,
      researchBonus: 60,
      defenseRating: 100,
      populationCapacity: 1000000,
      constructionTime: 28800,
      maintenanceCost: { metal: 8000, crystal: 6000, deuterium: 4000, energy: 1500 }
    },
    subStats: [
      { name: "Thrust Output", value: 88, icon: "🔥", description: "Propulsion force in stellar units" },
      { name: "Directional Control", value: 92, icon: "🎯", description: "Precision navigation capability" },
      { name: "Stellar Stability", value: 90, icon: "⭐", description: "Star integrity during movement" },
      { name: "Fuel Efficiency", value: 85, icon: "⛽", description: "Energy consumption per unit movement" }
    ],
    researchRequired: ["Megastructure Engineering", "Stellar Propulsion"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 14 },
      { name: "Deep Space Lab", level: 10 }
    ],
    constructionBonus: 70,
    specialAbility: "Star Mover - Move entire star systems, 300k energy, +70% production"
  },

  binary_orbital_array: {
    id: "binary_orbital_array",
    name: "Binary Orbital Array",
    type: "stellar_engineering",
    class: "class_2",
    tier: 2,
    description: "Optimized collection structure for binary star systems, maximizing energy from both stars.",
    icon: "⭐⭐",
    stats: {
      energyOutput: 180000,
      productionBonus: 50,
      researchBonus: 40,
      defenseRating: 70,
      populationCapacity: 5000000,
      constructionTime: 10800,
      maintenanceCost: { metal: 2500, crystal: 1800, deuterium: 1200, energy: 600 }
    },
    subStats: [
      { name: "Dual Capture", value: 96, icon: "⚡", description: "Efficiency for binary systems" },
      { name: "Harmonic Balance", value: 89, icon: "⚖️", description: "Energy balancing between stars" },
      { name: "Orbital Synchronization", value: 91, icon: "🔄", description: "Synchronized rotation capability" },
      { name: "Adaptive Collectors", value: 87, icon: "📡", description: "Dynamic collector adjustment" }
    ],
    researchRequired: ["Stellar Engineering", "Binary System Mechanics"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 11 },
      { name: "Deep Space Lab", level: 7 }
    ],
    constructionBonus: 50,
    specialAbility: "Twin Harvest - Maximizes energy from binary stars, 180k energy, +50% production"
  },

  neutron_stellar_forge: {
    id: "neutron_stellar_forge",
    name: "Neutron Stellar Forge",
    type: "matter_converter",
    class: "class_3",
    tier: 3,
    description: "Harnesses the extreme physics of neutron stars to forge exotic matter.",
    icon: "💥",
    stats: {
      energyOutput: 280000,
      productionBonus: 80,
      researchBonus: 100,
      defenseRating: 110,
      populationCapacity: 2000000,
      constructionTime: 25200,
      maintenanceCost: { metal: 9000, crystal: 7000, deuterium: 5000, energy: 2500 }
    },
    subStats: [
      { name: "Exotic Matter Output", value: 94, icon: "⚛️", description: "Exotic matter production per turn" },
      { name: "Physics Stability", value: 88, icon: "🌀", description: "Stability of extreme physics" },
      { name: "Research Catalyst", value: 100, icon: "📚", description: "Research acceleration capability" },
      { name: "Radiation Management", value: 85, icon: "☢️", description: "Radiation containment rating" }
    ],
    researchRequired: ["Exotic Physics", "Neutron Star Engineering"],
    buildingRequirements: [
      { name: "Megastructure Forge", level: 13 },
      { name: "Deep Space Lab", level: 11 }
    ],
    constructionBonus: 80,
    specialAbility: "Exotic Forge - Creates exotic matter, 280k energy, +100% research"
  }
};

// RESEARCH TECHNOLOGIES FOR MEGA STRUCTURES
export const MEGA_STRUCTURE_RESEARCH = [
  {
    id: "stellar_engineering_basics",
    name: "Stellar Engineering Basics",
    description: "Foundation technology for harnessing stellar energy",
    researchTime: 1000,
    resources: { metal: 500, crystal: 300 },
    tier: 1,
    unlocks: ["Dyson Swarm Alpha"]
  },
  {
    id: "advanced_stellar_engineering",
    name: "Advanced Stellar Engineering",
    description: "Improved efficiency in stellar collectors",
    researchTime: 2000,
    resources: { metal: 1000, crystal: 800 },
    tier: 1,
    unlocks: ["Dyson Swarm Beta"]
  },
  {
    id: "megastructure_theory",
    name: "Megastructure Theory",
    description: "Understanding the physics of mega-scale constructs",
    researchTime: 3000,
    resources: { metal: 2000, crystal: 1500 },
    tier: 2,
    unlocks: ["Ring World Genesis"]
  },
  {
    id: "kardashev_theory",
    name: "Kardashev Theory",
    description: "Type II civilization megastructure design",
    researchTime: 5000,
    resources: { metal: 5000, crystal: 4000 },
    tier: 3,
    unlocks: ["Dyson Sphere Omega"]
  },
  {
    id: "quantum_computing",
    name: "Quantum Computing",
    description: "Advanced computational systems for AI governance",
    researchTime: 4000,
    resources: { metal: 3000, crystal: 3500 },
    tier: 4,
    unlocks: ["Matrioshka Brain"]
  },
  {
    id: "dimensional_engineering",
    name: "Dimensional Engineering",
    description: "Technology to manipulate space and time",
    researchTime: 6000,
    resources: { metal: 8000, crystal: 7000 },
    tier: 5,
    unlocks: ["Megastructure Nexus"]
  }
];

export function getMegaStructuresByTier(tier: number): MegaStructure[] {
  return Object.values(MEGA_STRUCTURES).filter(s => s.tier === tier);
}

export function getMegaStructuresByClass(className: string): MegaStructure[] {
  return Object.values(MEGA_STRUCTURES).filter(s => s.class === className);
}

export function calculateConstructionCost(structure: MegaStructure): { metal: number; crystal: number; deuterium: number } {
  const baseCost = structure.stats.constructionTime;
  return {
    metal: Math.round(baseCost * 2),
    crystal: Math.round(baseCost * 1.5),
    deuterium: Math.round(baseCost * 0.8)
  };
}
