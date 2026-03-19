import { storage } from '../storage';
import {
  CONSTRUCTOR_YARD_CATALOG,
  CONSTRUCTOR_YARD_META,
  getYardEntryById,
  getYardEntriesByDomain,
  type YardDomain,
  type YardEntry,
  calculateYardUpgradeCost,
  calculateYardUpgradeTimeSec,
  calculateYardScaledStats,
  calculateYardScaledSubStats,
} from '../../shared/config/constructorYardSystemsConfig';

const CONSTRUCTOR_YARD_STATE_PREFIX = 'constructor_yard_state';

export interface YardUpgradeQueueItem {
  id: string;
  entryId: string;
  domain: YardDomain;
  fromLevel: number;
  toLevel: number;
  startedAt: number;
  endsAt: number;
  status: 'running' | 'completed';
}

export interface ConstructorYardState {
  levels: Record<string, number>;
  upgrades: YardUpgradeQueueItem[];
  lastUpdated: number;
}

function getStateKey(userId: string): string {
  return `${CONSTRUCTOR_YARD_STATE_PREFIX}:${userId}`;
}

const cache = new Map<string, ConstructorYardState>();

function getDefaultState(): ConstructorYardState {
  const levels: Record<string, number> = {};
  CONSTRUCTOR_YARD_CATALOG.forEach((entry) => {
    levels[entry.id] = 1;
  });

  return {
    levels,
    upgrades: [],
    lastUpdated: Date.now(),
  };
}

export async function getConstructorYardState(userId: string): Promise<ConstructorYardState> {
  if (cache.has(userId)) return cache.get(userId)!;

  const setting = await storage.getSetting(getStateKey(userId));
  if (setting?.value) {
    const state = setting.value as ConstructorYardState;
    cache.set(userId, state);
    return state;
  }

  const defaultState = getDefaultState();
  await saveConstructorYardState(userId, defaultState);
  return defaultState;
}

export async function saveConstructorYardState(userId: string, state: ConstructorYardState): Promise<void> {
  state.lastUpdated = Date.now();
  cache.set(userId, state);
  await storage.setSetting(getStateKey(userId), {
    value: state,
    expiresAt: null,
  });
}

export function getConstructorYardCatalog(domain?: YardDomain): YardEntry[] {
  if (!domain) return CONSTRUCTOR_YARD_CATALOG;
  return getYardEntriesByDomain(domain);
}

export function getConstructorYardMeta() {
  return CONSTRUCTOR_YARD_META;
}

export async function getConstructorYardStatus(userId: string) {
  const state = await getConstructorYardState(userId);

  const active = state.upgrades.filter((item) => item.status === 'running');
  const completed = state.upgrades.filter((item) => item.status === 'completed');

  const effectSummary = CONSTRUCTOR_YARD_CATALOG.reduce(
    (acc, entry) => {
      const level = state.levels[entry.id] || 1;
      const scaled = calculateYardScaledStats(entry, level);
      acc.totalHull += scaled.hull;
      acc.totalShields += scaled.shields;
      acc.totalFirepower += scaled.firepower;
      acc.totalCargo += scaled.cargo;
      return acc;
    },
    { totalHull: 0, totalShields: 0, totalFirepower: 0, totalCargo: 0 },
  );

  return {
    state,
    activeUpgrades: active,
    completedUpgrades: completed,
    effectSummary,
  };
}

export function previewUpgrade(entryId: string, currentLevel: number, targetLevel: number) {
  const entry = getYardEntryById(entryId);
  if (!entry) {
    return { success: false as const, message: 'Entry not found' };
  }

  if (targetLevel <= currentLevel || targetLevel > 999) {
    return { success: false as const, message: 'Invalid target level' };
  }

  const cost = calculateYardUpgradeCost(entry, currentLevel, targetLevel);
  const timeSec = calculateYardUpgradeTimeSec(entry, currentLevel, targetLevel);
  const currentStats = calculateYardScaledStats(entry, currentLevel);
  const targetStats = calculateYardScaledStats(entry, targetLevel);
  const currentSubStats = calculateYardScaledSubStats(entry, currentLevel);
  const targetSubStats = calculateYardScaledSubStats(entry, targetLevel);

  return {
    success: true as const,
    entry,
    currentLevel,
    targetLevel,
    cost,
    timeSec,
    currentStats,
    targetStats,
    currentSubStats,
    targetSubStats,
  };
}

export async function startUpgrade(userId: string, entryId: string, targetLevel: number) {
  const state = await getConstructorYardState(userId);
  const entry = getYardEntryById(entryId);

  if (!entry) return { success: false as const, message: 'Entry not found' };

  const currentLevel = state.levels[entryId] || 1;
  if (targetLevel <= currentLevel || targetLevel > 999) {
    return { success: false as const, message: 'Invalid target level' };
  }

  const alreadyRunning = state.upgrades.some((u) => u.entryId === entryId && u.status === 'running');
  if (alreadyRunning) return { success: false as const, message: 'Upgrade already running for this entry' };

  const timeSec = calculateYardUpgradeTimeSec(entry, currentLevel, targetLevel);
  const now = Date.now();

  const queueItem: YardUpgradeQueueItem = {
    id: `${entryId}-${now}`,
    entryId,
    domain: entry.domain,
    fromLevel: currentLevel,
    toLevel: targetLevel,
    startedAt: now,
    endsAt: now + timeSec * 1000,
    status: 'running',
  };

  state.upgrades.push(queueItem);
  await saveConstructorYardState(userId, state);

  return { success: true as const, queueItem };
}

export async function completeUpgrade(userId: string, entryId: string) {
  const state = await getConstructorYardState(userId);
  const running = state.upgrades.find((u) => u.entryId === entryId && u.status === 'running');

  if (!running) return { success: false as const, message: 'No running upgrade found for this entry' };

  if (Date.now() < running.endsAt) {
    return { success: false as const, message: 'Upgrade still in progress' };
  }

  running.status = 'completed';
  state.levels[entryId] = running.toLevel;
  await saveConstructorYardState(userId, state);

  return { success: true as const, updatedLevel: running.toLevel, completedUpgrade: running };
}

export async function completeAllReadyUpgrades(userId: string) {
  const state = await getConstructorYardState(userId);
  const now = Date.now();

  let completed = 0;
  for (const item of state.upgrades) {
    if (item.status === 'running' && item.endsAt <= now) {
      item.status = 'completed';
      state.levels[item.entryId] = item.toLevel;
      completed += 1;
    }
  }

  if (completed > 0) {
    await saveConstructorYardState(userId, state);
  }

  return { success: true as const, completed };
}
