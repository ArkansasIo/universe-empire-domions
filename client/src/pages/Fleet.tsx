import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Rocket, MapPin, Crosshair, Truck, Search, Play, Clock, AlertCircle, User, Anchor, Zap, Skull, Disc } from "lucide-react";
import { useState } from "react";
import { unitData } from "@/lib/unitData";
import { cn } from "@/lib/utils";

export default function Fleet() {
  const { units, activeMissions, dispatchFleet } = useGame();
  
  const [selectedUnits, setSelectedUnits] = useState<{[key: string]: number}>({});
  const [targetGalaxy, setTargetGalaxy] = useState("1");
  const [targetSystem, setTargetSystem] = useState("102");
  const [targetPlanet, setTargetPlanet] = useState("8");
  const [missionType, setMissionType] = useState<any>("attack");

  const handleUnitChange = (id: string, value: string) => {
     const num = parseInt(value) || 0;
     const max = units[id] || 0;
     setSelectedUnits(prev => ({
        ...prev,
        [id]: Math.min(Math.max(0, num), max)
     }));
  };

  const handleSelectAll = (id: string) => {
     setSelectedUnits(prev => ({
        ...prev,
        [id]: units[id] || 0
     }));
  };

  const handleDispatch = () => {
     // Filter zero counts
     const fleetComposition: {[key: string]: number} = {};
     let totalCount = 0;
     Object.entries(selectedUnits).forEach(([id, count]) => {
        if (count > 0) {
           fleetComposition[id] = count;
           totalCount += count;
        }
     });

     if (totalCount === 0) {
        alert("Select at least one ship!");
        return;
     }

     dispatchFleet({
        target: `${targetGalaxy}:${targetSystem}:${targetPlanet}`,
        type: missionType,
        units: fleetComposition,
        arrivalTime: 10000 // Mock 10s flight
     });

     // Reset
     setSelectedUnits({});
  };

  // Unit Grouping Helpers
  const getUnitClass = (id: string) => {
     const u = unitData.find(ud => ud.id === id);
     return u ? u.class : "unknown";
  };

  const getUnitName = (id: string) => {
     const u = unitData.find(ud => ud.id === id);
     return u ? u.name : id;
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Fleet Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage active missions and dispatch fleets.</p>
        </div>

        <Tabs defaultValue="dispatch" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="dispatch" className="font-orbitron"><Rocket className="w-4 h-4 mr-2" /> Dispatch Fleet</TabsTrigger>
              <TabsTrigger value="active" className="font-orbitron">
                 <Clock className="w-4 h-4 mr-2" /> Active Missions 
                 {activeMissions.length > 0 && <Badge className="ml-2 bg-primary text-white h-5">{activeMissions.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="templates" className="font-orbitron"><Anchor className="w-4 h-4 mr-2" /> Fleet Templates</TabsTrigger>
           </TabsList>

           {/* DISPATCH TAB */}
           <TabsContent value="dispatch" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Ship Selection */}
                <Card className="col-span-2 bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                      <Rocket className="w-5 h-5 text-primary" /> Select Fleet Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-transparent">
                          <TableHead className="text-slate-900">Unit Class & Type</TableHead>
                          <TableHead className="text-right text-slate-900">Speed</TableHead>
                          <TableHead className="text-right text-slate-900">Available</TableHead>
                          <TableHead className="text-right text-slate-900 w-[140px]">Select</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {["fighter", "capital", "super", "titan", "civilian", "troop", "vehicle"].map(cls => {
                           const classUnits = Object.keys(units).filter(id => getUnitClass(id) === cls && units[id] > 0);
                           if (classUnits.length === 0) return null;

                           return (
                              <>
                                 <TableRow key={cls} className="bg-slate-50 hover:bg-slate-50 border-slate-200">
                                    <TableCell colSpan={4} className="font-bold uppercase text-xs tracking-widest text-muted-foreground py-2">
                                       {cls} Class
                                    </TableCell>
                                 </TableRow>
                                 {classUnits.map(id => {
                                    const uData = unitData.find(u => u.id === id);
                                    return (
                                       <TableRow key={id} className="border-slate-100 hover:bg-slate-50">
                                          <TableCell className="font-medium text-slate-700">
                                             <div className="flex items-center gap-2">
                                                {cls === "super" && <Skull className="w-4 h-4 text-red-500" />}
                                                {getUnitName(id)}
                                             </div>
                                          </TableCell>
                                          <TableCell className="text-right text-slate-500 text-xs font-mono">{uData?.stats.speed.toLocaleString()}</TableCell>
                                          <TableCell className="text-right font-mono text-primary cursor-pointer hover:underline" onClick={() => handleSelectAll(id)}>
                                             {units[id]}
                                          </TableCell>
                                          <TableCell className="text-right">
                                             <div className="flex items-center gap-1 justify-end">
                                                <Input 
                                                   type="number" 
                                                   value={selectedUnits[id] || ""}
                                                   onChange={(e) => handleUnitChange(id, e.target.value)}
                                                   placeholder="0" 
                                                   className="h-8 bg-white border-slate-200 text-right w-20 text-slate-900" 
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSelectAll(id)}>
                                                   <Zap className="w-3 h-3" />
                                                </Button>
                                             </div>
                                          </TableCell>
                                       </TableRow>
                                    )
                                 })}
                              </>
                           )
                        })}
                        
                        {Object.values(units).every(val => val === 0) && (
                           <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                 No units available. Build some in the Shipyard!
                              </TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Right Column: Mission Details */}
                <div className="space-y-6">
                  <Card className="bg-white border-slate-200 shadow-sm">
                     <CardHeader>
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                         <MapPin className="w-5 h-5 text-blue-600" /> Coordinates
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">Galaxy</label>
                              <Input value={targetGalaxy} onChange={e => setTargetGalaxy(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                           </div>
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">System</label>
                              <Input value={targetSystem} onChange={e => setTargetSystem(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                           </div>
                           <div>
                              <label className="text-xs text-muted-foreground uppercase">Planet</label>
                              <Input value={targetPlanet} onChange={e => setTargetPlanet(e.target.value)} className="bg-slate-50 border-slate-200 font-mono text-slate-900" />
                           </div>
                        </div>
                        
                        <Select defaultValue="planet">
                           <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                              <SelectValue placeholder="Target Type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="planet">Planet</SelectItem>
                              <SelectItem value="debris">Debris Field</SelectItem>
                              <SelectItem value="moon">Moon</SelectItem>
                           </SelectContent>
                        </Select>
                     </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm">
                     <CardHeader>
                       <CardTitle className="text-lg font-orbitron flex items-center gap-2 text-slate-900">
                         <Crosshair className="w-5 h-5 text-red-600" /> Mission
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        {[
                           { id: "attack", icon: Crosshair, label: "Attack", color: "text-red-600" },
                           { id: "transport", icon: Truck, label: "Transport", color: "text-green-600" },
                           { id: "espionage", icon: Search, label: "Espionage", color: "text-blue-600" },
                           { id: "sabotage", icon: Skull, label: "Sabotage", color: "text-orange-600" },
                           { id: "colonize", icon: MapPin, label: "Colonize", color: "text-yellow-600" },
                           { id: "deploy", icon: Anchor, label: "Deploy", color: "text-purple-600" },
                        ].map(m => (
                           <Button 
                              key={m.id}
                              variant={missionType === m.id ? "secondary" : "outline"} 
                              className={cn("w-full justify-start border-slate-200 text-slate-700", missionType === m.id && "bg-slate-100 border-slate-300")}
                              onClick={() => setMissionType(m.id)}
                           >
                              <m.icon className={cn("w-4 h-4 mr-2", m.color)} /> {m.label}
                           </Button>
                        ))}
                     </CardContent>
                  </Card>
                  
                  <Button 
                     className="w-full bg-primary text-white hover:bg-primary/90 font-bold font-orbitron h-12 text-lg shadow-md"
                     onClick={handleDispatch}
                  >
                     <Play className="w-4 h-4 mr-2 fill-white" /> LAUNCH FLEET
                  </Button>
                </div>
              </div>
           </TabsContent>

           {/* ACTIVE MISSIONS TAB */}
           <TabsContent value="active" className="mt-6">
              {activeMissions.length === 0 ? (
                 <div className="text-center py-20 bg-white border border-slate-200 rounded-lg border-dashed">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Rocket className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Active Missions</h3>
                    <p className="text-slate-500">Fleet command is idle. Dispatch ships to see them here.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {activeMissions.map(mission => {
                       const now = Date.now();
                       const isReturn = mission.status === "return" || (now > mission.arrivalTime);
                       const endTime = isReturn ? mission.returnTime : mission.arrivalTime;
                       const totalTime = (mission.arrivalTime - (mission.arrivalTime - 10000)); // Approx
                       const timeLeft = Math.max(0, endTime - now);
                       const progress = Math.max(0, 100 - (timeLeft / 10000) * 100); // Mock progress base

                       return (
                          <Card key={mission.id} className="bg-white border-slate-200">
                             <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className={cn("w-10 h-10 rounded flex items-center justify-center", isReturn ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600")}>
                                         {isReturn ? <Anchor className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                                      </div>
                                      <div>
                                         <div className="font-bold text-slate-900 uppercase text-sm tracking-wider">{mission.type} Mission</div>
                                         <div className="text-xs text-slate-500">Target: [{mission.target}]</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-2xl font-mono font-bold text-slate-900">{Math.ceil(timeLeft / 1000)}s</div>
                                      <div className="text-xs text-muted-foreground uppercase font-bold">{isReturn ? "Returning" : "Arriving"}</div>
                                   </div>
                                </div>
                                
                                <div className="space-y-1">
                                   <div className="flex justify-between text-xs text-slate-500">
                                      <span>Origin</span>
                                      <span>Target</span>
                                   </div>
                                   <Progress value={progress} className="h-2" />
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-4 gap-2">
                                   {Object.entries(mission.units).map(([id, count]) => (
                                      <div key={id} className="bg-slate-50 p-2 rounded text-center border border-slate-100">
                                         <div className="text-xs text-slate-500 truncate">{getUnitName(id)}</div>
                                         <div className="font-mono font-bold text-slate-900">{count}</div>
                                      </div>
                                   ))}
                                </div>
                             </CardContent>
                          </Card>
                       )
                    })}
                 </div>
              )}
           </TabsContent>

           {/* TEMPLATES TAB (Mock) */}
           <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Mock Templates */}
                 <Card className="bg-white border-slate-200 cursor-pointer hover:border-primary transition-colors group">
                    <CardHeader>
                       <CardTitle className="text-slate-900 group-hover:text-primary">Raiding Party Alpha</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between"><span>Light Fighter</span> <span className="font-mono">50</span></div>
                          <div className="flex justify-between"><span>Cruiser</span> <span className="font-mono">10</span></div>
                          <div className="flex justify-between"><span>Small Cargo</span> <span className="font-mono">20</span></div>
                       </div>
                       <Button className="w-full mt-4" variant="outline">Load Template</Button>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200 cursor-pointer hover:border-primary transition-colors group">
                    <CardHeader>
                       <CardTitle className="text-slate-900 group-hover:text-primary">Colony Ship I</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between"><span>Colony Ship</span> <span className="font-mono">1</span></div>
                          <div className="flex justify-between"><span>Light Fighter</span> <span className="font-mono">5</span></div>
                          <div className="flex justify-between"><span>Large Cargo</span> <span className="font-mono">2</span></div>
                       </div>
                       <Button className="w-full mt-4" variant="outline">Load Template</Button>
                    </CardContent>
                 </Card>

                 <Card className="border-2 border-dashed border-slate-200 flex items-center justify-center min-h-[200px] hover:bg-slate-50 cursor-pointer">
                    <div className="text-center text-slate-400">
                       <Anchor className="w-10 h-10 mx-auto mb-2" />
                       <span className="font-bold block">Create New Template</span>
                    </div>
                 </Card>
              </div>
           </TabsContent>

        </Tabs>
      </div>
    </GameLayout>
  );
}
