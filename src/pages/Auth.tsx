import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.42 2.21-1.26 3.05-.84.84-1.94 1.32-3.04 1.23-.13-1.12.42-2.27 1.21-3.06.83-.83 2.06-1.36 3.09-1.22zM20.5 17.05c-.46 1.06-.69 1.53-1.28 2.46-.83 1.3-2 2.92-3.46 2.93-1.29.01-1.62-.84-3.37-.83-1.75.01-2.12.84-3.41.83-1.46-.01-2.57-1.47-3.4-2.77C2.49 15.65 1.83 11.13 3.84 8.7c1.43-1.73 3.69-2.74 5.81-2.74 2.16 0 3.52 1.18 5.31 1.18 1.73 0 2.79-1.18 5.29-1.18 1.89 0 3.89.98 5.31 2.67-4.66 2.55-3.9 9.21-3.06 8.42z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8L6.2 33C9.5 39.4 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41.4 35.4 44 30 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/";
  const { user, loading } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  // Sign in fields
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up fields
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email: siEmail, password: siPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate(redirectTo, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({
      displayName: suName,
      email: suEmail,
      password: suPassword,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: parsed.data.displayName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — you're signed in!");
    navigate(redirectTo, { replace: true });
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message ?? "Sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-12 md:py-20 flex items-center justify-center">
        <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-card p-8">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl">Welcome to 123kids</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Save favorites, leave reviews, and list your business.
            </p>
          </div>

          <div className="space-y-2 mb-5">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => handleOAuth("google")}
              disabled={busy}
            >
              <GoogleIcon /> Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => handleOAuth("apple")}
              disabled={busy}
            >
              <AppleIcon /> Continue with Apple
            </Button>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or with email</span>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input
                    id="si-password"
                    type="password"
                    autoComplete="current-password"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="size-4 animate-spin" />} Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Your name</Label>
                  <Input
                    id="su-name"
                    type="text"
                    autoComplete="name"
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password</Label>
                  <Input
                    id="su-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="size-4 animate-spin" />} Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By continuing you agree to our{" "}
            <Link to="/" className="underline hover:text-foreground">Terms</Link> &{" "}
            <Link to="/" className="underline hover:text-foreground">Privacy</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
