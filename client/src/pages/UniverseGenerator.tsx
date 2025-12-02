import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Zap, 
  Droplets, 
  Flame,
  MapPin,
  RefreshCw,
  Scan,
  Maximize2,
  Moon,
  Activity
} from "lucide-react";
import { useState } from "react";
import { generateSystem, generateGalaxy, CelestialObject, Habitability } from "@/lib/universeSeed";

function getHabitabilityColor(habitability: Habitability | undefined): string {
  switch (habitability) {
    case "ideal": return "text-green-600";
    case "adequate": return "text-blue-600";
    case "marginal": return "text-yellow-600";
    case "barren": return "text-slate-600";
    case "hostile": return "text-red-600";
    default: return "text-slate-500";
  }
}

function getPlanetClassColor(planetClass: string): string {
  const colors: Record<string, string> = {
    M: "bg-blue-500",
    G: "bg-amber-400",
    D: "bg-slate-400",
    R: "bg-orange-600",
    V: "bg-yellow-500",
    T: "bg-cyan-500",
    A: "bg-gray-300",
    K: "bg-purple-500",
    J: "bg-orange-200",
    I: "bg-blue-300"
  };
  return colors[planetClass] || "bg-slate-400";
}

export default function UniverseGenerator() {
  const [galaxyX, setGalaxyX] = useState(1);
  const [galaxyY, setGalaxyY] = useState(1);
  const [galaxyZ, setGalaxyZ] = useState(1);
  const [systemX, setSystemX] = useState(0);
  const [systemY, setSystemY] = useState(0);
  const [systemZ, setSystemZ] = useState(0);
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSystem = () => {
    setLoading(true);
    setTimeout(() => {
      const coords = { x: systemX, y: systemY, z: systemZ };
      const generated = generateSystem(coords);
      setObjects(generated);
      setLoading(false);
    }, 100);
  };

  const handleGenerateGalaxy = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateGalaxy(galaxyX, galaxyY, galaxyZ);
      setObjects(generated);
      setLoading(false);
    }, 500);
  };

  const planets = objects.filter(obj => obj.type === "planet");
  const moons = objects.filter(obj => obj.type === "moon");
  const asteroids = objects.filter(obj => obj.type === "asteroid");
  const stars = objects.filter(obj => obj.type === "star");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Universe Generator</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Procedurally generate entire star systems and galaxies with deterministic seeding.</p>
        </div>

        {/* Generation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* System Generator */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Generate System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">X Coordinate</label>
                  <Input
                    type="number"
                    value={systemX}
                    onChange={(e) => setSystemX(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-system-x"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Y Coordinate</label>
                  <Input
                    type="number"
                    value={systemY}
                    onChange={(e) => setSystemY(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-system-y"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Z Coordinate</label>
                  <Input
                    type="number"
                    value={systemZ}
                    onChange={(e) => setSystemZ(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-system-z"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerateSystem}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="button-generate-system"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
                Generate System
              </Button>
            </CardContent>
          </Card>

          {/* Galaxy Generator */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                Generate Galaxy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy X</label>
                  <Input
                    type="number"
                    value={galaxyX}
                    onChange={(e) => setGalaxyX(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-galaxy-x"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy Y</label>
                  <Input
                    type="number"
                    value={galaxyY}
                    onChange={(e) => setGalaxyY(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-galaxy-y"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Galaxy Z</label>
                  <Input
                    type="number"
                    value={galaxyZ}
                    onChange={(e) => setGalaxyZ(parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    data-testid="input-galaxy-z"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerateGalaxy}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
                data-testid="button-generate-galaxy"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                Generate Galaxy (Slow)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {objects.length > 0 && (
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Generation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{stars.length}</p>
                  <p className="text-xs text-slate-600 uppercase">Stars</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{planets.length}</p>
                  <p className="text-xs text-slate-600 uppercase">Planets</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-600">{moons.length}</p>
                  <p className="text-xs text-slate-600 uppercase">Moons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{asteroids.length}</p>
                  <p className="text-xs text-slate-600 uppercase">Asteroids</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{objects.length}</p>
                  <p className="text-xs text-slate-600 uppercase">Total Objects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planets Display */}
        {planets.length > 0 && (
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Generated Planets ({planets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {planets.slice(0, 12).map((planet) => (
                  <div
                    key={planet.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300"
                    data-testid={`card-planet-${planet.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${getPlanetClassColor(planet.planetClass || "M")}`} />
                        <div>
                          <p className="font-bold text-sm text-slate-900">{planet.name}</p>
                          <p className="text-xs text-slate-500">{planet.planetClass}-Class</p>
                        </div>
                      </div>
                      <Badge className={getHabitabilityColor(planet.habitability)}>
                        {planet.habitability}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Diameter:</span>
                        <span className="font-mono font-bold">{planet.diameter?.toLocaleString()}km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Gravity:</span>
                        <span className="font-mono font-bold">{planet.gravity?.toFixed(2)}G</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Temperature:</span>
                        <span className="font-mono font-bold">{planet.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Water:</span>
                        <span className="font-mono font-bold">{planet.waterPercentage?.toFixed(1)}%</span>
                      </div>
                    </div>

                    {planet.mineralAbundance && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Zap className="w-3 h-3 text-yellow-600" />
                          <span className="font-mono">Metal: {planet.mineralAbundance.metal}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Activity className="w-3 h-3 text-blue-600" />
                          <span className="font-mono">Crystal: {planet.mineralAbundance.crystal}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Droplets className="w-3 h-3 text-cyan-600" />
                          <span className="font-mono">Deuterium: {planet.mineralAbundance.deuterium}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Asteroids Display */}
        {asteroids.length > 0 && (
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Generated Asteroids ({asteroids.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {asteroids.slice(0, 20).map((asteroid) => (
                  <div
                    key={asteroid.id}
                    className="p-3 bg-amber-50 rounded border border-amber-200 text-xs"
                    data-testid={`card-asteroid-${asteroid.id}`}
                  >
                    <p className="font-bold text-amber-900 mb-2">{asteroid.name}</p>
                    <div className="space-y-1 text-amber-800">
                      <p>Type: {asteroid.asteroidType}</p>
                      <p>Size: {asteroid.size}km</p>
                      <p>Metal: {asteroid.mineralAbundance?.metal}</p>
                      <p>Rare: {asteroid.mineralAbundance?.deuterium}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
