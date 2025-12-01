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

interface Research {
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
  updateResearch: (tech: keyof Research) => void;
  buildShip: (ship: keyof Ships, amount: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resources>({
    metal: 500,
    crystal: 500,
    deuterium: 0,
    energy: 0,
  });

  const [buildings, setBuildings] = useState<Buildings>({
    metalMine: 1,
    crystalMine: 1,
    deuteriumSynthesizer: 0,
    solarPlant: 1,
    roboticsFactory: 0,
    shipyard: 0,
    researchLab: 0,
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
        metal: prev.metal + production.metal,
        crystal: prev.crystal + production.crystal,
        deuterium: prev.deuterium + production.deuterium,
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

  const updateResearch = (tech: keyof Research) => {
     // Mock cost
     const costMetal = 500 * Math.pow(2, research[tech]);
     const costCrystal = 800 * Math.pow(2, research[tech]);
     const costDeut = 200 * Math.pow(2, research[tech]);

     if (resources.metal >= costMetal && resources.crystal >= costCrystal && resources.deuterium >= costDeut) {
        setResources(prev => ({
          ...prev,
          metal: prev.metal - costMetal,
          crystal: prev.crystal - costCrystal,
          deuterium: prev.deuterium - costDeut
        }));
        setResearch(prev => ({
          ...prev,
          [tech]: prev[tech] + 1
        }));
     } else {
        alert("Not enough resources!");
     }
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
