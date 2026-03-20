import { Link, useLocation } from "wouter";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PLANET_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { 
  type LucideIcon,
  LayoutDashboard, 
  Pickaxe, 
  Factory, 
  FlaskConical, 
  Rocket, 
  Send, 
  Globe, 
  Settings,
  Zap,
  Database,
  Box,
  Gem,
  User,
  Landmark,
  Mail,
  Shield,
  Hexagon,
  ShieldAlert,
  LogOut,
  ShoppingBag,
  Orbit,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Swords,
  Users,
  Map,
  Building2,
  Sparkles,
  CircleDot,
  GraduationCap,
  Compass,
  Home,
  Coins,
  Droplets,
  FileText,
  Trophy,
  Wheat,
  Crown,
  Satellite,
  Search,
  ScrollText,
  BookOpen,
  Network,
  AlertTriangle,
  Image,
  Award,
  Store,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  activePaths?: string[];
  activePrefixes?: string[];
}

interface NavGroup {
  title: string;
  description?: string;
  items: NavItem[];
}

interface MenuSection {
  title: string;
  icon: LucideIcon;
  description?: string;
  groups: NavGroup[];
}

interface ActivePageContext {
  section: string;
  sectionIcon: LucideIcon;
  sectionDescription?: string;
  group: string;
  groupDescription?: string;
  item: NavItem;
  siblings: NavItem[];
}

const isNavItemActive = (item: NavItem, location: string) => {
  if (location === item.href) {
    return true;
  }

  if (item.activePaths?.includes(location)) {
    return true;
  }

  return item.activePrefixes?.some((prefix) => location.startsWith(prefix)) ?? false;
};

const SidebarItem = ({
  href,
  icon: Icon,
  label,
  active,
  className,
  indentLevel = 1,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  className?: string;
  indentLevel?: 1 | 2;
}) => (
  <Link href={href} data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className={cn(
      "flex items-center gap-3 cursor-pointer transition-all duration-200 border-l-2",
      indentLevel === 2 ? "px-8 py-2 text-xs" : "px-6 py-2.5 text-xs",
      active 
        ? "bg-primary/10 border-primary text-primary font-bold" 
        : "border-transparent hover:bg-slate-200 hover:text-primary hover:border-primary/50 text-muted-foreground",
      className
    )}>
      <Icon className="w-4 h-4" />
      <span className="font-rajdhani font-semibold tracking-wider uppercase text-xs">{label}</span>
    </div>
  </Link>
);

