// Universe Seed System - Procedurally generates celestial objects based on coordinates
// Using deterministic seeding to ensure same coordinates always generate same objects

export type PlanetClass = "M" | "G" | "D" | "R" | "V" | "T" | "A" | "K" | "J" | "I";
export type AsteroidType = "C" | "S" | "M" | "F" | "X" | "B" | "Rare";
export type ObjectType = "planet" | "moon" | "asteroid" | "meteor" | "star" | "nebula" | "blackhole" | "wormhole" | "station" | "debris";
export type Habitability = "hostile" | "barren" | "marginal" | "adequate" | "ideal";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CelestialObject {
  id: string;
  name: string;
  type: ObjectType;
  coordinates: string;
  position: Vector3;
  
  // Planet properties
  planetClass?: PlanetClass;
  diameter?: number;
  gravity?: number;
  habitability?: Habitability;
  atmosphere?: string;
  temperature?: number;
  waterPercentage?: number;
  mineralAbundance?: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  
  // Moon properties
  parentPlanetId?: string;
  orbitalPeriod?: number;
  
  // Asteroid/Meteor properties
  asteroidType?: AsteroidType;
  size?: number;
  compositionMetal?: number;
  compositionRare?: number;
  
  // Star properties
  starType?: "O" | "B" | "A" | "F" | "G" | "K" | "M" | "Neutron" | "White Dwarf";
  luminosity?: number;
  surfaceTemp?: number;
  
  // General
  density?: number;
  magneticField?: number;
  age?: number;
  resources?: number;
}

// Seeded random number generator using coordinates
function seededRandom(seed: string, index: number = 0): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char + index;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 10000) / 10000;
}

function seededRandomRange(seed: string, min: number, max: number, index: number = 0): number {
  return min + seededRandom(seed, index) * (max - min);
}

function seededRandomInt(seed: string, min: number, max: number, index: number = 0): number {
  return Math.floor(seededRandomRange(seed, min, max, index));
}

// Parse coordinates like "[1:1:1]" into Vector3
function parseCoordinates(coordStr: string): Vector3 {
  const match = coordStr.match(/\[(\d+):(\d+):(\d+)\]/);
  if (match) {
    return {
      x: parseInt(match[1]),
      y: parseInt(match[2]),
      z: parseInt(match[3])
    };
  }
  return { x: 0, y: 0, z: 0 };
}

function createSeedString(coords: Vector3, suffix: string = ""): string {
  return `${coords.x}:${coords.y}:${coords.z}${suffix}`;
}

const PLANET_CLASSES: PlanetClass[] = ["M", "G", "D", "R", "V", "T", "A", "K"];
const STAR_TYPES = ["O", "B", "A", "F", "G", "K", "M", "Neutron", "White Dwarf"] as const;
const ASTEROID_TYPES: AsteroidType[] = ["C", "S", "M", "F", "X", "B", "Rare"];
const PLANET_NAMES = ["Prime", "Secundus", "Tertius", "Quartus", "Quintus", "Sextus", "Septimus"];
const MOON_NAMES = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta"];

