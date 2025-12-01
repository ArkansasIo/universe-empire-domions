import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommanderState, Item, RaceId, ClassId, SubClassId, RACES, CLASSES, SUBCLASSES } from './commanderTypes';

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

interface Buildings {
  metalMine: number;
  crystalMine: number;
  deuteriumSynthesizer: number;
  solarPlant: number;
  roboticsFactory: number;
  shipyard: number;
  researchLab: number;
}

// Define Research interface locally if not exported, or match the structure
export interface Research {
  energyTech: number;
  laserTech: number;
  ionTech: number;
  hyperspaceTech: number;
  plasmaTech: number;
  combustionDrive: number;
  impulseDrive: number;
  hyperspaceDrive: number;
  espionageTech: number;
  computerTech: number;
  astrophysics: number;
  intergalacticResearchNetwork: number;
  gravitonTech: number;
  weaponsTech: number;
  shieldingTech: number;
  armourTech: number;
  aiTech: number;
  quantumTech: number;
  [key: string]: number; 
}

// Dynamic unit storage
type Units = {
  [key: string]: number;
};

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "danger" | "success";
  timestamp: number;
}

export interface QueueItem {
  id: string;
  name: string;
  endTime: number;
  type: "building" | "research" | "unit";
  amount?: number;
}

