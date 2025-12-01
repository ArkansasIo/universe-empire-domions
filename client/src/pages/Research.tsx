import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, Box, Gem, Database, Zap, Lock, Info } from "lucide-react";
import { researchData, ResearchItem } from "@/lib/researchData";

const ResearchCard = ({ 
  item, 
  level, 
  onUpgrade, 
  resources 
}: { 
  item: ResearchItem, 
  level: number, 
  onUpgrade: (id: string) => void, 
  resources: any 
}) => {
  const Icon = item.icon;
  
  // Calculate cost based on level
  const metalCost = Math.floor(item.baseCost.metal * Math.pow(item.costFactor, level));
  const crystalCost = Math.floor(item.baseCost.crystal * Math.pow(item.costFactor, level));
  const deutCost = Math.floor(item.baseCost.deuterium * Math.pow(item.costFactor, level));
  const energyCost = item.baseCost.energy ? Math.floor(item.baseCost.energy * Math.pow(item.costFactor, level)) : 0;
  
  const canAfford = 
    resources.metal >= metalCost && 
    resources.crystal >= crystalCost && 
    resources.deuterium >= deutCost &&
    (energyCost === 0 || resources.energy >= energyCost);

  return (
    <Card className="bg-white border-slate-200 hover:border-primary/50 transition-all group overflow-hidden shadow-sm flex flex-col h-full">
       <div className="h-32 bg-slate-50 relative group-hover:bg-slate-100 transition-colors duration-500 border-b border-slate-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-slate-300 group-hover:text-primary/20 transition-colors" />
          </div>
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-mono text-primary border border-slate-200 shadow-sm">
            Lvl {level}
          </div>
          <div className="absolute top-2 left-2">
            {level === 0 && <Badge variant="outline" className="bg-slate-200 text-slate-500 border-slate-300">Not Researched</Badge>}
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900 group-hover:text-primary transition-colors">{item.name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1">
         <p className="text-sm text-slate-500 min-h-[3rem] mb-4">{item.description}</p>
         
         <div className="space-y-3">
            <div className="space-y-1">
               <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                  <Info className="w-3 h-3" /> Effects
               </div>
               {item.effects.map((effect, i) => (
                  <div key={i} className="flex justify-between text-xs border-b border-slate-100 pb-1 last:border-0">
                     <span className="text-slate-700">{effect.name}</span>
                     <span className="text-primary font-mono">{effect.value} {effect.perLevel && <span className="text-slate-400">({effect.perLevel}/lvl)</span>}</span>
                  </div>
               ))}
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-1">
               <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Research Costs</div>
               {metalCost > 0 && (
                 <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
                    <span className={resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900"}>{metalCost.toLocaleString()}</span>
                 </div>
               )}
               {crystalCost > 0 && (
                 <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
                    <span className={resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900"}>{crystalCost.toLocaleString()}</span>
                 </div>
               )}
               {deutCost > 0 && (
                 <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-green-600"><Database className="w-3 h-3" /> Deuterium</span>
                    <span className={resources.deuterium < deutCost ? "text-red-600 font-bold" : "text-slate-900"}>{deutCost.toLocaleString()}</span>
                 </div>
               )}
               {energyCost > 0 && (
                 <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-yellow-600"><Zap className="w-3 h-3" /> Energy</span>
                    <span className={resources.energy < energyCost ? "text-red-600 font-bold" : "text-slate-900"}>{energyCost.toLocaleString()}</span>
                 </div>
               )}
            </div>
         </div>
       </CardContent>
       
       <CardFooter className="pt-2">
         <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 font-orbitron tracking-wider"
            disabled={!canAfford}
            onClick={() => {
               if (canAfford) {
                  // Manually deduct resources in UI mock since gameContext doesn't have cost logic for dynamic techs yet
                  // Ideally this logic is all in gameContext
                  onUpgrade(item.id);
               }
            }}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> {level === 0 ? "RESEARCH" : "UPGRADE"}
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Research() {
  const { research, resources, updateResearch } = useGame();

  // Categorize research
  const basicTech = researchData.filter(r => !["combustionDrive", "impulseDrive", "hyperspaceDrive", "weaponsTech", "shieldingTech", "armourTech"].includes(r.id) && r.tier <= 4);
  const driveTech = researchData.filter(r => ["combustionDrive", "impulseDrive", "hyperspaceDrive"].includes(r.id));
  const combatTech = researchData.filter(r => ["weaponsTech", "shieldingTech", "armourTech"].includes(r.id));
  const advancedTech = researchData.filter(r => r.tier >= 5 || r.id === "gravitonTech");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Research Lab</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Unlock new technologies to improve ships, defenses, and resource production.</p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 h-12">
            <TabsTrigger value="basic" className="font-orbitron">Basic Tech</TabsTrigger>
            <TabsTrigger value="drives" className="font-orbitron">Drive Systems</TabsTrigger>
            <TabsTrigger value="combat" className="font-orbitron">Combat Tech</TabsTrigger>
            <TabsTrigger value="advanced" className="font-orbitron">Advanced</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
             <TabsContent value="basic" className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {basicTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="drives" className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {driveTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="combat" className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {combatTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="advanced" className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {advancedTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>
          </div>
        </Tabs>

      </div>
    </GameLayout>
  );
}
