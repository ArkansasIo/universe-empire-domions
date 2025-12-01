import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, ChevronLeft, ChevronRight, MessageSquare, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function Galaxy() {
  const [system, setSystem] = useState(102);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white glow-text">Galaxy View</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Scan surrounding systems for resources and potential threats.</p>
        </div>

        {/* Navigation Bar */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg flex justify-center items-center gap-4">
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-black/50 border-white/10" defaultValue="1" />
                 <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-black/50 border-white/10" value={system} onChange={(e) => setSystem(parseInt(e.target.value))} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
              Show Expedition
           </Button>
        </div>

        {/* Galaxy Table */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
           <Table>
             <TableHeader>
               <TableRow className="bg-white/5 border-white/10 hover:bg-white/5">
                 <TableHead className="text-center w-[80px] text-white">Pos</TableHead>
                 <TableHead className="w-[100px] text-white">Image</TableHead>
                 <TableHead className="text-white">Planet</TableHead>
                 <TableHead className="text-white">Moon</TableHead>
                 <TableHead className="text-white">Debris</TableHead>
                 <TableHead className="text-white">Player</TableHead>
                 <TableHead className="text-white">Alliance</TableHead>
                 <TableHead className="text-right text-white">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {Array.from({ length: 15 }).map((_, i) => {
                 const pos = i + 1;
                 // Mock Data Logic
                 const isOccupied = pos === 8 || pos === 4 || pos === 12;
                 const isMe = pos === 8;
                 
                 return (
                   <TableRow key={pos} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>
                      <TableCell>
                         {isOccupied && (
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 shadow-lg"></div>
                         )}
                      </TableCell>
                      <TableCell>
                         {isOccupied ? (
                            <div>
                               <div className={isMe ? "text-primary font-bold" : "text-slate-300"}>{isMe ? "Homeworld" : `Colony ${pos}`}</div>
                               {isMe && <div className="text-xs text-primary/60">[Active]</div>}
                            </div>
                         ) : (
                            <span className="text-muted-foreground/30 italic">-- Empty Space --</span>
                         )}
                      </TableCell>
                      <TableCell>
                         {pos === 12 && <div className="w-4 h-4 rounded-full bg-slate-400" title="Moon"></div>}
                      </TableCell>
                      <TableCell>
                         {pos === 4 && <div className="text-xs text-yellow-500/70 animate-pulse">T: 5.2k M: 2.1k</div>}
                      </TableCell>
                      <TableCell>
                         {isOccupied && (
                            <span className={isMe ? "text-green-400" : "text-red-400"}>
                               {isMe ? "Commander" : `Enemy_${pos}`}
                            </span>
                         )}
                      </TableCell>
                      <TableCell>
                         {isOccupied && !isMe && <span className="text-blue-300">[NOOBS]</span>}
                      </TableCell>
                      <TableCell className="text-right">
                         {isOccupied && !isMe && (
                            <div className="flex justify-end gap-2">
                               <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"><MessageSquare className="w-4 h-4" /></Button>
                               <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400"><ShieldAlert className="w-4 h-4" /></Button>
                            </div>
                         )}
                      </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
        </div>
      </div>
    </GameLayout>
  );
}
