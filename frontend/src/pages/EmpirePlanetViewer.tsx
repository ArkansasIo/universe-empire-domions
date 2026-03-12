import { useMemo, useState } from "react";
import { useGame } from "@/lib/gameContext";
import GameLayout from "@/components/layout/GameLayout";
import { 
  Globe, ChevronDown, ChevronUp, Settings, Trash2, Star, Moon,
  Factory, FlaskConical, Rocket, Shield, Zap, Database, Box, Gem,
  Thermometer, Ruler, Users, Building, ArrowUpDown, Filter, Search,
  Eye, Edit, MapPin, Layers, Grid3X3, List, RefreshCw
} from "lucide-react";

// OGame-style planet data interface
interface PlanetData {
  id: string;
  name: string;
  coordinates: string;
  position: number;
  fields: { used: number; max: number };
  temperature: { min: number; max: number };
  diameter: number;
  type: string;
  class: string;
  moon?: { name: string; fields: number; diameter: number };
  resources: { metal: number; crystal: number; deuterium: number; energy: number };
  buildings: Record<string, number>;
  ships: Record<string, number>;
  defense: Record<string, number>;
  production: { metal: number; crystal: number; deuterium: number };
}

// Generate mock planet data for demo
const generatePlanets = (count: number): PlanetData[] => {
  const types = ["Dry", "Desert", "Jungle", "Gas", "Water", "Ice", "Tundra", "Barren", "Volcanic", "Terra"];
  const classes = ["M", "K", "L", "H", "P", "Y", "J", "D", "O", "N"];
  
  return Array.from({ length: count }, (_, i) => {
    const position = (i % 15) + 1;
    const baseFields = position === 8 ? 220 : (180 - Math.abs(8 - position) * 15);
    const maxFields = baseFields + Math.floor(Math.random() * 50);
    const usedFields = Math.floor(Math.random() * maxFields * 0.7);
    
    return {
      id: `planet-${i + 1}`,
      name: i === 0 ? "Homeworld" : `Colony ${i}`,
      coordinates: `[${Math.floor(i / 15) + 1}:${(i % 499) + 1}:${position}]`,
      position,
      fields: { used: usedFields, max: maxFields },
      temperature: { 
        min: position <= 3 ? 100 + Math.random() * 100 : (position >= 13 ? -150 - Math.random() * 50 : -20 + Math.random() * 60),
        max: position <= 3 ? 150 + Math.random() * 100 : (position >= 13 ? -100 - Math.random() * 50 : 20 + Math.random() * 60)
      },
      diameter: 10000 + Math.floor(Math.random() * 6000),
      type: types[Math.floor(Math.random() * types.length)],
      class: classes[Math.floor(Math.random() * classes.length)],
      moon: Math.random() > 0.6 ? {
        name: `Moon ${i + 1}`,
        fields: Math.floor(Math.random() * 8) + 1,
        diameter: 2000 + Math.floor(Math.random() * 6000)
      } : undefined,
      resources: {
        metal: Math.floor(Math.random() * 5000000),
        crystal: Math.floor(Math.random() * 3000000),
        deuterium: Math.floor(Math.random() * 1500000),
        energy: Math.floor(Math.random() * 5000) - 500
      },
      buildings: {
        metalMine: Math.floor(Math.random() * 30),
        crystalMine: Math.floor(Math.random() * 25),
        deuteriumSynthesizer: Math.floor(Math.random() * 20),
        solarPlant: Math.floor(Math.random() * 25),
        roboticsFactory: Math.floor(Math.random() * 12),
        shipyard: Math.floor(Math.random() * 12),
        researchLab: Math.floor(Math.random() * 12),
        naniteFactory: Math.floor(Math.random() * 5),
        terraformer: Math.floor(Math.random() * 8)
      },
      ships: {
        lightFighter: Math.floor(Math.random() * 500),
        heavyFighter: Math.floor(Math.random() * 200),
        cruiser: Math.floor(Math.random() * 100),
        battleship: Math.floor(Math.random() * 50),
        smallCargo: Math.floor(Math.random() * 300),
        largeCargo: Math.floor(Math.random() * 100),
        colonyShip: Math.floor(Math.random() * 3),
        recycler: Math.floor(Math.random() * 50)
      },
      defense: {
        rocketLauncher: Math.floor(Math.random() * 500),
        lightLaser: Math.floor(Math.random() * 300),
        heavyLaser: Math.floor(Math.random() * 100),
        gaussCannon: Math.floor(Math.random() * 30),
        ionCannon: Math.floor(Math.random() * 50),
        plasmaTurret: Math.floor(Math.random() * 20)
      },
      production: {
        metal: Math.floor(Math.random() * 50000) + 5000,
        crystal: Math.floor(Math.random() * 30000) + 3000,
        deuterium: Math.floor(Math.random() * 15000) + 1000
      }
    };
  });
};

