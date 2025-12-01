import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Expanded Research Interface to match researchData.ts
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
  [key: string]: number; // Index signature for dynamic access
}

interface Ships {
  lightFighter: number;
  heavyFighter: number;
  cruiser: number;
  battleship: number;
  smallCargo: number;
  largeCargo: number;
  colonyShip: number;
  recycler: number;
  espionageProbe: number;
}

interface GameState {
  resources: Resources;
  buildings: Buildings;
  research: Research;
  ships: Ships;
  planetName: string;
  updateBuilding: (building: keyof Buildings) => void;
  updateResearch: (tech: string) => void; // Changed to string to allow dynamic IDs
  buildShip: (ship: keyof Ships, amount: number) => void;
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

  const [research, setResearch] = useState<Research>({
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

  const [ships, setShips] = useState<Ships>({
    lightFighter: 5,
    heavyFighter: 0,
    cruiser: 0,
    battleship: 0,
    smallCargo: 2,
    largeCargo: 0,
    colonyShip: 0,
    recycler: 0,
    espionageProbe: 10,
  });

  const planetName = "Homeworld";

  // Calculate production
  const getProduction = () => {
    const metalProd = 30 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalProd = 20 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutProd = 10 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    const energyProd = 20 * buildings.solarPlant * Math.pow(1.1, buildings.solarPlant);
    
    const metalCons = 10 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalCons = 10 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutCons = 20 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    
    const energyUsed = metalCons + crystalCons + deutCons;

    return {
      metal: metalProd / 3600, // speed up for testing
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
        metal: prev.metal + (production.metal * 10), // 10x speed for testing
        crystal: prev.crystal + (production.crystal * 10),
        deuterium: prev.deuterium + (production.deuterium * 10),
        energy: production.energy
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [buildings]);

  const updateBuilding = (building: keyof Buildings) => {
    const costMetal = 100 * Math.pow(2, buildings[building]);
    const costCrystal = 50 * Math.pow(2, buildings[building]);

    if (resources.metal >= costMetal && resources.crystal >= costCrystal) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - costMetal,
        crystal: prev.crystal - costCrystal
      }));
      setBuildings(prev => ({
        ...prev,
        [building]: prev[building] + 1
      }));
    } else {
      alert("Not enough resources!");
    }
  };

  const updateResearch = (tech: string) => {
     // We need cost calculation here too, but for now we'll rely on the Research component passing valid checks
     // or implement a generic cost calculator.
     // For prototype, we just increment.
     // Real implementation would import costs from researchData
     setResearch(prev => ({
       ...prev,
       [tech]: (prev[tech] || 0) + 1
     }));
  };

  const buildShip = (ship: keyof Ships, amount: number) => {
     // Mock cost per ship
     const costMetal = 3000 * amount;
     const costCrystal = 1000 * amount;

     if (resources.metal >= costMetal && resources.crystal >= costCrystal) {
        setResources(prev => ({
          ...prev,
          metal: prev.metal - costMetal,
          crystal: prev.crystal - costCrystal
        }));
        setShips(prev => ({
          ...prev,
          [ship]: prev[ship] + amount
        }));
     } else {
        alert("Not enough resources!");
     }
  };

  return (
    <GameContext.Provider value={{ 
       resources, 
       buildings, 
       research,
       ships,
       planetName, 
       updateBuilding,
       updateResearch,
       buildShip
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
