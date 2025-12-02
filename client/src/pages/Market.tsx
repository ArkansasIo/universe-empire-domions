import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MARKET_ITEMS, VENDORS, MarketItem, Vendor } from "@/lib/marketData";
import { ShoppingBag, AlertTriangle, Zap, User, Shield, Box, Gem, Database, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ItemCard = ({ 
  item, 
  mode, 
  inventoryCount, 
  onBuy, 
  onSell, 
  canAfford 
}: { 
  item: MarketItem, 
  mode: "buy" | "sell", 
  inventoryCount: number, 
  onBuy: () => void, 
  onSell: () => void,
  canAfford: boolean
}) => {
  const Icon = item.icon;
  const isContraband = item.rarity === "contraband";
  const isLegendary = item.rarity === "legendary";

  // Dynamic pricing logic (mock)
  const priceMult = mode === "buy" ? 1 : 0.5; // Sell for 50%
  const costMetal = Math.floor(item.basePrice.metal * priceMult);
  const costCrystal = Math.floor(item.basePrice.crystal * priceMult);
  const costDeut = Math.floor(item.basePrice.deuterium * priceMult);

  return (
    <Card className={cn(
      "group overflow-hidden transition-all hover:shadow-md border-slate-200",
      isContraband ? "bg-slate-900 border-purple-900/50 text-slate-100" : "bg-white",
      isLegendary ? "border-amber-400/50 shadow-amber-100" : ""
    )}>
      <div className="h-24 relative border-b border-border/10 bg-slate-50/50 flex items-center justify-center">
         <Icon className={cn("w-12 h-12 transition-transform group-hover:scale-110", isContraband ? "text-purple-400" : "text-slate-400")} />
         <div className="absolute top-2 right-2">
            {isContraband && <Badge variant="destructive" className="bg-purple-600 hover:bg-purple-700">ILLEGAL</Badge>}
            {!isContraband && <Badge variant="outline" className="bg-white/80">{item.type}</Badge>}
         </div>
         {inventoryCount > 0 && (
            <div className="absolute bottom-2 right-2 text-xs font-mono bg-slate-800 text-white px-2 py-1 rounded">
               Owned: {inventoryCount}
            </div>
         )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className={cn("text-base font-orbitron truncate", isContraband ? "text-purple-300" : "text-slate-900")}>
           {item.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2 text-sm h-20">
         <p className={cn("text-xs line-clamp-3", isContraband ? "text-slate-400" : "text-muted-foreground")}>
            {item.description}
         </p>
      </CardContent>

      <div className="px-6 pb-2 space-y-1">
         {costMetal > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-slate-400" : "text-slate-500"}>Metal</span>
               <span className={isContraband ? "text-slate-300" : "text-slate-700"}>{costMetal.toLocaleString()}</span>
            </div>
         )}
         {costCrystal > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-purple-400/70" : "text-blue-500/70"}>Crystal</span>
               <span className={isContraband ? "text-purple-300" : "text-blue-700"}>{costCrystal.toLocaleString()}</span>
            </div>
         )}
         {costDeut > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-green-400/70" : "text-green-500/70"}>Deuterium</span>
               <span className={isContraband ? "text-green-300" : "text-green-700"}>{costDeut.toLocaleString()}</span>
            </div>
         )}
      </div>

      <CardFooter className="pt-2">
         {mode === "buy" ? (
            <Button 
               className={cn("w-full h-8 text-xs font-orbitron", isContraband ? "bg-purple-700 hover:bg-purple-600" : "bg-primary hover:bg-primary/90")}
               disabled={!canAfford}
               onClick={onBuy}
            >
               {canAfford ? "PURCHASE" : "INSUFFICIENT FUNDS"}
            </Button>
         ) : (
            <Button 
               variant="outline"
               className={cn("w-full h-8 text-xs font-orbitron", isContraband ? "border-purple-700 text-purple-400 hover:bg-purple-900/50" : "")}
               disabled={inventoryCount <= 0}
               onClick={onSell}
            >
               SELL ITEM
            </Button>
         )}
      </CardFooter>
    </Card>
  );
};

