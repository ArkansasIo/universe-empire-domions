import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hexagon, Play, Clock, Sparkles, Box, History } from "lucide-react";
import { Artifact, ArtifactRarity } from "@/lib/artifactData";
import { cn } from "@/lib/utils";

const RarityBadge = ({ rarity }: { rarity: ArtifactRarity }) => {
   const colors = {
      common: "bg-slate-100 text-slate-600 border-slate-200",
      uncommon: "bg-green-100 text-green-700 border-green-200",
      rare: "bg-blue-100 text-blue-700 border-blue-200",
      epic: "bg-purple-100 text-purple-700 border-purple-200",
      legendary: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ancient: "bg-red-100 text-red-700 border-red-200"
   };
   return <Badge variant="outline" className={cn("uppercase text-[10px]", colors[rarity])}>{rarity}</Badge>;
};

export default function Artifacts() {
  const { artifacts, activateArtifact } = useGame();

  const passiveArtifacts = artifacts.filter(a => a.type === "passive");
  const activeArtifacts = artifacts.filter(a => a.type === "active");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Xeno-Archaeology Vault</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Study and utilize powerful relics from lost civilizations.</p>
        </div>

        <Tabs defaultValue="collection" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="collection" className="font-orbitron"><Hexagon className="w-4 h-4 mr-2" /> Artifact Collection</TabsTrigger>
              <TabsTrigger value="history" className="font-orbitron"><History className="w-4 h-4 mr-2" /> Discovery Log</TabsTrigger>
           </TabsList>

           <TabsContent value="collection" className="mt-6 space-y-6">
              
              {/* Active Relics */}
              {activeArtifacts.length > 0 && (
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold font-orbitron text-slate-900 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-yellow-500" /> Active Relics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {activeArtifacts.map(artifact => {
                          const now = Date.now();
                          const onCooldown = artifact.lastUsed && (now - artifact.lastUsed < (artifact.cooldown || 0));
                          const timeLeft = onCooldown ? Math.ceil(((artifact.lastUsed! + artifact.cooldown!) - now) / 1000) : 0;
                          
                          return (
                             <Card key={artifact.id} className="bg-white border-slate-200 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 z-10">
                                   <RarityBadge rarity={artifact.rarity} />
                                </div>
                                <div className="h-2 bg-yellow-500 w-full" />
                                <CardHeader>
                                   <CardTitle className="font-orbitron text-lg">{artifact.name}</CardTitle>
                                   <CardDescription>{artifact.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                   <div className="bg-slate-50 p-3 rounded text-sm italic text-slate-600 border border-slate-100">
                                      "{artifact.lore}"
                                   </div>
                                   <div className="space-y-1">
                                      <div className="text-xs font-bold uppercase text-slate-500">Effect</div>
                                      {artifact.bonuses.map((b, i) => (
                                         <div key={i} className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-yellow-500" /> {b}
                                         </div>
                                      ))}
                                   </div>
                                   <Button 
                                      className={cn("w-full font-orbitron", onCooldown ? "bg-slate-100 text-slate-400" : "bg-yellow-500 hover:bg-yellow-600 text-white")}
                                      disabled={!!onCooldown}
                                      onClick={() => activateArtifact(artifact.id)}
                                   >
                                      {onCooldown ? (
                                         <><Clock className="w-4 h-4 mr-2" /> Cooldown: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</>
                                      ) : (
                                         <><Play className="w-4 h-4 mr-2" /> ACTIVATE</>
                                      )}
                                   </Button>
                                </CardContent>
                             </Card>
                          )
                       })}
                    </div>
                 </div>
              )}

              {/* Passive Artifacts */}
              <div className="space-y-4">
                 <h3 className="text-xl font-bold font-orbitron text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-blue-500" /> Passive Artifacts
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {passiveArtifacts.map(artifact => (
                       <Card key={artifact.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                             <div className="flex justify-between items-start">
                                <CardTitle className="font-orbitron text-base">{artifact.name}</CardTitle>
                                <RarityBadge rarity={artifact.rarity} />
                             </div>
                             <CardDescription className="text-xs">{artifact.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                             <div className="space-y-2 mt-2">
                                {artifact.bonuses.map((b, i) => (
                                   <div key={i} className="text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded flex items-center gap-2">
                                      <div className="w-1 h-1 bg-blue-500 rounded-full" /> {b}
                                   </div>
                                ))}
                             </div>
                          </CardContent>
                       </Card>
                    ))}
                    {/* Empty Slots */}
                    {Array.from({ length: 3 }).map((_, i) => (
                       <div key={`empty-${i}`} className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-6 text-slate-300 min-h-[150px]">
                          <Hexagon className="w-10 h-10 mb-2 opacity-20" />
                          <span className="text-sm font-bold">Empty Slot</span>
                       </div>
                    ))}
                 </div>
              </div>

           </TabsContent>

           <TabsContent value="history" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardContent className="p-8 text-center text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No archaeological expeditions have been conducted yet.</p>
                    <Button variant="outline" className="mt-4">Launch Expedition (Coming Soon)</Button>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
