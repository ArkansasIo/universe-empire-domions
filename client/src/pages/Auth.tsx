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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-slate-300 hover:text-white z-20 transition-colors"
        data-testid="button-back-to-title"
        onClick={() => window.location.reload()}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 text-white relative z-10 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-orbitron font-bold tracking-wider text-white">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-cyan-300 font-rajdhani text-lg font-medium mt-2">⚡ Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-xs text-slate-200 flex gap-2 items-start">
             <Shield className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
             <p>{isLogin ? "Enter your credentials to command your fleet." : "Create an account to start your conquest."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white text-sm font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 mt-1 focus:border-cyan-500 focus:ring-cyan-500"
                data-testid="input-username"
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 mt-1 focus:border-cyan-500 focus:ring-cyan-500"
                data-testid="input-password"
                disabled={submitting}
              />
            </div>

            {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-2 rounded">{error}</div>}

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-orbitron tracking-widest h-12 shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl hover:shadow-cyan-500/50"
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
            className="w-full text-sm text-cyan-300 hover:text-cyan-200 underline transition-colors"
            disabled={submitting}
            data-testid="button-toggle-auth"
          >
            {isLogin ? "Create new account" : "Already have an account? Sign in"}
          </button>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4 pb-6 border-t border-slate-700 pt-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-300 hover:text-cyan-300 transition-colors" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <div className="flex items-center gap-4 text-xs text-slate-400">
             <Link href="/terms" className="hover:text-cyan-300 hover:underline transition-colors" data-testid="link-terms">
               Terms of Service
             </Link>
             <span>•</span>
             <Link href="/privacy" className="hover:text-cyan-300 hover:underline transition-colors" data-testid="link-privacy">
               Privacy Policy
             </Link>
           </div>
           <div className="text-xs text-slate-500 space-y-1 text-center">
             <span className="block">Version 0.1.0 // Universe: Nexus-Alpha</span>
             <span className="block text-slate-600">Developed by Tanang20</span>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
