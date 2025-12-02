// Game Configuration - Balance, economy, and rules
export const GAME_CONFIG = {
  // Resource production rates (per second base rate)
  resources: {
    metalPerSecond: 0.1,
    crystalPerSecond: 0.05,
    deuteriumPerSecond: 0.02,
    energyPerSecond: 0.15,
  },

  // Building costs and production
  buildings: {
    metalMine: { metal: 60, crystal: 15, deuterium: 5, time: 30 },
    crystalMine: { metal: 48, crystal: 24, deuterium: 10, time: 30 },
    deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 30, time: 30 },
    solarPlant: { metal: 75, crystal: 30, deuterium: 0, time: 30 },
    roboticsFactory: { metal: 400, crystal: 120, deuterium: 200, time: 120 },
    shipyard: { metal: 400, crystal: 200, deuterium: 100, time: 120 },
    researchLab: { metal: 200, crystal: 400, deuterium: 200, time: 120 },
  },

  // Unit/Ship costs
  units: {
    lightFighter: { metal: 3000, crystal: 1000, deuterium: 400, time: 10 },
    heavyFighter: { metal: 6000, crystal: 4000, deuterium: 1000, time: 30 },
    cruiser: { metal: 20000, crystal: 7000, deuterium: 2000, time: 60 },
    battleship: { metal: 45000, crystal: 15000, deuterium: 4000, time: 120 },
    smallCargo: { metal: 2000, crystal: 2000, deuterium: 500, time: 15 },
    largeCargo: { metal: 6000, crystal: 6000, deuterium: 1000, time: 30 },
    colonyShip: { metal: 10000, crystal: 20000, deuterium: 1000, time: 45 },
  },

  // Technology costs and progression
  technology: {
    baseMetalCost: 200,
    baseCrystalCost: 100,
    baseDeuteriumCost: 50,
    costMultiplier: 1.75,
    researchTime: 3600, // seconds
  },

  // Combat mechanics
  combat: {
    shieldRegeneration: 0.1, // per turn
    evasionBase: 5, // base evasion %
    accuracyBase: 90, // base accuracy %
    damageVariance: 0.15, // ±15%
    maxCombatTurns: 20,
  },

  // Kardashev scale progression
  kardashev: {
    levels: 18,
    requirements: {
      metal: 1000000,
      crystal: 500000,
      deuterium: 250000,
      research: 100,
    },
  },

  // Economy / Market
  market: {
    minPrice: 0.001,
    maxPrice: 1000,
    transactionFee: 0.02, // 2% fee
    orderExpirationTime: 86400000, // 24 hours in ms
  },

  // Alliance settings
  alliance: {
    minMembers: 1,
    maxMembers: 50,
    creationCost: { metal: 100000, crystal: 50000, deuterium: 10000 },
    dipomaticLevelRequirement: 5,
  },

  // Mission/Fleet mechanics
  missions: {
    fleetSpeed: 1, // multiplier for base speed
    minMissionTime: 60000, // 1 minute in ms
    maxActiveMissions: 100,
  },

  // Game speed settings
  gameSpeed: {
    economySpeed: 1,
    fleetSpeed: 1,
    researchSpeed: 1,
    buildingSpeed: 1,
  },

  // Session and gameplay
  gameplay: {
    sessionTimeout: 604800000, // 7 days in ms
    inactivityThreshold: 2592000000, // 30 days in ms
    maxPlayers: 10000,
    newPlayerStartingResources: {
      metal: 1000,
      crystal: 500,
      deuterium: 0,
      energy: 0,
    },
  },

  // Turn system - Players gain turns over time
  turns: {
    turnsPerMinute: 6,           // 6 turns gained per minute (1 every 10 seconds)
    maxCurrentTurns: 1000,       // Maximum turns that can be stored
    startingTurns: 50,           // New players start with 50 turns
    offlineAccrual: true,        // Turns accumulate while offline
    maxOfflineAccrualHours: 24,  // Maximum hours of offline turn accrual
  },
};

// Tier-based resource multipliers for different government types
export const GOVERNMENT_MULTIPLIERS = {
  democracy: { efficiency: 1.2, corruption: 0.5, stability: 1.0 },
  corporate: { efficiency: 1.4, corruption: 1.2, stability: 0.8 },
  military: { efficiency: 1.0, corruption: 0.8, stability: 0.9 },
  theocracy: { efficiency: 0.9, corruption: 0.6, stability: 1.1 },
  monarchy: { efficiency: 1.1, corruption: 1.0, stability: 1.0 },
};

// Race-specific bonuses
export const RACE_BONUSES = {
  terran: { production: 1.0, combat: 1.0, research: 1.0 },
  humanoid: { production: 0.95, combat: 1.05, research: 1.0 },
  silicon: { production: 1.1, combat: 0.9, research: 1.05 },
  energy: { production: 0.9, combat: 1.1, research: 1.0 },
  hybrid: { production: 1.0, combat: 1.0, research: 1.05 },
};
