import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ShoppingBag } from "lucide-react";

type StoreCategory = "boosters" | "cosmetics" | "resources" | "bundles";
type StoreCurrency = "silver" | "gold" | "platinum";

interface StorefrontItem {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  currency: StoreCurrency;
  price: number;
  grantItemId: string;
  grantQuantity: number;
  tags: string[];
}

interface StoreCatalogResponse {
  items: StorefrontItem[];
  categories: StoreCategory[];
}

interface CurrencyBalance {
  silver: number;
  gold: number;
  platinum: number;
}

const currencyColor: Record<StoreCurrency, string> = {
  silver: "text-slate-700",
  gold: "text-yellow-700",
  platinum: "text-indigo-700",
};

export default function Storefront() {
  const { toast } = useToast();
  const [category, setCategory] = useState<"all" | StoreCategory>("all");

  const { data: catalog } = useQuery<StoreCatalogResponse>({
    queryKey: ["/api/storefront/catalog"],
    queryFn: async () => {
      const res = await fetch("/api/storefront/catalog", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load storefront catalog");
      return res.json();
    },
  });

  const { data: balance } = useQuery<CurrencyBalance>({
    queryKey: ["/api/storefront/balance"],
    queryFn: async () => {
      const res = await fetch("/api/storefront/balance", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load storefront balance");
      return res.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiRequest("POST", "/api/storefront/purchase", { itemId, quantity: 1 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storefront/balance"] });
      toast({ title: "Purchase successful", description: "Item delivered to your inventory." });
    },
    onError: (error: any) => {
      toast({ title: "Purchase failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const visibleItems = useMemo(() => {
    const entries = catalog?.items || [];
    if (category === "all") return entries;
    return entries.filter((entry) => entry.category === category);
  }, [catalog?.items, category]);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Storefront</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Purchase boosters, cosmetics, resources, and bundles.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Wallet</CardTitle>
            <CardDescription>Current account balances</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="text-xs uppercase text-slate-500">Silver</div>
              <div className="text-2xl font-orbitron text-slate-900">{(balance?.silver || 0).toLocaleString()}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="text-xs uppercase text-yellow-600">Gold</div>
              <div className="text-2xl font-orbitron text-yellow-900">{(balance?.gold || 0).toLocaleString()}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded p-3">
              <div className="text-xs uppercase text-indigo-600">Platinum</div>
              <div className="text-2xl font-orbitron text-indigo-900">{(balance?.platinum || 0).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={category} onValueChange={(value) => setCategory(value as "all" | StoreCategory)}>
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="boosters">Boosters</TabsTrigger>
            <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => {
            const canAfford = (balance?.[item.currency] || 0) >= item.price;
            return (
              <Card key={item.id} className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{item.name}</span>
                    <Badge variant="outline" className="capitalize">{item.category}</Badge>
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600">Grants: {item.grantQuantity}x {item.grantItemId}</div>
                  <div className={`text-lg font-orbitron ${currencyColor[item.currency]}`}>
                    {item.price.toLocaleString()} {item.currency}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={`${item.id}-${tag}`} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    disabled={!canAfford || purchaseMutation.isPending}
                    onClick={() => purchaseMutation.mutate(item.id)}
                  >
                    {canAfford ? "Purchase" : "Insufficient Funds"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
