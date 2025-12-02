import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Compass, Ship, Users, MapPin, Zap, Shield } from "lucide-react";

interface Expedition {
  id: string;
  name: string;
  type: string;
  targetCoordinates: string;
  status: string;
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
  discoveries: any[];
  casualties: Record<string, number>;
  resources: Record<string, number>;
  startedAt: string;
  completedAt?: string;
}

interface ExpeditionTeam {
  id: string;
  unitId: string;
  role: string;
  status: string;
  health: number;
  experience: number;
}

interface ExpeditionEncounter {
  id: string;
  encounterType: string;
  description: string;
  rewards: Record<string, any>;
  losses: Record<string, any>;
  resolvedAt?: string;
}

export default function Expeditions() {
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
  const [newExpName, setNewExpName] = useState("");
  const [newExpType, setNewExpType] = useState("exploration");

  const { data: expeditionsData = {}, refetch } = useQuery({
    queryKey: ["expeditions"],
    queryFn: () => fetch("/api/expeditions").then(r => r.json()).catch(() => ({})),
  });
  
  const expeditions = Array.isArray(expeditionsData) ? expeditionsData : expeditionsData.expeditions || [];

  const { data: selectedTeam = [] } = useQuery({
    queryKey: ["expedition-team", selectedExpedition],
    queryFn: () =>
      selectedExpedition
        ? fetch(`/api/expeditions/${selectedExpedition}/team`).then(r => r.json())
        : Promise.resolve([]),
    enabled: !!selectedExpedition,
  });

  const { data: selectedEncounters = [] } = useQuery({
    queryKey: ["expedition-encounters", selectedExpedition],
    queryFn: () =>
      selectedExpedition
        ? fetch(`/api/expeditions/${selectedExpedition}/encounters`).then(r => r.json())
        : Promise.resolve([]),
    enabled: !!selectedExpedition,
  });

  const createExpeditionMutation = useMutation({
    mutationFn: (data: any) => fetch("/api/expeditions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => {
      refetch();
      setNewExpName("");
      setNewExpType("exploration");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 text-white";
      case "in_progress":
        return "bg-blue-600 text-white";
      case "preparing":
        return "bg-yellow-600 text-white";
      case "failed":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exploration":
        return <Compass className="w-4 h-4" />;
      case "military":
        return <Shield className="w-4 h-4" />;
      case "trade":
        return <Zap className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Ship className="w-8 h-8 text-blue-400" />
            Expeditions
          </h1>
          <p className="text-slate-300">Send fleets and troops to explore worlds and conquer interstellar objects</p>
        </div>

        {/* Create New Expedition */}
        <Card className="bg-slate-700 border-slate-600 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Launch New Expedition</CardTitle>
            <CardDescription>Assemble your forces for a new mission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Expedition name"
                value={newExpName}
                onChange={(e) => setNewExpName(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                data-testid="input-exp-name"
              />
              <select
                value={newExpType}
                onChange={(e) => setNewExpType(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
                data-testid="select-exp-type"
              >
                <option value="exploration">Exploration</option>
                <option value="military">Military</option>
                <option value="scientific">Scientific</option>
                <option value="trade">Trade</option>
                <option value="conquest">Conquest</option>
              </select>
              <Input
                placeholder="Target coordinates (e.g. [1:2:3])"
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                data-testid="input-exp-coords"
              />
              <Button
                onClick={() =>
                  createExpeditionMutation.mutate({
                    name: newExpName,
                    type: newExpType,
                    targetCoordinates: "[1:1:1]",
                    fleetComposition: { corvettes: 5, destroyers: 2 },
                    troopComposition: { soldiers: 100, scouts: 20 },
                  })
                }
                disabled={!newExpName}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-create-expedition"
              >
                Launch Expedition
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expeditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {expeditions.map((expedition: Expedition) => (
            <Card
              key={expedition.id}
              className={`bg-slate-700 border-slate-600 cursor-pointer transition-all ${
                selectedExpedition === expedition.id ? "ring-2 ring-blue-400" : "hover:border-blue-400"
              }`}
              onClick={() => setSelectedExpedition(expedition.id)}
              data-testid={`expedition-card-${expedition.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {getTypeIcon(expedition.type)}
                    {expedition.name}
                  </CardTitle>
                  <Badge className={getStatusColor(expedition.status)}>
                    {expedition.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-600 p-2 rounded">
                    <p className="text-slate-400">Target</p>
                    <p className="text-blue-300 font-bold">{expedition.targetCoordinates}</p>
                  </div>
                  <div className="bg-slate-600 p-2 rounded">
                    <p className="text-slate-400">Type</p>
                    <p className="text-purple-300 font-bold capitalize">{expedition.type}</p>
                  </div>
                </div>

                {/* Fleet */}
                <div className="bg-slate-600 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Ship className="w-4 h-4 text-blue-400" />
                    <p className="text-slate-300 text-sm font-semibold">Fleet</p>
                  </div>
                  <div className="text-xs space-y-1">
                    {Object.entries(expedition.fleetComposition).map(([ship, count]) => (
                      <div key={ship} className="flex justify-between text-slate-300">
                        <span className="capitalize">{ship}</span>
                        <span className="text-blue-400">×{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Troops */}
                <div className="bg-slate-600 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <p className="text-slate-300 text-sm font-semibold">Troops</p>
                  </div>
                  <div className="text-xs space-y-1">
                    {Object.entries(expedition.troopComposition).map(([troop, count]) => (
                      <div key={troop} className="flex justify-between text-slate-300">
                        <span className="capitalize">{troop}</span>
                        <span className="text-green-400">×{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discoveries */}
                {expedition.discoveries.length > 0 && (
                  <div className="bg-green-600 bg-opacity-20 border border-green-600 p-2 rounded text-sm">
                    <p className="text-green-300 font-semibold">{expedition.discoveries.length} Discoveries!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details Tab */}
        {selectedExpedition && (
          <div className="space-y-6">
            <Tabs defaultValue="team" className="w-full">
              <TabsList className="bg-slate-700 border border-slate-600">
                <TabsTrigger value="team" className="text-slate-300 data-[state=active]:bg-blue-600">
                  Team ({selectedTeam.length})
                </TabsTrigger>
                <TabsTrigger value="encounters" className="text-slate-300 data-[state=active]:bg-blue-600">
                  Encounters ({selectedEncounters.length})
                </TabsTrigger>
                <TabsTrigger value="log" className="text-slate-300 data-[state=active]:bg-blue-600">
                  Event Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="team">
                <Card className="bg-slate-700 border-slate-600 mt-4">
                  <CardHeader>
                    <CardTitle className="text-white">Expedition Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTeam.length > 0 ? (
                        selectedTeam.map((member: ExpeditionTeam) => (
                          <div key={member.id} className="bg-slate-600 p-3 rounded flex justify-between items-center">
                            <div>
                              <p className="text-white font-semibold text-sm">Unit {member.unitId.slice(0, 8)}</p>
                              <p className="text-slate-400 text-xs capitalize">{member.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 text-sm font-bold">{member.health}% Health</p>
                              <p className="text-yellow-400 text-xs">XP: {member.experience}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No team members assigned yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="encounters">
                <Card className="bg-slate-700 border-slate-600 mt-4">
                  <CardHeader>
                    <CardTitle className="text-white">Encounters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEncounters.length > 0 ? (
                        selectedEncounters.map((encounter: ExpeditionEncounter) => (
                          <div key={encounter.id} className="bg-slate-600 p-3 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-blue-600 text-white capitalize">
                                {encounter.encounterType}
                              </Badge>
                              {encounter.resolvedAt && (
                                <p className="text-green-400 text-xs">✓ Resolved</p>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{encounter.description}</p>
                            {Object.keys(encounter.rewards).length > 0 && (
                              <p className="text-green-400 text-xs">
                                Rewards: {JSON.stringify(encounter.rewards)}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No encounters recorded</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="log">
                <Card className="bg-slate-700 border-slate-600 mt-4">
                  <CardHeader>
                    <CardTitle className="text-white">Mission Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm">Event log for this expedition will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
