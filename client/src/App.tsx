import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/gameContext";
import NotFound from "@/pages/not-found";

import Overview from "@/pages/Overview";
import Resources from "@/pages/Resources";
import Facilities from "@/pages/Facilities";
import Research from "@/pages/Research";
import Shipyard from "@/pages/Shipyard";
import Fleet from "@/pages/Fleet";
import Galaxy from "@/pages/Galaxy";
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
import { useGame } from "@/lib/gameContext";

function Router() {
  const { isLoggedIn } = useGame();

  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/resources" component={Resources} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/research" component={Research} />
      <Route path="/artifacts" component={Artifacts} />
      <Route path="/shipyard" component={Shipyard} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/interstellar" component={Interstellar} />
      <Route path="/galaxy" component={Galaxy} />
      <Route path="/commander" component={Commander} />
      <Route path="/government" component={Government} />
      <Route path="/alliance" component={Alliance} />
      <Route path="/market" component={Market} />
      <Route path="/messages" component={Messages} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={Admin} />
      
      <Route component={NotFound} />
    </Switch>
  );
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
