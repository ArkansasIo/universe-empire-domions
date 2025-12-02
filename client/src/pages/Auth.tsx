import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Shield, Info, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const { isLoading, login } = useGame();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Authentication failed");
        setSubmitting(false);
        return;
      }

      // Reload page to trigger game context update
      window.location.href = "/";
    } catch (err) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-slate-600 hover:text-slate-900 z-20"
        data-testid="button-back-to-title"
        onClick={() => window.location.reload()}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-slate-200 text-slate-900 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-slate-900">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-600 font-rajdhani text-lg font-medium">Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600 flex gap-2 items-start">
             <Shield className="w-4 h-4 shrink-0 mt-0.5 text-slate-900" />
             <p>{isLogin ? "Enter your credentials to command your fleet." : "Create an account to start your conquest."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-slate-900 text-sm font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-white border-slate-300 text-slate-900 mt-1"
                data-testid="input-username"
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-900 text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-white border-slate-300 text-slate-900 mt-1"
                data-testid="input-password"
                disabled={submitting}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-12 shadow-lg transition-all hover:shadow-xl"
              disabled={submitting}
              data-testid="button-submit-auth"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                isLogin ? "ENTER GAME" : "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setUsername("");
              setPassword("");
            }}
            className="w-full text-sm text-slate-600 hover:text-slate-900 underline"
            disabled={submitting}
            data-testid="button-toggle-auth"
          >
            {isLogin ? "Create new account" : "Already have an account? Sign in"}
          </button>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4 pb-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-600 hover:text-slate-900" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <div className="flex items-center gap-4 text-xs text-slate-500">
             <Link href="/terms" className="hover:text-slate-700 hover:underline" data-testid="link-terms">
               Terms of Service
             </Link>
             <span>•</span>
             <Link href="/privacy" className="hover:text-slate-700 hover:underline" data-testid="link-privacy">
               Privacy Policy
             </Link>
           </div>
           <div className="text-xs text-slate-500 space-y-1 text-center">
             <span className="block">Version 0.1.0 // Universe: Nexus-Alpha</span>
             <span className="block text-slate-400">Developed by Tanang20</span>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
