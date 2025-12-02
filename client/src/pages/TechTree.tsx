import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Package, Zap, Search } from "lucide-react";
import { useState } from "react";
import { OGAME_BUILDINGS } from "@/lib/ogameBuildings";
import { OGAME_SHIPS } from "@/lib/ogameShips";
import { OGAME_RESEARCH } from "@/lib/ogameResearch";
import { cn } from "@/lib/utils";

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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Technology & Blueprint Tree</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Complete tech database: {OGAME_BUILDINGS.length} Buildings, {OGAME_SHIPS.length} Ships, {OGAME_RESEARCH.length} Technologies</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-slate-400 self-center" />
            <Input
              type="text"
              placeholder="Search buildings, ships, or research..."
              className="bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-tech-tree"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="buildings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-14 shadow-sm">
            <TabsTrigger value="buildings" className="font-orbitron text-sm flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Building className="w-4 h-4" />
              Buildings ({OGAME_BUILDINGS.length})
            </TabsTrigger>
            <TabsTrigger value="ships" className="font-orbitron text-sm flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Package className="w-4 h-4" />
              Ships ({OGAME_SHIPS.length})
            </TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron text-sm flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Zap className="w-4 h-4" />
              Research ({OGAME_RESEARCH.length})
            </TabsTrigger>
          </TabsList>

          {/* Buildings Tab */}
          <TabsContent value="buildings" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Name</TableHead>
                    <TableHead className="text-slate-700 font-bold">Category</TableHead>
                    <TableHead className="text-slate-700 font-bold">Metal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Crystal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Deuterium</TableHead>
                    <TableHead className="text-right text-slate-700 font-bold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_BUILDINGS).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No buildings found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_BUILDINGS).map(building => (
                      <TableRow
                        key={building.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(building.id)}
                        data-testid={`building-row-${building.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{building.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[building.category] || "bg-slate-100"}>
                            {building.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-amber-600 font-bold">{building.cost.metal}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{building.cost.crystal}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{building.cost.deuterium}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                            data-testid={`button-view-building-${building.id}`}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Ships Tab */}
          <TabsContent value="ships" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Name</TableHead>
                    <TableHead className="text-slate-700 font-bold">Type</TableHead>
                    <TableHead className="text-slate-700 font-bold">Attack</TableHead>
                    <TableHead className="text-slate-700 font-bold">Defense</TableHead>
                    <TableHead className="text-slate-700 font-bold">Speed</TableHead>
                    <TableHead className="text-slate-700 font-bold">Cost</TableHead>
                    <TableHead className="text-right text-slate-700 font-bold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_SHIPS).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No ships found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_SHIPS).map(ship => (
                      <TableRow
                        key={ship.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(ship.id)}
                        data-testid={`ship-row-${ship.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{ship.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[ship.type] || "bg-slate-100"}>
                            {ship.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-red-600 font-bold">{ship.attack}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{ship.defense}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{ship.speed}</TableCell>
                        <TableCell className="text-sm">
                          <span className="text-amber-600 font-bold">{ship.cost.metal}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-blue-600 font-bold">{ship.cost.crystal}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-green-600 font-bold">{ship.cost.deuterium}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                            data-testid={`button-view-ship-${ship.id}`}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Name</TableHead>
                    <TableHead className="text-slate-700 font-bold">Category</TableHead>
                    <TableHead className="text-slate-700 font-bold">Metal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Crystal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Deuterium</TableHead>
                    <TableHead className="text-slate-700 font-bold">Energy</TableHead>
                    <TableHead className="text-right text-slate-700 font-bold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_RESEARCH).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No research found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_RESEARCH).map(research => (
                      <TableRow
                        key={research.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(research.id)}
                        data-testid={`research-row-${research.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{research.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[research.category] || "bg-slate-100"}>
                            {research.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-amber-600 font-bold">{research.cost.metal}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{research.cost.crystal}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{research.cost.deuterium}</TableCell>
                        <TableCell className="font-mono text-yellow-600 font-bold">{research.cost.energy || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                            data-testid={`button-view-research-${research.id}`}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Item Details Panel */}
        {selectedItem && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">Item Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                  className="border-slate-200 text-slate-600"
                >
                  Close
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const building = OGAME_BUILDINGS.find(b => b.id === selectedItem);
                  const ship = OGAME_SHIPS.find(s => s.id === selectedItem);
                  const research = OGAME_RESEARCH.find(r => r.id === selectedItem);
                  
                  const item = building || ship || research;
                  
                  return item ? (
                    <>
                      <div className="md:col-span-3 bg-slate-50 p-4 rounded border border-slate-200">
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                      
                      {(building || research) && (
                        <>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Metal Cost</p>
                            <p className="text-2xl font-bold text-amber-600">{(item as any).cost.metal}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Crystal Cost</p>
                            <p className="text-2xl font-bold text-blue-600">{(item as any).cost.crystal}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Deuterium Cost</p>
                            <p className="text-2xl font-bold text-green-600">{(item as any).cost.deuterium}</p>
                          </div>
                        </>
                      )}
                      
                      {ship && (
                        <>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Attack Power</p>
                            <p className="text-2xl font-bold text-red-600">{(item as any).attack}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Defense Value</p>
                            <p className="text-2xl font-bold text-blue-600">{(item as any).defense}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Speed</p>
                            <p className="text-2xl font-bold text-green-600">{(item as any).speed}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Metal Cost</p>
                            <p className="text-2xl font-bold text-amber-600">{(item as any).cost.metal}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Crystal Cost</p>
                            <p className="text-2xl font-bold text-blue-600">{(item as any).cost.crystal}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Deuterium Cost</p>
                            <p className="text-2xl font-bold text-green-600">{(item as any).cost.deuterium}</p>
                          </div>
                        </>
                      )}
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
