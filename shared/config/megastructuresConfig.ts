/**
 * Megastructures System with 999 Levels, 99 Tiers, and Advanced Stats
 * Comprehensive mega-scale construction systems across the galaxy
 * @tag #megastructures #construction #stats #defense #offense
 */

import type { ProgressionStats } from './progressionSystemConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MegastructureType = 
  | 'dyson-sphere' 
  | 'ringworld' 
  | 'megaforge' 
  | 'research-nexus' 
  | 'orbital-defense'
  | 'generation-ship'
  | 'matter-converter'
  | 'dimensional-gate'
  | 'stellar-engine'
  | 'nova-cannon';

export type MegastructureClass = 
  | 'superweapon' 
  | 'infrastructure' 
  | 'research' 
  | 'production' 
  | 'defense' 
  | 'mobility' 
  | 'exotic';

export type MegastructureSubClass = 
  | 'offensive' 
  | 'defensive' 
  | 'support' 
  | 'hybrid' 
  | 'experimental' 
  | 'terraforming' 
  | 'dimensional';

export interface OffensiveStats {
  firepower: number;
  accuracy: number;
  range: number;
  rateOfFire: number;
  ammoCapacity: number;
  penetration: number;
  criticalChance: number;
  damageType: string; // 'kinetic', 'energy', 'exotic', 'dimensional'
}

export interface DefensiveStats {
  armorStrength: number;
  shieldCapacity: number;
  shieldRegeneration: number;
  evasion: number;
  damageReduction: number;
  reflectionChance: number;
  repairRate: number;
  selfHealingCapacity: number;
}

export interface MegastructureAttributes {
  // Power & Energy
  powerGeneration: number;
  powerConsumption: number;
  energyStorage: number;
  efficiency: number;
  
  // Production
  productionRate: number;
  craftingSpeed: number;
  resourceProcessing: number;
  
  // Computational
  computingPower: number;
  dataProcessing: number;
  aiCapability: number;
  
  // Exotic
  dimensionalResonance: number;
  realityStability: number;
  quantumPotential: number;
}

export interface MegastructureStats {
  // Base Stats
  power: number;
  efficiency: number;
  resilience: number;
  capacity: number;
  
  // Sub Stats
  precision: number;
  endurance: number;
  output: number;
  control: number;
  
  // Combat Stats
  offense: OffensiveStats;
  defense: DefensiveStats;
  
  // Attributes
  tech: number;
  command: number;
  logistics: number;
  survivability: number;
}

export interface Megastructure {
  id: string;
  name: string;
  type: MegastructureType;
  class: MegastructureClass;
  subClass: MegastructureSubClass;
  
  description: string;
  lore: string;
  
  // Progression
  level: number;
  tier: number;
  experience: number;
  
  // Stats
  baseStats: MegastructureStats;
  currentStats: MegastructureStats;
  
  // Progression multipliers
  levelMultiplier: number;
  tierMultiplier: number;
  totalMultiplier: number;
  
  // Properties
  size: 'compact' | 'huge' | 'massive' | 'colossal' | 'planetary' | 'solar' | 'galactic';
  constructionTime: number; // in game turns
  completionPercentage: number;
  
  // Location
  coordinates: { x: number; y: number; z: number };
  sector: string;
  orbitalBody: string;
  
  // Resources
  resourcesCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    rare: number;
  };
  
  maintenanceCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  
  // Functionality
  isActive: boolean;
  uptime: number; // 0-100%
  efficiency: number; // 0-100%
  
  // Strategic
  strategicValue: number;
  threatLevel: number;
  primaryFunction: string;
  secondaryFunctions: string[];
}

// ============================================================================
// MEGASTRUCTURE DEFINITIONS (10 TYPES × MULTIPLE CLASSES)
// ============================================================================

function createMegastructureTemplate(
  id: string,
  name: string,
  type: MegastructureType,
  modelClass: MegastructureClass,
  subClass: MegastructureSubClass,
  size: Megastructure['size'],
  primaryFunction: string,
  baseStats: MegastructureStats
): Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'> {
  return {
    id,
    name,
    type,
    class: modelClass,
    subClass,
    description: `${name} - A ${size} megastructure of ${type} class`,
    lore: `Ancient technology of unimaginable scale and power`,
    baseStats,
    constructionTime: 1000,
    completionPercentage: 0,
    resourcesCost: {
      metal: 10000000,
      crystal: 8000000,
      deuterium: 6000000,
      energy: 5000000,
      rare: 2000000,
    },
    maintenanceCost: {
      metal: 100000,
      crystal: 80000,
      deuterium: 60000,
      energy: 50000,
    },
    size,
    strategicValue: 90,
    threatLevel: 85,
    primaryFunction,
    secondaryFunctions: [],
  };
}

