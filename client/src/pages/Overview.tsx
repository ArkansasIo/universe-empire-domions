import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Thermometer, Ruler, User, Shield, Crosshair, Send, Info, Wind, Droplets, Weight } from "lucide-react";
import { getPlanetDetails } from "@/lib/planetUtils";
import { Badge } from "@/components/ui/badge";

export default function Overview() {
  const { planetName, resources, buildings } = useGame();
  
  // Deterministic details for "Homeworld" (seed 1)
  const planetInfo = getPlanetDetails(1);

  return (
    <GameLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900">Command Center</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">Welcome back, Commander.</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-primary font-mono">SERVER TIME</div>
             <div className="text-xl font-mono text-slate-900">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Planet Status - Enhanced */}
          <Card className="col-span-1 md:col-span-2 bg-white border-slate-200 overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-900">
                 <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Planet Status
                 </div>
                 <Badge variant="outline" className="border-primary text-primary font-orbitron tracking-widest">
                    CLASS {planetInfo.class}
                 </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Physical Stats */}
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-xs uppercase text-muted-foreground font-bold mb-2 tracking-widest flex items-center gap-2">
                           <Info className="w-3 h-3" /> Classification
                        </div>
                        <div className="text-xl font-orbitron text-slate-900 mb-1">{planetInfo.type}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                           {planetInfo.description}
                        </p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs uppercase font-bold">
                              <Wind className="w-3 h-3" /> Atmosphere
                           </div>
                           <div className="text-sm font-semibold text-slate-900">{planetInfo.atmosphere}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs uppercase font-bold">
                              <Weight className="w-3 h-3" /> Gravity
                           </div>
                           <div className="text-sm font-semibold text-slate-900">{planetInfo.gravity}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs uppercase font-bold">
                              <Droplets className="w-3 h-3" /> Hydrosphere
                           </div>
                           <div className="text-sm font-semibold text-slate-900">{planetInfo.hydrosphere}</div>
                        </div>
                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs uppercase font-bold">
                              <Thermometer className="w-3 h-3" /> Temp
                           </div>
                           <div className="text-sm font-semibold text-slate-900">{planetInfo.temperature}</div>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Development Stats */}
                  <div className="space-y-4">
                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                              <Ruler className="w-3 h-3" /> Diameter
                           </div>
                           <span className="text-xs text-slate-500">189/193 fields</span>
                        </div>
                        <div className="text-xl font-orbitron text-slate-900">12,800 km</div>
                        <Progress value={98} className="h-1 mt-2 bg-slate-200" />
                     </div>

                     <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs uppercase font-bold">
                           <Activity className="w-3 h-3" /> Planetary Features
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {planetInfo.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                                 {feature}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Events / Messages */}
          <Card className="bg-white border-slate-200 shadow-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-slate-900">
                 <Crosshair className="w-5 h-5 text-red-600" />
                 Hostile Activity
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-100 rounded flex gap-3 items-start">
                     <Shield className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                     <div>
                       <div className="text-sm font-bold text-red-600 uppercase">No incoming attacks</div>
                       <div className="text-xs text-red-800/70">Scanners are clear.</div>
                     </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded flex gap-3 items-start">
                     <Send className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                     <div>
                       <div className="text-sm font-bold text-blue-600 uppercase">Fleet Orders</div>
                       <div className="text-xs text-blue-800/70">No active missions.</div>
                     </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Building Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white border border-slate-200 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mines</div>
              <div className="text-2xl font-orbitron text-slate-900 group-hover:text-primary">Level {buildings.metalMine}</div>
              <div className="text-xs text-slate-500">Metal Mine</div>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mines</div>
              <div className="text-2xl font-orbitron text-slate-900 group-hover:text-primary">Level {buildings.crystalMine}</div>
              <div className="text-xs text-slate-500">Crystal Mine</div>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Power</div>
              <div className="text-2xl font-orbitron text-slate-900 group-hover:text-primary">Level {buildings.solarPlant}</div>
              <div className="text-xs text-slate-500">Solar Plant</div>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Research</div>
              <div className="text-2xl font-orbitron text-slate-900 group-hover:text-primary">Level {buildings.researchLab}</div>
              <div className="text-xs text-slate-500">Research Lab</div>
           </div>
        </div>
        
      </div>
    </GameLayout>
  );
}
