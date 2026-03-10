export type EntityFamily =
  | "starship"
  | "mothership"
  | "troop"
  | "unit"
  | "untrained-unit"
  | "civilian-unit"
  | "military-unit"
  | "government-unit"
  | "item"
  | "weapon"
  | "armor"
  | "vehicle";

export interface EntityArchetype {
  id: string;
  name: string;
  family: EntityFamily;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  baseStats: {
    power: number;
    defense: number;
    mobility: number;
    utility: number;
  };
  subStats: {
    precision: number;
    endurance: number;
    efficiency: number;
    control: number;
  };
  attributes: {
    tech: number;
    command: number;
    logistics: number;
    survivability: number;
  };
  subAttributes: {
    sensorRange: number;
    energyUse: number;
    maintenance: number;
    adaptation: number;
  };
}

function buildArchetype(
  family: EntityFamily,
  index: number,
  name: string,
  type: string,
  subType: string,
  cls: string,
  subClass: string,
): EntityArchetype {
  const seed = index + 1;
  return {
    id: `${family}-${seed.toString().padStart(3, "0")}`,
    name,
    family,
    type,
    subType,
    class: cls,
    subClass,
    baseStats: {
      power: 80 + seed * 3,
      defense: 70 + seed * 2,
      mobility: 65 + seed * 2,
      utility: 60 + seed,
    },
    subStats: {
      precision: 55 + seed,
      endurance: 58 + seed,
      efficiency: 60 + seed,
      control: 57 + seed,
    },
    attributes: {
      tech: 50 + seed,
      command: 48 + seed,
      logistics: 52 + seed,
      survivability: 54 + seed,
    },
    subAttributes: {
      sensorRange: 40 + seed,
      energyUse: 100 - Math.min(70, seed),
      maintenance: 30 + Math.floor(seed / 2),
      adaptation: 45 + seed,
    },
  };
}

const STARSHIPS: EntityArchetype[] = [
  ["Interceptor", "combat", "dogfighter", "frigate", "rapid-strike"],
  ["Skirmisher", "combat", "hit-and-run", "corvette", "raider"],
  ["Lancer", "combat", "pierce", "destroyer", "anti-armor"],
  ["Sentinel", "combat", "screen", "frigate", "guardian"],
  ["Arbiter", "command", "battle-control", "cruiser", "tactician"],
  ["Vanguard", "assault", "breach", "battlecruiser", "line-breaker"],
  ["Tempest", "assault", "plasma", "destroyer", "shock"],
  ["Comet", "recon", "deep-scan", "corvette", "scout"],
  ["Phalanx", "defense", "point-defense", "frigate", "shield-net"],
  ["Mercury", "support", "fleet-boost", "cruiser", "buffer"],
  ["Nova", "support", "field-repair", "support-cruiser", "restoration"],
  ["Eclipse", "stealth", "cloak", "corvette", "silent-hunter"],
].map((v, i) => buildArchetype("starship", i, v[0], v[1], v[2], v[3], v[4]));

const MOTHERSHIPS: EntityArchetype[] = [
  ["Citadel Prime", "capital", "fortress-core", "mothership", "command-anchor"],
  ["Aegis Crown", "capital", "shield-hub", "mothership", "defense-core"],
  ["Helios Ark", "carrier", "wing-deployment", "mothership", "launch-director"],
  ["Obelisk One", "capital", "siege-hub", "mothership", "planetbreaker"],
  ["Atlas Relay", "support", "logistics-hub", "mothership", "supply-master"],
  ["Sovereign Node", "command", "network-core", "mothership", "fleet-overmind"],
].map((v, i) => buildArchetype("mothership", i + 20, v[0], v[1], v[2], v[3], v[4]));

const TROOPS: EntityArchetype[] = [
  ["Rifle Legionary", "infantry", "line", "trooper", "marksman"],
  ["Breach Trooper", "infantry", "close-quarters", "trooper", "breacher"],
  ["Shield Guard", "infantry", "defender", "trooper", "protector"],
  ["Heavy Gunner", "infantry", "suppression", "trooper", "siege-infantry"],
  ["Recon Scout", "light", "pathfinder", "trooper", "infiltrator"],
  ["Field Medic", "support", "healer", "trooper", "stabilizer"],
  ["Combat Engineer", "support", "fortification", "trooper", "constructor"],
  ["Drone Handler", "support", "remote-ops", "trooper", "controller"],
  ["Shock Vanguard", "assault", "frontline", "trooper", "charger"],
  ["Psi Operative", "special", "mind-war", "trooper", "psionic"],
].map((v, i) => buildArchetype("troop", i + 30, v[0], v[1], v[2], v[3], v[4]));