// Format large numbers OGame-style
const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toLocaleString();
};

// View modes
type ViewMode = "resources" | "buildings" | "ships" | "defense" | "production" | "overview";

export default function EmpirePlanetViewer() {
  const { resources: gameResources, buildings: gameBuildings, units: gameUnits, planetName: homePlanetName, coordinates: homeCoords } = useGame();

  // Merge real homeworld data into the generated planet list
  const [planets] = useState<PlanetData[]>(() => {
    const generated = generatePlanets(12);
    // Override first planet with real player data
    generated[0] = {
      ...generated[0],
      name: homePlanetName || "Homeworld",
      coordinates: homeCoords ? `[${homeCoords}]` : generated[0].coordinates,
      resources: {
        metal: gameResources.metal,
        crystal: gameResources.crystal,
        deuterium: gameResources.deuterium,
        energy: gameResources.energy,
      },
      buildings: {
        metalMine: gameBuildings.metalMine ?? 0,
        crystalMine: gameBuildings.crystalMine ?? 0,
        deuteriumSynthesizer: gameBuildings.deuteriumSynthesizer ?? 0,
        solarPlant: gameBuildings.solarPlant ?? 0,
        roboticsFactory: gameBuildings.roboticsFactory ?? 0,
        shipyard: gameBuildings.shipyard ?? 0,
        researchLab: gameBuildings.researchLab ?? 0,
        naniteFactory: (gameBuildings as any).naniteFactory ?? 0,
        terraformer: (gameBuildings as any).terraformer ?? 0,
      },
      ships: {
        lightFighter: gameUnits.lightFighter ?? 0,
        heavyFighter: gameUnits.heavyFighter ?? 0,
        cruiser: gameUnits.cruiser ?? 0,
        battleship: gameUnits.battleship ?? 0,
        smallCargo: gameUnits.smallCargo ?? 0,
        largeCargo: gameUnits.largeCargo ?? 0,
        colonyShip: gameUnits.colonyShip ?? 0,
        recycler: gameUnits.recycler ?? 0,
      },
      production: {
        metal: Math.floor(30 * (gameBuildings.metalMine ?? 0) * Math.pow(1.1, gameBuildings.metalMine ?? 0)),
        crystal: Math.floor(20 * (gameBuildings.crystalMine ?? 0) * Math.pow(1.1, gameBuildings.crystalMine ?? 0)),
        deuterium: Math.floor(10 * (gameBuildings.deuteriumSynthesizer ?? 0) * Math.pow(1.02, gameBuildings.deuteriumSynthesizer ?? 0)),
      },
    };
    return generated;
  });
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [sortBy, setSortBy] = useState<string>("coordinates");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMoons, setShowMoons] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Sort and filter planets
  const sortedPlanets = useMemo(() => {
    let filtered = planets.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.coordinates.includes(searchTerm)
    );
    
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "coordinates":
          comparison = a.coordinates.localeCompare(b.coordinates);
          break;
        case "fields":
          comparison = a.fields.max - b.fields.max;
          break;
        case "metal":
          comparison = a.resources.metal - b.resources.metal;
          break;
        case "crystal":
          comparison = a.resources.crystal - b.resources.crystal;
          break;
        case "deuterium":
          comparison = a.resources.deuterium - b.resources.deuterium;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [planets, sortBy, sortOrder, searchTerm]);

  // Calculate totals
  const totals = useMemo(() => {
    return planets.reduce((acc, p) => ({
      metal: acc.metal + p.resources.metal,
      crystal: acc.crystal + p.resources.crystal,
      deuterium: acc.deuterium + p.resources.deuterium,
      fields: acc.fields + p.fields.max,
      usedFields: acc.usedFields + p.fields.used,
      production: {
        metal: acc.production.metal + p.production.metal,
        crystal: acc.production.crystal + p.production.crystal,
        deuterium: acc.production.deuterium + p.production.deuterium
      }
    }), { 
      metal: 0, crystal: 0, deuterium: 0, fields: 0, usedFields: 0,
      production: { metal: 0, crystal: 0, deuterium: 0 }
    });
  }, [planets]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => (
    <span className="inline-flex ml-1">
      {sortBy === column ? (
        sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-40" />
      )}
    </span>
  );

  return (
    <GameLayout>
      <div className="min-h-screen bg-white" data-testid="empire-planet-viewer">
        {/* OGame-style Header */}
        <div className="bg-gradient-to-r from-[#0d1117] via-[#1a2332] to-[#0d1117] text-white px-4 py-3 border-b-2 border-[#3a4a5c]">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-wide font-orbitron">EMPIRE OVERVIEW</h1>
              <span className="text-xs bg-cyan-600/30 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                {planets.length} Planets
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Last Update:</span>
              <span className="text-cyan-300 font-mono">{new Date().toLocaleTimeString()}</span>
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empire Totals Bar - OGame Style */}
        <div className="bg-[#1e2a3a] border-b border-[#3a4a5c] px-4 py-2">
          <div className="max-w-full mx-auto flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-sm"></div>
              <span className="text-gray-400">Metal:</span>
              <span className="text-white font-mono font-bold">{formatNumber(totals.metal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm"></div>
              <span className="text-gray-400">Crystal:</span>
              <span className="text-blue-300 font-mono font-bold">{formatNumber(totals.crystal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-sm"></div>
              <span className="text-gray-400">Deuterium:</span>
              <span className="text-green-300 font-mono font-bold">{formatNumber(totals.deuterium)}</span>
            </div>
            <div className="border-l border-gray-600 pl-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-gray-400">Total Fields:</span>
              <span className="text-amber-300 font-mono font-bold">{totals.usedFields.toLocaleString()} / {totals.fields.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Production/h:</span>
              <span className="text-yellow-300 font-mono text-xs">
                {formatNumber(totals.production.metal)} / {formatNumber(totals.production.crystal)} / {formatNumber(totals.production.deuterium)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-[#f0f4f8] border-b border-[#d1d9e0] px-4 py-2">
          <div className="max-w-full mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Tabs - OGame Style */}
            <div className="flex bg-white rounded border border-[#c1c9d0] overflow-hidden shadow-sm">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "resources", label: "Resources", icon: Database },
                { id: "buildings", label: "Buildings", icon: Building },
                { id: "ships", label: "Fleet", icon: Rocket },
                { id: "defense", label: "Defense", icon: Shield },
                { id: "production", label: "Production", icon: Factory }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as ViewMode)}
                  className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 border-r border-[#d1d9e0] last:border-r-0 transition-colors
                    ${viewMode === id 
                      ? 'bg-[#2a4a6a] text-white' 
                      : 'bg-white text-[#4a5a6a] hover:bg-[#e8f0f8]'
                    }`}
                  data-testid={`btn-view-${id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search planets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#c1c9d0] rounded bg-white focus:outline-none focus:border-[#5a8aba] w-48"
                  data-testid="input-search"
                />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-[#4a5a6a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMoons}
                  onChange={(e) => setShowMoons(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Moon className="w-3.5 h-3.5" />
                Show Moons
              </label>
            </div>
          </div>
        </div>

        {/* Main Table - OGame Style */}
        <div className="p-4">
          <div className="bg-white border border-[#c1c9d0] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs" data-testid="table-planets">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gradient-to-b from-[#2a4a6a] to-[#1a3a5a] text-white">
                    <th 
                      className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-1.5 text-cyan-300" />
                        Planet Name
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th 
                      className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                      onClick={() => handleSort("coordinates")}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                        Coords
                        <SortIcon column="coordinates" />
                      </div>
                    </th>
                    <th 
                      className="px-3 py-2 text-center font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                      onClick={() => handleSort("fields")}
                    >
                      <div className="flex items-center justify-center">
                        <Grid3X3 className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                        Fields
                        <SortIcon column="fields" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-[#3a5a7a]">
                      <div className="flex items-center justify-center">
                        <Thermometer className="w-3.5 h-3.5 mr-1.5 text-red-300" />
                        Temp
                      </div>
                    </th>
                    
                    {/* Conditional columns based on view mode */}
                    {viewMode === "overview" && (
                      <>
                        <th className="px-3 py-2 text-center font-semibold border-r border-[#3a5a7a]">Type</th>
                        <th className="px-3 py-2 text-center font-semibold border-r border-[#3a5a7a]">Diameter</th>
                        <th className="px-3 py-2 text-center font-semibold">Moon</th>
                      </>
                    )}
                    
                    {viewMode === "resources" && (
                      <>
                        <th 
                          className="px-3 py-2 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                          onClick={() => handleSort("metal")}
                        >
                          <div className="flex items-center justify-end">
                            <Box className="w-3.5 h-3.5 mr-1.5 text-gray-300" />
                            Metal
                            <SortIcon column="metal" />
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                          onClick={() => handleSort("crystal")}
                        >
                          <div className="flex items-center justify-end">
                            <Gem className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
                            Crystal
                            <SortIcon column="crystal" />
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors border-r border-[#3a5a7a]"
                          onClick={() => handleSort("deuterium")}
                        >
                          <div className="flex items-center justify-end">
                            <Database className="w-3.5 h-3.5 mr-1.5 text-green-300" />
                            Deuterium
                            <SortIcon column="deuterium" />
                          </div>
                        </th>
                        <th className="px-3 py-2 text-right font-semibold">
                          <div className="flex items-center justify-end">
                            <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
                            Energy
                          </div>
                        </th>
                      </>
                    )}
                    
                    {viewMode === "buildings" && (
                      <>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Metal Mine">M</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Crystal Mine">C</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Deuterium Synthesizer">D</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Solar Plant">S</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Robotics Factory">R</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Shipyard">SY</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Research Lab">RL</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Nanite Factory">NF</th>
                        <th className="px-2 py-2 text-center font-semibold" title="Terraformer">TF</th>
                      </>
                    )}
                    
                    {viewMode === "ships" && (
                      <>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Light Fighter">LF</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Heavy Fighter">HF</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Cruiser">CR</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Battleship">BS</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Small Cargo">SC</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Large Cargo">LC</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Colony Ship">CS</th>
                        <th className="px-2 py-2 text-center font-semibold" title="Recycler">RC</th>
                      </>
                    )}
                    
                    {viewMode === "defense" && (
                      <>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Rocket Launcher">RL</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Light Laser">LL</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Heavy Laser">HL</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Gauss Cannon">GC</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-[#3a5a7a]" title="Ion Cannon">IC</th>
                        <th className="px-2 py-2 text-center font-semibold" title="Plasma Turret">PT</th>
                      </>
                    )}
                    
                    {viewMode === "production" && (
                      <>
                        <th className="px-3 py-2 text-right font-semibold border-r border-[#3a5a7a]">
                          <div className="flex items-center justify-end text-gray-300">
                            Metal/h
                          </div>
                        </th>
                        <th className="px-3 py-2 text-right font-semibold border-r border-[#3a5a7a]">
                          <div className="flex items-center justify-end text-blue-300">
                            Crystal/h
                          </div>
                        </th>
                        <th className="px-3 py-2 text-right font-semibold">
                          <div className="flex items-center justify-end text-green-300">
                            Deut/h
                          </div>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {sortedPlanets.map((planet, index) => (
                    <>
                      {/* Planet Row */}
                      <tr 
                        key={planet.id}
                        className={`
                          ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}
                          hover:bg-[#e8f4ff] transition-colors cursor-pointer
                          ${selectedPlanet === planet.id ? 'bg-[#d0e8ff] hover:bg-[#d0e8ff]' : ''}
                          ${index === 0 ? 'bg-gradient-to-r from-amber-50 to-white' : ''}
                        `}
                        onClick={() => setSelectedPlanet(selectedPlanet === planet.id ? null : planet.id)}
                        data-testid={`row-planet-${planet.id}`}
                      >
                        <td className="px-3 py-2 border-r border-[#e8ecf0]">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                              ${index === 0 
                                ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                              }`}
                            >
                              {index === 0 ? <Star className="w-4 h-4" /> : (index + 1)}
                            </div>
                            <div>
                              <div className="font-semibold text-[#2a4a6a]">{planet.name}</div>
                              <div className="text-[10px] text-gray-500">Class {planet.class} • {planet.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-[#4a6a8a] border-r border-[#e8ecf0]">
                          {planet.coordinates}
                        </td>
                        <td className="px-3 py-2 text-center border-r border-[#e8ecf0]">
                          <div className="flex flex-col items-center">
                            <div className="font-semibold text-[#2a4a6a]">{planet.fields.used}/{planet.fields.max}</div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  planet.fields.used / planet.fields.max > 0.9 
                                    ? 'bg-red-500' 
                                    : planet.fields.used / planet.fields.max > 0.7 
                                      ? 'bg-amber-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${(planet.fields.used / planet.fields.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-[#e8ecf0]">
                          <span className={`font-mono text-xs ${
                            planet.temperature.max > 50 ? 'text-red-600' : 
                            planet.temperature.min < -50 ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {Math.round(planet.temperature.min)}°C to {Math.round(planet.temperature.max)}°C
                          </span>
                        </td>
                        
                        {/* Conditional data based on view mode */}
                        {viewMode === "overview" && (
                          <>
                            <td className="px-3 py-2 text-center border-r border-[#e8ecf0]">
                              <span className="px-2 py-0.5 bg-[#e8f0f8] text-[#4a6a8a] rounded text-xs font-medium">
                                {planet.type}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-[#e8ecf0]">
                              {planet.diameter.toLocaleString()} km
                            </td>
                            <td className="px-3 py-2 text-center">
                              {planet.moon ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Moon className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-600">{planet.moon.fields}f</span>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          </>
                        )}
                        
                        {viewMode === "resources" && (
                          <>
                            <td className="px-3 py-2 text-right font-mono text-gray-700 border-r border-[#e8ecf0]">
                              {formatNumber(planet.resources.metal)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-blue-600 border-r border-[#e8ecf0]">
                              {formatNumber(planet.resources.crystal)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-green-600 border-r border-[#e8ecf0]">
                              {formatNumber(planet.resources.deuterium)}
                            </td>
                            <td className={`px-3 py-2 text-right font-mono ${planet.resources.energy >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {planet.resources.energy >= 0 ? '+' : ''}{formatNumber(planet.resources.energy)}
                            </td>
                          </>
                        )}
                        
                        {viewMode === "buildings" && (
                          <>
                            <td className="px-2 py-2 text-center font-mono text-xs text-gray-700 border-r border-[#e8ecf0]">{planet.buildings.metalMine}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-blue-600 border-r border-[#e8ecf0]">{planet.buildings.crystalMine}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-green-600 border-r border-[#e8ecf0]">{planet.buildings.deuteriumSynthesizer}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-yellow-600 border-r border-[#e8ecf0]">{planet.buildings.solarPlant}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-purple-600 border-r border-[#e8ecf0]">{planet.buildings.roboticsFactory}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-indigo-600 border-r border-[#e8ecf0]">{planet.buildings.shipyard}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-cyan-600 border-r border-[#e8ecf0]">{planet.buildings.researchLab}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-pink-600 border-r border-[#e8ecf0]">{planet.buildings.naniteFactory}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-amber-600">{planet.buildings.terraformer}</td>
                          </>
                        )}
                        
                        {viewMode === "ships" && (
                          <>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.lightFighter || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.heavyFighter || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.cruiser || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.battleship || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.smallCargo || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.largeCargo || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.ships.colonyShip || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs">{planet.ships.recycler || '-'}</td>
                          </>
                        )}
                        
                        {viewMode === "defense" && (
                          <>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.defense.rocketLauncher || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.defense.lightLaser || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.defense.heavyLaser || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.defense.gaussCannon || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs border-r border-[#e8ecf0]">{planet.defense.ionCannon || '-'}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs">{planet.defense.plasmaTurret || '-'}</td>
                          </>
                        )}
                        
                        {viewMode === "production" && (
                          <>
                            <td className="px-3 py-2 text-right font-mono text-xs text-gray-700 border-r border-[#e8ecf0]">
                              +{formatNumber(planet.production.metal)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-blue-600 border-r border-[#e8ecf0]">
                              +{formatNumber(planet.production.crystal)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-green-600">
                              +{formatNumber(planet.production.deuterium)}
                            </td>
                          </>
                        )}
                      </tr>
                      
                      {/* Moon Row (if applicable and showMoons is true) */}
                      {showMoons && planet.moon && (
                        <tr 
                          key={`${planet.id}-moon`}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-[#f0f4f8]'} text-xs`}
                        >
                          <td className="px-3 py-1.5 border-r border-[#e8ecf0]" colSpan={1}>
                            <div className="flex items-center gap-2 pl-6">
                              <Moon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{planet.moon.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5 font-mono text-gray-500 border-r border-[#e8ecf0]">
                            {planet.coordinates.replace(']', ':M]')}
                          </td>
                          <td className="px-3 py-1.5 text-center text-gray-600 border-r border-[#e8ecf0]">
                            {planet.moon.fields}/8
                          </td>
                          <td className="px-3 py-1.5 text-center text-gray-500 border-r border-[#e8ecf0]">
                            -
                          </td>
                          {viewMode === "overview" && (
                            <>
                              <td className="px-3 py-1.5 text-center text-gray-500 border-r border-[#e8ecf0]">Moon</td>
                              <td className="px-3 py-1.5 text-center font-mono text-xs text-gray-500 border-r border-[#e8ecf0]">
                                {planet.moon.diameter.toLocaleString()} km
                              </td>
                              <td className="px-3 py-1.5 text-center text-gray-400">-</td>
                            </>
                          )}
                          {viewMode !== "overview" && (
                            <td colSpan={viewMode === "buildings" ? 9 : (viewMode === "ships" ? 8 : (viewMode === "defense" ? 6 : (viewMode === "resources" ? 4 : 3)))} className="px-3 py-1.5 text-center text-gray-400">
                              Moon data available in detailed view
                            </td>
                          )}
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>

                {/* Table Footer - Totals */}
                <tfoot>
                  <tr className="bg-gradient-to-b from-[#e8ecf0] to-[#d8dce0] font-semibold border-t-2 border-[#c1c9d0]">
                    <td className="px-3 py-2 border-r border-[#c8ccd0]">
                      <div className="flex items-center gap-2 text-[#2a4a6a]">
                        <Users className="w-4 h-4" />
                        Total ({sortedPlanets.length} planets)
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-[#c8ccd0]">-</td>
                    <td className="px-3 py-2 text-center border-r border-[#c8ccd0]">
                      <span className="text-[#2a4a6a]">{totals.usedFields}/{totals.fields}</span>
                    </td>
                    <td className="px-3 py-2 text-center border-r border-[#c8ccd0]">-</td>
                    
                    {viewMode === "overview" && (
                      <>
                        <td className="px-3 py-2 text-center border-r border-[#c8ccd0]">-</td>
                        <td className="px-3 py-2 text-center border-r border-[#c8ccd0]">-</td>
                        <td className="px-3 py-2 text-center">
                          {sortedPlanets.filter(p => p.moon).length} moons
                        </td>
                      </>
                    )}
                    
                    {viewMode === "resources" && (
                      <>
                        <td className="px-3 py-2 text-right font-mono text-gray-700 border-r border-[#c8ccd0]">
                          {formatNumber(totals.metal)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-blue-600 border-r border-[#c8ccd0]">
                          {formatNumber(totals.crystal)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-green-600 border-r border-[#c8ccd0]">
                          {formatNumber(totals.deuterium)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">-</td>
                      </>
                    )}
                    
                    {viewMode === "production" && (
                      <>
                        <td className="px-3 py-2 text-right font-mono text-gray-700 border-r border-[#c8ccd0]">
                          +{formatNumber(totals.production.metal)}/h
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-blue-600 border-r border-[#c8ccd0]">
                          +{formatNumber(totals.production.crystal)}/h
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-green-600">
                          +{formatNumber(totals.production.deuterium)}/h
                        </td>
                      </>
                    )}
                    
                    {(viewMode === "buildings" || viewMode === "ships" || viewMode === "defense") && (
                      <td colSpan={viewMode === "buildings" ? 9 : (viewMode === "ships" ? 8 : 6)} className="px-3 py-2 text-center text-gray-500">
                        See individual planet details
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Legend / Help */}
        <div className="px-4 pb-4">
          <div className="bg-[#f8fafc] border border-[#e1e5e9] rounded-lg p-4 text-xs text-gray-600">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full"></div>
                <span>Homeworld</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                <span>Colony</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-3 h-3 text-gray-400" />
                <span>Moon Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1.5 bg-green-500 rounded-full"></div>
                <span>&lt;70% Fields Used</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1.5 bg-amber-500 rounded-full"></div>
                <span>70-90% Fields Used</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1.5 bg-red-500 rounded-full"></div>
                <span>&gt;90% Fields Used</span>
              </div>
            </div>
            <div className="mt-3 text-gray-500">
              <strong>Tip:</strong> Click column headers to sort. Click a planet row to select it. Position 8 typically has the largest planet size (up to 252 base fields).
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
