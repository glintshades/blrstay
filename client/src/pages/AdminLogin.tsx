import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, ShieldCheck, BarChart2, Calendar, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoImage from "@assets/WhatsApp_Image_2026-03-07_at_9.44.22_AM-removebg-preview_1772895802233.png";

const FEATURES = [
  { icon: Calendar, text: "Manage booking inquiries" },
  { icon: BarChart2, text: "View analytics & revenue" },
  { icon: Eye, text: "Track website visitors" },
  { icon: ShieldCheck, text: "Secure, session-based access" },
];

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/admin/login", { password });
      toast({ title: "Welcome back!", description: "Redirecting to dashboard…" });
      setTimeout(() => { window.location.href = "/admin/dashboard"; }, 100);
    } catch {
      toast({ title: "Access denied", description: "Incorrect password. Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12" style={{ background: "hsl(215 40% 18%)" }}>
        <div>
          <img src={logoImage} alt="Blrstay" className="h-12 w-auto object-contain brightness-0 invert mb-12" />
          <h1 className="text-3xl font-bold text-white leading-snug mb-3">
            Premium PG Admin<br />Control Centre
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Manage your Blrstay property — bookings, guests, photos, and analytics — all in one place.
          </p>
          <div className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/70" />
                </div>
                <p className="text-white/70 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-white/30 text-xs">House 17, Raksha Layout, Honnenahalli · Yelahanka, Bangalore</p>
        </div>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="md:hidden">
            <img src={logoImage} alt="Blrstay" className="h-10 w-auto object-contain" />
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-5">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter your admin password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
                data-testid="input-admin-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign in to Admin Panel"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            <a href="/" className="hover:underline">← Back to Blrstay website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