const UNITS: EntityArchetype[] = [
  ["Worker Unit", "industrial", "resource", "utility", "extraction"],
  ["Builder Unit", "industrial", "construction", "utility", "fabrication"],
  ["Repair Unit", "industrial", "maintenance", "utility", "restoration"],
  ["Survey Unit", "exploration", "mapping", "utility", "cartography"],
  ["Harvester Unit", "resource", "collection", "utility", "agri-harvest"],
  ["Refinery Unit", "resource", "processing", "utility", "material-refine"],
  ["Relay Unit", "network", "signal", "utility", "communications"],
  ["Guardian Unit", "security", "patrol", "utility", "watch"],
  ["Archive Unit", "knowledge", "indexing", "utility", "catalog"],
  ["Mediator Unit", "diplomacy", "liaison", "utility", "negotiation"],
].map((v, i) => buildArchetype("unit", i + 40, v[0], v[1], v[2], v[3], v[4]));

const UNTRAINED_UNITS: EntityArchetype[] = [
  ["Cadet Core", "trainee", "basic-combat", "starter", "cadet"],
  ["Labor Recruit", "trainee", "basic-labor", "starter", "apprentice"],
  ["Scout Initiate", "trainee", "basic-recon", "starter", "spotter"],
  ["Tech Novice", "trainee", "basic-tech", "starter", "assistant"],
  ["Aid Trainee", "trainee", "basic-support", "starter", "orderly"],
  ["Pilot Trainee", "trainee", "basic-flight", "starter", "flight-cadet"],
].map((v, i) => buildArchetype("untrained-unit", i + 50, v[0], v[1], v[2], v[3], v[4]));

const CIVILIAN_UNITS: EntityArchetype[] = [
  ["Colonist", "population", "settler", "civilian", "founder"],
  ["Agronomist", "economy", "food", "civilian", "farm-specialist"],
  ["Miner", "economy", "ore", "civilian", "extraction-specialist"],
  ["Technician", "infrastructure", "systems", "civilian", "maintenance-specialist"],
  ["Merchant", "economy", "trade", "civilian", "market-specialist"],
  ["Educator", "social", "learning", "civilian", "academy-specialist"],
  ["Medic", "social", "health", "civilian", "clinic-specialist"],
  ["Transit Operator", "infrastructure", "transport", "civilian", "mobility-specialist"],
].map((v, i) => buildArchetype("civilian-unit", i + 56, v[0], v[1], v[2], v[3], v[4]));

const MILITARY_UNITS: EntityArchetype[] = [
  ["Line Infantry", "ground", "assault", "military", "rifle"],
  ["Siege Battery", "ground", "artillery", "military", "long-range"],
  ["Assault Walker", "mechanized", "breaker", "military", "walker"],
  ["Defense Walker", "mechanized", "shield", "military", "bulwark"],
  ["Interceptor Wing", "aerial", "fighter", "military", "air-superiority"],
  ["Bomber Wing", "aerial", "strike", "military", "payload"],
  ["Electronic Warfare", "special", "jamming", "military", "ew-ops"],
  ["Orbital Marines", "special", "boarding", "military", "void-assault"],
  ["Command Cadre", "command", "coordination", "military", "field-command"],
  ["Strategic Reserve", "command", "reinforcement", "military", "rapid-response"],
].map((v, i) => buildArchetype("military-unit", i + 64, v[0], v[1], v[2], v[3], v[4]));

const GOVERNMENT_UNITS: EntityArchetype[] = [
  ["Senate Envoy", "administration", "diplomatic", "government", "external-affairs"],
  ["Civic Marshal", "administration", "order", "government", "security-office"],
  ["Treasury Auditor", "administration", "finance", "government", "budget-control"],
  ["Policy Architect", "administration", "planning", "government", "long-range"],
  ["Intelligence Bureau", "administration", "counter-intel", "government", "analysis"],
  ["Systems Governor", "administration", "regional-rule", "government", "sector-command"],
].map((v, i) => buildArchetype("government-unit", i + 74, v[0], v[1], v[2], v[3], v[4]));

