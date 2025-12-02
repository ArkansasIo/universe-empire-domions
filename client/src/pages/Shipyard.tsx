import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Box, Gem, Database, Plus, Info, Shield, Sword, Zap, User, Truck, Clock, Hammer, Skull, Hexagon } from "lucide-react";
import { useState, useEffect } from "react";
import { unitData, UnitItem } from "@/lib/unitData";

const UnitCard = ({ 
  item, 
  count, 
  onBuild, 
  resources 
}: { 
  item: UnitItem, 
  count: number, 
  onBuild: (id: string, amount: number, name: string, time: number) => void, 
  resources: any 
}) => {
  const [amount, setAmount] = useState(1);
  const Icon = item.icon;
  
  const totalMetal = item.cost.metal * amount;
  const totalCrystal = item.cost.crystal * amount;
  const totalDeut = item.cost.deuterium * amount;
  
  const buildTime = 2000; // Mock time per unit (2s)

  const canAfford = 
    resources.metal >= totalMetal && 
    resources.crystal >= totalCrystal && 
    resources.deuterium >= totalDeut;

  return (
    <Card className="bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full">
       <div className="h-24 bg-slate-50 relative border-b border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-slate-300 group-hover:text-primary/20 transition-colors" />
          </div>
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-mono text-primary border border-slate-200 shadow-sm">
            Owned: {count}
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900">{item.name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1 space-y-3">
         <p className="text-xs text-muted-foreground min-h-[2.5rem]">{item.description}</p>
         
         <div className="grid grid-cols-2 gap-1 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 p-2 rounded">
            <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Hull: {item.stats.structure.toLocaleString()}</div>
            <div className="flex items-center gap-1"><Sword className="w-3 h-3" /> Atk: {item.stats.attack.toLocaleString()}</div>
            <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Shld: {item.stats.shield.toLocaleString()}</div>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time: {buildTime/1000}s</div>
         </div>

         {/* Requirements Mock */}
         <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">
            <Badge variant="outline" className="border-slate-200 text-slate-400 h-5">Shipyard Lvl 1</Badge>
            {item.class === "capital" && <Badge variant="outline" className="border-slate-200 text-slate-400 h-5">Impulse Drive Lvl 4</Badge>}
         </div>

         <div className="space-y-1 pt-1">
            {item.cost.metal > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                 <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span>
                 <span className={resources.metal < totalMetal ? "text-red-600 font-bold" : ""}>{item.cost.metal.toLocaleString()}</span>
              </div>
            )}
            {item.cost.crystal > 0 && (
              <div className="flex items-center justify-between text-xs text-blue-600">
                 <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span>
                 <span className={resources.crystal < totalCrystal ? "text-red-600 font-bold" : ""}>{item.cost.crystal.toLocaleString()}</span>
              </div>
            )}
            {item.cost.deuterium > 0 && (
              <div className="flex items-center justify-between text-xs text-green-600">
                 <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</span>
                 <span className={resources.deuterium < totalDeut ? "text-red-600 font-bold" : ""}>{item.cost.deuterium.toLocaleString()}</span>
              </div>
            )}
         </div>

         <div className="flex gap-2 pt-2">
            <Input 
              type="number" 
              min="1" 
              max="1000"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-slate-50 border-slate-200 h-8 text-xs font-mono text-slate-900"
            />
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron text-xs h-8"
            disabled={!canAfford}
            onClick={() => onBuild(item.id, amount, item.name, buildTime)}
         >
           {canAfford ? (
             <>
               <Plus className="w-3 h-3 mr-2" /> BUILD
             </>
           ) : (
             "NO RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Shipyard() {
  const { units, resources, buildUnit, queue } = useGame();

  const combatShips = unitData.filter(u => u.class === "fighter" || u.class === "capital");
  const civilShips = unitData.filter(u => u.class === "civilian");
  const troops = unitData.filter(u => u.class === "troop");
  const vehicles = unitData.filter(u => u.class === "vehicle");
  const supers = unitData.filter(u => u.class === "super");
  const titans = unitData.filter(u => u.class === "titan");

  // Filter queue for units
  const unitQueue = queue.filter(q => q.type === "unit");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Orbital Shipyard</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Construct fleets, recruit personnel, and build ground vehicles.</p>
        </div>

        {/* Production Queue */}
        {unitQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm mb-6">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Hammer className="w-4 h-4" /> Production Queue
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {unitQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-slate-200">
                               <Hammer className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900">
                                  <span>{item.amount}x {item.name}</span>
                                  <span className="font-mono text-primary">{timeLeft}s</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / 2) * 100)} className="h-1 mt-1" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <Tabs defaultValue="combat" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="combat" className="font-orbitron"><Sword className="w-4 h-4 mr-2" /> Combat Fleet</TabsTrigger>
            <TabsTrigger value="civil" className="font-orbitron"><Box className="w-4 h-4 mr-2" /> Civil Ships</TabsTrigger>
            <TabsTrigger value="troops" className="font-orbitron"><User className="w-4 h-4 mr-2" /> Personnel</TabsTrigger>
            <TabsTrigger value="vehicles" className="font-orbitron"><Truck className="w-4 h-4 mr-2" /> Vehicles</TabsTrigger>
            <TabsTrigger value="super" className="font-orbitron text-purple-600"><Zap className="w-4 h-4 mr-2" /> Super Capital</TabsTrigger>
            <TabsTrigger value="titan" className="font-orbitron text-red-600 font-bold border-red-200 bg-red-50"><Hexagon className="w-4 h-4 mr-2" /> TITANS</TabsTrigger>
          </TabsList>

          <div className="mt-6">
             <TabsContent value="combat" className="mt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {combatShips.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="civil" className="mt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {civilShips.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="troops" className="mt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {troops.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="vehicles" className="mt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {vehicles.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="super" className="mt-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {supers.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="titan" className="mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {titans.map(item => (
                    <UnitCard key={item.id} item={item} count={units[item.id] || 0} onBuild={buildUnit} resources={resources} />
                 ))}
               </div>
             </TabsContent>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
