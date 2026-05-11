import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import heroImageAlt from "@/assets/hero-image-alt.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type SocialProvider = "google" | "github";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    focusable="false"
    className="h-5 w-5 shrink-0"
  >
    <path
      fill="#EA4335"
      d="M12 4.77c1.76 0 3.35.61 4.59 1.8l3.44-3.44C17.94 1.15 15.23 0 12 0 7.32 0 3.28 2.69 1.3 6.58l4 3.11C6.24 6.88 8.88 4.77 12 4.77z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.61v2.99h3.87c2.26-2.08 3.56-5.15 3.56-8.63z"
    />
    <path
      fill="#FBBC05"
      d="M5.3 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.57.38-2.31V6.58H1.3A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.3 5.42l4-3.11z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-2.99c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.95H1.3v3.11A11.99 11.99 0 0 0 12 24z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    focusable="false"
    className="h-5 w-5 shrink-0 fill-current"
  >
    <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.64 1.66.23 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .297z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, signInWithOAuth, authMode } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);

  const locationState = (location.state as
    | { from?: string; reason?: string }
    | null) ?? { from: "/dashboard" };

  const from = locationState.from ?? "/dashboard";
  const isBusy = isSubmitting || socialProvider !== null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await login(validation.data as { email: string; password: string });
    setIsSubmitting(false);

    if (!result.success) {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back",
      description: result.message,
    });

    const fallbackTarget = result.user?.role === "admin" ? "/admin" : "/dashboard";
    const target = from === "/login" || from === "/register" ? fallbackTarget : from;
    navigate(target, { replace: true });
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setSocialProvider(provider);
    const result = await signInWithOAuth(provider, "/login");

    if (!result.success) {
      setSocialProvider(null);
      toast({
        title: "Unable to continue",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Redirecting",
      description: result.message,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-16">
      <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_5%_10%,hsl(var(--primary)/0.1),transparent_70%),radial-gradient(1000px_450px_at_92%_6%,hsl(var(--accent)/0.14),transparent_72%)]" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative hidden overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 text-white shadow-2xl lg:block"
          >
            <img
              src={heroImageAlt}
              alt="Students learning together in an online class"
              width={1200}
              height={900}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/75 to-primary/65" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="space-y-4">
                <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-white/90">
                  LMS Access Portal
                </p>
                <h1 className="max-w-xl text-4xl font-extrabold leading-tight">
                  Welcome back to your tech growth journey.
                </h1>
                <p className="max-w-lg text-sm text-white/85">
                  Sign in to continue your enrolled courses, live sessions, and
                  weekly assignments inside Get Techy With Lucky LMS.
                </p>
              </div>

              <div className="grid gap-4 pt-8 text-sm">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  Structured beginner-to-pro pathways
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  Practical projects reviewed by mentors
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  Flexible learning from any device
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-xl"
          >
            <Card className="border border-border/70 bg-card/95 shadow-[0_22px_65px_hsl(var(--foreground)/0.12)] backdrop-blur">
              <CardHeader className="space-y-3">
                <h1 className="text-3xl font-bold">
                  Login to <span className="text-primary">Your LMS Account</span>
                </h1>
                <p className="text-muted-foreground">
                  Continue your learning journey with Get Techy With Lucky.
                </p>
                <p className="text-xs text-muted-foreground">
                  Auth mode:{" "}
                  {authMode === "supabase" ? "Supabase" : "Local (development)"}
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                {locationState.reason === "login_required" && (
                  <p className="rounded-2xl border border-border/80 bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                    Please login to continue.
                  </p>
                )}

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full justify-start border-border/80 bg-background/90 text-foreground hover:bg-muted"
                    onClick={() => handleSocialSignIn("google")}
                    disabled={isBusy}
                  >
                    <GoogleIcon />
                    {socialProvider === "google"
                      ? "Connecting to Google..."
                      : "Continue with Google"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full justify-start border-border/80 bg-background/90 text-foreground hover:bg-muted"
                    onClick={() => handleSocialSignIn("github")}
                    disabled={isBusy}
                  >
                    <GitHubIcon />
                    {socialProvider === "github"
                      ? "Connecting to GitHub..."
                      : "Continue with GitHub"}
                  </Button>
                </div>

                {authMode !== "supabase" && (
                  <p className="rounded-2xl border border-border/80 bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                    Social login is disabled in local auth mode. Enable Supabase
                    auth to use Google or GitHub sign-in.
                  </p>
                )}

                <div className="relative py-1 text-center">
                  <span className="bg-card px-3 text-xs uppercase tracking-wide text-muted-foreground">
                    Or continue with email
                  </span>
                  <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      maxLength={120}
                      autoComplete="email"
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      maxLength={128}
                      autoComplete="current-password"
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    disabled={isBusy}
                  >
                    {isSubmitting ? "Signing in..." : "Login"}
                  </Button>
                </form>

                <div className="flex flex-col gap-2 text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                  <p className="text-muted-foreground">
                    New learner?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-primary hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
