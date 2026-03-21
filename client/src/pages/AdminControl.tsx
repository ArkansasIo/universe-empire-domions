import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Ban,
  Database,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wand2,
} from "lucide-react";

type AdminMeResponse = {
  isAdmin: boolean;
  role: string | null;
  masqueradingAsUserId?: string | null;
  actingAdminUserId?: string | null;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: "active" | "muted" | "banned";
  role: string;
  lastLogin: string | null;
  ip: string;
};

type AdminUsersResponse = { users: AdminUser[] };

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

type AdminAccountsResponse = {
  accounts: Array<{
    id: string;
    userId: string;
    role: string;
    username: string;
    email: string;
  }>;
};

type AdminOperationsResponse = {
  operations: Array<{
    id: string;
    type: string;
    status: string;
    requestedBy: string;
    requestedAt: number;
    completedAt?: number;
    notes?: string;
  }>;
};

type ServerSettings = {
  universeName: string;
  economySpeed: number;
  researchSpeed: number;
  fleetSpeedWar: number;
  fleetSpeedHolding: number;
  fleetSpeedPeaceful: number;
  planetFieldsBonus: number;
  basicIncomeMetal: number;
  basicIncomeCrystal: number;
  basicIncomeDeuterium: number;
  basicIncomeEnergy: number;
  registrationPlanetAmount: number;
  darkMatterBonus: number;
  darkMatterRegenEnabled: boolean;
  darkMatterRegenAmount: number;
  darkMatterRegenPeriod: number;
  planetRelocationCost: number;
  planetRelocationDuration: number;
  allianceCooldownDays: number;
  battleEngine: "rust" | "php";
  allianceCombatSystemOn: boolean;
  debrisFieldFromShips: number;
  debrisFieldFromDefense: number;
  debrisFieldDeuteriumOn: boolean;
  rapidFireEnabled: boolean;
  defenseRepairRate: number;
  expeditionLootRate: number;
  expeditionDelayRate: number;
  expeditionBlackHoleRate: number;
  highscoreAdminVisible: boolean;
  numberOfGalaxies: number;
  systemsPerGalaxy: number;
  positionsPerSystem: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  peaceMode: boolean;
  resourceRate: number;
  gameSpeed: number;
  fleetSpeed: number;
};

type RulesContent = {
  rulesContent: string;
  legalContent: string;
  privacyPolicyContent: string;
  termsContent: string;
  contactContent: string;
};