const ITEMS: EntityArchetype[] = [
  ["Nano Toolkit", "consumable", "repair-kit", "item", "engineering-pack"],
  ["Quantum Battery", "consumable", "energy-cell", "item", "power-pack"],
  ["Signal Beacon", "utility", "locator", "item", "nav-pack"],
  ["Field Ration", "consumable", "sustainment", "item", "supply-pack"],
  ["Memory Core", "utility", "data-module", "item", "intel-pack"],
  ["Phase Key", "utility", "access-token", "item", "security-pack"],
].map((v, i) => buildArchetype("item", i + 80, v[0], v[1], v[2], v[3], v[4]));

const WEAPONS: EntityArchetype[] = [
  ["Rail Carbine", "ballistic", "kinetic", "weapon", "marksman"],
  ["Plasma Rifle", "energy", "plasma", "weapon", "line-assault"],
  ["Ion Lance", "energy", "ion", "weapon", "piercing"],
  ["Gauss Cannon", "ballistic", "gauss", "weapon", "siege"],
  ["Arc Blade", "melee", "electro", "weapon", "duelist"],
  ["Pulse Mortar", "explosive", "pulse", "weapon", "suppression"],
].map((v, i) => buildArchetype("weapon", i + 86, v[0], v[1], v[2], v[3], v[4]));

const ARMORS: EntityArchetype[] = [
  ["Reactive Vest", "light", "reactive", "armor", "scout"],
  ["Composite Plate", "medium", "composite", "armor", "assault"],
  ["Bulwark Shell", "heavy", "fortified", "armor", "tank"],
  ["Aegis Suit", "heavy", "shielded", "armor", "guardian"],
  ["Phase Mantle", "special", "phase", "armor", "operative"],
].map((v, i) => buildArchetype("armor", i + 92, v[0], v[1], v[2], v[3], v[4]));

const VEHICLES: EntityArchetype[] = [
  ["Scout Rover", "ground", "recon", "vehicle", "light"],
  ["Cargo Hauler", "ground", "logistics", "vehicle", "transport"],
  ["Siege Crawler", "ground", "assault", "vehicle", "heavy"],
  ["Med Evac Skiff", "aerial", "support", "vehicle", "rescue"],
  ["Command APC", "ground", "command", "vehicle", "coordination"],
].map((v, i) => buildArchetype("vehicle", i + 97, v[0], v[1], v[2], v[3], v[4]));

export const ENTITY_ARCHETYPES_90: EntityArchetype[] = [
  ...STARSHIPS,
  ...MOTHERSHIPS,
  ...TROOPS,
  ...UNITS,
  ...UNTRAINED_UNITS,
  ...CIVILIAN_UNITS,
  ...MILITARY_UNITS,
  ...GOVERNMENT_UNITS,
  ...ITEMS,
  ...WEAPONS,
  ...ARMORS,
  ...VEHICLES,
];

export const ENTITY_ARCHETYPES_GROUPED = {
  starships: STARSHIPS,
  motherships: MOTHERSHIPS,
  troops: TROOPS,
  units: UNITS,
  untrainedUnits: UNTRAINED_UNITS,
  civilianUnits: CIVILIAN_UNITS,
  militaryUnits: MILITARY_UNITS,
  governmentUnits: GOVERNMENT_UNITS,
  items: ITEMS,
  weapons: WEAPONS,
  armors: ARMORS,
  vehicles: VEHICLES,
};

export const ENTITY_ARCHETYPES_META = {
  total: ENTITY_ARCHETYPES_90.length,
  expected: 90,
  byFamily: {
    starship: STARSHIPS.length,
    mothership: MOTHERSHIPS.length,
    troop: TROOPS.length,
    unit: UNITS.length,
    "untrained-unit": UNTRAINED_UNITS.length,
    "civilian-unit": CIVILIAN_UNITS.length,
    "military-unit": MILITARY_UNITS.length,
    "government-unit": GOVERNMENT_UNITS.length,
    item: ITEMS.length,
    weapon: WEAPONS.length,
    armor: ARMORS.length,
    vehicle: VEHICLES.length,
  },
};
