import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, FlaskConical, Rocket, Shield, ArrowUpCircle, Box, Gem } from "lucide-react";

const FacilityCard = ({ 
  id, 
  name, 
  level, 
  description, 
  icon: Icon, 
  onUpgrade, 
  resources 
}: any) => {
  const metalCost = Math.floor(200 * Math.pow(2, level));
  const crystalCost = Math.floor(100 * Math.pow(2, level));
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

export default function Facilities() {
  const { buildings, resources, updateBuilding } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Facilities</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Construct advanced facilities to research technologies and build fleets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <FacilityCard 
              id="roboticsFactory"
              name="Robotics Factory"
              level={buildings.roboticsFactory}
              description="Robotics factories provide the construction units to build structures. Each level reduces construction time."
              icon={Factory}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <FacilityCard 
              id="shipyard"
              name="Shipyard"
              level={buildings.shipyard}
              description="The Shipyard constructs your fleet and defense mechanisms. Higher levels allow for faster construction and better ships."
              icon={Rocket}
              resources={resources}
              onUpgrade={updateBuilding}
           />
           <FacilityCard 
              id="researchLab"
              name="Research Lab"
              level={buildings.researchLab}
              description="A research lab is required to research new technologies. Higher levels speed up research time."
              icon={FlaskConical}
              resources={resources}
              onUpgrade={updateBuilding}
           />
        </div>
      </div>
    </GameLayout>
  );
}
