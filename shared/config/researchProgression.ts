/**
 * Research Progression System
 * Supports 1-99 tiers and 1-999 levels for all research technologies
 */

import { ProgressionSystem, SCALING_PROFILES } from './progressionSystem';

export type ResearchBranch = 
  | 'energy'
  | 'propulsion'
  | 'weapons'
  | 'defense'
  | 'shields'
  | 'construction'
  | 'computers'
  | 'espionage'
  | 'megastructure'
  | 'economy'
  | 'genetics'
  | 'quantum'
  | 'exotic';

export interface ResearchConfig {
  baseCost: { metal: number; crystal: number; deuterium: number };
  baseTime: number;
  baseStats: Record<string, number>;
  unlocksBuild: string[];
  unlocksUnit: string[];
  unlocksResearch: string[];
  bonusPerLevel: Record<string, number>;
  bonusPerTier: Record<string, number>;
  prerequisites: string[];
}

export interface Research {
  id: string;
  name: string;
  branch: ResearchBranch;
  tier: number;
  maxLevel: number;
  description: string;
  icon: string;
  category: string;
}

// Research tier progression requirements
export const RESEARCH_UNLOCK_REQS: Record<number, string[]> = {
  1: [],
  3: ['Energy Technology Level 1'],
  5: ['Advanced Engineering Level 1'],
  10: ['Quantum Physics Level 5'],
  15: ['Exotic Matter Research Level 3'],
  20: ['Megastructure Engineering Level 10'],
  25: ['Ascension Studies Level 1'],
  30: ['Reality Engineering Level 1'],
  50: ['Godhood Studies Level 10'],
  99: ['Ultimate Knowledge Level 1'],
};

// Energy Branch
export const ENERGY_TECHNOLOGIES: Research[] = [
  {
    id: 'energy-tech-1',
    name: 'Basic Energy',
    branch: 'energy',
    tier: 1,
    maxLevel: 999,
    description: 'Understanding of fundamental energy systems',
    icon: '⚡',
    category: 'Foundational',
  },
  {
    id: 'energy-tech-2',
    name: 'Advanced Energy',
    branch: 'energy',
    tier: 5,
    maxLevel: 999,
    description: 'Improved energy generation and efficiency',
    icon: '⚡⚡',
    category: 'Intermediate',
  },
  {
    id: 'energy-tech-3',
    name: 'Nuclear Fission',
    branch: 'energy',
    tier: 10,
    maxLevel: 999,
    description: 'Harness nuclear fission for power',
    icon: '☢️',
    category: 'Advanced',
  },
  {
    id: 'energy-tech-4',
    name: 'Nuclear Fusion',
    branch: 'energy',
    tier: 15,
    maxLevel: 999,
    description: 'Control fusion reactions for massive energy output',
    icon: '☢️☢️',
    category: 'Advanced',
  },
];

// Propulsion Branch
export const PROPULSION_TECHNOLOGIES: Research[] = [
  {
    id: 'combustion-drive',
    name: 'Combustion Drive',
    branch: 'propulsion',
    tier: 1,
    maxLevel: 999,
    description: 'Chemical-based rocket propulsion',
    icon: '🚀',
    category: 'Foundational',
  },
  {
    id: 'impulse-drive',
    name: 'Impulse Drive',
    branch: 'propulsion',
    tier: 3,
    maxLevel: 999,
    description: 'Ion-based propulsion for increased speed',
    icon: '💫',
    category: 'Intermediate',
  },
  {
    id: 'hyperdrive',
    name: 'Hyperdrive',
    branch: 'propulsion',
    tier: 10,
    maxLevel: 999,
    description: 'Achieve faster-than-light travel',
    icon: '⚡🚀',
    category: 'Advanced',
  },
  {
    id: 'warp-drive',
    name: 'Warp Drive',
    branch: 'propulsion',
    tier: 20,
    maxLevel: 999,
    description: 'Manipulate spacetime for instantaneous travel',
    icon: '🌀🚀',
    category: 'Exotic',
  },
];

