import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Rocket, Users, Landmark, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { RACES, RaceId, CLASSES } from "@/lib/commanderTypes";
import { GOVERNMENTS, GovernmentId } from "@/lib/governmentData";

export default function AccountSetup() {
  const { completeSetup, isLoading, commander, government } = useGame();
  const [selectedRace, setSelectedRace] = useState<RaceId>("terran");
  const [selectedGovernment, setSelectedGovernment] = useState<GovernmentId>("democracy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleBack = () => {
    window.location.href = "/";
  };

  const isDataLoaded = commander && government && commander.race && government.type;

  useEffect(() => {
    if (isDataLoaded && !hasUserInteracted) {
      setSelectedRace(commander.race);
      setSelectedGovernment(government.type);
    }
  }, [commander?.race, government?.type, hasUserInteracted, isDataLoaded]);

  const handleRaceChange = (race: RaceId) => {
    setHasUserInteracted(true);
    setSelectedRace(race);
  };

  const handleGovernmentChange = (gov: GovernmentId) => {
    setHasUserInteracted(true);
    setSelectedGovernment(gov);
  };

  const handleComplete = async () => {
    if (!commander || !government) {
      setError("Game data is still loading. Please wait.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    const updatedCommander = {
      ...commander,
      race: selectedRace
    };
    
    const govBase = GOVERNMENTS[selectedGovernment].baseStats;
    
    const updatedGovernment = {
      ...government,
      type: selectedGovernment,
      stats: {
        stability: govBase.stability,
        publicSupport: 50,
        efficiency: govBase.efficiency,
        militaryReadiness: govBase.military,
        corruption: 10
      }
    };
    
    try {
      await completeSetup(updatedCommander, updatedGovernment);
    } catch (err) {
      setError("Failed to save your selections. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-slate-600 hover:text-slate-900 z-20"
        data-testid="button-back-from-setup"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-orbitron font-bold tracking-wider text-slate-900">EMPIRE SETUP</CardTitle>
          <CardDescription className="text-slate-600 font-rajdhani text-lg font-medium">Choose your race and government to begin your conquest</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Race Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Your Race
            </Label>
            <Select value={selectedRace} onValueChange={handleRaceChange}>
              <SelectTrigger className="w-full h-12 bg-white border-slate-300" data-testid="select-race">
                <SelectValue placeholder="Choose a race" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RACES).map(race => (
                  <SelectItem key={race.id} value={race.id} data-testid={`option-race-${race.id}`}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Race Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-600 mb-2">{RACES[selectedRace].description}</p>
              <div className="space-y-1">
                {RACES[selectedRace].bonuses.map((bonus, i) => (
                  <div key={i} className="text-xs text-emerald-600 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {bonus}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Government Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              Select Your Government
            </Label>
            <Select value={selectedGovernment} onValueChange={handleGovernmentChange}>
              <SelectTrigger className="w-full h-12 bg-white border-slate-300" data-testid="select-government">
                <SelectValue placeholder="Choose a government" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GOVERNMENTS).map(gov => (
                  <SelectItem key={gov.id} value={gov.id} data-testid={`option-gov-${gov.id}`}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Government Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-600 mb-2">{GOVERNMENTS[selectedGovernment].description}</p>
              <div className="text-xs text-slate-500 mb-2">Ruler Title: {GOVERNMENTS[selectedGovernment].rulerTitle}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-700">Bonuses</div>
                  {GOVERNMENTS[selectedGovernment].bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-700">Penalties</div>
                  {GOVERNMENTS[selectedGovernment].penalties.map((penalty, i) => (
                    <div key={i} className="text-xs text-red-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {penalty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button 
            onClick={handleComplete} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
            disabled={isLoading || isSubmitting}
            data-testid="button-begin-conquest"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                INITIALIZING EMPIRE...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-2" />
                BEGIN CONQUEST
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