export function generatePlanet(systemCoords: Vector3, planetIndex: number): CelestialObject {
  const seed = createSeedString(systemCoords, `:planet:${planetIndex}`);
  const planetClass = PLANET_CLASSES[seededRandomInt(seed, 0, PLANET_CLASSES.length, 1)];
  
  const habitabilityRoll = seededRandom(seed, 2);
  let habitability: Habitability = "hostile";
  if (habitabilityRoll > 0.7) habitability = "ideal";
  else if (habitabilityRoll > 0.55) habitability = "adequate";
  else if (habitabilityRoll > 0.4) habitability = "marginal";
  else if (habitabilityRoll > 0.2) habitability = "barren";
  
  const temperature = seededRandomInt(seed, -150, 350, 3);
  const waterPercentage = seededRandom(seed, 4) * 100;
  
  // Resource distribution based on planet class
  const baseMetalDensity = planetClass === "K" ? 0.8 : planetClass === "D" ? 0.9 : 0.5;
  const baseCrystalDensity = planetClass === "G" ? 0.7 : planetClass === "R" ? 0.8 : 0.4;
  const baseDeuteriumDensity = planetClass === "A" ? 0.9 : planetClass === "I" ? 0.8 : 0.3;
  
  return {
    id: `planet-${seed}`,
    name: `${PLANET_NAMES[planetIndex % PLANET_NAMES.length]} ${planetIndex}`,
    type: "planet",
    coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:${planetIndex}]`,
    position: {
      x: systemCoords.x + seededRandomRange(seed, -0.5, 0.5, 5),
      y: systemCoords.y + seededRandomRange(seed, -0.5, 0.5, 6),
      z: systemCoords.z + seededRandomRange(seed, -0.2, 0.2, 7)
    },
    planetClass,
    diameter: seededRandomInt(seed, 4000, 15000, 8),
    gravity: seededRandomRange(seed, 0.3, 3.0, 9),
    habitability,
    atmosphere: habitability !== "hostile" ? ["N2-O2", "CO2-N2", "Exotic"][seededRandomInt(seed, 0, 3, 10)] : "None",
    temperature,
    waterPercentage,
    mineralAbundance: {
      metal: Math.round(baseMetalDensity * 1000 + seededRandom(seed, 11) * 500),
      crystal: Math.round(baseCrystalDensity * 800 + seededRandom(seed, 12) * 400),
      deuterium: Math.round(baseDeuteriumDensity * 600 + seededRandom(seed, 13) * 300)
    },
    age: seededRandomInt(seed, 100, 5000, 14), // In millions of years
    magneticField: seededRandomRange(seed, 0, 100, 15),
    density: seededRandomRange(seed, 1, 10, 16),
    resources: seededRandomInt(seed, 1000, 100000, 17)
  };
}

export function generateMoons(systemCoords: Vector3, planetIndex: number, moonCount: number): CelestialObject[] {
  const moons: CelestialObject[] = [];
  for (let i = 0; i < moonCount; i++) {
    const seed = createSeedString(systemCoords, `:moon:${planetIndex}:${i}`);
    moons.push({
      id: `moon-${seed}`,
      name: `${MOON_NAMES[i % MOON_NAMES.length]}`,
      type: "moon",
      coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:${planetIndex}:${i}]`,
      position: {
        x: systemCoords.x + seededRandomRange(seed, -0.3, 0.3, 1),
        y: systemCoords.y + seededRandomRange(seed, -0.3, 0.3, 2),
        z: systemCoords.z + seededRandomRange(seed, -0.1, 0.1, 3)
      },
      parentPlanetId: `planet-${createSeedString(systemCoords, `:planet:${planetIndex}`)}`,
      diameter: seededRandomInt(seed, 500, 5000, 4),
      gravity: seededRandomRange(seed, 0.1, 1.5, 5),
      habitability: "barren",
      temperature: seededRandomInt(seed, -200, 150, 6),
      mineralAbundance: {
        metal: seededRandomInt(seed, 100, 10000, 7),
        crystal: seededRandomInt(seed, 50, 5000, 8),
        deuterium: seededRandomInt(seed, 20, 2000, 9)
      },
      orbitalPeriod: seededRandomRange(seed, 0.1, 50, 10), // In days
      age: seededRandomInt(seed, 100, 5000, 11),
      magneticField: seededRandomRange(seed, 0, 30, 12)
    });
  }
  return moons;
}