const VendorProfile = ({ vendor, active, onClick }: { vendor: Vendor, active: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border-2",
      active 
        ? "bg-primary/5 border-primary" 
        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200",
      vendor.type === "black_market" && active ? "bg-slate-900 border-purple-500 text-white" : "",
      vendor.type === "black_market" && !active ? "bg-slate-900/90 border-transparent hover:border-purple-500/50 text-slate-300" : ""
    )}
  >
     <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white", vendor.avatarColor)}>
        {vendor.type === "official" && <User className="w-6 h-6" />}
        {vendor.type === "scientist" && <Zap className="w-6 h-6" />}
        {vendor.type === "black_market" && <AlertTriangle className="w-6 h-6" />}
     </div>
     <div className="flex-1">
        <h4 className="font-orbitron font-bold text-sm">{vendor.name}</h4>
        <p className="text-xs opacity-70 font-rajdhani uppercase tracking-wider">{vendor.title}</p>
     </div>
     {active && <ArrowRight className="w-4 h-4 opacity-50" />}
  </div>
);

export default function Market() {
  const { resources, inventory, buyItem, sellItem } = useGame();
  const [selectedVendorId, setSelectedVendorId] = useState(VENDORS[0].id);
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  const selectedVendor = VENDORS.find(v => v.id === selectedVendorId) || VENDORS[0];
  
  // Filter items based on vendor inventory or player inventory (for selling)
  const displayItems = mode === "buy" 
    ? MARKET_ITEMS.filter(item => selectedVendor.inventory.includes(item.id))
    : MARKET_ITEMS.filter(item => (inventory[item.id] || 0) > 0); // When selling, show owned items

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galactic Trade Network</h2>
             <p className="text-muted-foreground font-rajdhani text-lg">Acquire construction materials, rare parts, and exotic commodities.</p>
           </div>
           <div className="flex gap-2 bg-white p-1 rounded border border-slate-200">
              <Button 
                size="sm" 
                variant={mode === "buy" ? "default" : "ghost"} 
                onClick={() => setMode("buy")}
                className="w-32 font-orbitron"
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> BUY
              </Button>
              <Button 
                size="sm" 
                variant={mode === "sell" ? "default" : "ghost"} 
                onClick={() => setMode("sell")}
                className="w-32 font-orbitron"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> SELL
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Vendor List */}
           <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Available Vendors</h3>
              {VENDORS.map(vendor => (
                 <VendorProfile 
                    key={vendor.id} 
                    vendor={vendor} 
                    active={selectedVendorId === vendor.id} 
                    onClick={() => setSelectedVendorId(vendor.id)} 
                 />
              ))}

              <Card className="bg-slate-50 border-slate-200 mt-6">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Wallet</CardTitle>
                 </CardHeader>
                 <CardContent className="text-xs space-y-2">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Metal</span>
                       <span className="font-mono">{Math.floor(resources.metal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-blue-500">Crystal</span>
                       <span className="font-mono">{Math.floor(resources.crystal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-green-500">Deuterium</span>
                       <span className="font-mono">{Math.floor(resources.deuterium).toLocaleString()}</span>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Main Trading Area */}
           <div className="lg:col-span-3">
              <Card className={cn("border-none shadow-none bg-transparent")}>
                 <div className="flex items-center gap-4 mb-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md", selectedVendor.avatarColor)}>
                       {selectedVendor.type === "official" && <User className="w-8 h-8" />}
                       {selectedVendor.type === "scientist" && <Zap className="w-8 h-8" />}
                       {selectedVendor.type === "black_market" && <AlertTriangle className="w-8 h-8" />}
                    </div>
                    <div>
                       <h3 className="text-xl font-orbitron font-bold">{selectedVendor.name}</h3>
                       <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Badge variant="secondary" className="text-[10px] h-5">{selectedVendor.specialty}</Badge>
                          <span className="font-rajdhani uppercase tracking-widest text-xs">{selectedVendor.title}</span>
                       </div>
                       <p className="text-sm text-slate-600 italic">"{selectedVendor.description}"</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayItems.length === 0 && (
                       <div className="col-span-full text-center py-12 text-muted-foreground">
                          <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No items available in this category.</p>
                       </div>
                    )}
                    
                    {displayItems.map(item => {
                       const cost = item.basePrice;
                       const canAfford = 
                          resources.metal >= cost.metal && 
                          resources.crystal >= cost.crystal && 
                          resources.deuterium >= cost.deuterium;

                       return (
                          <ItemCard 
                             key={item.id} 
                             item={item} 
                             mode={mode} 
                             inventoryCount={inventory[item.id] || 0}
                             canAfford={canAfford}
                             onBuy={() => buyItem(item.id, item.basePrice)}
                             onSell={() => sellItem(item.id, item.basePrice)}
                          />
                       );
                    })}
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </GameLayout>
  );
}
