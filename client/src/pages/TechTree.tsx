import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Building, Package, Zap, Rocket } from "lucide-react";
import { useState } from "react";
import { OGAME_BUILDINGS } from "@/lib/ogameBuildings";
import { OGAME_SHIPS } from "@/lib/ogameShips";
import { OGAME_RESEARCH } from "@/lib/ogameResearch";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

export default function TechTree() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categoryColors: {[key: string]: string} = {
    resource: "bg-amber-100 text-amber-900",
    production: "bg-orange-100 text-orange-900",
    defense: "bg-red-100 text-red-900",
    utility: "bg-blue-100 text-blue-900",
    fighter: "bg-green-100 text-green-900",
    cargo: "bg-sky-100 text-sky-900",
    support: "bg-purple-100 text-purple-900",
    probe: "bg-pink-100 text-pink-900",
    capital: "bg-red-100 text-red-900",
    special: "bg-violet-100 text-violet-900",
    drive: "bg-cyan-100 text-cyan-900",
    weapon: "bg-rose-100 text-rose-900",
    shield: "bg-indigo-100 text-indigo-900",
    armor: "bg-slate-100 text-slate-900",
    energy: "bg-yellow-100 text-yellow-900",
    computer: "bg-blue-100 text-blue-900",
    esp: "bg-purple-100 text-purple-900",
    upgrade: "bg-lime-100 text-lime-900",
  };

  const filterBySearch = (items: any[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Technology & Blueprint Tree</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">OGame Complete: {OGAME_BUILDINGS.length} Buildings, {OGAME_SHIPS.length} Ships, {OGAME_RESEARCH.length} Research Technologies</p>
        </div>

        <Tabs defaultValue="buildings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="buildings" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Building className="w-4 h-4" /> Buildings ({OGAME_BUILDINGS.length})
            </TabsTrigger>
            <TabsTrigger value="ships" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Package className="w-4 h-4" /> Ships ({OGAME_SHIPS.length})
            </TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Zap className="w-4 h-4" /> Research ({OGAME_RESEARCH.length})
            </TabsTrigger>
          </TabsList>

          {/* Buildings */}
          <TabsContent value="buildings" className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Search buildings..."
              className="w-full px-4 py-2 border border-slate-300 rounded bg-white text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-buildings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(OGAME_BUILDINGS).map(building => (
                <Card
                  key={building.id}
                  className={cn("cursor-pointer border-slate-200 transition-all", selectedItem === building.id ? "border-primary shadow-lg" : "hover:shadow-md")}
                  onClick={() => setSelectedItem(building.id)}
                  data-testid={`building-card-${building.id}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-orbitron font-bold text-slate-900">{building.name}</div>
                        <div className="text-xs text-slate-600">{building.description}</div>
                      </div>
                      <Badge className={categoryColors[building.category] || "bg-slate-100"}>
                        {building.category}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <div><span className="font-bold text-amber-600">{building.cost.metal}</span> Metal</div>
                      <div><span className="font-bold text-blue-600">{building.cost.crystal}</span> Crystal</div>
                      <div><span className="font-bold text-green-600">{building.cost.deuterium}</span> Deut</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ships */}
          <TabsContent value="ships" className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Search ships..."
              className="w-full px-4 py-2 border border-slate-300 rounded bg-white text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-ships"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(OGAME_SHIPS).map(ship => (
                <Card
                  key={ship.id}
                  className={cn("cursor-pointer border-slate-200 transition-all", selectedItem === ship.id ? "border-primary shadow-lg" : "hover:shadow-md")}
                  onClick={() => setSelectedItem(ship.id)}
                  data-testid={`ship-card-${ship.id}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-orbitron font-bold text-slate-900">{ship.name}</div>
                        <div className="text-xs text-slate-600">{ship.description}</div>
                      </div>
                      <Badge className={categoryColors[ship.type] || "bg-slate-100"}>
                        {ship.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <div><span className="font-bold text-red-600">{ship.attack}</span> Atk</div>
                      <div><span className="font-bold text-blue-600">{ship.defense}</span> Def</div>
                      <div><span className="font-bold text-green-600">{ship.speed}</span> Spd</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] pt-1 border-t border-slate-200">
                      <div><span className="font-bold text-amber-600">{ship.cost.metal}</span> M</div>
                      <div><span className="font-bold text-blue-600">{ship.cost.crystal}</span> C</div>
                      <div><span className="font-bold text-green-600">{ship.cost.deuterium}</span> D</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Research */}
          <TabsContent value="research" className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Search research..."
              className="w-full px-4 py-2 border border-slate-300 rounded bg-white text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-research"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(OGAME_RESEARCH).map(research => (
                <Card
                  key={research.id}
                  className={cn("cursor-pointer border-slate-200 transition-all", selectedItem === research.id ? "border-primary shadow-lg" : "hover:shadow-md")}
                  onClick={() => setSelectedItem(research.id)}
                  data-testid={`research-card-${research.id}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-orbitron font-bold text-slate-900">{research.name}</div>
                        <div className="text-xs text-slate-600">{research.description}</div>
                      </div>
                      <Badge className={categoryColors[research.category] || "bg-slate-100"}>
                        {research.category}
                      </Badge>
                    </div>
                    {research.prerequisites && Object.keys(research.prerequisites).length > 0 && (
                      <div className="text-xs text-slate-600">Requires: {Object.keys(research.prerequisites).join(", ")}</div>
                    )}
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <div><span className="font-bold text-amber-600">{research.cost.metal}</span> M</div>
                      <div><span className="font-bold text-blue-600">{research.cost.crystal}</span> C</div>
                      <div><span className="font-bold text-green-600">{research.cost.deuterium}</span> D</div>
                    </div>
                    {research.bonus && (
                      <div className="text-[10px] bg-slate-50 p-1 rounded italic text-slate-700">
                        Bonus: {Object.values(research.bonus).join(", ")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
