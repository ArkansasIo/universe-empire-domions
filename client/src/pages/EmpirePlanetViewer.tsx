import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type PlanetTypeRecord = {
  id: string;
  name: string;
  family: string;
  class: string;
  rarity: string;
  description: string;
  stats: {
    habitabilityIndex: number;
    metalRichness: number;
    crystalRichness: number;
    deuteriumRichness: number;
  };
};

type PlanetResponse = {
  count: number;
  planets: PlanetTypeRecord[];
};

type TravelStateResponse = {
  travelState: { activeRoute: any; discoveredWormholes: string[] };
  travelLog: Array<{ id: string; createdAt: string; route: any }>;
  knownPlanets: string[];
};

export default function EmpirePlanetViewer() {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  const planetsQuery = useQuery<PlanetResponse>({
    queryKey: ["planet-types"],
    queryFn: async () => {
      const res = await fetch("/api/planets/types", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load planet types");
      return res.json();
    },
  });

  const travelStateQuery = useQuery<TravelStateResponse>({
    queryKey: ["travel-player-state"],
    queryFn: async () => {
      const res = await fetch("/api/travel/player/state", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load travel state");
      return res.json();
    },
  });

  const filteredPlanets = useMemo(() => {
    const planets = planetsQuery.data?.planets || [];
    return planets.filter(p => {
      const rarityMatch = rarityFilter === "all" || p.rarity === rarityFilter;
      const classMatch = classFilter === "all" || p.class === classFilter;
      return rarityMatch && classMatch;
    });
  }, [planetsQuery.data?.planets, rarityFilter, classFilter]);

  const classes = useMemo(() => {
    const set = new Set<string>();
    (planetsQuery.data?.planets || []).forEach(p => set.add(p.class));
    return Array.from(set).sort();
  }, [planetsQuery.data?.planets]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-bold tracking-wide">Empire Planet Viewer</h1>
          <p className="text-slate-300 mt-2">
            Browse classified planet types and review your current interstellar travel state.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-sm text-slate-400">Known Planet Types</div>
            <div className="text-2xl font-semibold mt-1">{planetsQuery.data?.count ?? 0}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-sm text-slate-400">Known Planets (Player)</div>
            <div className="text-2xl font-semibold mt-1">{travelStateQuery.data?.knownPlanets?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-sm text-slate-400">Travel Log Entries</div>
            <div className="text-2xl font-semibold mt-1">{travelStateQuery.data?.travelLog?.length ?? 0}</div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap gap-3">
          <label className="text-sm">
            <span className="mr-2 text-slate-300">Rarity</span>
            <select
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1"
              value={rarityFilter}
              onChange={e => setRarityFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mr-2 text-slate-300">Class</span>
            <select
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1"
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
            >
              <option value="all">All</option>
              {classes.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPlanets.map(planet => (
            <article key={planet.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{planet.name}</h2>
                <span className="text-xs uppercase tracking-wide text-cyan-300">{planet.rarity}</span>
              </div>

              <p className="text-slate-300 text-sm mt-2 line-clamp-3">{planet.description}</p>

              <div className="mt-3 text-sm text-slate-300 space-y-1">
                <div>Family: {planet.family}</div>
                <div>Class: {planet.class}</div>
                <div>Habitability: {planet.stats.habitabilityIndex}</div>
                <div>
                  Resources M/C/D: {planet.stats.metalRichness}/{planet.stats.crystalRichness}/{planet.stats.deuteriumRichness}
                </div>
              </div>
            </article>
          ))}
        </section>

        {(planetsQuery.isLoading || travelStateQuery.isLoading) && (
          <div className="text-slate-400">Loading empire planetary intelligence...</div>
        )}
      </div>
    </div>
  );
}
