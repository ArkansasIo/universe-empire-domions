import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, Sword, Shield, Cpu, Hammer, Anvil, Sparkles, 
  Box, Gem, Database, Flame, Star, Fingerprint, Dna, FlaskConical
} from "lucide-react";
import { Item, blueprints, RACES, CLASSES, SUBCLASSES, RaceId, ClassId, SubClassId } from "@/lib/commanderTypes";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ItemCard = ({ item, onEquip, onTemper }: { item: Item, onEquip?: (item: Item) => void, onTemper?: (id: string) => void }) => (
   <div className={cn(
      "bg-white border p-3 rounded flex flex-col gap-2 relative group transition-all hover:shadow-md",
      item.rarity === "legendary" ? "border-yellow-400 bg-yellow-50/30" :
      item.rarity === "epic" ? "border-purple-400 bg-purple-50/30" :
      item.rarity === "rare" ? "border-blue-400 bg-blue-50/30" :
      "border-slate-200"
   )}>
      <div className="flex items-start justify-between">
         <div className="flex items-center gap-2">
            <div className={cn(
               "w-10 h-10 rounded flex items-center justify-center border",
               item.rarity === "legendary" ? "bg-yellow-100 border-yellow-400 text-yellow-600" :
               item.rarity === "epic" ? "bg-purple-100 border-purple-400 text-purple-600" :
               item.rarity === "rare" ? "bg-blue-100 border-blue-400 text-blue-600" :
               "bg-slate-100 border-slate-300 text-slate-500"
            )}>
               {item.type === "weapon" && <Sword className="w-6 h-6" />}
               {item.type === "armor" && <Shield className="w-6 h-6" />}
               {item.type === "module" && <Cpu className="w-6 h-6" />}
               {item.type === "blueprint" && <Hammer className="w-6 h-6" />}
               {item.type === "material" && <Box className="w-6 h-6" />}
            </div>
            <div>
               <div className="font-bold text-sm text-slate-900 flex items-center gap-1">
                  {item.name}
                  {item.tempering ? <span className="text-red-500">+{item.tempering}</span> : null}
               </div>
               <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{item.rarity} {item.type}</div>
            </div>
         </div>
         {item.masterwork && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
      </div>
      
      <p className="text-xs text-slate-600 italic">{item.description}</p>
      
      {item.stats && (
         <div className="grid grid-cols-2 gap-1 mt-1">
            {Object.entries(item.stats).map(([key, val]) => (
               <div key={key} className="text-xs bg-slate-50 px-1 rounded text-slate-700 capitalize flex justify-between">
                  <span>{key}:</span>
                  <span className="font-mono font-bold">+{val}</span>
               </div>
            ))}
         </div>
      )}

      <div className="flex gap-1 mt-auto pt-2">
         {onEquip && (item.type === "weapon" || item.type === "armor" || item.type === "module") && (
            <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => onEquip(item)}>Equip</Button>
         )}
         {onTemper && (item.type === "weapon" || item.type === "armor" || item.type === "module") && (
            <Button size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={() => onTemper(item.id)}>Temper</Button>
         )}
      </div>
   </div>
);

