export type StoreCurrency = 'silver' | 'gold' | 'platinum';

export interface StorefrontItem {
  id: string;
  name: string;
  category: 'boosters' | 'cosmetics' | 'resources' | 'bundles';
  description: string;
  currency: StoreCurrency;
  price: number;
  grantItemId: string;
  grantQuantity: number;
  tags: string[];
}

export interface SeasonPassReward {
  tier: number;
  rewardType: 'currency' | 'item';
  currency?: StoreCurrency;
  amount?: number;
  itemId?: string;
  quantity?: number;
}

export interface StoryMissionTemplate {
  missionCode: string;
  act: number;
  chapter: number;
  missionType: 'main' | 'side';
  title: string;
  description: string;
  npcName: string;
  difficulty: number;
  rewardXp: number;
  rewardMetal: number;
  rewardCrystal: number;
  rewardDeuterium: number;
}

export interface StoryActDefinition {
  act: number;
  title: string;
  synopsis: string;
}

const ACT_THEMES = [
  { title: 'Embers of Origin', npc: 'Archivist Kora', theme: 'colonial stabilization' },
  { title: 'Fractured Alliances', npc: 'Envoy Halden', theme: 'diplomatic conflict' },
  { title: 'Echoes of the Void', npc: 'Oracle Nira', theme: 'anomaly incursions' },
  { title: 'Siege of the Rift', npc: 'Marshal Vex', theme: 'multi-front war' },
  { title: 'Crown of the Stars', npc: 'Regent Solari', theme: 'endgame sovereignty' },
] as const;

const STORE_CATALOG_BLUEPRINT: Array<Omit<StorefrontItem, 'grantItemId'>> = [
  {
    id: 'store-booster-1',
    name: 'Research Booster Pack',
    category: 'boosters',
    description: 'Short-term acceleration pack for research and commander XP gain.',
    currency: 'gold',
    price: 140,
    grantQuantity: 1,
    tags: ['research', 'xp', 'booster'],
  },
  {
    id: 'store-cosmetic-1',
    name: 'Command Banner: Nebula Crest',
    category: 'cosmetics',
    description: 'A premium commander banner cosmetic with animated crest effects.',
    currency: 'platinum',
    price: 12,
    grantQuantity: 1,
    tags: ['cosmetic', 'banner'],
  },
  {
    id: 'store-resource-1',
    name: 'Strategic Resource Crate',
    category: 'resources',
    description: 'A crate containing mixed strategic materials for expansion rushes.',
    currency: 'silver',
    price: 20000,
    grantQuantity: 5,
    tags: ['resources', 'crate'],
  },
  {
    id: 'store-bundle-1',
    name: 'Frontier Expansion Bundle',
    category: 'bundles',
    description: 'Balanced set of consumables and tactical modules for campaign progression.',
    currency: 'gold',
    price: 300,
    grantQuantity: 1,
    tags: ['bundle', 'expansion'],
  },
  {
    id: 'store-booster-2',
    name: 'Fleet Supremacy Charge',
    category: 'boosters',
    description: 'Temporary fleet performance module for combat-heavy missions.',
    currency: 'gold',
    price: 110,
    grantQuantity: 1,
    tags: ['fleet', 'combat', 'booster'],
  },
  {
    id: 'store-cosmetic-2',
    name: 'Dockyard Skin: Obsidian Frame',
    category: 'cosmetics',
    description: 'Dark metallic visual theme for shipyards and fleet docks.',
    currency: 'platinum',
    price: 18,
    grantQuantity: 1,
    tags: ['cosmetic', 'dockyard'],
  },
];

export const STOREFRONT_ITEMS: StorefrontItem[] = STORE_CATALOG_BLUEPRINT.map((item) => ({
  ...item,
  grantItemId: `reward-${item.id}`,
}));

export const SEASON_PASS_CONFIG = {
  seasonId: 'season-alpha-01',
  name: 'Ascension Front',
  premiumUnlockCurrency: 'platinum' as const,
  premiumUnlockCost: 25,
  maxTier: 100,
  xpPerTier: 1200,
  freeRewards: Array.from({ length: 100 }, (_, index): SeasonPassReward => {
    const tier = index + 1;
    if (tier % 10 === 0) {
      return { tier, rewardType: 'currency', currency: 'gold', amount: 50 + tier * 2 };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'silver',
      amount: 1000 + tier * 125,
    };
  }),
  premiumRewards: Array.from({ length: 100 }, (_, index): SeasonPassReward => {
    const tier = index + 1;

    if (tier % 5 === 0) {
      return {
        tier,
        rewardType: 'item',
        itemId: `season-premium-crate-${tier}`,
        quantity: 1,
      };
    }

    return {
      tier,
      rewardType: 'currency',
      currency: 'gold',
      amount: 20 + tier,
    };
  }),
};

export const STORY_ACTS: StoryActDefinition[] = ACT_THEMES.map((theme, index) => ({
  act: index + 1,
  title: theme.title,
  synopsis: `Act ${index + 1} focuses on ${theme.theme}, escalating your empire toward stellar dominion.`,
}));

function createMainMission(act: number, chapter: number): StoryMissionTemplate {
  const theme = ACT_THEMES[act - 1];
  const missionNumber = (act - 1) * 10 + chapter;
  const difficultyBase = Math.min(10, 1 + act + Math.floor(chapter / 3));

  return {
    missionCode: `ACT${act}-MAIN-${chapter}`,
    act,
    chapter,
    missionType: 'main',
    title: `${theme.title}: Operation ${missionNumber}`,
    description: `Advance the primary war effort through chapter ${chapter} operations in ${theme.theme}.`,
    npcName: theme.npc,
    difficulty: difficultyBase,
    rewardXp: 350 + missionNumber * 35,
    rewardMetal: 400 + missionNumber * 70,
    rewardCrystal: 260 + missionNumber * 52,
    rewardDeuterium: 180 + missionNumber * 44,
  };
}

function createSideMission(act: number, indexWithinAct: number): StoryMissionTemplate {
  const theme = ACT_THEMES[act - 1];
  const chapter = indexWithinAct * 2;
  const missionNumber = (act - 1) * 5 + indexWithinAct;

  return {
    missionCode: `ACT${act}-SIDE-${indexWithinAct}`,
    act,
    chapter,
    missionType: 'side',
    title: `${theme.title}: Auxiliary Directive ${missionNumber}`,
    description: `Optional side objective tied to ${theme.theme}, unlocking support rewards.`,
    npcName: `${theme.npc} Liaison`,
    difficulty: Math.min(9, act + indexWithinAct),
    rewardXp: 220 + missionNumber * 24,
    rewardMetal: 240 + missionNumber * 45,
    rewardCrystal: 180 + missionNumber * 33,
    rewardDeuterium: 120 + missionNumber * 28,
  };
}

export const STORY_MAIN_MISSIONS_50: StoryMissionTemplate[] = Array.from({ length: 5 }, (_, actIndex) => {
  const act = actIndex + 1;
  return Array.from({ length: 10 }, (_, chapterIndex) => createMainMission(act, chapterIndex + 1));
}).flat();

export const STORY_SIDE_MISSIONS: StoryMissionTemplate[] = Array.from({ length: 5 }, (_, actIndex) => {
  const act = actIndex + 1;
  return Array.from({ length: 5 }, (_, sideIndex) => createSideMission(act, sideIndex + 1));
}).flat();

export const STORY_MISSIONS_ALL: StoryMissionTemplate[] = [
  ...STORY_MAIN_MISSIONS_50,
  ...STORY_SIDE_MISSIONS,
];
