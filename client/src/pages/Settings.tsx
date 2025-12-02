import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Server, Shield, Monitor, Database, Power, Save, RefreshCw, Clock, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { config, updateConfig, cronJobs, toggleCronJob, runCronJob, isAdmin, isActualAdmin, adminRole, toggleAdmin } = useGame();

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-orbitron font-bold text-slate-900">System Configuration</h2>
             <p className="text-muted-foreground font-rajdhani text-lg">Manage server parameters, game rules, and account settings.</p>
           </div>
           {isActualAdmin && (
             <div className="flex items-center gap-2">
                {isAdmin && <Badge variant="destructive" className="animate-pulse">ADMIN MODE</Badge>}
                {!isAdmin && <Badge variant="secondary">USER VIEW</Badge>}
                <Button 
                   variant={isAdmin ? "destructive" : "outline"} 
                   size="sm"
                   onClick={toggleAdmin}
                   data-testid="button-toggle-admin-mode"
                >
                   {isAdmin ? "Switch to User View" : "Switch to Admin Mode"}
                </Button>
             </div>
           )}
        </div>

        <Tabs defaultValue="game" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="game" className="font-orbitron"><Monitor className="w-4 h-4 mr-2" /> Game Rules</TabsTrigger>
              <TabsTrigger value="server" className="font-orbitron"><Server className="w-4 h-4 mr-2" /> Server Config</TabsTrigger>
              <TabsTrigger value="cron" className="font-orbitron"><Clock className="w-4 h-4 mr-2" /> Cron Jobs</TabsTrigger>
              <TabsTrigger value="account" className="font-orbitron"><SettingsIcon className="w-4 h-4 mr-2" /> Account</TabsTrigger>
           </TabsList>

           {/* GAME RULES TAB */}
           <TabsContent value="game" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Monitor className="w-5 h-5 text-primary" /> Universe Parameters
                    </CardTitle>
                    <CardDescription>Adjusting these values will instantly affect game logic.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    
                    {/* Game Speed */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div>
                             <label className="font-bold text-slate-900 block">Game Speed Multiplier</label>
                             <span className="text-xs text-slate-500">Affects build times, research, and production ticks.</span>
                          </div>
                          <div className="font-mono font-bold text-xl text-primary">{config.gameSpeed}x</div>
                       </div>
                       <Slider 
                          value={[config.gameSpeed]} 
                          min={1} max={10} step={1}
                          onValueChange={(v) => updateConfig({ gameSpeed: v[0] })}
                       />
                    </div>

                    {/* Fleet Speed */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div>
                             <label className="font-bold text-slate-900 block">Fleet Flight Speed</label>
                             <span className="text-xs text-slate-500">Multiplies the travel speed of all ships.</span>
                          </div>
                          <div className="font-mono font-bold text-xl text-blue-600">{config.fleetSpeed}x</div>
                       </div>
                       <Slider 
                          value={[config.fleetSpeed]} 
                          min={1} max={10} step={1}
                          onValueChange={(v) => updateConfig({ fleetSpeed: v[0] })}
                       />
                    </div>

                    {/* Resource Rate */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div>
                             <label className="font-bold text-slate-900 block">Resource Production Rate</label>
                             <span className="text-xs text-slate-500">Global multiplier for all mines and synthesizers.</span>
                          </div>
                          <div className="font-mono font-bold text-xl text-green-600">{config.resourceRate}x</div>
                       </div>
                       <Slider 
                          value={[config.resourceRate]} 
                          min={1} max={20} step={1}
                          onValueChange={(v) => updateConfig({ resourceRate: v[0] })}
                       />
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded border border-slate-200">
                             <Shield className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <div className="font-bold text-slate-900">Peace Mode</div>
                             <div className="text-xs text-slate-500">Disable all combat missions between players.</div>
                          </div>
                       </div>
                       <Switch 
                          checked={config.peaceMode}
                          onCheckedChange={(v) => updateConfig({ peaceMode: v })}
                       />
                    </div>

                 </CardContent>
              </Card>
           </TabsContent>

           {/* SERVER CONFIG TAB */}
           <TabsContent value="server" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Server className="w-5 h-5 text-slate-600" /> Server Settings
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Universe Name</label>
                          <Input 
                             value={config.universeName}
                             onChange={(e) => updateConfig({ universeName: e.target.value })}
                             className="bg-slate-50 border-slate-200"
                          />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Server Timezone</label>
                          <Select value={config.serverTimezone} onValueChange={(v) => updateConfig({ serverTimezone: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                                <SelectItem value="CET">CET (Central European Time)</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <div className="flex items-center justify-between pt-4">
                          <span className="text-sm font-bold text-slate-700">Maintenance Mode</span>
                          <Switch 
                             checked={config.maintenanceMode}
                             onCheckedChange={(v) => updateConfig({ maintenanceMode: v })}
                          />
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Database className="w-5 h-5 text-blue-600" /> Data Management
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="text-sm text-slate-500 mb-4">
                          Manage local game data and server snapshots.
                       </div>
                       
                       <Button variant="outline" className="w-full justify-start">
                          <Save className="w-4 h-4 mr-2" /> Create Backup Snapshot
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="w-4 h-4 mr-2" /> Reset Universe (Wipe Data)
                       </Button>
                       <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Power className="w-4 h-4 mr-2" /> Force Server Restart
                       </Button>
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>

           {/* CRON JOBS TAB */}
           <TabsContent value="cron" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Clock className="w-5 h-5 text-purple-600" /> Scheduled Tasks (Cron)
                    </CardTitle>
                    <CardDescription>Manage periodic background tasks and server automation.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {cronJobs.map(job => {
                          const isDue = Date.now() - job.lastRun >= job.interval;
                          return (
                             <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center gap-4">
                                   <div className={`w-2 h-2 rounded-full ${job.enabled ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                                   <div>
                                      <div className="font-bold text-slate-900 flex items-center gap-2">
                                         {job.name}
                                         <Badge variant="outline" className="text-[10px] uppercase">{job.type}</Badge>
                                      </div>
                                      <div className="text-xs text-slate-500">{job.description}</div>
                                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                                         Interval: {job.interval / 1000}s | Last Run: {new Date(job.lastRun).toLocaleTimeString()}
                                      </div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <Button variant="ghost" size="sm" onClick={() => runCronJob(job.id)}>
                                      <Play className="w-4 h-4" />
                                   </Button>
                                   <Switch 
                                      checked={job.enabled}
                                      onCheckedChange={() => toggleCronJob(job.id)}
                                   />
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* ACCOUNT TAB */}
           <TabsContent value="account" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <SettingsIcon className="w-5 h-5 text-slate-600" /> Account Settings
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-sm text-slate-500">Account management settings.</p>
                       <p className="text-xs text-slate-400">(Email, Password, 2FA, API Keys)</p>
                    </CardContent>
                 </Card>

                 {isActualAdmin && (
                    <Card className="bg-white border-slate-200 border-l-4 border-l-red-500">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Shield className="w-5 h-5 text-red-600" /> Administrator Access
                          </CardTitle>
                          <CardDescription>
                             You have admin privileges. Role: <span className="font-semibold text-red-600 uppercase">{adminRole || 'admin'}</span>
                          </CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="flex items-center justify-between bg-slate-50 p-4 rounded border border-slate-100">
                             <div>
                                <div className="font-bold text-slate-900">Admin Mode</div>
                                <div className="text-xs text-slate-500">
                                   {isAdmin 
                                      ? "Currently viewing as admin with full access" 
                                      : "Currently viewing as a regular user"}
                                </div>
                             </div>
                             <Switch 
                                checked={isAdmin}
                                onCheckedChange={toggleAdmin}
                                data-testid="switch-admin-mode"
                             />
                          </div>
                          <div className="text-xs text-slate-400">
                             Toggle between admin mode (full access, admin tools visible) and user view (see the game as players do).
                          </div>
                       </CardContent>
                    </Card>
                 )}
              </div>
           </TabsContent>

        </Tabs>
      </div>
    </GameLayout>
  );
}