const baseOffensiveStats: OffensiveStats = {
  firepower: 500,
  accuracy: 85,
  range: 10000,
  rateOfFire: 10,
  ammoCapacity: 100000,
  penetration: 80,
  criticalChance: 15,
  damageType: 'kinetic',
};

const baseDefensiveStats: DefensiveStats = {
  armorStrength: 400,
  shieldCapacity: 50000,
  shieldRegeneration: 100,
  evasion: 10,
  damageReduction: 60,
  reflectionChance: 20,
  repairRate: 250,
  selfHealingCapacity: 1000,
};

const baseAttributes: MegastructureAttributes = {
  powerGeneration: 1000000,
  powerConsumption: 500000,
  energyStorage: 10000000,
  efficiency: 95,
  productionRate: 1000,
  craftingSpeed: 5000,
  resourceProcessing: 50000,
  computingPower: 1000000,
  dataProcessing: 500000,
  aiCapability: 95,
  dimensionalResonance: 80,
  realityStability: 90,
  quantumPotential: 85,
};

export const MEGASTRUCTURES: Omit<Megastructure, 'level' | 'tier' | 'experience' | 'currentStats' | 'levelMultiplier' | 'tierMultiplier' | 'totalMultiplier' | 'coordinates' | 'sector' | 'orbitalBody' | 'isActive' | 'uptime' | 'efficiency'>[] = [
  // 1. DYSON SPHERE - Energy generation megastructure
  createMegastructureTemplate(
    'mega-dyson-01',
    'Dyson Sphere Prime',
    'dyson-sphere',
    'infrastructure',
    'support',
    'galactic',
    'Stellar energy harvesting',
    {
      power: 1000,
      efficiency: 98,
      resilience: 800,
      capacity: 10000,
      precision: 90,
      endurance: 850,
      output: 1200,
      control: 950,
      offense: { ...baseOffensiveStats, damageType: 'energy' },
      defense: { ...baseDefensiveStats, shieldCapacity: 100000 },
      tech: 200,
      command: 150,
      logistics: 180,
      survivability: 850,
    }
  ),
  
  // 2. RINGWORLD - Massive orbital habitat
  createMegastructureTemplate(
    'mega-ringworld-01',
    'Ringworld Constructor',
    'ringworld',
    'infrastructure',
    'support',
    'solar',
    'Planetary-scale habitat construction',
    {
      power: 950,
      efficiency: 96,
      resilience: 900,
      capacity: 15000,
      precision: 100,
      endurance: 950,
      output: 1100,
      control: 1000,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, armorStrength: 600 },
      tech: 220,
      command: 160,
      logistics: 200,
      survivability: 900,
    }
  ),
  
  // 3. MEGAFORGE - Production facility
  createMegastructureTemplate(
    'mega-forge-01',
    'Megaforge Titan',
    'megaforge',
    'production',
    'hybrid',
    'massive',
    'Weapon and unit production',
    {
      power: 800,
      efficiency: 99,
      resilience: 600,
      capacity: 8000,
      precision: 110,
      endurance: 700,
      output: 1500,
      control: 1100,
      offense: baseOffensiveStats,
      defense: baseDefensiveStats,
      tech: 180,
      command: 120,
      logistics: 220,
      survivability: 700,
    }
  ),
  
  // 4. RESEARCH NEXUS - Scientific advancement
  createMegastructureTemplate(
    'mega-nexus-01',
    'Research Nexus Prime',
    'research-nexus',
    'research',
    'support',
    'massive',
    'Scientific breakthrough acceleration',
    {
      power: 700,
      efficiency: 99,
      resilience: 500,
      capacity: 5000,
      precision: 150,
      endurance: 600,
      output: 800,
      control: 1200,
      offense: baseOffensiveStats,
      defense: baseDefensiveStats,
      tech: 300,
      command: 100,
      logistics: 150,
      survivability: 600,
    }
  ),
  
  // 5. ORBITAL FORTRESS - Defense structure
  createMegastructureTemplate(
    'mega-fortress-01',
    'Orbital Fortress Omega',
    'orbital-defense',
    'defense',
    'defensive',
    'huge',
    'Planetary defense and orbital control',
    {
      power: 900,
      efficiency: 97,
      resilience: 1000,
      capacity: 7000,
      precision: 120,
      endurance: 1100,
      output: 600,
      control: 900,
      offense: { ...baseOffensiveStats, firepower: 800, range: 20000 },
      defense: { ...baseDefensiveStats, armorStrength: 800, shieldCapacity: 150000 },
      tech: 190,
      command: 200,
      logistics: 170,
      survivability: 1000,
    }
  ),
  
  // 6. GENERATION SHIP - Interstellar colonization
  createMegastructureTemplate(
    'mega-genship-01',
    'Generation Ship Exodus',
    'generation-ship',
    'mobility',
    'support',
    'planetary',
    'Interstellar colonization and migration',
    {
      power: 850,
      efficiency: 93,
      resilience: 750,
      capacity: 12000,
      precision: 85,
      endurance: 900,
      output: 700,
      control: 850,
      offense: { ...baseOffensiveStats, firepower: 300 },
      defense: { ...baseDefensiveStats, armorStrength: 500, shieldCapacity: 80000 },
      tech: 210,
      command: 140,
      logistics: 250,
      survivability: 800,
    }
  ),
  
  // 7. MATTER CONVERTER - Resource transformation
  createMegastructureTemplate(
    'mega-converter-01',
    'Matter Converter Nexus',
    'matter-converter',
    'production',
    'hybrid',
    'colossal',
    'Universal matter-energy conversion',
    {
      power: 920,
      efficiency: 98,
      resilience: 650,
      capacity: 9000,
      precision: 130,
      endurance: 750,
      output: 1400,
      control: 1050,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, shieldCapacity: 90000 },
      tech: 250,
      command: 130,
      logistics: 210,
      survivability: 750,
    }
  ),
  
  // 8. DIMENSIONAL GATE - Exotic portal technology
  createMegastructureTemplate(
    'mega-gate-01',
    'Dimensional Gate Infinity',
    'dimensional-gate',
    'exotic',
    'experimental',
    'massive',
    'Dimensional rifts and exotic teleportation',
    {
      power: 1050,
      efficiency: 85,
      resilience: 550,
      capacity: 4000,
      precision: 200,
      endurance: 500,
      output: 500,
      control: 1500,
      offense: { ...baseOffensiveStats, damageType: 'dimensional', penetration: 150 },
      defense: { ...baseDefensiveStats, reflectionChance: 80 },
      tech: 350,
      command: 80,
      logistics: 100,
      survivability: 550,
    }
  ),
  
  // 9. STELLAR ENGINE - Star manipulation
  createMegastructureTemplate(
    'mega-engine-01',
    'Stellar Engine Dyson',
    'stellar-engine',
    'mobility',
    'hybrid',
    'solar',
    'Star system propulsion and movement',
    {
      power: 980,
      efficiency: 92,
      resilience: 850,
      capacity: 11000,
      precision: 110,
      endurance: 950,
      output: 1300,
      control: 1100,
      offense: baseOffensiveStats,
      defense: { ...baseDefensiveStats, armorStrength: 700 },
      tech: 290,
      command: 170,
      logistics: 240,
      survivability: 900,
    }
  ),
  
  // 10. NOVA CANNON - Ultimate weapon
  createMegastructureTemplate(
    'mega-cannon-01',
    'Nova Cannon Apocalypse',
    'nova-cannon',
    'superweapon',
    'offensive',
    'colossal',
    'Stellar-scale weaponized devastation',
    {
      power: 1100,
      efficiency: 94,
      resilience: 700,
      capacity: 6000,
      precision: 140,
      endurance: 800,
      output: 2000,
      control: 1000,
      offense: { ...baseOffensiveStats, firepower: 2000, range: 100000, damageType: 'stellar' },
      defense: { ...baseDefensiveStats, armorStrength: 900 },
      tech: 280,
      command: 180,
      logistics: 160,
      survivability: 800,
    }
  ),
];