// Weapons Branch
export const WEAPON_TECHNOLOGIES: Research[] = [
  {
    id: 'laser-tech',
    name: 'Laser Technology',
    branch: 'weapons',
    tier: 3,
    maxLevel: 999,
    description: 'Harness laser beams as weapons',
    icon: '🔫',
    category: 'Foundational',
  },
  {
    id: 'plasma-tech',
    name: 'Plasma Weapons',
    branch: 'weapons',
    tier: 8,
    maxLevel: 999,
    description: 'Generate and weaponize plasma',
    icon: '🔥',
    category: 'Intermediate',
  },
  {
    id: 'particle-cannon',
    name: 'Particle Cannons',
    branch: 'weapons',
    tier: 15,
    maxLevel: 999,
    description: 'Accelerate particles to near-light speeds',
    icon: '⚛️',
    category: 'Advanced',
  },
  {
    id: 'antimatter-weapons',
    name: 'Antimatter Weapons',
    branch: 'weapons',
    tier: 25,
    maxLevel: 999,
    description: 'Unleash the power of antimatter annihilation',
    icon: '💥',
    category: 'Exotic',
  },
];

// Defense Branch
export const DEFENSE_TECHNOLOGIES: Research[] = [
  {
    id: 'armor-tech',
    name: 'Armor Technology',
    branch: 'defense',
    tier: 2,
    maxLevel: 999,
    description: 'Improve hull armor and protection',
    icon: '🛡️',
    category: 'Foundational',
  },
  {
    id: 'shield-tech',
    name: 'Shield Technology',
    branch: 'defense',
    tier: 5,
    maxLevel: 999,
    description: 'Generate protective energy shields',
    icon: '✨',
    category: 'Intermediate',
  },
  {
    id: 'advanced-shields',
    name: 'Advanced Shield Systems',
    branch: 'defense',
    tier: 12,
    maxLevel: 999,
    description: 'Multi-layered adaptive shield technology',
    icon: '✨✨',
    category: 'Advanced',
  },
  {
    id: 'null-field',
    name: 'Null Field Technology',
    branch: 'defense',
    tier: 30,
    maxLevel: 999,
    description: 'Create zones where damage is negated',
    icon: '⭕',
    category: 'Exotic',
  },
];

// Computer Branch
export const COMPUTER_TECHNOLOGIES: Research[] = [
  {
    id: 'computer-1',
    name: 'Basic Computing',
    branch: 'computers',
    tier: 1,
    maxLevel: 999,
    description: 'Electronic computation systems',
    icon: '💻',
    category: 'Foundational',
  },
  {
    id: 'computer-2',
    name: 'Advanced Computing',
    branch: 'computers',
    tier: 5,
    maxLevel: 999,
    description: 'Quantum-assisted computation',
    icon: '⚙️',
    category: 'Intermediate',
  },
  {
    id: 'ai-research',
    name: 'Artificial Intelligence',
    branch: 'computers',
    tier: 10,
    maxLevel: 999,
    description: 'Create intelligent AI systems',
    icon: '🤖',
    category: 'Advanced',
  },
  {
    id: 'godai',
    name: 'Godlike AI',
    branch: 'computers',
    tier: 50,
    maxLevel: 999,
    description: 'AI systems of transcendent intelligence',
    icon: '👁️',
    category: 'Exotic',
  },
];

// Megastructure Branch
export const MEGASTRUCTURE_TECHNOLOGIES: Research[] = [
  {
    id: 'mega-construct-1',
    name: 'Megastructure Engineering I',
    branch: 'megastructure',
    tier: 10,
    maxLevel: 999,
    description: 'Basic understanding of megastructure construction',
    icon: '🏗️',
    category: 'Foundational',
  },
  {
    id: 'mega-construct-2',
    name: 'Megastructure Engineering II',
    branch: 'megastructure',
    tier: 20,
    maxLevel: 999,
    description: 'Advanced megastructure design',
    icon: '🏗️🏗️',
    category: 'Intermediate',
  },
  {
    id: 'dyson-engineering',
    name: 'Dyson Sphere Engineering',
    branch: 'megastructure',
    tier: 30,
    maxLevel: 999,
    description: 'Design and build dyson spheres',
    icon: '☀️',
    category: 'Advanced',
  },
  {
    id: 'ringworld-engineering',
    name: 'Ringworld Engineering',
    branch: 'megastructure',
    tier: 35,
    maxLevel: 999,
    description: 'Construct massive ring habitats',
    icon: '🪐',
    category: 'Advanced',
  },
];