const CollapsibleMenu = ({
  title,
  icon: Icon,
  groups,
  location,
  defaultOpen = false,
}: {
  title: string;
  icon: LucideIcon;
  groups: NavGroup[];
  location: string;
  defaultOpen?: boolean;
}) => {
  const hasActiveChild = groups.some((group) => group.items.some((item) => isNavItemActive(item, location)));
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  return (
    <div className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 border-l-2",
          hasActiveChild 
            ? "bg-primary/5 border-primary/50 text-primary" 
            : "border-transparent hover:bg-slate-100 text-muted-foreground hover:text-slate-700"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-rajdhani font-semibold tracking-wider uppercase text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="bg-slate-50/50">
          {groups.map((group) => (
            <div key={group.title} className="py-1">
              <div className="px-6 py-2 text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase">
                {group.title}
              </div>
              {group.items.map((item) => (
                <SidebarItem 
                  key={item.href}
                  href={item.href} 
                  icon={item.icon} 
                  label={item.label} 
                  active={isNavItemActive(item, location)}
                  indentLevel={2}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const menuSections: MenuSection[] = [
  {
    title: "Empire",
    icon: Building2,
    description: "Manage planets, colonies, infrastructure, and civilization growth.",
    groups: [
      {
        title: "Command",
        description: "Core empire oversight and planetary command tools.",
        items: [
          { href: "/empire-command-center", icon: Crown, label: "Command Center", description: "Review empire status, strategic alerts, and central command tools." },
          { href: "/empire-view", icon: LayoutDashboard, label: "Empire View", description: "See your empire at a glance across worlds and systems." },
          { href: "/empire-planets", icon: Globe, label: "Empire Planets", description: "Browse controlled planets and inspect planet detail pages.", activePrefixes: ["/planet/"] },
          { href: "/planet-command", icon: Rocket, label: "Planet Command", description: "Issue direct orders for planetary production and control." },
        ],
      },
      {
        title: "Infrastructure",
        description: "Expand production chains and build out planetary capacity.",
        items: [
          { href: "/resources", icon: Pickaxe, label: "Resources", description: "Track and improve metal, crystal, energy, and strategic reserves." },
          { href: "/facilities", icon: Factory, label: "Facilities", description: "Construct and upgrade industrial, research, and support facilities." },
          { href: "/colonies", icon: Home, label: "Colonies", description: "Manage colonization targets, colony slots, and expansion plans." },
          { href: "/stations", icon: Satellite, label: "Stations", description: "Control orbital stations, outposts, and support platforms." },
          { href: "/megastructures", icon: CircleDot, label: "Megastructures", description: "Develop late-game empire-scale construction projects." },
        ],
      },
      {
        title: "Civilization",
        description: "Shape society progression and large-scale empire milestones.",
        items: [
          { href: "/civilization-systems", icon: Users, label: "Civilization Systems", description: "Review your civilization systems, bonuses, and societal traits." },
          { href: "/civilization-management", icon: Building2, label: "Civilization Mgmt", description: "Adjust policies and manage civilization-wide development." },
          { href: "/empire-progression", icon: Award, label: "Kardashev Scale", description: "Track empire advancement through long-term progression tiers." },
        ],
      },
    ],
  },
  {
    title: "Research",
    icon: FlaskConical,
    description: "Unlock technologies, manage labs, and catalog discoveries.",
    groups: [
      {
        title: "Labs",
        description: "Operate research centers and queue scientific projects.",
        items: [
          { href: "/research", icon: FlaskConical, label: "Research Hub", description: "View current research priorities and laboratory output." },
          { href: "/research-lab", icon: Zap, label: "Research Management", description: "Allocate research capacity and manage active development." },
        ],
      },
      {
        title: "Tech Trees",
        description: "Navigate structured technology paths and reference systems.",
        items: [
          { href: "/technology-tree", icon: GraduationCap, label: "Technology Tree", description: "Browse upgrade dependencies and long-term tech routes.", activePaths: ["/tech-tree"] },
          { href: "/ogame-compendium", icon: Database, label: "OGame Compendium", description: "Reference structured technology, economy, and combat data." },
        ],
      },
      {
        title: "Discoveries",
        description: "Catalog rare finds, advanced designs, and recovered relics.",
        items: [
          { href: "/blueprints", icon: FileText, label: "Blueprints", description: "Review unlocked designs and production-ready schematics." },
          { href: "/artifacts", icon: Hexagon, label: "Artifacts", description: "Inspect rare artifacts that modify empire capabilities." },
          { href: "/relics", icon: Gem, label: "Relics", description: "Manage relic bonuses and rare discovery effects." },
        ],
      },
    ],
  },
  {
    title: "Military",
    icon: Swords,
    description: "Command fleets, armies, expeditions, and combat operations.",
    groups: [
      {
        title: "Forces",
        description: "Build and organize space and ground units.",
        items: [
          { href: "/shipyard", icon: Rocket, label: "Shipyard", description: "Construct ships and prepare new fleets for deployment." },
          { href: "/fleet", icon: Send, label: "Fleet Command", description: "Dispatch fleets, track missions, and manage formations." },
          { href: "/army", icon: Users, label: "Army", description: "Review land units, formations, and force composition." },
          { href: "/army-management", icon: Swords, label: "Army Management", description: "Train, equip, and reorganize planetary armies." },
        ],
      },
      {
        title: "Operations",
        description: "Run missions, battles, and after-action reviews.",
        items: [
          { href: "/expeditions", icon: Compass, label: "Expeditions", description: "Launch deep-space missions for risk, reward, and discovery." },
          { href: "/combat", icon: ShieldAlert, label: "Combat Center", description: "Engage combat systems and active battle mechanics." },
          { href: "/battle-logs", icon: ScrollText, label: "Battle Logs", description: "Review previous engagements and combat outcomes." },
        ],
      },
      {
        title: "Raids",
        description: "Coordinate raid loops, target discovery, and boss encounters.",
        items: [
          { href: "/raids", icon: Swords, label: "Raid Operations", description: "Coordinate raid entry points and active raid campaigns." },
          { href: "/raid-finder", icon: Search, label: "Raid Finder", description: "Search for available raids and suitable objectives." },
          { href: "/raid-bosses", icon: Crown, label: "Raid Bosses", description: "Track elite raid bosses and encounter preparation." },
        ],
      },
    ],
  },
  {
    title: "Exploration",
    icon: Map,
    description: "Survey space, navigate networks, and discover new worlds.",
    groups: [
      {
        title: "Maps",
        description: "Navigate local, galactic, and generated universe views.",
        items: [
          { href: "/interstellar", icon: Sparkles, label: "Interstellar", description: "Explore broader interstellar travel and system links." },
          { href: "/galaxy", icon: Globe, label: "Galaxy Map", description: "Browse sector positions, neighbors, and route planning." },
          { href: "/universe", icon: Orbit, label: "Universe View", description: "Inspect the full universe and long-range spatial context." },
          { href: "/universe-generator", icon: RefreshCw, label: "Universe Generator", description: "Generate and inspect procedural universe structures." },
        ],
      },
      {
        title: "Discovery",
        description: "Search celestial bodies, biomes, and transit systems.",
        items: [
          { href: "/exploration", icon: Compass, label: "Exploration", description: "Run exploration loops and reveal frontier opportunities." },
          { href: "/warp-network", icon: Network, label: "Warp Network", description: "Manage travel corridors and inter-system movement." },
          { href: "/celestial-browser", icon: CircleDot, label: "Celestial Browser", description: "Inspect stars, planets, and other celestial objects." },
          { href: "/biome-codex", icon: BookOpen, label: "Biome Codex", description: "Study biome entries and their detailed environmental data.", activePrefixes: ["/biome/"] },
        ],
      },
      {
        title: "Events",
        description: "Respond to live universe activity and dynamic world events.",
        items: [
          { href: "/universe-events", icon: AlertTriangle, label: "Universe Events", description: "Review active world events and their empire-wide impact." },
        ],
      },
    ],
  },
  {
    title: "Diplomacy",
    icon: Shield,
    description: "Lead your people, manage alliances, and build social networks.",
    groups: [
      {
        title: "Leadership",
        description: "Manage identity, power structures, and ranking systems.",
        items: [
          { href: "/commander", icon: User, label: "Commander", description: "Customize commander identity, stats, and personal progression." },
          { href: "/government", icon: Landmark, label: "Government", description: "Review state structure, laws, and governing bonuses." },
          { href: "/factions", icon: Users, label: "Factions", description: "Navigate faction relations and influence networks." },
          { href: "/leaderboard", icon: Trophy, label: "Leaderboard", description: "Compare empire performance against other players." },
        ],
      },
      {
        title: "Alliances",
        description: "Coordinate communication, guilds, and allied diplomacy.",
        items: [
          { href: "/alliance", icon: Shield, label: "Alliance", description: "Manage alliance structure, members, and cooperative play." },
          { href: "/guilds", icon: Crown, label: "Guilds", description: "Organize guild participation and long-term group identity." },
          { href: "/friends", icon: Users, label: "Friends", description: "Track friends, contacts, and cooperative player lists." },
          { href: "/messages", icon: Mail, label: "Messages", description: "Read diplomatic, social, and operational communications." },
        ],
      },
    ],
  },
  {
    title: "Economy",
    icon: ShoppingBag,
    description: "Trade resources, pursue rewards, and progress through game modes.",
    groups: [
      {
        title: "Trade",
        description: "Buy, sell, and browse goods across the empire economy.",
        items: [
          { href: "/market", icon: ShoppingBag, label: "Market", description: "Trade raw materials, strategic goods, and market offers." },
          { href: "/merchants", icon: User, label: "Merchants", description: "Work with merchant NPCs and their specialized inventories." },
          { href: "/storefront", icon: Store, label: "Storefront", description: "Browse premium or featured storefront offerings." },
        ],
      },
      {
        title: "Progression",
        description: "Advance through achievements, passes, and narrative content.",
        items: [
          { href: "/achievements", icon: Trophy, label: "Achievements", description: "Track unlocks, milestones, and earned achievement rewards." },
          { href: "/season-pass", icon: Award, label: "Season Pass", description: "Review seasonal objectives and time-limited progression rewards." },
          { href: "/battle-pass", icon: Swords, label: "Battle Pass", description: "Advance combat-focused progression tracks and rewards." },
          { href: "/story-mode", icon: BookOpen, label: "Story Mode", description: "Play through narrative content and guided mission arcs." },
        ],
      },
    ],
  },
];

const systemItems: NavItem[] = [
  { href: "/diagnostics", icon: AlertTriangle, label: "Diagnostics", description: "Inspect client, server, and gameplay diagnostic tools." },
  { href: "/assets-gallery", icon: Image, label: "Assets Gallery", description: "Browse game assets and visual reference content." },
  { href: "/settings", icon: Settings, label: "Settings", description: "Update configuration, preferences, and account options." },
];

const adminItems: NavItem[] = [
  { href: "/admin", icon: ShieldAlert, label: "Control Panel", description: "Use administrative controls for game and player management." },
  { href: "/server-console", icon: Database, label: "Server Console", description: "Review live server console tools and operational controls." },
];

const getActivePageContext = (location: string, isAdmin: boolean): ActivePageContext | null => {
  for (const section of menuSections) {
    for (const group of section.groups) {
      const activeItem = group.items.find((item) => isNavItemActive(item, location));
      if (activeItem) {
        return {
          section: section.title,
          sectionIcon: section.icon,
          sectionDescription: section.description,
          group: group.title,
          groupDescription: group.description,
          item: activeItem,
          siblings: group.items,
        };
      }
    }
  }

  const activeSystemItem = systemItems.find((item) => isNavItemActive(item, location));
  if (activeSystemItem) {
    return {
      section: "System",
      sectionIcon: Settings,
      sectionDescription: "Configure the client, inspect tools, and access support utilities.",
      group: "Operations",
      groupDescription: "System-level tools and settings.",
      item: activeSystemItem,
      siblings: systemItems,
    };
  }

  if (isAdmin) {
    const activeAdminItem = adminItems.find((item) => isNavItemActive(item, location));
    if (activeAdminItem) {
      return {
        section: "Administration",
        sectionIcon: ShieldAlert,
        sectionDescription: "High-privilege controls for monitoring and operating the game.",
        group: "Control",
        groupDescription: "Administrative pages and server operations.",
        item: activeAdminItem,
        siblings: adminItems,
      };
    }
  }

  return null;
};

const ResourceDisplay = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: number, colorClass: string }) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded shadow-sm min-w-[140px]">
      <div className={cn("p-2 rounded-full bg-slate-100", colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={cn("font-orbitron font-medium text-sm tabular-nums", colorClass)}>
          {Math.floor(safeValue).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const TurnDisplay = ({ currentTurns, totalTurns, isLoading }: { currentTurns: number, totalTurns: number, isLoading: boolean }) => (
  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 px-4 py-2 rounded shadow-sm min-w-[180px]" data-testid="display-turns">
    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Turns</span>
      <div className="flex items-center gap-2">
        <span className="font-orbitron font-bold text-sm tabular-nums text-indigo-900">
          {currentTurns.toLocaleString()}
        </span>
        <span className="text-[10px] text-indigo-500 font-mono">+6/min</span>
      </div>
    </div>
    <div className="border-l border-indigo-200 pl-3 ml-1">
      <span className="text-[9px] uppercase tracking-widest text-slate-400">Total</span>
      <div className="font-mono text-xs text-slate-600">{totalTurns.toLocaleString()}</div>
    </div>
  </div>
);

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { resources, planetName, coordinates, isAdmin, logout, username } = useGame();
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";
  const buildId = import.meta.env.VITE_BUILD_ID || "dev";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "local";
  const sidebarPlanetImage = PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  const fallbackPlanetImage = "/theme-temp.png";
  const activePageContext = getActivePageContext(location, isAdmin);

  const { data: turnData, isLoading: turnsLoading } = useQuery({
    queryKey: ['/api/turns'],
    queryFn: async () => {
      const res = await fetch('/api/turns', { credentials: 'include' });
      if (!res.ok) return { currentTurns: 0, totalTurns: 0 };
      return res.json();
    },
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen text-slate-900 overflow-hidden flex flex-col bg-slate-50">
      
      {/* Top Bar - Resources */}
      <header className="relative z-20 h-24 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-sm">
             <Rocket className="text-white w-6 h-6" />
           </div>
           <div>
             <h1 className="font-orbitron font-bold text-xl tracking-wider text-slate-900">Universe-<span className="text-primary text-sm font-normal">Empires-Dominions</span></h1>
             <p className="text-xs text-muted-foreground font-rajdhani tracking-widest uppercase">Server: Nexus-Alpha // User: {username || "Commander"}</p>
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="hidden lg:flex items-center gap-1">
              {[
              { href: "/forums", label: "Forums" },
              { href: "/about", label: "About" },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
            ].map((entry) => (
              <Link key={entry.href} href={entry.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-[11px]",
                    location === entry.href ? "text-primary" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {entry.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            <TurnDisplay 
              currentTurns={turnData?.currentTurns || 0} 
              totalTurns={turnData?.totalTurns || 0} 
              isLoading={turnsLoading} 
            />
            <ResourceDisplay icon={Box} label="Metal" value={resources.metal} colorClass="text-slate-600" />
            <ResourceDisplay icon={Gem} label="Crystal" value={resources.crystal} colorClass="text-blue-600" />
            <ResourceDisplay icon={Database} label="Deuterium" value={resources.deuterium} colorClass="text-green-600" />
            <ResourceDisplay icon={Zap} label="Energy" value={resources.energy} colorClass={resources.energy >= 0 ? "text-yellow-600" : "text-red-600"} />
            <ResourceDisplay icon={Coins} label="Credits" value={resources.credits} colorClass="text-amber-600" />
            <ResourceDisplay icon={Wheat} label="Food" value={resources.food} colorClass="text-lime-600" />
            <ResourceDisplay icon={Droplets} label="Water" value={resources.water} colorClass="text-cyan-600" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto scrollbar-hide">
          
          <div className="p-6">
             <div className="bg-slate-100 border border-slate-200 p-4 rounded text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full border-2 border-primary mb-3 shadow-sm overflow-hidden">
                  <img
                    src={sidebarPlanetImage}
                    alt={planetName || "Planet"}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackPlanetImage;
                    }}
                  />
                </div>
                <h3 className="font-orbitron font-bold text-slate-900">{planetName}</h3>
                <p className="text-xs text-muted-foreground">[{coordinates}]</p>
             </div>
          </div>

          <nav className="flex-1 py-2">
            {/* Main Overview */}
            <SidebarItem href="/" icon={LayoutDashboard} label="Overview" active={location === "/"} />
            
            {menuSections.map((section) => (
              <CollapsibleMenu
                key={section.title}
                title={section.title}
                icon={section.icon}
                groups={section.groups}
                location={location}
                defaultOpen={section.title === "Empire"}
              />
            ))}
            
            {/* System */}
            <div className="px-4 mt-4 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">System</div>
            {systemItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isNavItemActive(item, location)}
              />
            ))}
            
            {isAdmin && (
               <>
                  <div className="px-4 mt-4 mb-2 text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                     <ShieldAlert className="w-3 h-3" /> Administration
                  </div>
                  {adminItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      active={isNavItemActive(item, location)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    />
                  ))}
               </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-200">
             <button 
               onClick={logout}
               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition-colors text-sm font-bold uppercase tracking-wider"
             >
               <LogOut className="w-4 h-4" /> Logout
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-slate-50">
           <div className="max-w-6xl mx-auto">
             {activePageContext && (
               <section className="mb-6 rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
                 <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white">
                   <div className="flex flex-wrap items-start justify-between gap-4">
                     <div className="space-y-2">
                       <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
                         <span>{activePageContext.section}</span>
                         <span className="text-cyan-100/50">/</span>
                         <span>{activePageContext.group}</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20">
                           <activePageContext.sectionIcon className="h-5 w-5 text-cyan-200" />
                         </div>
                         <div>
                           <h2 className="font-orbitron text-2xl font-bold tracking-wide text-white">
                             {activePageContext.item.label}
                           </h2>
                           <p className="text-sm text-slate-300">
                             {activePageContext.item.description || activePageContext.groupDescription || activePageContext.sectionDescription}
                           </p>
                         </div>
                       </div>
                     </div>
                     <div className="rounded-xl border border-cyan-200/15 bg-white/5 px-4 py-3 text-right">
                       <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Current Submenu</div>
                       <div className="mt-1 font-rajdhani text-lg font-semibold uppercase tracking-wider text-cyan-100">
                         {activePageContext.group}
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="px-6 py-4">
                   <div className="mb-3 flex items-center justify-between gap-3">
                     <div>
                       <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Sub Pages</div>
                       <div className="text-sm text-slate-600">
                         {activePageContext.groupDescription || "Jump between related pages in this submenu group."}
                       </div>
                     </div>
                     <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                       {activePageContext.siblings.length} linked pages
                     </div>
                   </div>

                   <div className="flex flex-wrap gap-3">
                     {activePageContext.siblings.map((item) => {
                       const itemActive = isNavItemActive(item, location);

                       return (
                         <Link key={item.href} href={item.href}>
                           <div
                             className={cn(
                               "min-w-[180px] max-w-[240px] cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200",
                               itemActive
                                 ? "border-primary bg-primary/10 shadow-sm"
                                 : "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-white"
                             )}
                           >
                             <div className="mb-2 flex items-center gap-2">
                               <item.icon className={cn("h-4 w-4", itemActive ? "text-primary" : "text-slate-500")} />
                               <div className={cn(
                                 "font-rajdhani text-sm font-bold uppercase tracking-wider",
                                 itemActive ? "text-primary" : "text-slate-800"
                               )}>
                                 {item.label}
                               </div>
                             </div>
                             <p className="text-xs leading-5 text-slate-500">
                               {item.description || "Open this related page."}
                             </p>
                           </div>
                         </Link>
                       );
                     })}
                   </div>
                 </div>
               </section>
             )}
             {children}
           </div>
        </main>
      </div>

      <footer className="h-8 border-t border-slate-200 bg-white px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono" data-testid="footer-build-info">
        <div>universe-empire-domions</div>
        <div className="flex items-center gap-4">
          <span>Version: {appVersion}</span>
          <span>Build: {buildId}</span>
          <span>Time: {buildTime}</span>
        </div>
      </footer>
    </div>
  );
}
