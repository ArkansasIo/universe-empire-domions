import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MEGA_STRUCTURES, getMegaStructuresByTier, MEGA_STRUCTURE_CLASSES, calculateConstructionCost } from "@/lib/megaStructures";
import { Zap, Cog, Users, Building2, TrendingUp } from "lucide-react";

export default function MegaStructures() {
  const getTierColor = (tier: number) => {
    const colors = {
      1: "bg-blue-50 border-blue-200",
      2: "bg-purple-50 border-purple-200",
      3: "bg-orange-50 border-orange-200",
      4: "bg-pink-50 border-pink-200",
      5: "bg-amber-50 border-amber-200"
    };
    return colors[tier as keyof typeof colors] || "bg-slate-50 border-slate-200";
  };

  const getTierBadgeColor = (tier: number) => {
    const colors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-purple-100 text-purple-800",
      3: "bg-orange-100 text-orange-800",
      4: "bg-pink-100 text-pink-800",
      5: "bg-amber-100 text-amber-800"
    };
    return colors[tier as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Megastructures</h1>
          <p className="text-slate-600 mt-2">Cosmic engineering marvels that reshape civilization itself</p>
        </div>

        {/* Tabs for different tiers */}
        <Tabs defaultValue="tier1" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-auto flex-wrap w-full justify-start gap-2 p-2">
            {[1, 2, 3, 4, 5].map(tier => (
              <TabsTrigger key={tier} value={`tier${tier}`} className="capitalize">
                Tier {tier}
              </TabsTrigger>
            ))}
          </TabsList>

          {[1, 2, 3, 4, 5].map(tier => (
            <TabsContent key={tier} value={`tier${tier}`} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.values(MEGA_STRUCTURES)
                  .filter(structure => structure.tier === tier)
                  .map(structure => {
                    const cost = calculateConstructionCost(structure);
                    return (
                      <Card key={structure.id} className={`border-2 ${getTierColor(tier)}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-5xl">{structure.icon}</span>
                              <div>
                                <CardTitle className="text-slate-900">{structure.name}</CardTitle>
                                <p className="text-xs text-slate-600 mt-1">{structure.type.replace(/_/g, " ").toUpperCase()}</p>
                              </div>
                            </div>
                            <Badge className={getTierBadgeColor(tier)}>
                              Tier {tier}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Description */}
                          <p className="text-sm text-slate-700">{structure.description}</p>

                          {/* Special Ability */}
                          <div className="p-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded">
                            <p className="text-xs font-bold text-amber-900 mb-1">⭐ SPECIAL ABILITY</p>
                            <p className="text-xs text-amber-800">{structure.specialAbility}</p>
                          </div>

                          {/* Main Stats */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <div>
                                <p className="text-xs text-slate-600">Energy Output</p>
                                <p className="font-bold text-slate-900">{structure.stats.energyOutput.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-slate-600">Production</p>
                                <p className="font-bold text-slate-900">+{structure.stats.productionBonus}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-slate-600">Research</p>
                                <p className="font-bold text-slate-900">+{structure.stats.researchBonus}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Users className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-slate-600">Population</p>
                                <p className="font-bold text-slate-900">{(structure.stats.populationCapacity / 1000000).toFixed(1)}M</p>
                              </div>
                            </div>
                          </div>

                          {/* Sub Stats */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-600">ATTRIBUTE BREAKDOWN</p>
                            <div className="grid grid-cols-2 gap-2">
                              {structure.subStats.map((stat, idx) => (
                                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-900">{stat.icon} {stat.name}</span>
                                    <span className="text-xs font-bold text-primary">{stat.value}</span>
                                  </div>
                                  <div className="bg-white rounded h-2 overflow-hidden">
                                    <div 
                                      className="bg-gradient-to-r from-primary to-purple-500 h-full"
                                      style={{ width: `${stat.value}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Maintenance Cost */}
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs font-bold text-red-900 mb-2">⚙️ MAINTENANCE COST (per cycle)</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-red-700">Metal:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.metal}</span></div>
                              <div><span className="text-red-700">Crystal:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.crystal}</span></div>
                              <div><span className="text-red-700">Deuterium:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.deuterium}</span></div>
                              <div><span className="text-red-700">Energy:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.energy}</span></div>
                            </div>
                          </div>

                          {/* Construction Cost */}
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs font-bold text-green-900 mb-2">📦 CONSTRUCTION COST</p>
                            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                              <div><span className="text-green-700">Metal:</span> <span className="font-bold text-green-900">{cost.metal}</span></div>
                              <div><span className="text-green-700">Crystal:</span> <span className="font-bold text-green-900">{cost.crystal}</span></div>
                              <div><span className="text-green-700">Deuterium:</span> <span className="font-bold text-green-900">{cost.deuterium}</span></div>
                            </div>
                            <p className="text-xs text-green-700">⏱️ Construction Time: {structure.stats.constructionTime.toLocaleString()} turns</p>
                          </div>

                          {/* Requirements */}
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
                            <div>
                              <p className="text-xs font-bold text-blue-900 mb-1">📚 RESEARCH REQUIRED</p>
                              <div className="flex flex-wrap gap-1">
                                {structure.researchRequired.map((tech, idx) => (
                                  <Badge key={idx} className="bg-blue-200 text-blue-800 text-xs">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-900 mb-1">🏗️ BUILDING REQUIREMENTS</p>
                              {structure.buildingRequirements.map((req, idx) => (
                                <div key={idx} className="text-xs text-blue-800">
                                  {req.name} Level {req.level}+
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button className="w-full bg-primary hover:bg-primary/90" data-testid={`button-construct-${structure.id}`}>
                            Begin Construction
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Megastructure Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Tier 1:</strong> Dyson Swarms - Basic stellar energy collection for early-game empires
            </p>
            <p>
              <strong>Tier 2:</strong> Ring Worlds - Massive habitats supporting billions of inhabitants
            </p>
            <p>
              <strong>Tier 3:</strong> Dyson Spheres & Stellar Engines - Complete stellar control and star mobility
            </p>
            <p>
              <strong>Tier 4:</strong> Matrioshka Brains - Computational megastructures for advanced civilizations (Kardashev Type II)
            </p>
            <p>
              <strong>Tier 5:</strong> Megastructure Networks - Transcendent civilizations (Kardashev Type III)
            </p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
