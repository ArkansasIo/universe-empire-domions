import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Shield, Info, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const { login, isLoading } = useGame();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-slate-900">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-600 font-rajdhani text-lg font-medium">Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-600 flex gap-3 items-start">
             <Shield className="w-5 h-5 shrink-0 mt-0.5 text-slate-900" />
             <div>
               <p className="font-semibold text-slate-900 mb-1">New to Stellar Dominion?</p>
               <p>Sign in with your Replit account to get started. New commanders are granted a starter planet and basic resource production facilities.</p>
             </div>
          </div>
          
          <Button 
             onClick={() => login()} 
             className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
             disabled={isLoading}
             data-testid="button-login"
          >
             {isLoading ? (
               <>
                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                 INITIALIZING...
               </>
             ) : (
               "SIGN IN WITH REPLIT"
             )}
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-3 pb-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-600 hover:text-slate-900" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <span className="text-xs text-slate-500">
             Version 0.1.0 // Universe: Nexus-Alpha
           </span>
        </CardFooter>
      </Card>
    </div>
  );
}