// ============================================================================
// MEGASTRUCTURE LEVELS & TIERS
// ============================================================================

export class MegastructureProgression {
  /**
   * Calculate level multiplier (1-999)
   */
  static getLevelMultiplier(level: number): number {
    return 1.0 + (0.015 * (level - 1)); // 1.0 to 15.98x
  }
  
  /**
   * Calculate tier multiplier (1-99)
   */
  static getTierMultiplier(tier: number): number {
    return 1.0 + (0.08 * (tier - 1)); // 1.0 to 8.84x
  }
  
  /**
   * Calculate total multiplier
   */
  static getTotalMultiplier(level: number, tier: number): number {
    return this.getLevelMultiplier(level) * this.getTierMultiplier(tier);
  }
  
  /**
   * Calculate stat at level and tier
   */
  static calculateStat(baseStat: number, level: number, tier: number): number {
    const levelMult = this.getLevelMultiplier(level);
    const tierMult = this.getTierMultiplier(tier);
    const levelBonus = 8 * (level - 1);
    const tierBonus = 100 * (tier - 1);
    
    return Math.floor((baseStat * levelMult * tierMult) + levelBonus + tierBonus);
  }
  
  /**
   * Calculate all stats for a megastructure
   */
  static calculateAllStats(baseStats: MegastructureStats, level: number, tier: number): MegastructureStats {
    return {
      power: this.calculateStat(baseStats.power, level, tier),
      efficiency: this.calculateStat(baseStats.efficiency, level, tier),
      resilience: this.calculateStat(baseStats.resilience, level, tier),
      capacity: this.calculateStat(baseStats.capacity, level, tier),
      precision: this.calculateStat(baseStats.precision, level, tier),
      endurance: this.calculateStat(baseStats.endurance, level, tier),
      output: this.calculateStat(baseStats.output, level, tier),
      control: this.calculateStat(baseStats.control, level, tier),
      offense: {
        firepower: this.calculateStat(baseStats.offense.firepower, level, tier),
        accuracy: this.calculateStat(baseStats.offense.accuracy, level, tier),
        range: this.calculateStat(baseStats.offense.range, level, tier),
        rateOfFire: this.calculateStat(baseStats.offense.rateOfFire, level, tier),
        ammoCapacity: this.calculateStat(baseStats.offense.ammoCapacity, level, tier),
        penetration: this.calculateStat(baseStats.offense.penetration, level, tier),
        criticalChance: Math.min(this.calculateStat(baseStats.offense.criticalChance, level, tier), 100),
        damageType: baseStats.offense.damageType,
      },
      defense: {
        armorStrength: this.calculateStat(baseStats.defense.armorStrength, level, tier),
        shieldCapacity: this.calculateStat(baseStats.defense.shieldCapacity, level, tier),
        shieldRegeneration: this.calculateStat(baseStats.defense.shieldRegeneration, level, tier),
        evasion: Math.min(this.calculateStat(baseStats.defense.evasion, level, tier), 100),
        damageReduction: Math.min(this.calculateStat(baseStats.defense.damageReduction, level, tier), 95),
        reflectionChance: Math.min(this.calculateStat(baseStats.defense.reflectionChance, level, tier), 100),
        repairRate: this.calculateStat(baseStats.defense.repairRate, level, tier),
        selfHealingCapacity: this.calculateStat(baseStats.defense.selfHealingCapacity, level, tier),
      },
      tech: this.calculateStat(baseStats.tech, level, tier),
      command: this.calculateStat(baseStats.command, level, tier),
      logistics: this.calculateStat(baseStats.logistics, level, tier),
      survivability: this.calculateStat(baseStats.survivability, level, tier),
    };
  }
}