// Quantum Branch
export const QUANTUM_TECHNOLOGIES: Research[] = [
  {
    id: 'quantum-basics',
    name: 'Quantum Mechanics',
    branch: 'quantum',
    tier: 8,
    maxLevel: 999,
    description: 'Understanding quantum phenomena',
    icon: '⚛️',
    category: 'Foundational',
  },
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    branch: 'quantum',
    tier: 12,
    maxLevel: 999,
    description: 'Harness quantum superposition for computation',
    icon: '⚛️💻',
    category: 'Intermediate',
  },
  {
    id: 'quantum-entanglement',
    name: 'Quantum Entanglement',
    branch: 'quantum',
    tier: 20,
    maxLevel: 999,
    description: 'Use entanglement for instant communication',
    icon: '🔗',
    category: 'Advanced',
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    branch: 'quantum',
    tier: 28,
    maxLevel: 999,
    description: 'Transport matter across quantum channels',
    icon: '✨➡️✨',
    category: 'Exotic',
  },
];

// Exotic Branch
export const EXOTIC_TECHNOLOGIES: Research[] = [
  {
    id: 'exotic-matter',
    name: 'Exotic Matter Research',
    branch: 'exotic',
    tier: 15,
    maxLevel: 999,
    description: 'Understanding exotic and hypothetical matter',
    icon: '💫',
    category: 'Advanced',
  },
  {
    id: 'dark-energy',
    name: 'Dark Energy Manipulation',
    branch: 'exotic',
    tier: 25,
    maxLevel: 999,
    description: 'Harness dark energy forces',
    icon: '🌑',
    category: 'Exotic',
  },
  {
    id: 'reality-engineering',
    name: 'Reality Engineering',
    branch: 'exotic',
    tier: 40,
    maxLevel: 999,
    description: 'Manipulate reality itself',
    icon: '🌀',
    category: 'Godlike',
  },
  {
    id: 'ascension-tech',
    name: 'Ascension Technology',
    branch: 'exotic',
    tier: 75,
    maxLevel: 999,
    description: 'Technology to transcend mortality',
    icon: '👑',
    category: 'Transcendent',
  },
];

// All technologies
export const ALL_TECHNOLOGIES: Research[] = [
  ...ENERGY_TECHNOLOGIES,
  ...PROPULSION_TECHNOLOGIES,
  ...WEAPON_TECHNOLOGIES,
  ...DEFENSE_TECHNOLOGIES,
  ...COMPUTER_TECHNOLOGIES,
  ...MEGASTRUCTURE_TECHNOLOGIES,
  ...QUANTUM_TECHNOLOGIES,
  ...EXOTIC_TECHNOLOGIES,
];

