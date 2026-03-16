import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Award, Gift } from "lucide-react";

interface SeasonPassReward {
  tier: number;
  rewardType: "currency" | "item";
  currency?: "silver" | "gold" | "platinum";
  amount?: number;
  itemId?: string;
  quantity?: number;
}

interface SeasonPassOverview {
  config: {
    seasonId: string;
    name: string;
    maxTier: number;
    xpPerTier: number;
    freeRewards: SeasonPassReward[];
    premiumRewards: SeasonPassReward[];
  };
  state: {
    seasonId: string;
    xp: number;
    currentTier: number;
    claimedFree: number[];
    claimedPremium: number[];
    premiumUnlocked: boolean;
  };
}

function rewardLabel(reward: SeasonPassReward): string {
  if (reward.rewardType === "currency") {
    return `${(reward.amount || 0).toLocaleString()} ${reward.currency || "silver"}`;
  }
  return `${reward.quantity || 1}x ${reward.itemId || "reward item"}`;
}

export default function SeasonPass() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<SeasonPassOverview>({
    queryKey: ["/api/season-pass/overview"],
    queryFn: async () => {
      const res = await fetch("/api/season-pass/overview", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load season pass overview");
      return res.json();
    },
  });

  const addXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const res = await apiRequest("POST", "/api/season-pass/xp", { xp });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Season XP Added", description: "Progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add XP", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async ({ tier, premium }: { tier: number; premium: boolean }) => {
      const res = await apiRequest("POST", "/api/season-pass/claim", { tier, premium });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Reward Claimed", description: "Season pass reward delivered." });
    },
    onError: (error: any) => {
      toast({ title: "Claim failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const season = data?.state;
  const config = data?.config;
  const progressPct = season && config ? Math.min(100, (season.currentTier / config.maxTier) * 100) : 0;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Season Pass</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Advance through 100 tiers and claim free or premium rewards.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> {config?.name || "Loading Season"}</CardTitle>
            <CardDescription>{config?.seasonId || "season"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-slate-500">Loading season pass...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Current Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{season?.currentTier || 1}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">Season XP</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(season?.xp || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-3">
                    <div className="text-xs text-slate-500 uppercase">XP / Tier</div>
                    <div className="text-2xl font-orbitron text-slate-900">{(config?.xpPerTier || 0).toLocaleString()}</div>
                  </div>
                </div>

                <Progress value={progressPct} className="h-2" />

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(1200)} disabled={addXpMutation.isPending}>
                    +1 Tier XP
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addXpMutation.mutate(2400)} disabled={addXpMutation.isPending}>
                    +2 Tier XP
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="free" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-11">
            <TabsTrigger value="free">Free Track</TabsTrigger>
            <TabsTrigger value="premium">Premium Track</TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.freeRewards || []).map((reward) => {
                const claimed = Boolean(season?.claimedFree?.includes(reward.tier));
                const unlocked = (season?.currentTier || 1) >= reward.tier;
                return (
                  <Card key={`free-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge variant="outline">Free</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, premium: false })}
                      >
                        {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(config?.premiumRewards || []).map((reward) => {
                const claimed = Boolean(season?.claimedPremium?.includes(reward.tier));
                const unlocked = (season?.currentTier || 1) >= reward.tier;
                return (
                  <Card key={`premium-${reward.tier}`} className="bg-white border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Tier {reward.tier}</span>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Premium</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><Gift className="w-4 h-4" /> {rewardLabel(reward)}</div>
                      <Button
                        className="w-full"
                        size="sm"
                        variant={claimed ? "secondary" : "default"}
                        disabled={!unlocked || claimed || claimMutation.isPending}
                        onClick={() => claimMutation.mutate({ tier: reward.tier, premium: true })}
                      >
                        {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