// ============================================================================
// MEGASTRUCTURE CREATION & MANAGEMENT
// ============================================================================

/**
 * Create a new megastructure at specified level and tier
 */
export function createMegastructure(
  templateId: string,
  customId: string,
  level: number = 1,
  tier: number = 1,
  x: number = 0,
  y: number = 0,
  z: number = 0,
  sector: string = 'Unknown'
): Megastructure | null {
  const template = MEGASTRUCTURES.find(m => m.id === templateId);
  if (!template) return null;
  
  const clampedLevel = Math.max(1, Math.min(level, 999));
  const clampedTier = Math.max(1, Math.min(tier, 99));
  const levelMult = MegastructureProgression.getLevelMultiplier(clampedLevel);
  const tierMult = MegastructureProgression.getTierMultiplier(clampedTier);
  const totalMult = levelMult * tierMult;
  
  const currentStats = MegastructureProgression.calculateAllStats(template.baseStats, clampedLevel, clampedTier);
  
  return {
    ...template,
    id: customId,
    level: clampedLevel,
    tier: clampedTier,
    experience: 0,
    currentStats,
    levelMultiplier: levelMult,
    tierMultiplier: tierMult,
    totalMultiplier: totalMult,
    coordinates: { x, y, z },
    sector,
    orbitalBody: 'Unassigned',
    isActive: false,
    uptime: 0,
    efficiency: 100,
  };
}

