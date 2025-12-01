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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/resources" component={Resources} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/research" component={Research} />
      <Route path="/shipyard" component={Shipyard} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/galaxy" component={Galaxy} />
      <Route path="/commander" component={Commander} />
      
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
