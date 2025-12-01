import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rocket, MapPin, Crosshair, Truck, Search } from "lucide-react";

export default function Fleet() {
  const { ships } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Fleet Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Select ships and dispatch them on missions across the galaxy.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Ship Selection */}
          <Card className="col-span-2 bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" /> Select Fleet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white">Ship Type</TableHead>
                    <TableHead className="text-right text-white">Available</TableHead>
                    <TableHead className="text-right text-white w-[100px]">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(ships).map(([key, count]) => (
                    count > 0 && (
                      <TableRow key={key} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium capitalize text-slate-300">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-primary">{count}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="h-8 bg-black/50 border-white/10 text-right w-20 ml-auto" 
                          />
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                  {Object.values(ships).every(val => val === 0) && (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                           No ships available. Build some in the Shipyard!
                        </TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right Column: Mission Details */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
               <CardHeader>
                 <CardTitle className="text-lg font-orbitron flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-blue-400" /> Destination
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">Galaxy</label>
                        <Input defaultValue="1" className="bg-black/50 border-white/10 font-mono" />
                     </div>
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">System</label>
                        <Input defaultValue="102" className="bg-black/50 border-white/10 font-mono" />
                     </div>
                     <div>
                        <label className="text-xs text-muted-foreground uppercase">Planet</label>
                        <Input defaultValue="8" className="bg-black/50 border-white/10 font-mono" />
                     </div>
                  </div>
                  
                  <Select defaultValue="planet">
                     <SelectTrigger className="bg-black/50 border-white/10">
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

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
               <CardHeader>
                 <CardTitle className="text-lg font-orbitron flex items-center gap-2">
                   <Crosshair className="w-5 h-5 text-red-400" /> Mission
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-primary">
                     <Search className="w-4 h-4 mr-2 text-blue-400" /> Espionage
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-primary">
                     <Crosshair className="w-4 h-4 mr-2 text-red-400" /> Attack
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-primary">
                     <Truck className="w-4 h-4 mr-2 text-green-400" /> Transport
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-primary">
                     <MapPin className="w-4 h-4 mr-2 text-yellow-400" /> Colonize
                  </Button>
               </CardContent>
            </Card>
            
            <Button className="w-full bg-primary hover:bg-primary/80 text-black font-bold font-orbitron h-12 text-lg shadow-[0_0_20px_rgba(0,255,255,0.3)]">
               SEND FLEET
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
