import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  ShieldAlert, 
  Hexagon, 
  Triangle, 
  CircleDot, 
  Orbit,
  Search,
  Rocket
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

type SystemObject = {
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number, crystal: number };
  moon?: boolean;
  class?: string;
};

// ---------------------------------------------------------------------------
// NMS-style deterministic universe seed system
// ---------------------------------------------------------------------------

/** FNV-1a 32-bit hash of an arbitrary string. */
function fnv1a(str: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return hash || 1;
}

/** Derive a pseudo-random float in [0, 1) from a base hash at a given slot. */
function seededAt(baseHash: number, slot: number): number {
  let h = (baseHash + Math.imul(slot >>> 0, 2654435761)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const SYLLABLES = [
  "al", "an", "ar", "as", "ba", "be", "bi", "bo", "ca", "ce", "ci", "co",
  "da", "de", "di", "do", "el", "en", "er", "es", "fa", "fe", "fi", "ga",
  "ge", "gi", "go", "ha", "he", "hi", "ia", "io", "ja", "ka", "ke", "ki",
  "ko", "la", "le", "li", "lo", "ma", "me", "mi", "mo", "na", "ne", "ni",
  "no", "on", "or", "os", "pa", "pe", "pi", "ra", "re", "ri", "ro", "sa",
  "se", "si", "so", "ta", "te", "ti", "to", "ul", "un", "ur", "va", "ve",
  "vi", "vo", "xa", "xe", "za", "ze", "zo",
] as const;

function generateName(hash: number, slot = 0): string {
  const numSyl = seededAt(hash, slot) > 0.55 ? 3 : 2;
  let name = "";
  for (let i = 0; i < numSyl; i++) {
    const idx = Math.floor(seededAt(hash, slot + i + 1) * SYLLABLES.length);
    name += SYLLABLES[idx];
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const STAR_TYPE_THRESHOLDS: Array<[string, number]> = [
  ["O", 0.00003], ["B", 0.0013], ["A", 0.006], ["F", 0.03],
  ["G", 0.076], ["K", 0.121], ["M", 1],
];

function pickStarType(r: number): string {
  let cumulative = 0;
  for (const [type, weight] of STAR_TYPE_THRESHOLDS) {
    cumulative += weight;
    if (r < cumulative) return type;
  }
  return "M";
}

const PLANET_CLASS_THRESHOLDS: Array<[string, number]> = [
  ["M", 0.10], ["H", 0.25], ["L", 0.32], ["Y", 0.39],
  ["T", 0.49], ["J", 0.64], ["K", 0.84], ["D", 1.00],
];

function pickPlanetClass(r: number): string {
  for (const [cls, threshold] of PLANET_CLASS_THRESHOLDS) {
    if (r < threshold) return cls;
  }
  return "K";
}

/** Planet class → Tailwind gradient classes for the visual circle. */
const PLANET_GRADIENT: Record<string, string> = {
  M: "from-blue-400 to-emerald-600",
  H: "from-yellow-500 to-orange-700",
  L: "from-lime-500 to-emerald-700",
  K: "from-red-700 to-stone-500",
  Y: "from-red-500 to-orange-900",
  D: "from-slate-400 to-stone-600",
  J: "from-amber-400 to-orange-700",
  T: "from-sky-300 to-indigo-600",
};

const getPlanetGradient = (cls?: string) =>
  cls && PLANET_GRADIENT[cls] ? PLANET_GRADIENT[cls] : "from-blue-500 to-purple-800";

/** Planet class → badge colour classes. */
const PLANET_CLASS_BADGE: Record<string, string> = {
  M: "bg-green-100 text-green-700",
  H: "bg-yellow-100 text-yellow-700",
  L: "bg-lime-100 text-lime-700",
  K: "bg-stone-100 text-stone-600",
  Y: "bg-red-100 text-red-700",
  D: "bg-slate-100 text-slate-600",
  J: "bg-orange-100 text-orange-700",
  T: "bg-sky-100 text-sky-700",
};

/** Star type labels and visual colours. */
const STAR_INFO: Record<string, { label: string; color: string; glow: string }> = {
  O: { label: "Blue Giant",    color: "#9bb0ff", glow: "shadow-[0_0_16px_#9bb0ff]" },
  B: { label: "Blue-White",    color: "#aabfff", glow: "shadow-[0_0_14px_#aabfff]" },
  A: { label: "White Star",    color: "#e0e8ff", glow: "shadow-[0_0_12px_#cad7ff]" },
  F: { label: "Yellow-White",  color: "#fff8dc", glow: "shadow-[0_0_12px_#f8f7ff]" },
  G: { label: "Yellow Dwarf",  color: "#fff4ea", glow: "shadow-[0_0_12px_#ffe4a0]" },
  K: { label: "Orange Dwarf",  color: "#ffd2a1", glow: "shadow-[0_0_12px_#ffa060]" },
  M: { label: "Red Dwarf",     color: "#ffcc6f", glow: "shadow-[0_0_12px_#ff6040]" },
};

interface GeneratedSystem {
  systemName: string;
  star: { type: string; name: string };
  positions: Array<{ pos: number } & SystemObject>;
}

function buildSystem(universe: string, galaxy: number, sector: number, system: number): GeneratedSystem {
  const baseKey = `${universe}:${galaxy}:${sector}:${system}`;
  const sysHash = fnv1a(`${baseKey}:sys`);

  const starType = pickStarType(seededAt(sysHash, 0));
  const starName = generateName(fnv1a(`${baseKey}:star-name`));
  const systemName = generateName(fnv1a(`${baseKey}:sys-name`));

  // 2-9 planets per system (NMS-style)
  const planetCount = Math.floor(seededAt(sysHash, 1) * 8) + 2;
  const positions: Array<{ pos: number } & SystemObject> = [];

  for (let i = 0; i < planetCount; i++) {
    const pos = i + 1;
    const planetHash = fnv1a(`${baseKey}:planet-${pos}`);
    const planetClass = pickPlanetClass(seededAt(planetHash, 0));
    const hasMoon = seededAt(planetHash, 1) < 0.42;
    const planetName = generateName(fnv1a(`${baseKey}:pname-${pos}`));
    positions.push({ pos, type: "planet", name: planetName, moon: hasMoon, class: planetClass });
  }

  // Optional asteroid belt
  const hasBelt = seededAt(sysHash, 2) < 0.35;
  const beltPos = planetCount + 1;
  if (hasBelt && beltPos <= 14) {
    const beltHash = fnv1a(`${baseKey}:belt`);
    positions.push({
      pos: beltPos,
      type: "asteroid",
      name: "Asteroid Belt",
      debris: {
        metal: Math.floor(seededAt(beltHash, 0) * 9000 + 1000),
        crystal: Math.floor(seededAt(beltHash, 1) * 4500 + 500),
      },
    });
  }

  // Rare phenomena in the outer system
  const rarePos = beltPos + (hasBelt ? 1 : 0);
  if (rarePos <= 14) {
    const rareHash = fnv1a(`${baseKey}:rare`);
    const rareRoll = seededAt(rareHash, 0);
    if (rareRoll < 0.02) {
      positions.push({ pos: rarePos, type: "blackhole", name: "Singularity", debris: { metal: 50000, crystal: 50000 } });
    } else if (rareRoll < 0.06) {
      positions.push({ pos: rarePos, type: "nebula", name: "Ion Cloud" });
    } else if (rareRoll < 0.10) {
      positions.push({ pos: rarePos, type: "station", name: "Pirate Outpost", owner: "Pirates" });
    }
  }

  // Fill remaining positions as empty
  for (let pos = 1; pos <= 15; pos++) {
    if (!positions.find((p) => p.pos === pos)) {
      positions.push({ pos, type: "empty", name: "" });
    }
  }

  return { systemName, star: { type: starType, name: starName }, positions };
}

export default function Galaxy() {
  const [universe, setUniverse] = useState("uni1");
  const [galaxy, setGalaxy] = useState(1);
  const [sector, setSector] = useState(4); 
  const [system, setSystem] = useState(102);

  const generatedSystem = buildSystem(universe, galaxy, sector, system);

  const getSystemData = (pos: number): SystemObject => {
    const entry = generatedSystem.positions.find((p) => p.pos === pos);
    if (!entry) return { type: "empty", name: "" };
    const { pos: _pos, ...obj } = entry;
    return obj;
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galaxy View</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Scan surrounding sectors and systems for resources and anomalies.</p>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap justify-center items-center gap-4 shadow-sm">
           
           {/* Universe Selector */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
              <Select value={universe} onValueChange={setUniverse}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                  <SelectValue placeholder="Select Universe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                  <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                  <SelectItem value="uni3">Quantum-Gamma</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

           {/* Galaxy Nav */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => Math.max(1, g - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={galaxy} onChange={(e) => setGalaxy(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => g + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           {/* Sector Nav (New) */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold text-primary">Sector</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-primary/30 text-primary font-bold" value={sector} onChange={(e) => setSector(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>

           {/* System Nav */}
           <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                 <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={system} onChange={(e) => setSystem(parseInt(e.target.value) || 1)} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => s + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
           </div>
           
           <Button className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 h-8 text-xs uppercase tracking-wider">
              <Orbit className="w-3 h-3 mr-2" /> Expedition
           </Button>
        </div>

        {/* System Info / Star Display */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex-shrink-0",
              STAR_INFO[generatedSystem.star.type]?.glow,
            )}
            style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_INFO[generatedSystem.star.type]?.color ?? "#ffe4a0"})` }}
          />
          <div>
            <div className="font-bold text-slate-900 font-orbitron text-lg">
              {generatedSystem.systemName} System
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">
              Star: <span className="font-semibold text-slate-700">{generatedSystem.star.name}</span>
              {" · "}Type <span className="font-semibold text-slate-700">{generatedSystem.star.type}</span>
              {" · "}
              <span className="italic">{STAR_INFO[generatedSystem.star.type]?.label ?? "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Galaxy Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
           <Table>
             <TableHeader>
               <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                 <TableHead className="text-center w-[60px] text-slate-700">Pos</TableHead>
                 <TableHead className="w-[80px] text-slate-700">Visual</TableHead>
                 <TableHead className="text-slate-700">Name</TableHead>
                 <TableHead className="text-slate-700">Class</TableHead>
                 <TableHead className="text-slate-700">Moon/Debris</TableHead>
                 <TableHead className="text-slate-700">Player / Status</TableHead>
                 <TableHead className="text-slate-700">Alliance</TableHead>
                 <TableHead className="text-right text-slate-700">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {Array.from({ length: 15 }).map((_, i) => {
                 const pos = i + 1;
                 const data = getSystemData(pos);
                 const isMe = data.owner === "Commander";
                 
                 return (
                   <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-mono text-muted-foreground">{pos}</TableCell>
                      
                      {/* Visual Column */}
                      <TableCell>
                         {data.type === "planet" && (
                           <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br shadow-sm border border-slate-200", getPlanetGradient(data.class))}></div>
                         )}
                         {data.type === "asteroid" && (
                           <div className="w-10 h-10 flex items-center justify-center">
                             <div className="w-8 h-8 rounded bg-slate-300 rotate-45 border border-slate-400"></div>
                           </div>
                         )}
                         {data.type === "blackhole" && (
                           <div className="w-10 h-10 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-slate-800 flex items-center justify-center">
                             <div className="w-9 h-9 rounded-full border border-white/20"></div>
                           </div>
                         )}
                         {data.type === "nebula" && (
                           <div className="w-10 h-10 rounded-full bg-purple-100 blur-sm opacity-80"></div>
                         )}
                         {data.type === "station" && (
                            <div className="w-10 h-10 flex items-center justify-center">
                              <Hexagon className="w-8 h-8 text-slate-600 fill-slate-200" />
                            </div>
                         )}
                      </TableCell>
                      
                      {/* Name Column */}
                      <TableCell>
                         {data.type !== "empty" ? (
                            <div className={cn("font-medium", isMe ? "text-primary" : "text-slate-700")}>
                               {data.name}
                            </div>
                         ) : (
                            <span className="text-muted-foreground/30 italic">-- Empty Space --</span>
                         )}
                      </TableCell>

                      {/* Class/Type Column */}
                      <TableCell>
                         {data.type === "asteroid" && <Badge variant="outline" className="border-slate-400 text-slate-600">Asteroid</Badge>}
                         {data.type === "blackhole" && <Badge variant="destructive" className="bg-black hover:bg-black text-white">Singularity</Badge>}
                         {data.type === "nebula" && <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Nebula</Badge>}
                         {data.type === "station" && <Badge variant="outline" className="border-red-400 text-red-600">Pirate Base</Badge>}
                         {data.type === "planet" && <Badge variant="secondary" className={cn(
                            data.class && PLANET_CLASS_BADGE[data.class]
                              ? PLANET_CLASS_BADGE[data.class]
                              : "bg-blue-100 text-blue-700"
                         )}>Class {data.class}</Badge>}
                      </TableCell>
                      
                      {/* Moon/Debris Column */}
                      <TableCell>
                         <div className="flex items-center gap-2">
                            {data.moon && <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-400" title="Moon"></div>}
                            {data.debris && (
                               <div className="flex items-center text-xs text-yellow-600 font-mono" title={`Metal: ${data.debris.metal}, Crystal: ${data.debris.crystal}`}>
                                  <Triangle className="w-3 h-3 mr-1 fill-yellow-600 rotate-180" /> 
                                  <span>D-Field</span>
                               </div>
                            )}
                         </div>
                      </TableCell>
                      
                      {/* Player Column */}
                      <TableCell>
                         {data.owner && (
                            <span className={cn(
                              "font-medium",
                              isMe ? "text-green-600" : data.type === "station" ? "text-red-600" : "text-red-500"
                            )}>
                               {data.owner}
                               {data.type === "station" && " (Hostile)"}
                            </span>
                         )}
                      </TableCell>
                      
                      {/* Alliance Column */}
                      <TableCell>
                         {data.alliance && <span className="text-blue-500 font-bold">[{data.alliance}]</span>}
                      </TableCell>
                      
                      {/* Actions Column */}
                      <TableCell className="text-right">
                         {data.type !== "empty" && !isMe && (
                            <div className="flex justify-end gap-2">
                               <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => alert("Scanning " + data.name)}>
                                 <Search className="w-4 h-4" />
                               </Button>
                               {(data.type === "planet" || data.type === "station") && (
                                 <>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => alert("Messaging " + data.name)}><MessageSquare className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => alert("Attacking " + data.name)}><ShieldAlert className="w-4 h-4" /></Button>
                                 </>
                               )}
                               {(data.type === "asteroid" || data.type === "blackhole") && (
                                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-yellow-50 hover:text-yellow-600" onClick={() => alert("Launching fleet to " + data.name)}><Rocket className="w-4 h-4" /></Button>
                               )}
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
