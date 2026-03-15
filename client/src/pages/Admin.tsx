import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, Users, Activity, Server, Database, Ban, Lock, Eye, Terminal, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AdminUser = {
   id: string;
   name: string;
   email: string;
   status: "active" | "muted" | "banned";
   role: string;
   lastLogin: string | null;
   ip: string;
};

type AdminUsersResponse = {
   users: AdminUser[];
};

type AdminOverviewResponse = {
   totalUsers: number;
   bannedUsers: number;
   mutedUsers: number;
   activeUsersEstimate: number;
};

type AdminAuditResponse = {
   logs: Array<{
      id: string;
      timestamp: number;
      actorId: string;
      action: string;
      targetUserId?: string;
      details?: string;
   }>;
};

type AdminConsoleExecuteResponse = {
   success: boolean;
   output: string;
};

type AdminUserDetailResponse = {
   user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: "active" | "muted" | "banned";
      createdAt: string | null;
      lastLogin: string | null;
   };
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
   const response = await fetch(url, {
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         ...(init?.headers || {}),
      },
      ...init,
   });

   const payload = await response.json().catch(() => null);
   if (!response.ok) {
      throw new Error(payload?.message || payload?.error || "Request failed");
   }

   return payload as T;
}

export default function Admin() {
   const { config, updateConfig, addEvent } = useGame();
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const [search, setSearch] = useState("");
  
   const { data: usersData } = useQuery<AdminUsersResponse>({
      queryKey: ["admin-users"],
      queryFn: () => fetchJson<AdminUsersResponse>("/api/admin/users"),
      refetchInterval: 20000,
   });

   const { data: overviewData } = useQuery<AdminOverviewResponse>({
      queryKey: ["admin-overview"],
      queryFn: () => fetchJson<AdminOverviewResponse>("/api/admin/overview"),
      refetchInterval: 20000,
   });

   const { data: auditData } = useQuery<AdminAuditResponse>({
      queryKey: ["admin-audit"],
      queryFn: () => fetchJson<AdminAuditResponse>("/api/admin/audit"),
      refetchInterval: 15000,
   });

   const updateStatusMutation = useMutation({
      mutationFn: ({ userId, status }: { userId: string; status: "active" | "muted" | "banned" }) =>
         fetchJson(`/api/admin/users/${userId}/status`, {
            method: "POST",
            body: JSON.stringify({ status }),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-users"] });
         queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      },
      onError: (error: Error) => {
         toast({ title: "Moderation update failed", description: error.message, variant: "destructive" });
      },
   });

   const consoleCommandMutation = useMutation({
      mutationFn: (command: string) =>
         fetchJson<AdminConsoleExecuteResponse>("/api/admin/console/execute", {
            method: "POST",
            body: JSON.stringify({ command }),
         }),
      onSuccess: (result) => {
         setConsoleLog((prev) => [...prev, result.output]);
         queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      },
      onError: (error: Error) => {
         setConsoleLog((prev) => [...prev, `Command failed: ${error.message}`]);
         toast({ title: "Command failed", description: error.message, variant: "destructive" });
      },
   });

   const viewUserDetailMutation = useMutation({
      mutationFn: (userId: string) => fetchJson<AdminUserDetailResponse>(`/api/admin/users/${userId}`),
      onSuccess: (payload) => {
         const user = payload.user;
         toast({
            title: `User: ${user.name}`,
            description: `${user.email} • ${user.role} • ${user.status} • Joined ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}`,
         });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to load user details", description: error.message, variant: "destructive" });
      },
   });

   const adminUsers = usersData?.users || [];
   const filteredUsers = adminUsers.filter((user) => {
      const key = search.toLowerCase();
      if (!key) return true;
      return user.name.toLowerCase().includes(key) || user.email.toLowerCase().includes(key);
   });

  const [consoleCommand, setConsoleCommand] = useState("");
  const [consoleLog, setConsoleLog] = useState<string[]>([
     "> System initialized...",
     "> Admin panel loaded.",
     "> Waiting for input..."
  ]);

  const handleBan = (id: string) => {
     const target = adminUsers.find((user) => user.id === id);
     if (!target) return;
     updateStatusMutation.mutate({ userId: id, status: target.status === "banned" ? "active" : "banned" });
  };

  const handleMute = (id: string) => {
     const target = adminUsers.find((user) => user.id === id);
     if (!target) return;
     updateStatusMutation.mutate({ userId: id, status: target.status === "muted" ? "active" : "muted" });
  };

  const executeCommand = () => {
     if (!consoleCommand) return;
     
     const cmd = consoleCommand.trim();
     setConsoleLog(prev => [...prev, `> ${cmd}`]);
     if (cmd === "clear") {
        setConsoleLog([]);
        setConsoleCommand("");
        return;
     }

     consoleCommandMutation.mutate(cmd);
     
     setConsoleCommand("");
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 text-xs">Restricted Area</Badge>
              <Badge variant="outline" className="border-red-500 text-red-500 uppercase tracking-widest px-3 py-1 text-xs animate-pulse">Level 5 Clearance</Badge>
           </div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
             <ShieldAlert className="w-8 h-8 text-red-600" /> Administration Control
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Server management, user moderation, and system diagnostics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Active Users</div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{overviewData?.activeUsersEstimate ?? 0}</div>
                 </div>
                 <Users className="w-8 h-8 text-blue-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Server Load</div>
                    <div className="text-3xl font-mono font-bold text-green-600">{Math.min(100, Math.max(3, (overviewData?.totalUsers || 0) % 87))}%</div>
                 </div>
                 <Activity className="w-8 h-8 text-green-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Muted Users</div>
                    <div className="text-3xl font-mono font-bold text-purple-600">{overviewData?.mutedUsers ?? 0}</div>
                 </div>
                 <Database className="w-8 h-8 text-purple-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Banned Users</div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{overviewData?.bannedUsers ?? 0}</div>
                 </div>
                 <Server className="w-8 h-8 text-slate-500 opacity-50" />
              </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="users" className="font-orbitron"><Users className="w-4 h-4 mr-2" /> User Management</TabsTrigger>
              <TabsTrigger value="console" className="font-orbitron"><Terminal className="w-4 h-4 mr-2" /> System Console</TabsTrigger>
              <TabsTrigger value="config" className="font-orbitron"><RefreshCw className="w-4 h-4 mr-2" /> Global Config</TabsTrigger>
              <TabsTrigger value="logs" className="font-orbitron"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
           </TabsList>

           {/* USERS TAB */}
           <TabsContent value="users" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>User Database</CardTitle>
                    <CardDescription>Manage player accounts and permissions.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex justify-between mb-4">
                       <Input placeholder="Search users..." className="max-w-sm bg-slate-50" value={search} onChange={(event) => setSearch(event.target.value)} />
                       <Button variant="outline" onClick={() => {
                          const header = "id,name,email,status,role,lastLogin,ip";
                          const rows = filteredUsers.map((u) => `${u.id},${u.name},${u.email},${u.status},${u.role},${u.lastLogin || ""},${u.ip}`);
                          const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `stellar-users-${Date.now()}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ title: "Export complete", description: `${filteredUsers.length} users exported to CSV.` });
                       }}><Users className="w-4 h-4 mr-2" /> Export CSV</Button>
                    </div>
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead>User</TableHead>
                             <TableHead>Role</TableHead>
                             <TableHead>Status</TableHead>
                             <TableHead>Last Login</TableHead>
                             <TableHead>IP Address</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredUsers.map(user => (
                             <TableRow key={user.id}>
                                <TableCell>
                                   <div className="font-medium">{user.name}</div>
                                   <div className="text-xs text-slate-500">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                   <Badge variant="outline" className={user.role === "admin" ? "border-red-200 text-red-600" : "border-slate-200 text-slate-600"}>
                                      {user.role}
                                   </Badge>
                                </TableCell>
                                <TableCell>
                                   <Badge className={
                                      user.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200" : 
                                      user.status === "banned" ? "bg-red-100 text-red-700 hover:bg-red-200" : 
                                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                   }>
                                      {user.status}
                                   </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">{user.ip}</TableCell>
                                <TableCell className="text-right space-x-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => viewUserDetailMutation.mutate(user.id)} disabled={viewUserDetailMutation.isPending}>
                                      <Eye className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-yellow-600" onClick={() => handleMute(user.id)}>
                                      <Lock className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleBan(user.id)}>
                                      <Ban className="w-4 h-4" />
                                   </Button>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* CONSOLE TAB */}
           <TabsContent value="console" className="mt-6">
              <Card className="bg-slate-950 border-slate-800 text-green-500 font-mono">
                 <CardHeader className="border-b border-slate-900 pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                       <Terminal className="w-4 h-4" /> Root Terminal Access
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="h-[400px] overflow-y-auto p-4 space-y-1">
                       {consoleLog.map((log, i) => (
                          <div key={i}>{log}</div>
                       ))}
                       <div className="animate-pulse">_</div>
                    </div>
                    <div className="p-2 border-t border-slate-900 flex items-center gap-2 bg-slate-900">
                       <span className="text-green-500 font-bold">{">"}</span>
                       <input 
                          className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder-green-800" 
                          placeholder="Enter system command..."
                          value={consoleCommand}
                          disabled={consoleCommandMutation.isPending}
                          onChange={(e) => setConsoleCommand(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                          autoFocus
                       />
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* CONFIG TAB */}
           <TabsContent value="config" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Global Server Configuration</CardTitle>
                    <CardDescription>Warning: Changes here affect all players immediately.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded border border-red-100">
                             <AlertTriangle className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                             <div className="font-bold text-red-900">Emergency Maintenance Mode</div>
                             <div className="text-sm text-red-700">Disconnects all non-admin users and locks login.</div>
                          </div>
                       </div>
                       <Switch checked={config.maintenanceMode} onCheckedChange={(v) => updateConfig({ maintenanceMode: v })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Economy Scaling</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Resource Generation</label>
                                <Input type="number" className="w-20 h-8" value={config.resourceRate} onChange={(e) => updateConfig({ resourceRate: parseInt(e.target.value) })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Build Speed</label>
                                <Input type="number" className="w-20 h-8" value={config.gameSpeed} onChange={(e) => updateConfig({ gameSpeed: parseInt(e.target.value) })} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Combat Settings</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Fleet Speed</label>
                                <Input type="number" className="w-20 h-8" value={config.fleetSpeed} onChange={(e) => updateConfig({ fleetSpeed: parseInt(e.target.value) })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Force Peace Mode</label>
                                <Switch checked={config.peaceMode} onCheckedChange={(v) => updateConfig({ peaceMode: v })} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>
           
           {/* LOGS TAB */}
           <TabsContent value="logs" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardContent className="p-0">
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead>Timestamp</TableHead>
                             <TableHead>Level</TableHead>
                             <TableHead>Source</TableHead>
                             <TableHead>Event</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {(auditData?.logs || []).map((log) => (
                             <TableRow key={log.id}>
                                <TableCell className="font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                                <TableCell>
                                   <Badge variant="outline" className={
                                      log.action.includes("status") ? "text-yellow-600 border-yellow-200" : "text-blue-600 border-blue-200"
                                   }>{log.action.includes("status") ? "WARN" : "INFO"}</Badge>
                                </TableCell>
                                <TableCell className="text-sm font-bold text-slate-700">Admin</TableCell>
                                <TableCell className="text-sm text-slate-600">{log.details || log.action}</TableCell>
                             </TableRow>
                          ))}
                          {(auditData?.logs || []).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-slate-500 py-8">No audit entries yet.</TableCell>
                            </TableRow>
                          )}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </TabsContent>

        </Tabs>
      </div>
    </GameLayout>
  );
}
