import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CheckSquare, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    let result;
    if (isRegister) {
      if (!name.trim()) { setError("Numele este obligatoriu"); return; }
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-zinc-900 to-purple-600/10" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              TaskFlow
            </span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Gestioneaza-ti<br />sarcinile cu usurinta
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Organizeaza, prioritizeaza si finalizeaza task-urile echipei tale intr-un singur loc.
            </p>
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-400" style={{ fontFamily: "'Manrope', sans-serif" }}>100%</p>
                <p className="text-sm text-zinc-500 mt-1">Gratuit</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-400" style={{ fontFamily: "'Manrope', sans-serif" }}>3</p>
                <p className="text-sm text-zinc-500 mt-1">Vizualizari</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-400" style={{ fontFamily: "'Manrope', sans-serif" }}>Rapid</p>
                <p className="text-sm text-zinc-500 mt-1">Si Simplu</p>
              </div>
            </div>
          </div>
          <p className="text-zinc-700 text-sm">TaskFlow 2025</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>TaskFlow</span>
          </div>

          <div>
            <h2 data-testid="login-title" className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {isRegister ? "Creaza un cont" : "Bine ai revenit!"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isRegister ? "Inregistreaza-te pentru a incepe" : "Conecteaza-te la contul tau"}
            </p>
          </div>

          {!isRegister && (
            <div data-testid="demo-credentials" className="p-3 rounded-lg bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.2)]">
              <p className="text-sm text-[hsl(var(--primary))] font-mono">
                Demo: alex@taskflow.io / demo123
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            {isRegister && (
              <div className="space-y-2">
                <Label className="text-foreground">Nume complet</Label>
                <Input
                  data-testid="name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexandru Popescu"
                  className="h-11"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input
                data-testid="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.com"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Parola</Label>
              <div className="relative">
                <Input
                  data-testid="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introdu parola"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  data-testid="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p data-testid="login-error" className="text-sm text-destructive font-medium">{error}</p>}

            <Button
              data-testid="submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-primary-foreground font-medium transition-colors duration-150"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Creaza cont" : "Conecteaza-te"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? "Ai deja un cont?" : "Nu ai cont?"}{" "}
            <button
              data-testid="toggle-auth-mode"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-[hsl(var(--primary))] font-medium hover:underline transition-colors duration-150"
            >
              {isRegister ? "Conecteaza-te" : "Inregistreaza-te"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
