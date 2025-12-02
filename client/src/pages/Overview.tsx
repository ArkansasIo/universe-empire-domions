import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Thermometer, Ruler, User, Shield, Crosshair, Send, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { getPlanetDetails } from "@/lib/planetUtils";

export default function Overview() {
  const { planetName, resources, buildings, events, coordinates } = useGame();
  
  // Parse coordinates to get a seed for planet generation
  const coordParts = coordinates.split(':').map(p => parseInt(p) || 0);
  const planetSeed = (coordParts[0] || 1) * 1000 + (coordParts[1] || 102) * 100 + (coordParts[2] || 8);
  const planetInfo = getPlanetDetails(planetSeed);

  return (
    <GameLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900">Command Center</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">{planetName} • {coordinates}</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-primary font-mono">SERVER TIME</div>
             <div className="text-xl font-mono text-slate-900">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Planet Status */}
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
                  </div>
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
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Universe Events Feed */}
          <Card className="bg-white border-slate-200 shadow-sm flex flex-col h-[400px]">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-slate-900">
                 <Activity className="w-5 h-5 text-blue-600" />
                 Universe Events
               </CardTitle>
             </CardHeader>
             <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[320px] px-6">
                   <div className="space-y-4 pb-4">
                      {events.map(event => (
                         <div key={event.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4">
                            <div className="mt-1">
                               {event.type === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                               {event.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                               {event.type === "danger" && <AlertCircle className="w-4 h-4 text-red-500" />}
                               {event.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div>
                               <div className="text-sm font-bold text-slate-900">{event.title}</div>
                               <div className="text-xs text-slate-500">{event.description}</div>
                               <div className="text-[10px] text-slate-400 mt-1">{new Date(event.timestamp).toLocaleTimeString()}</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </ScrollArea>
             </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
