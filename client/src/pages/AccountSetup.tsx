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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-slate-300 hover:text-white z-20 transition-colors"
        data-testid="button-back-from-setup"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-purple-500/50 text-white relative z-10 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <CardHeader className="text-center pb-2 border-b border-purple-500/30">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">EMPIRE SETUP</CardTitle>
          <CardDescription className="text-purple-300 font-rajdhani text-lg font-medium mt-2">✨ Choose your race and government to begin your conquest</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Race Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Select Your Race
            </Label>
            <Select value={selectedRace} onValueChange={handleRaceChange}>
              <SelectTrigger className="w-full h-12 bg-slate-700/50 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500" data-testid="select-race">
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
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
              <p className="text-sm text-slate-200 mb-2">{RACES[selectedRace].description}</p>
              <div className="space-y-1">
                {RACES[selectedRace].bonuses.map((bonus, i) => (
                  <div key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {bonus}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Government Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-pink-400" />
              Select Your Government
            </Label>
            <Select value={selectedGovernment} onValueChange={handleGovernmentChange}>
              <SelectTrigger className="w-full h-12 bg-slate-700/50 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500" data-testid="select-government">
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
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
              <p className="text-sm text-slate-200 mb-2">{GOVERNMENTS[selectedGovernment].description}</p>
              <div className="text-xs text-slate-300 mb-2">Ruler Title: <span className="text-pink-300 font-semibold">{GOVERNMENTS[selectedGovernment].rulerTitle}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-emerald-400">✓ Bonuses</div>
                  {GOVERNMENTS[selectedGovernment].bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-red-400">✗ Penalties</div>
                  {GOVERNMENTS[selectedGovernment].penalties.map((penalty, i) => (
                    <div key={i} className="text-xs text-red-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {penalty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button 
            onClick={handleComplete} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/50"
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
