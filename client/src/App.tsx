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
import { useGame } from "@/lib/gameContext";

function LoadingSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
      <style>{`
        @keyframes slowPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes slowPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes slowBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes slowFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-slow-ping {
          animation: slowPing 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-slow-pulse {
          animation: slowPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-slow-bounce {
          animation: slowBounce 2s infinite;
        }
        .animate-slow-fade-in {
          animation: slowFade 2s ease-in-out;
        }
      `}</style>
      
      <div className="relative">
        <div className="absolute inset-0 animate-slow-ping">
          <div className="w-32 h-32 rounded-full bg-primary/20" />
        </div>
        <div className="relative w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 animate-slow-pulse">
          <Rocket className="w-16 h-16 text-white animate-slow-bounce" />
        </div>
      </div>
      
      <div className="mt-12 text-center animate-slow-fade-in">
        <h1 className="font-orbitron text-4xl font-bold text-white tracking-widest mb-2">
          STELLAR <span className="text-primary">DOMINION</span>
        </h1>
        <p className="text-slate-400 font-rajdhani text-lg tracking-wider uppercase">
          Initializing Command Systems
        </p>
      </div>
      
      <div className="mt-8 flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-slow-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-slow-bounce" style={{ animationDelay: '400ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-slow-bounce" style={{ animationDelay: '800ms' }} />
      </div>
      
      <div className="absolute bottom-8 text-slate-500 text-xs font-mono animate-slow-fade-in" style={{ animationDelay: '0.5s' }}>
        v0.8.2-beta // Nexus-Alpha Server
      </div>
    </div>
  );
}

function RouterContent() {
  const { isLoggedIn, needsSetup, isLoading } = useGame();

  // If credentials are stored in localStorage, show splash while authenticating
  const hasStoredCredentials = typeof window !== 'undefined' && 
    localStorage.getItem('stellar_username') && 
    localStorage.getItem('stellar_password');

  if (isLoading || (!isLoggedIn && hasStoredCredentials)) {
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
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={Admin} />
      <Route path="/console" component={ServerConsole} />
      <Route component={NotFound} />
    </Switch>
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