type DeveloperShortcutsResponse = {
  presets: Array<{ id: string; label: string }>;
  buildingCatalog: string[];
  researchCatalog: string[];
  unitCatalog: string[];
  currentUserId: string;
  actingAdminUserId: string | null;
  masqueradingAsUserId: string | null;
  recentActions: string[];
  worldObjects: Array<{
    id: string;
    type: "planet" | "moon" | "debris";
    coordinates: string;
    name: string;
    ownerUserId?: string;
    createdAt: number;
  }>;
  userDirectory: Array<{
    id: string;
    username: string;
    email: string;
  }>;
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
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

const DEFAULT_SERVER_SETTINGS: ServerSettings = {
  universeName: "Nexus Crown",
  economySpeed: 4,
  researchSpeed: 8,
  fleetSpeedWar: 3,
  fleetSpeedHolding: 2,
  fleetSpeedPeaceful: 6,
  planetFieldsBonus: 25,
  basicIncomeMetal: 30,
  basicIncomeCrystal: 15,
  basicIncomeDeuterium: 8,
  basicIncomeEnergy: 20,
  registrationPlanetAmount: 1,
  darkMatterBonus: 2500,
  darkMatterRegenEnabled: true,
  darkMatterRegenAmount: 100,
  darkMatterRegenPeriod: 3600,
  planetRelocationCost: 5000,
  planetRelocationDuration: 3600,
  allianceCooldownDays: 3,
  battleEngine: "rust",
  allianceCombatSystemOn: true,
  debrisFieldFromShips: 30,
  debrisFieldFromDefense: 0,
  debrisFieldDeuteriumOn: false,
  rapidFireEnabled: true,
  defenseRepairRate: 70,
  expeditionLootRate: 100,
  expeditionDelayRate: 10,
  expeditionBlackHoleRate: 2,
  highscoreAdminVisible: false,
  numberOfGalaxies: 9,
  systemsPerGalaxy: 499,
  positionsPerSystem: 16,
  maintenanceMode: false,
  allowNewRegistrations: true,
  peaceMode: false,
  resourceRate: 4,
  gameSpeed: 4,
  fleetSpeed: 4,
};

const DEFAULT_RULES: RulesContent = {
  rulesContent: "",
  legalContent: "",
  privacyPolicyContent: "",
  termsContent: "",
  contactContent: "",
};

export default function AdminControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [targetIdentifier, setTargetIdentifier] = useState("");
  const [serverForm, setServerForm] = useState<ServerSettings>(DEFAULT_SERVER_SETTINGS);
  const [rulesForm, setRulesForm] = useState<RulesContent>(DEFAULT_RULES);
  const [resourceForm, setResourceForm] = useState({
    metal: "0",
    crystal: "0",
    deuterium: "0",
    energy: "0",
    credits: "0",
    food: "0",
    water: "0",
    darkMatter: "0",
  });
  const [buildingKey, setBuildingKey] = useState("metalMine");
  const [buildingLevel, setBuildingLevel] = useState("30");
  const [researchKey, setResearchKey] = useState("energyTech");
  const [researchLevel, setResearchLevel] = useState("10");
  const [unitId, setUnitId] = useState("lightFighter");
  const [unitAmount, setUnitAmount] = useState("100");
  const [worldType, setWorldType] = useState<"planet" | "moon" | "debris">("planet");
  const [worldCoordinates, setWorldCoordinates] = useState("1:1:1");
  const [worldName, setWorldName] = useState("Admin Created World Object");

  const { data: meData, isLoading: meLoading } = useQuery<AdminMeResponse>({
    queryKey: ["admin-me"],
    queryFn: () => fetchJson<AdminMeResponse>("/api/admin/me"),
    retry: false,
  });

  const { data: overviewData } = useQuery<AdminOverviewResponse>({
    queryKey: ["admin-overview"],
    queryFn: () => fetchJson<AdminOverviewResponse>("/api/admin/overview"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 20000,
  });

  const { data: usersData } = useQuery<AdminUsersResponse>({
    queryKey: ["admin-users"],
    queryFn: () => fetchJson<AdminUsersResponse>("/api/admin/users"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 20000,
  });

  const { data: accountsData } = useQuery<AdminAccountsResponse>({
    queryKey: ["admin-accounts"],
    queryFn: () => fetchJson<AdminAccountsResponse>("/api/admin/accounts"),
    enabled: !!meData?.isAdmin,
  });

  const { data: auditData } = useQuery<AdminAuditResponse>({
    queryKey: ["admin-audit"],
    queryFn: () => fetchJson<AdminAuditResponse>("/api/admin/audit"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 15000,
  });

  const { data: operationsData } = useQuery<AdminOperationsResponse>({
    queryKey: ["admin-operations"],
    queryFn: () => fetchJson<AdminOperationsResponse>("/api/admin/operations"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 15000,
  });

  const { data: serverSettingsData } = useQuery<{ settings: ServerSettings }>({
    queryKey: ["admin-server-settings"],
    queryFn: () => fetchJson<{ settings: ServerSettings }>("/api/admin/server-settings"),
    enabled: !!meData?.isAdmin,
  });

  const { data: rulesData } = useQuery<{ content: RulesContent }>({
    queryKey: ["admin-rules-content"],
    queryFn: () => fetchJson<{ content: RulesContent }>("/api/admin/rules-content"),
    enabled: !!meData?.isAdmin,
  });

  const { data: devData } = useQuery<DeveloperShortcutsResponse>({
    queryKey: ["admin-developer-shortcuts"],
    queryFn: () => fetchJson<DeveloperShortcutsResponse>("/api/admin/developer-shortcuts"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (serverSettingsData?.settings) {
      setServerForm(serverSettingsData.settings);
    }
  }, [serverSettingsData]);

  useEffect(() => {
    if (rulesData?.content) {
      setRulesForm(rulesData.content);
    }
  }, [rulesData]);

  useEffect(() => {
    if (devData?.buildingCatalog?.length) {
      setBuildingKey((current) => (devData.buildingCatalog.includes(current) ? current : devData.buildingCatalog[0]));
    }
    if (devData?.researchCatalog?.length) {
      setResearchKey((current) => (devData.researchCatalog.includes(current) ? current : devData.researchCatalog[0]));
    }
    if (devData?.unitCatalog?.length) {
      setUnitId((current) => (devData.unitCatalog.includes(current) ? current : devData.unitCatalog[0]));
    }
  }, [devData]);

  const activeUsers = useMemo(() => usersData?.users || [], [usersData]);

  const invalidateAdmin = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
    queryClient.invalidateQueries({ queryKey: ["admin-server-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-rules-content"] });
    queryClient.invalidateQueries({ queryKey: ["admin-developer-shortcuts"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "muted" | "banned" }) =>
      fetchJson(`/api/admin/users/${userId}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => invalidateAdmin(),
    onError: (error: Error) => toast({ title: "User update failed", description: error.message, variant: "destructive" }),
  });

  const serverSettingsMutation = useMutation({
    mutationFn: (payload: ServerSettings) =>
      fetchJson("/api/admin/server-settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Server settings saved", description: "Imported OGameX server settings were updated." });
    },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const rulesMutation = useMutation({
    mutationFn: (payload: RulesContent) =>
      fetchJson("/api/admin/rules-content", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Rules content saved", description: "Rules, legal, privacy, terms, and contact text updated." });
    },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const shortcutMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, {
        method: "POST",
        body: JSON.stringify(payload || {}),
      }),
    onSuccess: (_payload, variables) => {
      invalidateAdmin();
      if (variables.url.includes("impersonate") || variables.url.includes("stop-impersonation")) {
        window.location.reload();
        return;
      }
      toast({ title: "Developer shortcut applied", description: "Admin action executed successfully." });
    },
    onError: (error: Error) => toast({ title: "Shortcut failed", description: error.message, variant: "destructive" }),
  });

  const operationsMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, {
        method: "POST",
        body: JSON.stringify(payload || {}),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Operation queued", description: "Administrative operation was accepted." });
    },
    onError: (error: Error) => toast({ title: "Operation failed", description: error.message, variant: "destructive" }),
  });

  if (meLoading) {
    return (
      <GameLayout>
        <div className="p-6 text-slate-500">Loading admin control systems...</div>
      </GameLayout>
    );
  }

  if (!meData?.isAdmin) {
    return (
      <GameLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-600" /> Admin Control Locked
            </h2>
            <p className="text-muted-foreground">This route requires an administrator session.</p>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle>Administrator login required</CardTitle>
              <CardDescription>
                Use the dedicated admin sign-in route to authenticate with an administrator account before entering this panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild className="bg-red-600 hover:bg-red-500">
                <a href="/admin-login">Open Admin Login</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/">Return to Title Page</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 text-xs">Admin Control</Badge>
            <Badge variant="outline" className="uppercase tracking-widest px-3 py-1 text-xs">
              {meData.role || "admin"}
            </Badge>
            {devData?.masqueradingAsUserId ? (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                Impersonating {devData.masqueradingAsUserId}
              </Badge>
            ) : null}
          </div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" /> OGameX Admin Control Integration
          </h2>
          <p className="text-muted-foreground">
            Unified admin panel with imported server settings, rules editors, moderation, operations, and developer shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Users</div><div className="text-2xl font-bold">{overviewData?.totalUsers ?? 0}</div></div><Users className="w-6 h-6 text-blue-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Active</div><div className="text-2xl font-bold">{overviewData?.activeUsersEstimate ?? 0}</div></div><Activity className="w-6 h-6 text-emerald-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Muted</div><div className="text-2xl font-bold">{overviewData?.mutedUsers ?? 0}</div></div><Lock className="w-6 h-6 text-amber-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Banned</div><div className="text-2xl font-bold">{overviewData?.bannedUsers ?? 0}</div></div><Ban className="w-6 h-6 text-red-500" /></CardContent></Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start h-auto flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="server">Server Settings</TabsTrigger>
            <TabsTrigger value="rules">Rules & Legal</TabsTrigger>
            <TabsTrigger value="developer">Developer Shortcuts</TabsTrigger>
            <TabsTrigger value="logs">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Control Status</CardTitle>
                  <CardDescription>Live administrator session and imported server controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="font-semibold">Maintenance Mode</div>
                      <div className="text-sm text-slate-500">Lock gameplay while administrators perform maintenance.</div>
                    </div>
                    <Switch
                      checked={serverForm.maintenanceMode}
                      onCheckedChange={(checked) => setServerForm((prev) => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="font-semibold">Peace Mode</div>
                      <div className="text-sm text-slate-500">Disable hostile tempo while systems are stabilized.</div>
                    </div>
                    <Switch
                      checked={serverForm.peaceMode}
                      onCheckedChange={(checked) => setServerForm((prev) => ({ ...prev, peaceMode: checked }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><div className="text-xs uppercase text-slate-500">Universe</div><div className="font-semibold">{serverForm.universeName}</div></div>
                    <div><div className="text-xs uppercase text-slate-500">Economy</div><div className="font-semibold">{serverForm.economySpeed}x</div></div>
                    <div><div className="text-xs uppercase text-slate-500">Research</div><div className="font-semibold">{serverForm.researchSpeed}x</div></div>
                  </div>
                  <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Apply Server Toggles
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>Administrative operations and server workflow controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/backup" })}>Create Backup</Button>
                    <Button variant="outline" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/restart" })}>Queue Restart</Button>
                    <Button variant="destructive" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/reset-universe", payload: { confirmText: "RESET" } })}>Reset Universe</Button>
                  </div>
                  <div className="space-y-2">
                    {(operationsData?.operations || []).map((operation) => (
                      <div key={operation.id} className="border rounded-lg p-3">
                        <div className="font-semibold">{operation.type}</div>
                        <div className="text-xs text-slate-500">{operation.status} · {new Date(operation.requestedAt).toLocaleString()}</div>
                        {operation.notes ? <div className="text-sm text-slate-600 mt-1">{operation.notes}</div> : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User and Admin Accounts</CardTitle>
                <CardDescription>Moderation and access visibility across player and admin accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold mb-2">Admin Accounts</div>
                    <div className="space-y-2">
                      {(accountsData?.accounts || []).map((account) => (
                        <div key={account.id} className="border rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{account.username}</div>
                            <div className="text-xs text-slate-500">{account.email} · {account.role}</div>
                          </div>
                          <Badge variant="outline">{account.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Player Accounts</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeUsers.slice(0, 12).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </TableCell>
                            <TableCell><Badge variant="outline">{user.status}</Badge></TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ userId: user.id, status: user.status === "muted" ? "active" : "muted" })}>Mute</Button>
                              <Button size="sm" variant="destructive" onClick={() => statusMutation.mutate({ userId: user.id, status: user.status === "banned" ? "active" : "banned" })}>Ban</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="server" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Imported OGameX Server Settings</CardTitle>
                <CardDescription>Universe, economy, battle, expedition, and galaxy configuration mirrored into the new backend.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    ["universeName", "Universe Name"],
                    ["economySpeed", "Economy Speed"],
                    ["researchSpeed", "Research Speed"],
                    ["fleetSpeedWar", "War Fleet Speed"],
                    ["fleetSpeedHolding", "Holding Fleet Speed"],
                    ["fleetSpeedPeaceful", "Peaceful Fleet Speed"],
                    ["planetFieldsBonus", "Planet Fields Bonus"],
                    ["registrationPlanetAmount", "Registration Planets"],
                    ["darkMatterBonus", "Dark Matter Bonus"],
                    ["defenseRepairRate", "Defense Repair Rate"],
                    ["numberOfGalaxies", "Galaxies"],
                    ["systemsPerGalaxy", "Systems per Galaxy"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <div className="text-sm font-medium mb-1">{label}</div>
                      <Input
                        value={String(serverForm[key as keyof ServerSettings])}
                        onChange={(event) =>
                          setServerForm((prev) => ({
                            ...prev,
                            [key]: key === "universeName" ? event.target.value : Number(event.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    ["darkMatterRegenEnabled", "Dark Matter Regen"],
                    ["allianceCombatSystemOn", "Alliance Combat"],
                    ["debrisFieldDeuteriumOn", "Deuterium Debris"],
                    ["rapidFireEnabled", "Rapid Fire"],
                    ["highscoreAdminVisible", "Show Admins in Highscore"],
                    ["allowNewRegistrations", "Allow Registrations"],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="font-medium">{label}</div>
                      <Switch
                        checked={Boolean(serverForm[key as keyof ServerSettings])}
                        onCheckedChange={(checked) =>
                          setServerForm((prev) => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending}>
                  <Server className="w-4 h-4 mr-2" /> Save Server Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rules, Legal, Privacy, and Contact</CardTitle>
                <CardDescription>Editable policy content based on the OGameX admin legal editor layout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["rulesContent", "Rules"],
                  ["legalContent", "Legal"],
                  ["privacyPolicyContent", "Privacy Policy"],
                  ["termsContent", "Terms & Conditions"],
                  ["contactContent", "Contact"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <div className="font-medium mb-2">{label}</div>
                    <Textarea
                      value={rulesForm[key as keyof RulesContent]}
                      onChange={(event) => setRulesForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      className="min-h-32"
                    />
                  </div>
                ))}
                <Button onClick={() => rulesMutation.mutate(rulesForm)} disabled={rulesMutation.isPending}>
                  <Database className="w-4 h-4 mr-2" /> Save Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developer" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Target Player</CardTitle>
                  <CardDescription>Choose a player by username, email, or user id for developer shortcut actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={targetIdentifier} onChange={(event) => setTargetIdentifier(event.target.value)} placeholder="player username, email, or user id" />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/impersonate", payload: { identifier: targetIdentifier } })} disabled={!targetIdentifier}>
                      <Users className="w-4 h-4 mr-2" /> Impersonate
                    </Button>
                    <Button variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/stop-impersonation" })}>
                      Restore Admin
                    </Button>
                    {(devData?.presets || []).map((preset) => (
                      <Button key={preset.id} variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/apply-preset", payload: { identifier: targetIdentifier, preset: preset.id } })} disabled={!targetIdentifier}>
                        <Wand2 className="w-4 h-4 mr-2" /> {preset.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Grants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(resourceForm).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm font-medium mb-1">{key}</div>
                          <Input value={value} onChange={(event) => setResourceForm((prev) => ({ ...prev, [key]: event.target.value }))} />
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => shortcutMutation.mutate({
                        url: "/api/admin/developer-shortcuts/grant-resources",
                        payload: { identifier: targetIdentifier, resources: resourceForm },
                      })}
                      disabled={!targetIdentifier}
                    >
                      Grant Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>State Editors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Building Key</div><Input value={buildingKey} onChange={(event) => setBuildingKey(event.target.value)} list="building-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Level</div><Input value={buildingLevel} onChange={(event) => setBuildingLevel(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/set-building-level", payload: { identifier: targetIdentifier, buildingKey, level: buildingLevel } })} disabled={!targetIdentifier}>Set Building</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Research Key</div><Input value={researchKey} onChange={(event) => setResearchKey(event.target.value)} list="research-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Level</div><Input value={researchLevel} onChange={(event) => setResearchLevel(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/set-research-level", payload: { identifier: targetIdentifier, researchKey, level: researchLevel } })} disabled={!targetIdentifier}>Set Research</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Unit Id</div><Input value={unitId} onChange={(event) => setUnitId(event.target.value)} list="unit-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Amount</div><Input value={unitAmount} onChange={(event) => setUnitAmount(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/add-unit", payload: { identifier: targetIdentifier, unitId, amount: unitAmount } })} disabled={!targetIdentifier}>Add Unit</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["resources", "units", "buildings", "research"].map((scope) => (
                        <Button key={scope} variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/reset-player", payload: { identifier: targetIdentifier, scope } })} disabled={!targetIdentifier}>
                          Reset {scope}
                        </Button>
                      ))}
                    </div>
                    <datalist id="building-catalog">{(devData?.buildingCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                    <datalist id="research-catalog">{(devData?.researchCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                    <datalist id="unit-catalog">{(devData?.unitCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>World Object Tools</CardTitle>
                    <CardDescription>Create or delete planets, moons, and debris markers at coordinates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input value={worldType} onChange={(event) => setWorldType(event.target.value as "planet" | "moon" | "debris")} placeholder="planet" />
                      <Input value={worldCoordinates} onChange={(event) => setWorldCoordinates(event.target.value)} placeholder="1:1:1" />
                      <Input value={worldName} onChange={(event) => setWorldName(event.target.value)} placeholder="object name" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/world-object", payload: { action: "create", type: worldType, coordinates: worldCoordinates, name: worldName } })}>
                        Create
                      </Button>
                      <Button variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/world-object", payload: { action: "delete", type: worldType, coordinates: worldCoordinates, name: worldName } })}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Shortcut Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(devData?.recentActions || []).slice(0, 8).map((entry, index) => (
                      <div key={`${entry}-${index}`} className="border rounded-lg p-2 text-sm text-slate-700">{entry}</div>
                    ))}
                    {(devData?.worldObjects || []).slice(0, 8).map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-2 text-sm">
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-xs text-slate-500">{entry.type} · {entry.coordinates}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Administrative actions and imported control operations.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(auditData?.logs || []).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell className="text-xs text-slate-500">{log.targetUserId || "-"}</TableCell>
                        <TableCell className="text-sm text-slate-600">{log.details || "-"}</TableCell>
                      </TableRow>
                    ))}
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
