import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Lock, CheckCircle, Clock, Zap, Lightbulb, Users, Cog } from "lucide-react";

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

const areaIcons = {
  physics: Lightbulb,
  society: Users,
  engineering: Cog
};

export default function TechnologyTree() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [expandedTech, setExpandedTech] = useState<string | null>(null);

  const { data: areasData = {} } = useQuery({
    queryKey: ["research-areas"],
    queryFn: () => fetch("/api/research/areas").then(r => r.json()).catch(() => ({})),
  });

  const areas = Array.isArray(areasData) ? areasData : areasData.areas || [];

  const { data: subcategoriesData = [] } = useQuery({
    queryKey: ["research-subcategories", selectedArea],
    queryFn: () =>
      selectedArea
        ? fetch(`/api/research/subcategories?areaId=${selectedArea}`).then(r => r.json()).catch(() => [])
        : Promise.resolve([]),
    enabled: !!selectedArea,
  });

  const subcategories = Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.subcategories || [];

  const { data: technologiesData = [] } = useQuery({
    queryKey: ["research-technologies", subcategories],
    queryFn: () =>
      subcategories.length > 0
        ? fetch(`/api/research/technologies?subcategoryIds=${subcategories.map((s: any) => s.id).join(",")}`).then(r => r.json()).catch(() => [])
        : Promise.resolve([]),
    enabled: subcategories.length > 0,
  });

  const technologies = Array.isArray(technologiesData) ? technologiesData : technologiesData.technologies || [];

  const { data: playerProgress = {} } = useQuery({
    queryKey: ["player-research-progress"],
    queryFn: () => fetch("/api/research/progress").then(r => r.json()).catch(() => ({})),
  });

  const techsByCategory = useMemo(() => {
    const map: Record<string, ResearchTechnology[]> = {};
    subcategories.forEach((sub: ResearchSubcategory) => {
      map[sub.id] = technologies.filter((t: ResearchTechnology) => t.subcategoryId === sub.id);
    });
    return map;
  }, [technologies, subcategories]);

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

  const getTierColor = (tier: number) => {
    const colors = ["bg-slate-600", "bg-blue-600", "bg-purple-600", "bg-pink-600", "bg-yellow-600"];
    return colors[Math.min(tier - 1, colors.length - 1)];
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const currentArea = areas.find((a: ResearchArea) => a.id === selectedArea);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-400" />
            Stellaris Technology Tree
          </h1>
          <p className="text-slate-300">Master advanced technologies across Physics, Society, and Engineering disciplines</p>
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {areas.map((area: ResearchArea) => {
            const AreaIcon = areaIcons[area.areaKey as keyof typeof areaIcons] || Cog;
            return (
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
                    <AreaIcon className="w-5 h-5" />
                    {area.areaName}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">{area.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technologies Grid */}
        {selectedArea && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{currentArea?.areaName || "Technologies"}</h2>

            {subcategories.length > 0 && (
              <Tabs defaultValue={subcategories[0]?.id} className="w-full">
                <TabsList className="bg-slate-700 border border-slate-600 mb-6 flex flex-wrap">
                  {subcategories.map((sub: ResearchSubcategory) => (
                    <TabsTrigger
                      key={sub.id}
                      value={sub.id}
                      className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      {sub.categoryName}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {subcategories.map((sub: ResearchSubcategory) => (
                  <TabsContent key={sub.id} value={sub.id}>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-sm mb-4">{sub.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(techsByCategory[sub.id] || []).map((tech: ResearchTechnology) => {
                          const progress = playerProgress[tech.id] || { status: "locked", progress: 0 };
                          const isExpanded = expandedTech === tech.id;

                          return (
                            <Card
                              key={tech.id}
                              className="bg-slate-700 border-slate-600 hover:border-blue-400 transition-all cursor-pointer"
                              onClick={() => setExpandedTech(isExpanded ? null : tech.id)}
                              data-testid={`tech-card-${tech.techKey}`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(progress.status)}
                                    <CardTitle className="text-white text-base">{tech.techName}</CardTitle>
                                  </div>
                                  <Badge className={`${getTierColor(tech.tier)} text-white border-0`}>
                                    T{tech.tier}
                                  </Badge>
                                </div>
                                <CardDescription className="text-slate-400 text-xs">{tech.description}</CardDescription>
                              </CardHeader>

                              <CardContent className="space-y-3">
                                {/* Quick Info */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-slate-600 p-2 rounded">
                                    <p className="text-slate-400">Time</p>
                                    <p className="text-blue-300 font-bold">{formatTime(tech.researchTime)}</p>
                                  </div>
                                  <div className="bg-slate-600 p-2 rounded">
                                    <p className="text-slate-400">Status</p>
                                    <p className="text-yellow-300 font-bold capitalize">{progress.status}</p>
                                  </div>
                                </div>

                                {progress.status === "in_progress" && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                      <span>Progress</span>
                                      <span>{Math.round(progress.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                                        style={{ width: `${progress.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Expandable Details */}
                                {isExpanded && (
                                  <div className="space-y-3 border-t border-slate-600 pt-3">
                                    {/* Costs */}
                                    <div>
                                      <p className="text-slate-400 font-semibold text-xs mb-2">RESEARCH COST</p>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        {Object.entries(tech.cost).map(([resource, amount]) => (
                                          <div key={resource} className="bg-slate-600 p-2 rounded">
                                            <p className="text-slate-400 capitalize">{resource}</p>
                                            <p className="text-emerald-400 font-bold">{amount}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Bonuses */}
                                    {Object.keys(tech.bonuses).length > 0 && (
                                      <div>
                                        <p className="text-slate-400 font-semibold text-xs mb-2">BONUSES</p>
                                        <div className="space-y-1">
                                          {Object.entries(tech.bonuses).map(([bonus, value]) => (
                                            <div key={bonus} className="flex justify-between text-xs">
                                              <span className="text-slate-300 capitalize">{bonus.replace(/_/g, " ")}:</span>
                                              <span className="text-green-400 font-bold">
                                                {typeof value === "number" && value < 1
                                                  ? `+${Math.round(value * 100)}%`
                                                  : `+${value}`}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Prerequisites */}
                                    {tech.prerequisites.length > 0 && (
                                      <div>
                                        <p className="text-slate-400 font-semibold text-xs mb-2">PREREQUISITES</p>
                                        <div className="space-y-1">
                                          {tech.prerequisites.map((prereq) => (
                                            <p key={prereq} className="text-xs text-blue-300">{prereq}</p>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Unlocks */}
                                    {tech.unlocks.length > 0 && (
                                      <div>
                                        <p className="text-slate-400 font-semibold text-xs mb-2">UNLOCKS</p>
                                        <div className="space-y-1">
                                          {tech.unlocks.map((unlock) => (
                                            <p key={unlock} className="text-xs text-purple-300">{unlock}</p>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Status Badge */}
                                <div className="pt-2">
                                  <Badge className={`${getStatusColor(progress.status)} border w-full justify-center`}>
                                    {progress.status === "completed"
                                      ? "✓ Researched"
                                      : progress.status === "in_progress"
                                      ? "⏳ In Progress"
                                      : progress.status === "available"
                                      ? "⚡ Available"
                                      : "🔒 Locked"}
                                  </Badge>
                                </div>

                                <Button
                                  disabled={progress.status === "locked" || progress.status === "completed"}
                                  className={`w-full mt-2 ${
                                    progress.status === "completed"
                                      ? "bg-green-600 hover:bg-green-600 cursor-default"
                                      : progress.status === "in_progress"
                                      ? "bg-blue-600 hover:bg-blue-600 cursor-default"
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

                                {!isExpanded && (
                                  <p className="text-xs text-slate-500 text-center cursor-pointer hover:text-slate-400">
                                    Click to expand details
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
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
