import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BookOpen, Zap, Cog, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { BASE_BLUEPRINTS, Blueprint, calculateManufacturingCost, calculateManufacturingTime, calculateSuccessRate, createBlueprintCopy } from "@/lib/blueprintSystem";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

export default function Blueprints() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BASE_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyRuns, setCopyRuns] = useState("10");
  const [copyQuality, setCopyQuality] = useState("85");
  const [manufacturingQty, setManufacturingQty] = useState("1");

  const originals = blueprints.filter(bp => bp.isOriginal);
  const copies = blueprints.filter(bp => bp.isCopy && bp.remainingRuns > 0);
  const usedUp = blueprints.filter(bp => bp.isCopy && bp.remainingRuns === 0);

  const handleCreateCopy = () => {
    if (!selectedBlueprint) return;
    
    const newCopy = createBlueprintCopy(
      selectedBlueprint,
      parseInt(copyRuns),
      parseInt(copyQuality)
    );
    
    setBlueprints([...blueprints, newCopy]);
    setShowCopyDialog(false);
    setCopyRuns("10");
    setCopyQuality("85");
  };

  const renderBlueprint = (bp: Blueprint) => {
    const matCost = calculateManufacturingCost(bp, 1);
    const time = calculateManufacturingTime(bp, 1);
    const successRate = calculateSuccessRate(bp);

    return (
      <Card
        key={bp.id}
        className={cn(
          "cursor-pointer border-slate-200 transition-all",
          selectedBlueprint?.id === bp.id ? "border-primary shadow-lg" : "hover:shadow-md"
        )}
        onClick={() => setSelectedBlueprint(bp)}
        data-testid={`blueprint-card-${bp.id}`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-orbitron font-bold text-slate-900">{bp.name}</div>
              <div className="text-xs text-slate-600">Produces: {bp.outputName}</div>
            </div>
            <div className="flex gap-1">
              {bp.isOriginal && <Badge className="bg-yellow-100 text-yellow-900">Original</Badge>}
              {bp.isCopy && <Badge className="bg-blue-100 text-blue-900">Copy</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-600">Type:</span>
              <div className="font-bold capitalize">{bp.type}</div>
            </div>
            <div>
              <span className="text-slate-600">Success Rate:</span>
              <div className="font-bold text-green-600">{successRate.toFixed(0)}%</div>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded text-xs space-y-1">
            <div className="font-bold">Materials:</div>
            {matCost.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span>{m.itemName}:</span>
                <span className="font-mono">{m.quantity}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Time: <span className="font-bold">{Math.ceil(time / 60)}m</span></div>
            {bp.isCopy && (
              <div>Runs: <span className="font-bold">{bp.remainingRuns}/{bp.maxRuns}</span></div>
            )}
          </div>

          {bp.isCopy && (
            <Progress value={(bp.remainingRuns / bp.maxRuns) * 100} className="h-1" />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Blueprint Manufacturing</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">EVE Online-style blueprint system with copies, runs, and manufacturing.</p>
        </div>

        {selectedBlueprint && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs uppercase text-slate-600 mb-1">Selected</div>
                  <div className="font-orbitron font-bold">{selectedBlueprint.name}</div>
                  {selectedBlueprint.isCopy && (
                    <div className="text-xs text-blue-700 mt-1">Quality: {selectedBlueprint.quality}%</div>
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase text-slate-600 mb-1">Success Rate</div>
                  <div className="font-bold text-lg text-green-600">
                    {calculateSuccessRate(selectedBlueprint).toFixed(0)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowCopyDialog(true)}
                    data-testid="btn-make-copy"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Make Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={manufacturingQty}
                    onChange={(e) => setManufacturingQty(e.target.value)}
                    placeholder="Quantity"
                    className="h-8"
                    data-testid="input-mfg-qty"
                  />
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" data-testid="btn-manufacture">
                    Manufacture
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="originals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="originals" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <BookOpen className="w-4 h-4" /> Originals ({originals.length})
            </TabsTrigger>
            <TabsTrigger value="copies" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Copy className="w-4 h-4" /> Copies ({copies.length})
            </TabsTrigger>
            <TabsTrigger value="usedUp" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <AlertCircle className="w-4 h-4" /> Used Up ({usedUp.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="originals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {originals.map(bp => renderBlueprint(bp))}
            </div>
          </TabsContent>

          <TabsContent value="copies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {copies.length > 0 ? (
                copies.map(bp => renderBlueprint(bp))
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="p-8 text-center text-slate-600">
                    No blueprint copies. Create one from an original blueprint.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usedUp" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usedUp.length > 0 ? (
                usedUp.map(bp => renderBlueprint(bp))
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="p-8 text-center text-slate-600">
                    No used-up blueprints yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Copy Dialog */}
        <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
          <DialogContent data-testid="dialog-blueprint-copy">
            <DialogHeader>
              <DialogTitle>Create Blueprint Copy</DialogTitle>
              <DialogDescription>
                Create a limited-run copy of {selectedBlueprint?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-1 block">Number of Runs</label>
                <Input
                  type="number"
                  min="1"
                  max="300"
                  value={copyRuns}
                  onChange={(e) => setCopyRuns(e.target.value)}
                  data-testid="input-copy-runs"
                />
                <p className="text-xs text-slate-600 mt-1">How many times can this copy be manufactured</p>
              </div>

              <div>
                <label className="text-sm font-bold mb-1 block">Quality %</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={copyQuality}
                  onChange={(e) => setCopyQuality(e.target.value)}
                  data-testid="input-copy-quality"
                />
                <p className="text-xs text-slate-600 mt-1">Higher quality = better success rate (affects material cost)</p>
              </div>

              <div className="bg-slate-100 p-3 rounded text-sm">
                <div className="font-bold mb-2">Copy Effect:</div>
                <ul className="text-xs space-y-1 text-slate-700">
                  <li>• Limited to {copyRuns} manufacturing runs</li>
                  <li>• Success rate reduced by quality factor</li>
                  <li>• Material costs vary with quality</li>
                </ul>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCopyDialog(false)} data-testid="btn-cancel-copy">
                  Cancel
                </Button>
                <Button onClick={handleCreateCopy} className="bg-blue-600" data-testid="btn-confirm-copy">
                  Create Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}
