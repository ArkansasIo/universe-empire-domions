import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Shield, Info, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const { isLoading, login } = useGame();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Load saved credentials from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("stellar_username");
    const savedPassword = localStorage.getItem("stellar_password");
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  // Save credentials to localStorage
  const saveCredentials = (user: string, pass: string) => {
    localStorage.setItem("stellar_username", user);
    localStorage.setItem("stellar_password", pass);
  };

  const clearCredentials = () => {
    localStorage.removeItem("stellar_username");
    localStorage.removeItem("stellar_password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate inputs
    if (!username.trim()) {
      setError("Username is required");
      console.warn("[AUTH] Validation failed: Username required");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      console.warn("[AUTH] Validation failed: Username too short");
      return;
    }
    if (!password) {
      setError("Password is required");
      console.warn("[AUTH] Validation failed: Password required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      console.warn("[AUTH] Validation failed: Password too short");
      return;
    }

    setSubmitting(true);
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    console.log(`[AUTH] Attempting ${isLogin ? 'LOGIN' : 'REGISTER'} for user: ${username.trim()}`);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
        credentials: "include"
      });

      console.log(`[AUTH] Response status: ${res.status} ${res.statusText}`);

      if (!res.ok) {
        const data = await res.json();
        const errorMsg = data.message || "Authentication failed";
        console.error(`[AUTH] ${isLogin ? 'LOGIN' : 'REGISTER'} failed:`, { status: res.status, message: errorMsg });
        setError(errorMsg);
        setSubmitting(false);
        return;
      }

      let responseData;
      try {
        responseData = await res.json();
        console.log(`[AUTH] ${isLogin ? 'LOGIN' : 'REGISTER'} successful:`, responseData);
      } catch (parseErr) {
        console.error("[AUTH] Failed to parse response JSON:", parseErr);
        setError("Failed to parse authentication response");
        setSubmitting(false);
        return;
      }
      
      // Validate response data
      if (!responseData || typeof responseData !== 'object') {
        console.error("[AUTH] Invalid response data structure:", responseData);
        setError("Invalid authentication response");
        setSubmitting(false);
        return;
      }
      
      console.log("[AUTH] Response data validated successfully");
      
      // Save credentials on successful login
      saveCredentials(username.trim(), password);
      console.log("[AUTH] Credentials saved, redirecting to game...");
      
      // Reload page to trigger game context update
      window.location.href = "/";
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[AUTH] Network/exception error:", errorMsg, err);
      setError("Network error. Please try again. Check console for details.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-md bg-white border border-slate-300 text-slate-900 relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-orbitron font-bold tracking-wider text-slate-900">STELLAR DOMINION</CardTitle>
          <CardDescription className="text-slate-700 font-rajdhani text-lg font-medium mt-2">⚡ Command your fleet. Conquer the stars.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg text-xs text-slate-700 flex gap-2 items-start">
             <Shield className="w-4 h-4 shrink-0 mt-0.5 text-slate-600" />
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
                placeholder="Enter username (min 3 characters)"
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 mt-1 focus:border-slate-600 focus:ring-slate-600"
                data-testid="input-username"
                disabled={submitting}
                required
                minLength={3}
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-900 text-sm font-semibold">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 pr-10 focus:border-slate-600 focus:ring-slate-600"
                  data-testid="input-password"
                  disabled={submitting}
                  required
                  minLength={6}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                  data-testid="button-toggle-password"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <div className="text-red-700 text-sm bg-red-50 border border-red-300 p-2 rounded">{error}</div>}

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

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="w-full text-sm text-slate-700 hover:text-slate-900 underline transition-colors"
              disabled={submitting}
              data-testid="button-toggle-auth"
            >
              {isLogin ? "Create new account" : "Already have an account? Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                clearCredentials();
                setUsername("");
                setPassword("");
                setError("");
              }}
              className="w-full text-xs text-slate-500 hover:text-slate-700 underline transition-colors"
              disabled={submitting}
              data-testid="button-clear-credentials"
            >
              Clear saved credentials
            </button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4 pb-6 border-t border-slate-300 pt-6">
           <Link href="/about">
             <Button variant="ghost" className="text-slate-700 hover:text-slate-900 transition-colors" data-testid="button-about">
               <Info className="w-4 h-4 mr-2" /> About Stellar Dominion
             </Button>
           </Link>
           <div className="flex items-center gap-4 text-xs text-slate-600">
             <Link href="/terms" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-terms">
               Terms of Service
             </Link>
             <span>•</span>
             <Link href="/privacy" className="hover:text-slate-900 hover:underline transition-colors" data-testid="link-privacy">
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