/**
 * Upgrade megastructure level
 */
export function upgradeMegastructureLevel(mega: Megastructure, levels: number = 1): Megastructure {
  const newLevel = Math.min(mega.level + levels, 999);
  const newStats = MegastructureProgression.calculateAllStats(mega.baseStats, newLevel, mega.tier);
  
  return {
    ...mega,
    level: newLevel,
    currentStats: newStats,
    levelMultiplier: MegastructureProgression.getLevelMultiplier(newLevel),
    totalMultiplier: MegastructureProgression.getTotalMultiplier(newLevel, mega.tier),
  };
}

/**
 * Upgrade megastructure tier
 */
export function upgradeMegastructureTier(mega: Megastructure, tiers: number = 1): Megastructure {
  const newTier = Math.min(mega.tier + tiers, 99);
  const newStats = MegastructureProgression.calculateAllStats(mega.baseStats, mega.level, newTier);
  
  return {
    ...mega,
    tier: newTier,
    currentStats: newStats,
    tierMultiplier: MegastructureProgression.getTierMultiplier(newTier),
    totalMultiplier: MegastructureProgression.getTotalMultiplier(mega.level, newTier),
  };
}

/**
 * Activate/deactivate megastructure
 */
export function toggleMegastructure(mega: Megastructure, active: boolean): Megastructure {
  return {
    ...mega,
    isActive: active,
  };
}

/**
 * Update megastructure efficiency
 */
export function updateMegastructureEfficiency(mega: Megastructure, efficiency: number): Megastructure {
  return {
    ...mega,
    efficiency: Math.max(0, Math.min(efficiency, 100)),
  };
}

/**
 * Get offensive power rating
 */
export function getOffensivePower(mega: Megastructure): number {
  const stats = mega.currentStats;
  return Math.floor(
    stats.offense.firepower * (stats.offense.accuracy / 100) * 
    (1 + stats.offense.penetration / 100) * 
    (1 + stats.offense.criticalChance / 100)
  );
}

/**
 * Get defensive power rating
 */
export function getDefensivePower(mega: Megastructure): number {
  const stats = mega.currentStats;
  return Math.floor(
    (stats.defense.armorStrength * 2) + 
    stats.defense.shieldCapacity + 
    (stats.defense.damageReduction * 100) +
    (stats.defense.reflectionChance * 50)
  );
}

/**
 * Get total strategic value
 */
export function getStrategicValue(mega: Megastructure): number {
  const offensive = getOffensivePower(mega);
  const defensive = getDefensivePower(mega);
  const efficiency = mega.currentStats.efficiency;
  
  return Math.floor((offensive + defensive) * (efficiency / 100));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get megastructure by type
 */
export function getMegastructuresByType(type: MegastructureType): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.type === type);
}

/**
 * Get megastructure by class
 */
export function getMegastructuresByClass(modelClass: MegastructureClass): typeof MEGASTRUCTURES {
  return MEGASTRUCTURES.filter(m => m.class === modelClass);
}

/**
 * Get all megastructure types
 */
export function getAllMegastructureTypes(): MegastructureType[] {
  return Array.from(new Set(MEGASTRUCTURES.map(m => m.type)));
}

/**
 * Get all megastructure classes
 */
export function getAllMegastructureClasses(): MegastructureClass[] {
  return Array.from(new Set(MEGASTRUCTURES.map(m => m.class)));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MEGASTRUCTURES,
  MegastructureProgression,
  createMegastructure,
  upgradeMegastructureLevel,
  upgradeMegastructureTier,
  toggleMegastructure,
  updateMegastructureEfficiency,
  getOffensivePower,
  getDefensivePower,
  getStrategicValue,
  getMegastructuresByType,
  getMegastructuresByClass,
  getAllMegastructureTypes,
  getAllMegastructureClasses,
};
