import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Lock, CheckCircle, Clock, Zap } from "lucide-react";

interface ResearchArea {
  id: string;
  areaKey: string;
  areaName: string;
  description: string;
  color: string;
}

interface ResearchSubcategory {
  id: string;
  areaId: string;
  categoryKey: string;
  categoryName: string;
  description: string;
}

interface ResearchTechnology {
  id: string;
  subcategoryId: string;
  techKey: string;
  techName: string;
  description: string;
  tier: number;
  researchTime: number;
  cost: Record<string, number>;
  prerequisites: string[];
  unlocks: string[];
  bonuses: Record<string, any>;
}

interface PlayerProgress {
  technologyId: string;
  status: "locked" | "available" | "in_progress" | "completed";
  progress: number;
  startedAt?: string;
  completedAt?: string;
}

export default function TechnologyTree() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const { data: areas = [] } = useQuery({
    queryKey: ["research-areas"],
    queryFn: () => fetch("/api/research/areas").then(r => r.json()),
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["research-subcategories", selectedArea],
    queryFn: () =>
      selectedArea
        ? fetch(`/api/research/subcategories?areaId=${selectedArea}`).then(r => r.json())
        : Promise.resolve([]),
    enabled: !!selectedArea,
  });

  const { data: technologies = [] } = useQuery({
    queryKey: ["research-technologies", subcategories],
    queryFn: () =>
      subcategories.length > 0
        ? fetch(`/api/research/technologies?subcategoryIds=${subcategories.map((s: any) => s.id).join(",")}`).then(r => r.json())
        : Promise.resolve([]),
    enabled: subcategories.length > 0,
  });

  const { data: playerProgress = {} } = useQuery({
    queryKey: ["player-research-progress"],
    queryFn: () => fetch("/api/research/progress").then(r => r.json()),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "available":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <Lock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "available":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-400" />
            Technology Tree
          </h1>
          <p className="text-slate-300">Research and unlock advanced technologies across three research paths</p>
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {areas.map((area: ResearchArea) => (
            <Card
              key={area.id}
              className={`cursor-pointer transition-all ${
                selectedArea === area.id
                  ? "bg-blue-600 border-blue-400 ring-2 ring-blue-300"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600"
              }`}
              onClick={() => setSelectedArea(area.id)}
              data-testid={`area-card-${area.areaKey}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  {area.areaName}
                  <ChevronRight className="w-4 h-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technologies Grid */}
        {selectedArea && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {areas.find((a: ResearchArea) => a.id === selectedArea)?.areaName || "Technologies"}
            </h2>

            {subcategories.length > 0 && (
              <Tabs defaultValue={subcategories[0]?.id} className="w-full">
                <TabsList className="bg-slate-700 border border-slate-600">
                  {subcategories.map((sub: ResearchSubcategory) => (
                    <TabsTrigger key={sub.id} value={sub.id} className="text-slate-300 data-[state=active]:bg-blue-600">
                      {sub.categoryName}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {subcategories.map((sub: ResearchSubcategory) => (
                  <TabsContent key={sub.id} value={sub.id}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {technologies
                        .filter((tech: ResearchTechnology) => tech.subcategoryId === sub.id)
                        .map((tech: ResearchTechnology) => {
                          const progress = playerProgress[tech.id] || { status: "locked", progress: 0 };
                          return (
                            <Card
                              key={tech.id}
                              className="bg-slate-700 border-slate-600 hover:border-blue-400 transition-all"
                              data-testid={`tech-card-${tech.techKey}`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <CardTitle className="text-white text-base flex items-center gap-2">
                                      {getStatusIcon(progress.status)}
                                      {tech.techName}
                                    </CardTitle>
                                  </div>
                                  <Badge className={`${getStatusColor(progress.status)} border`}>
                                    Tier {tech.tier}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-slate-300">{tech.description}</p>

                                {progress.status === "in_progress" && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                      <span>Progress</span>
                                      <span>{Math.round(progress.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                        style={{ width: `${progress.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Costs */}
                                <div className="text-xs space-y-1">
                                  <p className="text-slate-400 font-semibold">Costs:</p>
                                  {Object.entries(tech.cost).map(([resource, amount]) => (
                                    <p key={resource} className="text-slate-300 flex justify-between">
                                      <span className="capitalize">{resource}:</span>
                                      <span className="text-blue-400">{amount}</span>
                                    </p>
                                  ))}
                                  <p className="text-slate-300 flex justify-between mt-2">
                                    <span>Time:</span>
                                    <span className="text-blue-400">{Math.round(tech.researchTime / 60)}m</span>
                                  </p>
                                </div>

                                {/* Bonuses */}
                                {Object.keys(tech.bonuses).length > 0 && (
                                  <div className="text-xs space-y-1">
                                    <p className="text-slate-400 font-semibold">Bonuses:</p>
                                    {Object.entries(tech.bonuses).map(([bonus, value]) => (
                                      <p key={bonus} className="text-green-400 flex justify-between">
                                        <span className="capitalize">{bonus}:</span>
                                        <span>+{value}</span>
                                      </p>
                                    ))}
                                  </div>
                                )}

                                <Button
                                  disabled={progress.status === "locked" || progress.status === "completed"}
                                  className={`w-full mt-2 ${
                                    progress.status === "completed"
                                      ? "bg-green-600 hover:bg-green-600"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                  data-testid={`research-btn-${tech.techKey}`}
                                >
                                  {progress.status === "completed"
                                    ? "Researched"
                                    : progress.status === "in_progress"
                                    ? "In Progress"
                                    : "Start Research"}
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
