import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Rocket, Shield, Swords, Box, Gem, Plus } from "lucide-react";
import { useState } from "react";

const ShipCard = ({ 
  id, 
  name, 
  count, 
  description, 
  icon: Icon, 
  onBuild, 
  resources 
}: any) => {
  const [amount, setAmount] = useState(1);
  
  const metalCost = 3000; // Simplified flat cost for mockup
  const crystalCost = 1000;

  const totalMetal = metalCost * amount;
  const totalCrystal = crystalCost * amount;
  
  const canAfford = resources.metal >= totalMetal && resources.crystal >= totalCrystal;

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all group overflow-hidden">
       <div className="h-24 bg-gradient-to-br from-slate-900 to-black relative border-b border-white/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-white/10 group-hover:text-primary/20 transition-colors" />
          </div>
          <div className="absolute top-2 right-2 bg-primary/20 px-2 py-1 rounded text-xs font-mono text-primary border border-primary/20">
            Owned: {count}
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-white">{name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 space-y-3">
         <p className="text-xs text-muted-foreground h-10">{description}</p>
         
         <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
               <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span>
               <span>{metalCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-blue-300">
               <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span>
               <span>{crystalCost.toLocaleString()}</span>
            </div>
         </div>

         <div className="flex gap-2 pt-2">
            <Input 
              type="number" 
              min="1" 
              max="100"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              className="bg-black/50 border-white/10 h-8 text-xs font-mono"
            />
         </div>
       </CardContent>
       
       <CardFooter>
         <Button 
            className="w-full bg-primary/10 hover:bg-primary hover:text-black border border-primary/50 text-primary font-orbitron text-xs h-8"
            disabled={!canAfford}
            onClick={() => onBuild(id, amount)}
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
  const { ships, resources, buildShip } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Orbital Shipyard</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Construct fleets for combat, transport, and colonization.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           <div className="col-span-full text-sm font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-2 mb-2">Combat Ships</div>
           
           <ShipCard 
              id="lightFighter"
              name="Light Fighter"
              count={ships.lightFighter}
              description="The first fighting ship available. Agile but weak armor."
              icon={Swords}
              resources={resources}
              onBuild={buildShip}
           />
           <ShipCard 
              id="heavyFighter"
              name="Heavy Fighter"
              count={ships.heavyFighter}
              description="Stronger than light fighters, with better armor and shields."
              icon={Swords}
              resources={resources}
              onBuild={buildShip}
           />
           <ShipCard 
              id="cruiser"
              name="Cruiser"
              count={ships.cruiser}
              description="Fast ship with heavy weaponry. Effective against fighter swarms."
              icon={Rocket}
              resources={resources}
              onBuild={buildShip}
           />
           <ShipCard 
              id="battleship"
              name="Battleship"
              count={ships.battleship}
              description="The backbone of any fleet. Heavy armor and massive firepower."
              icon={Shield}
              resources={resources}
              onBuild={buildShip}
           />

           <div className="col-span-full text-sm font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-2 mb-2 mt-4">Civil Ships</div>
           
           <ShipCard 
              id="smallCargo"
              name="Small Cargo"
              count={ships.smallCargo}
              description="Fast transport ship with limited capacity."
              icon={Box}
              resources={resources}
              onBuild={buildShip}
           />
           <ShipCard 
              id="largeCargo"
              name="Large Cargo"
              count={ships.largeCargo}
              description="Large transport ship with massive capacity but slow speed."
              icon={Box}
              resources={resources}
              onBuild={buildShip}
           />
        </div>
      </div>
    </GameLayout>
  );
}
