import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Gem, Database, Zap, ArrowUpCircle } from "lucide-react";

const BuildingCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources 
}: any) => {
  const metalCost = Math.floor(100 * Math.pow(1.5, level));
  const crystalCost = Math.floor(50 * Math.pow(1.5, level));
  const canAfford = resources.metal >= metalCost && resources.crystal >= crystalCost;

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all group overflow-hidden">
       <div className="h-32 bg-gradient-to-br from-slate-900 to-black relative group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/10 group-hover:text-primary/20 transition-colors" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-primary border border-primary/20">
            Lvl {level}
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-white group-hover:text-primary transition-colors">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2">
         <p className="text-sm text-muted-foreground min-h-[3rem]">{description}</p>
         
         <div className="mt-4 space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Upgrade Costs</div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-300"><Box className="w-3 h-3" /> Metal</span>
               <span className={resources.metal < metalCost ? "text-red-500" : "text-white"}>{metalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-blue-300"><Gem className="w-3 h-3" /> Crystal</span>
               <span className={resources.crystal < crystalCost ? "text-red-500" : "text-white"}>{crystalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
               <span className="flex items-center gap-2 text-slate-400"><Zap className="w-3 h-3" /> Time</span>
               <span className="text-white">{(level + 1) * 10}s</span>
            </div>
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary/10 hover:bg-primary hover:text-black border border-primary/50 text-primary font-orbitron tracking-wider"
            disabled={!canAfford}
            onClick={() => onUpgrade(id)}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> UPGRADE
             </>
           ) : (
             "INSUFFICIENT RESOURCES"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Resources() {
  const { buildings, resources, updateBuilding } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Resource Buildings</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage your resource production infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <BuildingCard 
              id="metalMine"
              name="Metal Mine"
              level={buildings.metalMine}
              description="Used in the extraction of metal ore, metal mines are the primary source of resources for your empire."
              icon={Box}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="crystalMine"
              name="Crystal Mine"
              level={buildings.crystalMine}
              description="Crystals are the main resource used for electronic circuits and form certain alloy compounds."
              icon={Gem}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="deuteriumSynthesizer"
              name="Deuterium Synthesizer"
              level={buildings.deuteriumSynthesizer}
              description="Deuterium is a heavy isotope of hydrogen. It is used as fuel for spaceships and is harvested in the deep sea."
              icon={Database}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <BuildingCard 
              id="solarPlant"
              name="Solar Plant"
              level={buildings.solarPlant}
              description="Solar power plants absorb energy from solar radiation. All mines need energy to operate."
              icon={Zap}
              resources={resources}
              onUpgrade={updateBuilding}
           />
        </div>
      </div>
    </GameLayout>
  );
}