export function generateAsteroids(systemCoords: Vector3, asteroidCount: number): CelestialObject[] {
  const asteroids: CelestialObject[] = [];
  for (let i = 0; i < asteroidCount; i++) {
    const seed = createSeedString(systemCoords, `:asteroid:${i}`);
    const asteroidType = ASTEROID_TYPES[seededRandomInt(seed, 0, ASTEROID_TYPES.length, 1)];
    
    // Resource composition based on asteroid type
    const compositionMetal = asteroidType === "M" ? 0.9 : asteroidType === "F" ? 0.7 : 0.4;
    const compositionRare = asteroidType === "Rare" ? 0.95 : asteroidType === "X" ? 0.6 : 0.1;
    
    asteroids.push({
      id: `asteroid-${seed}`,
      name: `Asteroid ${i + 1}`,
      type: "asteroid",
      coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:A${i}]`,
      position: {
        x: systemCoords.x + seededRandomRange(seed, -5, 5, 2),
        y: systemCoords.y + seededRandomRange(seed, -5, 5, 3),
        z: systemCoords.z + seededRandomRange(seed, -3, 3, 4)
      },
      asteroidType,
      size: seededRandomInt(seed, 10, 5000, 5),
      diameter: seededRandomInt(seed, 100, 3000, 6),
      compositionMetal: compositionMetal,
      compositionRare: compositionRare,
      mineralAbundance: {
        metal: Math.round(compositionMetal * seededRandomInt(seed, 5000, 50000, 7)),
        crystal: seededRandomInt(seed, 500, 15000, 8),
        deuterium: seededRandomInt(seed, 200, 5000, 9)
      },
      age: seededRandomInt(seed, 1000, 4600, 10),
      resources: seededRandomInt(seed, 5000, 100000, 11)
    });
  }
  return asteroids;
}

export function generateStar(galaxyCoords: Vector3): CelestialObject {
  const seed = createSeedString(galaxyCoords, ":star");
  const starType = STAR_TYPES[seededRandomInt(seed, 0, STAR_TYPES.length, 1)];
  
  // Star properties vary by type
  const luminosityByType: Record<string, [number, number]> = {
    O: [50000, 100000],
    B: [10000, 50000],
    A: [5000, 10000],
    F: [2000, 5000],
    G: [500, 2000],
    K: [100, 500],
    M: [10, 100],
    Neutron: [0.1, 1],
    "White Dwarf": [100, 1000]
  };
  
  const [minLum, maxLum] = luminosityByType[starType] || [100, 1000];
  
  return {
    id: `star-${seed}`,
    name: `Star System`,
    type: "star",
    coordinates: `[${galaxyCoords.x}:${galaxyCoords.y}:${galaxyCoords.z}]`,
    position: {
      x: galaxyCoords.x,
      y: galaxyCoords.y,
      z: galaxyCoords.z
    },
    starType: starType as "O" | "B" | "A" | "F" | "G" | "K" | "M" | "Neutron" | "White Dwarf",
    luminosity: seededRandomRange(seed, minLum, maxLum, 2),
    surfaceTemp: seededRandomInt(seed, 3000, 30000, 3),
    diameter: seededRandomInt(seed, 500000, 2000000, 4),
    age: seededRandomInt(seed, 100, 13000, 5) // In millions of years
  };
}

export function generateSystem(systemCoords: Vector3): CelestialObject[] {
  const objects: CelestialObject[] = [];
  
  // Generate star
  objects.push(generateStar(systemCoords));
  
  // Generate planets
  const planetCount = seededRandomInt(createSeedString(systemCoords, ":planet:count"), 3, 12, 0);
  for (let i = 0; i < planetCount; i++) {
    const planet = generatePlanet(systemCoords, i);
    objects.push(planet);
    
    // Generate moons for this planet
    const moonRoll = seededRandom(createSeedString(systemCoords, `:planet:${i}:moons`), 0);
    const moonCount = moonRoll > 0.7 ? seededRandomInt(createSeedString(systemCoords, `:planet:${i}:mooncount`), 1, 8, 0) : 0;
    const moons = generateMoons(systemCoords, i, moonCount);
    objects.push(...moons);
  }
  
  // Generate asteroid field
  const asteroidCount = seededRandomInt(createSeedString(systemCoords, ":asteroid:count"), 10, 50, 0);
  const asteroids = generateAsteroids(systemCoords, asteroidCount);
  objects.push(...asteroids);
  
  return objects;
}

export function generateGalaxy(galaxyX: number, galaxyY: number, galaxyZ: number): CelestialObject[] {
  const galaxyCoords: Vector3 = { x: galaxyX, y: galaxyY, z: galaxyZ };
  const objects: CelestialObject[] = [];
  
  // Generate sectors with systems
  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let sz = 0; sz < 2; sz++) {
        const sectorCoords: Vector3 = {
          x: galaxyX * 100 + sx * 30,
          y: galaxyY * 100 + sy * 30,
          z: galaxyZ * 100 + sz * 30
        };
        
        // Generate 2-5 systems per sector
        const systemCount = seededRandomInt(createSeedString(sectorCoords, ":system:count"), 2, 5, 0);
        for (let i = 0; i < systemCount; i++) {
          const systemCoords: Vector3 = {
            x: sectorCoords.x + i * 10 + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:offset`), -3, 3, 0),
            y: sectorCoords.y + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:y`), -5, 5, 0),
            z: sectorCoords.z + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:z`), -2, 2, 0)
          };
          
          const system = generateSystem(systemCoords);
          objects.push(...system);
        }
      }
    }
  }
  
  return objects;
}

export function getCelestialObjectByCoordinates(coordinates: string): CelestialObject | null {
  const coords = parseCoordinates(coordinates);
  
  // Parse coordinate depth to determine what to generate
  const parts = coordinates.match(/\d+/g) || [];
  
  if (parts.length === 3) {
    // Galaxy level
    return generateStar({ x: parseInt(parts[0]), y: parseInt(parts[1]), z: parseInt(parts[2]) });
  } else if (parts.length === 4) {
    // System level
    const system = generateSystem(coords);
    return system[0]; // Return star
  }
  
  return null;
}
