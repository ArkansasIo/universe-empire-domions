import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, LogOut, Search, Plus, Trophy, MessageSquare, Globe } from "lucide-react";
import { useState } from "react";
import { MOCK_ALLIANCES } from "@/lib/allianceData";

export default function Alliance() {
  const { alliance, createAlliance, joinAlliance, leaveAlliance } = useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [createName, setCreateName] = useState("");
  const [createTag, setCreateTag] = useState("");

  if (alliance) {
     return (
        <GameLayout>
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                       <Shield className="w-8 h-8 text-primary" />
                       <h2 className="text-3xl font-orbitron font-bold text-slate-900">[{alliance.tag}] {alliance.name}</h2>
                    </div>
                    <p className="text-muted-foreground font-rajdhani text-lg">Alliance Command Center</p>
                 </div>
                 <Button variant="destructive" onClick={leaveAlliance}>
                    <LogOut className="w-4 h-4 mr-2" /> Leave Alliance
                 </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Alliance Info */}
                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Globe className="w-5 h-5 text-blue-600" /> Overview
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm italic text-slate-600">
                          "{alliance.description}"
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Members</span>
                             <span className="font-bold text-slate-900">{alliance.members.length}/50</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Total Points</span>
                             <span className="font-bold text-slate-900">{alliance.members.reduce((acc, m) => acc + m.points, 0).toLocaleString()}</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Internal Comms */}
                 <Card className="bg-white border-slate-200 lg:col-span-2">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <MessageSquare className="w-5 h-5 text-green-600" /> Internal Comms
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="bg-slate-50 p-4 rounded border border-slate-100 mb-4">
                          <div className="text-xs font-bold uppercase text-primary mb-1">Alliance Announcement</div>
                          <p className="text-slate-800">{alliance.announcement}</p>
                       </div>
                       <div className="h-[200px] flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded">
                          Chat Module Offline (Mockup)
                       </div>
                    </CardContent>
                 </Card>

                 {/* Member List */}
                 <Card className="bg-white border-slate-200 lg:col-span-3">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Users className="w-5 h-5 text-slate-600" /> Roster
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {alliance.members.map(member => (
                             <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-primary">
                                      {member.name.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="font-bold text-sm text-slate-900">{member.name}</div>
                                      <div className="text-xs text-slate-500 uppercase">{member.rank}</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="font-mono text-sm font-bold text-slate-700">{member.points} pts</div>
                                   <div className="text-[10px] text-green-600 uppercase font-bold">{member.status}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </GameLayout>
     );
  }

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Alliance Network</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Join forces with other commanders or establish your own faction.</p>
        </div>

        <Tabs defaultValue="search" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="search" className="font-orbitron"><Search className="w-4 h-4 mr-2" /> Find Alliance</TabsTrigger>
              <TabsTrigger value="create" className="font-orbitron"><Plus className="w-4 h-4 mr-2" /> Establish Alliance</TabsTrigger>
           </TabsList>

           <TabsContent value="search" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Alliance Directory</CardTitle>
                    <CardDescription>Search for an alliance to join.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex gap-2">
                       <Input 
                          placeholder="Search by tag or name..." 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                       />
                       <Button>Search</Button>
                    </div>

                    <div className="space-y-4">
                       {MOCK_ALLIANCES.map(a => (
                          <div key={a.id} className="flex items-center justify-between p-4 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">
                                   {a.tag}
                                </div>
                                <div>
                                   <div className="font-bold text-slate-900 text-lg">[{a.tag}] {a.name}</div>
                                   <div className="text-sm text-slate-500">{a.description}</div>
                                </div>
                             </div>
                             <Button variant="outline" onClick={() => joinAlliance(a.id!)}>Apply</Button>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="create" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Found New Alliance</CardTitle>
                    <CardDescription>Establish a new power in the galaxy.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4 max-w-md">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Alliance Name</label>
                       <Input 
                          placeholder="e.g. Terran Federation" 
                          value={createName}
                          onChange={e => setCreateName(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Alliance Tag (3-8 chars)</label>
                       <Input 
                          placeholder="e.g. TERRA" 
                          maxLength={8}
                          value={createTag}
                          onChange={e => setCreateTag(e.target.value.toUpperCase())}
                          className="bg-slate-50 border-slate-200 font-mono"
                       />
                    </div>
                    <Button className="w-full" onClick={() => createAlliance(createName, createTag)}>
                       <Trophy className="w-4 h-4 mr-2" /> Establish Alliance
                    </Button>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
