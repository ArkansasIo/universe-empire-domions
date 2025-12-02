import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/gameContext";
import NotFound from "@/pages/not-found";
import { Rocket } from "lucide-react";

import Overview from "@/pages/Overview";
import Resources from "@/pages/Resources";
import Facilities from "@/pages/Facilities";
import Research from "@/pages/Research";
import Shipyard from "@/pages/Shipyard";
import Fleet from "@/pages/Fleet";
import Galaxy from "@/pages/Galaxy";
import Universe from "@/pages/Universe";
import UniverseGenerator from "@/pages/UniverseGenerator";
import Commander from "@/pages/Commander";
import Government from "@/pages/Government";
import Settings from "@/pages/Settings";
import Messages from "@/pages/Messages";
import Alliance from "@/pages/Alliance";
import Artifacts from "@/pages/Artifacts";
import Interstellar from "@/pages/Interstellar";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import Market from "@/pages/Market";
import About from "@/pages/About";
import Combat from "@/pages/Combat";
import BattleLogs from "@/pages/BattleLogs";
import AccountSetup from "@/pages/AccountSetup";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import ServerConsole from "@/pages/ServerConsole";
import Exploration from "@/pages/Exploration";
import Colonies from "@/pages/Colonies";
import TechTree from "@/pages/TechTree";
import Blueprints from "@/pages/Blueprints";
import TechnologyTree from "@/pages/TechnologyTree";
import Expeditions from "@/pages/Expeditions";
import Army from "@/pages/Army";
import MegaStructures from "@/pages/MegaStructures";
import Achievements from "@/pages/Achievements";
import Factions from "@/pages/Factions";
import EmpireProgression from "@/pages/EmpireProgression";
import WarpNetwork from "@/pages/WarpNetwork";
import Stations from "@/pages/Stations";
import Merchants from "@/pages/Merchants";
import CelestialBrowser from "@/pages/CelestialBrowser";
import Diagnostics from "@/pages/Diagnostics";
import StoryMode from "@/pages/StoryMode";
import Relics from "@/pages/Relics";
import FriendsList from "@/pages/FriendsList";
import Guilds from "@/pages/Guilds";
import Raids from "@/pages/Raids";
import UniverseEvents from "@/pages/UniverseEvents";
import RaidBosses from "@/pages/RaidBosses";
import RaidFinder from "@/pages/RaidFinder";
import { useGame } from "@/lib/gameContext";

function LoadingSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden relative">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.5); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .orbit { animation: orbit 8s linear infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .fade-in { animation: fade-in 0.8s ease-out; }
        .slide-up { animation: slide-up 0.8s ease-out; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 border border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}>
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 slide-up">
          <h1 className="font-orbitron text-5xl font-bold text-white tracking-widest mb-3">
            STELLAR <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">DOMINION</span>
          </h1>
          <p className="text-slate-300 font-rajdhani text-sm tracking-widest uppercase mb-8 fade-in">
            Connecting to Nexus Command System
          </p>

          <div className="flex justify-center gap-3 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>

          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" style={{ width: '70%' }} />
          </div>

          <p className="text-slate-400 font-rajdhani text-xs">Initializing game systems...</p>
        </div>
      </div>

      <div className="absolute bottom-6 text-slate-500 text-xs font-mono z-10">
        <span className="text-blue-400">v1.0.0</span> • Production Ready
      </div>
    </div>
  );
}

function RouterContent() {
  const { isLoggedIn, needsSetup, isLoading } = useGame();

  if (isLoading) {
    return <LoadingSplash />;
  }

  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={Auth} />
      </Switch>
    );
  }

  if (needsSetup) {
    return (
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={AccountSetup} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/resources" component={Resources} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/research" component={Research} />
      <Route path="/artifacts" component={Artifacts} />
      <Route path="/shipyard" component={Shipyard} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/army" component={Army} />
      <Route path="/interstellar" component={Interstellar} />
      <Route path="/galaxy" component={Galaxy} />
      <Route path="/universe" component={Universe} />
      <Route path="/universe-generator" component={UniverseGenerator} />
      <Route path="/commander" component={Commander} />
      <Route path="/government" component={Government} />
      <Route path="/alliance" component={Alliance} />
      <Route path="/market" component={Market} />
      <Route path="/messages" component={Messages} />
      <Route path="/combat" component={Combat} />
      <Route path="/battle-logs" component={BattleLogs} />
      <Route path="/exploration" component={Exploration} />
      <Route path="/colonies" component={Colonies} />
      <Route path="/tech-tree" component={TechTree} />
      <Route path="/technology-tree" component={TechnologyTree} />
      <Route path="/expeditions" component={Expeditions} />
      <Route path="/blueprints" component={Blueprints} />
      <Route path="/megastructures" component={MegaStructures} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/factions" component={Factions} />
      <Route path="/empire-progression" component={EmpireProgression} />
      <Route path="/warp-network" component={WarpNetwork} />
      <Route path="/stations" component={Stations} />
      <Route path="/merchants" component={Merchants} />
      <Route path="/celestial-browser" component={CelestialBrowser} />
      <Route path="/diagnostics" component={Diagnostics} />
      <Route path="/story-mode" component={StoryMode} />
      <Route path="/relics" component={Relics} />
      <Route path="/friends" component={FriendsList} />
      <Route path="/guilds" component={Guilds} />
      <Route path="/raids" component={Raids} />
      <Route path="/universe-events" component={UniverseEvents} />
      <Route path="/raid-bosses" component={RaidBosses} />
      <Route path="/raid-finder" component={RaidFinder} />
  );
}

function Router() {
  return <RouterContent />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Router />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