interface GameState {
  resources: Resources;
  buildings: Buildings;
  research: {[key: string]: number};
  units: Units;
  commander: CommanderState;
  planetName: string;
  events: GameEvent[];
  queue: QueueItem[];
  updateBuilding: (building: keyof Buildings, name: string, time: number) => void;
  updateResearch: (tech: string, name: string, time: number) => void;
  buildUnit: (unitId: string, amount: number, name: string, time: number) => void;
  addEvent: (title: string, description: string, type: GameEvent["type"]) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: "weapon" | "armor" | "module") => void;
  craftItem: (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => void;
  temperItem: (itemId: string) => void;
  setCommanderIdentity: (race: RaceId, cls: ClassId, subClass: SubClassId | null) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resources>({
    metal: 50000,
    crystal: 50000,
    deuterium: 20000,
    energy: 5000,
  });

  const [buildings, setBuildings] = useState<Buildings>({
    metalMine: 10,
    crystalMine: 8,
    deuteriumSynthesizer: 5,
    solarPlant: 12,
    roboticsFactory: 2,
    shipyard: 2,
    researchLab: 1,
  });

  const [research, setResearch] = useState<{[key: string]: number}>({
    energyTech: 0,
    laserTech: 0,
    ionTech: 0,
    hyperspaceTech: 0,
    plasmaTech: 0,
    combustionDrive: 0,
    impulseDrive: 0,
    hyperspaceDrive: 0,
    espionageTech: 0,
    computerTech: 0,
    astrophysics: 0,
    intergalacticResearchNetwork: 0,
    gravitonTech: 0,
    weaponsTech: 0,
    shieldingTech: 0,
    armourTech: 0,
    aiTech: 0,
    quantumTech: 0
  });

  const [units, setUnits] = useState<Units>({
    lightFighter: 5,
    smallCargo: 2,
    espionageProbe: 10,
    marine: 50,
    colonist: 100
  });

  const [commander, setCommander] = useState<CommanderState>({
    name: "Commander",
    race: "terran",
    class: "admiral",
    subClass: null,
    stats: { level: 1, xp: 0, warfare: 1, logistics: 1, science: 1, engineering: 1 },
    equipment: { weapon: null, armor: null, module: null },
    inventory: [
      { id: "bp_plasmaRifle", name: "Plasma Rifle Blueprint", description: "Blueprint for a standard plasma rifle.", type: "blueprint", rarity: "common", level: 1 },
      { id: "raw_metal", name: "Refined Metal", description: "High quality crafting material.", type: "material", rarity: "common", level: 1 }
    ]
  });

  const [events, setEvents] = useState<GameEvent[]>([
    { id: "1", title: "Welcome Commander", description: "Colony established on Homeworld.", type: "success", timestamp: Date.now() }
  ]);

  const [queue, setQueue] = useState<QueueItem[]>([]);

  const planetName = "Homeworld";

  // Calculate production
  const getProduction = () => {
    // Add Commander Logistics Bonus
    let logisticsBonus = 1 + (commander.stats.logistics * 0.05); // 5% per level

    // Add Race/Class Bonuses
    if (commander.race === "terran") logisticsBonus += 0.05;
    if (commander.race === "lithoid") logisticsBonus += 0.10; // Mock
    if (commander.class === "industrialist") logisticsBonus += 0.15;

    const metalProd = 30 * buildings.metalMine * Math.pow(1.1, buildings.metalMine) * logisticsBonus;
    const crystalProd = 20 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine) * logisticsBonus;
    const deutProd = 10 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer) * logisticsBonus;
    const energyProd = 20 * buildings.solarPlant * Math.pow(1.1, buildings.solarPlant);
    
    const metalCons = 10 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalCons = 10 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutCons = 20 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    
    const energyUsed = metalCons + crystalCons + deutCons;

    return {
      metal: metalProd / 3600,
      crystal: crystalProd / 3600,
      deuterium: deutProd / 3600,
      energy: energyProd - energyUsed
    };
  };

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const production = getProduction();
      
      setResources(prev => ({
        metal: prev.metal + (production.metal * 10),
        crystal: prev.crystal + (production.crystal * 10),
        deuterium: prev.deuterium + (production.deuterium * 10),
        energy: production.energy
      }));

      // Process Queue
      const now = Date.now();
      setQueue(prev => {
        const finished = prev.filter(item => item.endTime <= now);
        const remaining = prev.filter(item => item.endTime > now);

        finished.forEach(item => {
           if (item.type === "building") {
             setBuildings(b => ({ ...b, [item.id]: b[item.id as keyof Buildings] + 1 }));
             addEvent("Construction Complete", `${item.name} upgrade finished.`, "success");
             // Give XP
             setCommander(c => ({ ...c, stats: { ...c.stats, xp: c.stats.xp + 100 } }));
           } else if (item.type === "research") {
             setResearch(r => ({ ...r, [item.id]: (r[item.id] || 0) + 1 }));
             addEvent("Research Complete", `${item.name} research finished.`, "info");
             setCommander(c => ({ ...c, stats: { ...c.stats, xp: c.stats.xp + 200 } }));
           } else if (item.type === "unit" && item.amount) {
             setUnits(u => ({ ...u, [item.id]: (u[item.id] || 0) + item.amount! }));
             addEvent("Shipyard Order", `${item.amount}x ${item.name} constructed.`, "success");
           }
        });

        return remaining;
      });

      // Random Events (Mock)
      if (Math.random() > 0.995) {
         const randomEvents = [
            { title: "Merchant Arrival", desc: "A wandering trader has docked at the spaceport.", type: "info" },
            { title: "Solar Flare", desc: "Energy production increased by 10% momentarily.", type: "success" },
            { title: "Pirate Signal", desc: "Intercepcted coded transmission from local pirate gang.", type: "warning" },
            { title: "Sensor Malfunction", desc: "Long range scanners offline for maintenance.", type: "danger" }
         ];
         const ev = randomEvents[Math.floor(Math.random() * randomEvents.length)];
         addEvent(ev.title, ev.desc, ev.type as any);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [buildings, commander.stats.logistics, commander.race, commander.class]);

  const addEvent = (title: string, description: string, type: GameEvent["type"]) => {
    setEvents(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 10));
  };

  const updateBuilding = (building: keyof Buildings, name: string, time: number = 5000) => {
    const costMetal = 100 * Math.pow(2, buildings[building]);
    const costCrystal = 50 * Math.pow(2, buildings[building]);

    if (resources.metal >= costMetal && resources.crystal >= costCrystal) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - costMetal,
        crystal: prev.crystal - costCrystal
      }));
      setQueue(prev => [...prev, {
        id: building,
        name: name,
        endTime: Date.now() + time,
        type: "building"
      }]);
    } else {
      alert("Not enough resources!");
    }
  };

  const updateResearch = (tech: string, name: string, time: number = 5000) => {
     setQueue(prev => [...prev, {
        id: tech,
        name: name,
        endTime: Date.now() + time,
        type: "research"
      }]);
  };

  const buildUnit = (unitId: string, amount: number, name: string, time: number = 2000) => {
    setQueue(prev => [...prev, {
      id: unitId,
      name: name,
      endTime: Date.now() + (time * amount),
      type: "unit",
      amount
    }]);
  };

  const equipItem = (item: Item) => {
    if (item.type === "blueprint" || item.type === "material") return;
    
    setCommander(prev => {
      const slot = item.type as "weapon" | "armor" | "module";
      const currentEquip = prev.equipment[slot];
      const newInventory = prev.inventory.filter(i => i.id !== item.id);
      if (currentEquip) newInventory.push(currentEquip);
      
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: newInventory
      };
    });
  };

  const unequipItem = (slot: "weapon" | "armor" | "module") => {
    setCommander(prev => {
      const item = prev.equipment[slot];
      if (!item) return prev;
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: [...prev.inventory, item]
      };
    });
  };

  const craftItem = (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => {
     if (resources.metal >= cost.metal && resources.crystal >= cost.crystal && (!cost.deuterium || resources.deuterium >= cost.deuterium)) {
        setResources(prev => ({
           ...prev,
           metal: prev.metal - cost.metal,
           crystal: prev.crystal - cost.crystal,
           deuterium: prev.deuterium - (cost.deuterium || 0)
        }));
        setCommander(prev => ({
           ...prev,
           inventory: [...prev.inventory, item]
        }));
        addEvent("Crafting Complete", `Created ${item.name}`, "success");
     } else {
        alert("Insufficient Resources");
     }
  };

  const temperItem = (itemId: string) => {
     if (resources.metal >= 1000) {
        setResources(prev => ({ ...prev, metal: prev.metal - 1000 }));
        setCommander(prev => ({
           ...prev,
           inventory: prev.inventory.map(i => i.id === itemId ? { ...i, tempering: (i.tempering || 0) + 1 } : i),
           equipment: {
              weapon: prev.equipment.weapon?.id === itemId ? { ...prev.equipment.weapon, tempering: (prev.equipment.weapon.tempering || 0) + 1 } : prev.equipment.weapon,
              armor: prev.equipment.armor?.id === itemId ? { ...prev.equipment.armor, tempering: (prev.equipment.armor.tempering || 0) + 1 } : prev.equipment.armor,
              module: prev.equipment.module?.id === itemId ? { ...prev.equipment.module, tempering: (prev.equipment.module.tempering || 0) + 1 } : prev.equipment.module,
           }
        }));
        addEvent("Tempering Success", "Item improved successfully.", "success");
     }
  };

  const setCommanderIdentity = (race: RaceId, cls: ClassId, subClass: SubClassId | null) => {
    setCommander(prev => ({ ...prev, race, class: cls, subClass }));
    addEvent("Identity Updated", `Commander identity re-sequenced to ${RACES[race].name} ${CLASSES[cls].name}.`, "info");
  };

  return (
    <GameContext.Provider value={{ 
       resources, 
       buildings, 
       research,
       units,
       commander,
       planetName, 
       events,
       queue,
       updateBuilding,
       updateResearch,
       buildUnit,
       addEvent,
       equipItem,
       unequipItem,
       craftItem,
       temperItem,
       setCommanderIdentity
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