export default function Commander() {
  const { commander, equipItem, unequipItem, craftItem, temperItem, setCommanderIdentity } = useGame();

  const [selectedRace, setSelectedRace] = useState<RaceId>(commander.race);
  const [selectedClass, setSelectedClass] = useState<ClassId>(commander.class);
  const [selectedSubClass, setSelectedSubClass] = useState<SubClassId | "none">(commander.subClass || "none");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">High Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage your commander's profile, equipment, and identity.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="profile" className="font-orbitron"><User className="w-4 h-4 mr-2" /> Profile & Equipment</TabsTrigger>
            <TabsTrigger value="identity" className="font-orbitron"><Dna className="w-4 h-4 mr-2" /> Identity & Class</TabsTrigger>
            <TabsTrigger value="inventory" className="font-orbitron"><Box className="w-4 h-4 mr-2" /> Inventory</TabsTrigger>
            <TabsTrigger value="smithy" className="font-orbitron"><Anvil className="w-4 h-4 mr-2" /> Smithy</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Column */}
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Fingerprint className="w-5 h-5 text-primary" /> Commander Stats</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="text-center">
                         <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-2 overflow-hidden relative">
                            <User className="w-12 h-12 text-slate-400" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] uppercase py-0.5">
                               {RACES[commander.race].name}
                            </div>
                         </div>
                         <h3 className="text-xl font-orbitron text-slate-900">Commander</h3>
                         <div className="flex justify-center gap-2 mt-1">
                            <Badge variant="outline" className="border-primary text-primary">{CLASSES[commander.class].name}</Badge>
                            {commander.subClass && <Badge variant="secondary">{SUBCLASSES[commander.subClass].name}</Badge>}
                         </div>
                         <div className="mt-4 px-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                               <span>XP</span>
                               <span>{commander.stats.xp} / 1000</span>
                            </div>
                            <Progress value={(commander.stats.xp / 1000) * 100} className="h-2" />
                         </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Sword className="w-4 h-4 text-red-500" /> Warfare</span>
                            <span className="font-mono text-lg text-slate-900">{commander.stats.warfare}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Box className="w-4 h-4 text-yellow-500" /> Logistics</span>
                            <span className="font-mono text-lg text-slate-900">{commander.stats.logistics}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-blue-500" /> Science</span>
                            <span className="font-mono text-lg text-slate-900">{commander.stats.science}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Hammer className="w-4 h-4 text-slate-500" /> Engineering</span>
                            <span className="font-mono text-lg text-slate-900">{commander.stats.engineering}</span>
                         </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs space-y-2">
                         <div className="font-bold text-slate-900 uppercase">Active Bonuses</div>
                         {RACES[commander.race].bonuses.map((b, i) => <div key={`r-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-primary rounded-full" /> {b}</div>)}
                         {CLASSES[commander.class].bonuses.map((b, i) => <div key={`c-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-blue-500 rounded-full" /> {b}</div>)}
                         {commander.subClass && SUBCLASSES[commander.subClass].bonuses.map((b, i) => <div key={`sc-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-purple-500 rounded-full" /> {b}</div>)}
                      </div>
                   </CardContent>
                </Card>

                {/* Equipment Column */}
                <div className="col-span-2 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Weapon Slot */}
                      <Card className={cn("border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all", commander.equipment.weapon ? "bg-white border-solid border-slate-200" : "bg-slate-50 border-slate-300")}>
                         <span className="text-xs uppercase font-bold text-slate-400 mb-2">Main Weapon</span>
                         {commander.equipment.weapon ? (
                            <div className="w-full">
                               <ItemCard item={commander.equipment.weapon} />
                               <Button variant="ghost" size="sm" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => unequipItem("weapon")}>Unequip</Button>
                            </div>
                         ) : (
                            <Sword className="w-12 h-12 text-slate-300" />
                         )}
                      </Card>

                      {/* Armor Slot */}
                      <Card className={cn("border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all", commander.equipment.armor ? "bg-white border-solid border-slate-200" : "bg-slate-50 border-slate-300")}>
                         <span className="text-xs uppercase font-bold text-slate-400 mb-2">Body Armor</span>
                         {commander.equipment.armor ? (
                            <div className="w-full">
                               <ItemCard item={commander.equipment.armor} />
                               <Button variant="ghost" size="sm" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => unequipItem("armor")}>Unequip</Button>
                            </div>
                         ) : (
                            <Shield className="w-12 h-12 text-slate-300" />
                         )}
                      </Card>

                      {/* Module Slot */}
                      <Card className={cn("border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all", commander.equipment.module ? "bg-white border-solid border-slate-200" : "bg-slate-50 border-slate-300")}>
                         <span className="text-xs uppercase font-bold text-slate-400 mb-2">Tech Module</span>
                         {commander.equipment.module ? (
                            <div className="w-full">
                               <ItemCard item={commander.equipment.module} />
                               <Button variant="ghost" size="sm" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => unequipItem("module")}>Unequip</Button>
                            </div>
                         ) : (
                            <Cpu className="w-12 h-12 text-slate-300" />
                         )}
                      </Card>
                   </div>
                </div>
             </div>
          </TabsContent>

          {/* IDENTITY TAB (New) */}
          <TabsContent value="identity" className="mt-6">
             <Card className="bg-white border-slate-200">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900"><Dna className="w-5 h-5 text-primary" /> Genetic & Professional Sequencing</CardTitle>
                   <CardDescription>Modify your commander's biological origin and specialization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   
                   {/* Race Selection */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Origin Species</label>
                         <Select value={selectedRace} onValueChange={(v: RaceId) => setSelectedRace(v)}>
                            <SelectTrigger>
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                               {Object.values(RACES).map(r => (
                                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                            <p className="mb-2">{RACES[selectedRace].description}</p>
                            <div className="space-y-1">
                               {RACES[selectedRace].bonuses.map((b, i) => (
                                  <Badge key={i} variant="outline" className="bg-white">{b}</Badge>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Class Selection */}
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Career Path</label>
                         <Select value={selectedClass} onValueChange={(v: ClassId) => {
                            setSelectedClass(v);
                            setSelectedSubClass("none"); // Reset sub
                         }}>
                            <SelectTrigger>
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                               {Object.values(CLASSES).map(c => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                            <p className="mb-2">{CLASSES[selectedClass].description}</p>
                            <div className="space-y-1">
                               {CLASSES[selectedClass].bonuses.map((b, i) => (
                                  <Badge key={i} variant="outline" className="bg-white">{b}</Badge>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* SubClass Selection */}
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Specialization</label>
                         <Select 
                           value={selectedSubClass} 
                           onValueChange={(v: SubClassId | "none") => setSelectedSubClass(v)}
                           disabled={commander.stats.level < 10 && false} // Mock disabled
                         >
                            <SelectTrigger>
                               <SelectValue placeholder="Requires Level 10" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="none">-- None --</SelectItem>
                               {CLASSES[selectedClass].subClasses.map(scId => (
                                  <SelectItem key={scId} value={scId}>{SUBCLASSES[scId].name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         {selectedSubClass !== "none" ? (
                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                               <p className="mb-2">{SUBCLASSES[selectedSubClass as SubClassId].description}</p>
                               <div className="space-y-1">
                                  {SUBCLASSES[selectedSubClass as SubClassId].bonuses.map((b, i) => (
                                     <Badge key={i} variant="outline" className="bg-white border-purple-200 text-purple-700">{b}</Badge>
                                  ))}
                               </div>
                            </div>
                         ) : (
                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-400 italic text-center">
                               Select a specialization to see details.
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="flex justify-end">
                      <Button size="lg" onClick={() => setCommanderIdentity(selectedRace, selectedClass, selectedSubClass === "none" ? null : selectedSubClass)}>
                         Confirm Identity Sequence
                      </Button>
                   </div>

                </CardContent>
             </Card>
          </TabsContent>

          {/* INVENTORY TAB */}
          <TabsContent value="inventory" className="mt-6">
             <Card className="bg-white border-slate-200 min-h-[400px]">
                <CardContent className="p-6">
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {commander.inventory.map((item, i) => (
                         <ItemCard key={i} item={item} onEquip={equipItem} onTemper={temperItem} />
                      ))}
                      {Array.from({ length: Math.max(0, 20 - commander.inventory.length) }).map((_, i) => (
                         <div key={`empty-${i}`} className="aspect-square bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          {/* SMITHY TAB */}
          <TabsContent value="smithy" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blueprint Crafting */}
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Hammer className="w-5 h-5 text-primary" /> Blueprint Crafting</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      {blueprints.map(bp => (
                         <div key={bp.id} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-500">
                                  <Hammer className="w-5 h-5" />
                               </div>
                               <div>
                                  <div className="font-bold text-sm text-slate-900">{bp.name}</div>
                                  <div className="text-xs text-slate-500">Requires: {bp.cost.metal} Metal, {bp.cost.crystal} Crystal</div>
                               </div>
                            </div>
                            <Button size="sm" onClick={() => {
                               const item: Item = {
                                  id: Math.random().toString(36),
                                  name: bp.name.replace(" Blueprint", ""),
                                  description: "Crafted item.",
                                  type: bp.type as any,
                                  rarity: "common",
                                  level: 1,
                                  stats: { warfare: 5 } // Simplified stats
                               };
                               craftItem(item, bp.cost);
                            }}>Craft</Button>
                         </div>
                      ))}
                   </CardContent>
                </Card>
                
                {/* Tempering / Masterwork */}
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Flame className="w-5 h-5 text-orange-500" /> Tempering Station</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-center py-8 text-slate-500">
                         <Anvil className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                         <p>Select an item from your inventory or equipment slots to temper it.</p>
                         <p className="text-xs mt-2">Tempering costs Metal and has a chance to fail.</p>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
