import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Thermometer, Ruler, User, Shield, Crosshair, Send } from "lucide-react";

export default function Overview() {
  const { planetName, resources, buildings } = useGame();

  return (
    <GameLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Command Center</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">Welcome back, Commander.</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-primary font-mono">SERVER TIME</div>
             <div className="text-xl font-mono">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Planet Status */}
          <Card className="col-span-1 md:col-span-2 bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Activity className="w-5 h-5 text-primary" />
                 Planet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="bg-black/50 p-4 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                           <Ruler className="w-4 h-4" /> Diameter
                        </div>
                        <div className="text-xl font-orbitron">12,800 km <span className="text-xs text-muted-foreground">(189/193 fields)</span></div>
                        <Progress value={98} className="h-1 mt-2 bg-white/10" />
                     </div>
                     
                     <div className="bg-black/50 p-4 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                           <Thermometer className="w-4 h-4" /> Temperature
                        </div>
                        <div className="text-xl font-orbitron">12°C to 48°C</div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="bg-black/50 p-4 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                           <User className="w-4 h-4" /> Population
                        </div>
                        <div className="text-xl font-orbitron">0 <span className="text-xs text-muted-foreground">/ 0</span></div>
                     </div>
                     
                     <div className="bg-black/50 p-4 rounded border border-white/5">
                         <div className="flex items-center gap-2 text-muted-foreground mb-1">
                           <Activity className="w-4 h-4" /> Efficiency
                        </div>
                        <div className="text-xl font-orbitron text-green-400">100%</div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Events / Messages */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Crosshair className="w-5 h-5 text-destructive" />
                 Hostile Activity
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-900/20 border border-red-500/20 rounded flex gap-3 items-start">
                     <Shield className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                     <div>
                       <div className="text-sm font-bold text-red-400 uppercase">No incoming attacks</div>
                       <div className="text-xs text-muted-foreground">Scanners are clear.</div>
                     </div>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded flex gap-3 items-start">
                     <Send className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                     <div>
                       <div className="text-sm font-bold text-blue-400 uppercase">Fleet Orders</div>
                       <div className="text-xs text-muted-foreground">No active missions.</div>
                     </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Building Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-card border border-white/5 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mines</div>
              <div className="text-2xl font-orbitron text-white group-hover:text-primary">Level {buildings.metalMine}</div>
              <div className="text-xs text-white/50">Metal Mine</div>
           </div>
           <div className="bg-card border border-white/5 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mines</div>
              <div className="text-2xl font-orbitron text-white group-hover:text-primary">Level {buildings.crystalMine}</div>
              <div className="text-xs text-white/50">Crystal Mine</div>
           </div>
           <div className="bg-card border border-white/5 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Power</div>
              <div className="text-2xl font-orbitron text-white group-hover:text-primary">Level {buildings.solarPlant}</div>
              <div className="text-xs text-white/50">Solar Plant</div>
           </div>
           <div className="bg-card border border-white/5 p-4 rounded hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Research</div>
              <div className="text-2xl font-orbitron text-white group-hover:text-primary">Level {buildings.researchLab}</div>
              <div className="text-xs text-white/50">Research Lab</div>
           </div>
        </div>
        
      </div>
    </GameLayout>
  );
}
