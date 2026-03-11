
import { MEGASTRUCTURES as baseMegastructures, createMegastructure, Megastructure } from '@shared/config/megastructuresConfig';

const megaStructureIcons: { [key: string]: string } = {
  'dyson-sphere': '☀️',
  'ringworld': '🪐',
  'megaforge': '🔨',
  'research-nexus': '🧠',
  'orbital-defense': '🛡️',
  'generation-ship': '🚀',
  'matter-converter': '✨',
  'dimensional-gate': '🌀',
  'stellar-engine': '⚙️',
  'nova-cannon': '💥',
};

const megastructureTiers: { [key: string]: number } = {
  'orbital-defense': 1,
  'generation-ship': 1,
  'ringworld': 2,
  'megaforge': 2,
  'research-nexus': 2,
  'dyson-sphere': 3,
  'matter-converter': 3,
  'stellar-engine': 3,
  'dimensional-gate': 4,
  'nova-cannon': 5,
};

export const MEGA_STRUCTURES = baseMegastructures.map((base: any) => {
  const mega = createMegastructure(base.id, `my-${base.id}`);
  if (!mega) return null;

  return {
    ...mega,
    templateId: base.id,
    icon: megaStructureIcons[mega.type] || '❓',
    tier: megastructureTiers[mega.type] || 1,
    specialAbility: mega.primaryFunction,
    stats: {
      ...mega.currentStats,
      energyOutput: mega.currentStats.power,
      productionBonus: mega.currentStats.output,
      researchBonus: mega.currentStats.tech,
      populationCapacity: mega.currentStats.capacity * 1000,
      maintenanceCost: mega.maintenanceCost,
      constructionTime: mega.constructionTime,
    },
    subStats: [
      { name: 'Power', value: mega.currentStats.power / 10, description: 'Energy generation and output.', icon: '⚡️' },
      { name: 'Resilience', value: mega.currentStats.resilience / 10, description: 'Structural integrity and defense.', icon: '🦾' },
      { name: 'Efficiency', value: mega.currentStats.efficiency, description: 'Operational effectiveness.', icon: '✅' },
      { name: 'Capacity', value: mega.currentStats.capacity / 100, description: 'Population or resource capacity.', icon: '👥' },
    ],
    researchRequired: ['Advanced Engineering', 'Exotic Materials'],
    buildingRequirements: [{ name: 'Spaceport', level: 10 }],
  };
}).filter(Boolean) as (Megastructure & { templateId: string; icon: string; tier: number; specialAbility: string; stats: any; subStats: any[]; researchRequired: string[]; buildingRequirements: any[] })[];

export const getMegaStructuresByTier = (tier: number) => {
  return MEGA_STRUCTURES.filter(s => s.tier === tier);
}

export const MEGA_STRUCTURE_CLASSES = Array.from(new Set(MEGA_STRUCTURES.map(s => s.class)));

export const calculateConstructionCost = (structure: any) => {
  return structure.resourcesCost;
}