// Research configs
export const RESEARCH_CONFIGS: Record<string, ResearchConfig> = {
  'energy-tech-1': {
    baseCost: { metal: 200, crystal: 400, deuterium: 200 },
    baseTime: 600,
    baseStats: { efficiency: 10, output: 5 },
    unlocksBuild: ['solar-plant'],
    unlocksUnit: [],
    unlocksResearch: ['energy-tech-2'],
    bonusPerLevel: { efficiency: 0.5, output: 0.25 },
    bonusPerTier: { efficiency: 1, output: 0.5 },
    prerequisites: [],
  },

  'laser-tech': {
    baseCost: { metal: 400, crystal: 200, deuterium: 100 },
    baseTime: 800,
    baseStats: { attack: 10, efficiency: 8 },
    unlocksBuild: ['laser-turret'],
    unlocksUnit: [],
    unlocksResearch: ['plasma-tech'],
    bonusPerLevel: { attack: 0.5, efficiency: 0.3 },
    bonusPerTier: { attack: 1.5, efficiency: 0.8 },
    prerequisites: ['energy-tech-1'],
  },

  'combustion-drive': {
    baseCost: { metal: 100, crystal: 100, deuterium: 100 },
    baseTime: 400,
    baseStats: { speed: 5, efficiency: 6 },
    unlocksBuild: [],
    unlocksUnit: ['light-fighter', 'small-cargo'],
    unlocksResearch: ['impulse-drive'],
    bonusPerLevel: { speed: 0.2, efficiency: 0.1 },
    bonusPerTier: { speed: 0.8, efficiency: 0.4 },
    prerequisites: [],
  },

  'mega-construct-1': {
    baseCost: { metal: 10000, crystal: 10000, deuterium: 5000 },
    baseTime: 5000,
    baseStats: { efficiency: 20, capacity: 100 },
    unlocksBuild: [],
    unlocksUnit: [],
    unlocksResearch: ['mega-construct-2', 'dyson-engineering'],
    bonusPerLevel: { efficiency: 1, capacity: 5 },
    bonusPerTier: { efficiency: 3, capacity: 20 },
    prerequisites: ['energy-tech-2', 'computer-2'],
  },
};

/**
 * Calculate research cost
 */
export function calculateResearchCost(
  researchId: string,
  level: number,
  tier: number
): { metal: number; crystal: number; deuterium: number } | null {
  const config = RESEARCH_CONFIGS[researchId];
  if (!config) return null;

  return ProgressionSystem.calculateScaledCost(
    {
      baseCost: config.baseCost,
      baseTime: config.baseTime,
      baseStats: config.baseStats,
      levelMultiplier: SCALING_PROFILES.research.levelMultiplier,
      tierMultiplier: SCALING_PROFILES.research.tierMultiplier,
      tierCostIncrease: SCALING_PROFILES.research.tierCostIncrease,
      tierTimeIncrease: SCALING_PROFILES.research.tierTimeIncrease,
    },
    level,
    tier
  );
}

/**
 * Calculate research time
 */
export function calculateResearchTime(
  researchId: string,
  level: number,
  tier: number
): number | null {
  const config = RESEARCH_CONFIGS[researchId];
  if (!config) return null;

  return ProgressionSystem.calculateScaledBuildTime(
    {
      baseCost: config.baseCost,
      baseTime: config.baseTime,
      baseStats: config.baseStats,
      levelMultiplier: SCALING_PROFILES.research.levelMultiplier,
      tierMultiplier: SCALING_PROFILES.research.tierMultiplier,
      tierCostIncrease: SCALING_PROFILES.research.tierCostIncrease,
      tierTimeIncrease: SCALING_PROFILES.research.tierTimeIncrease,
    },
    level,
    tier
  );
}

/**
 * Get research by branch
 */
export function getResearchByBranch(branch: ResearchBranch): Research[] {
  return ALL_TECHNOLOGIES.filter(t => t.branch === branch);
}

/**
 * Get research available at tier
 */
export function getResearchForTier(tier: number): Research[] {
  return ALL_TECHNOLOGIES.filter(t => t.tier <= tier);
}

/**
 * Get research prerequisites
 */
export function getPrerequisites(researchId: string): string[] {
  const config = RESEARCH_CONFIGS[researchId];
  return config ? config.prerequisites : [];
}

/**
 * Check if research is unlocked
 */
export function isResearchUnlocked(
  researchId: string,
  completedResearch: Record<string, number>
): boolean {
  const config = RESEARCH_CONFIGS[researchId];
  if (!config) return false;

  // Check all prerequisites
  return config.prerequisites.every(prereq => {
    // Check if prerequisite exists and has at least level 1
    return completedResearch[prereq] !== undefined && completedResearch[prereq] > 0;
  });
}

/**
 * Get techs unlocked by research
 */
export function getUnlockedByResearch(researchId: string): {
  buildings: string[];
  units: string[];
  research: string[];
} {
  const config = RESEARCH_CONFIGS[researchId];
  if (!config) return { buildings: [], units: [], research: [] };

  return {
    buildings: config.unlocksBuild,
    units: config.unlocksUnit,
    research: config.unlocksResearch,
  };
}
