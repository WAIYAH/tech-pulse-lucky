import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-image.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().min(10, "Please enter a valid phone number."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
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

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, signInWithOAuth, authMode } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);
  const isBusy = isSubmitting || socialProvider !== null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName: validation.data.fullName,
      email: validation.data.email,
      phone: validation.data.phone,
      password: validation.data.password,
    });
    setIsSubmitting(false);

    if (!result.success) {
      toast({
        title: "Registration Failed",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Created",
      description: result.message,
    });

    if (result.user?.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (result.user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setSocialProvider(provider);
    const result = await signInWithOAuth(provider, "/register");

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
      <div className="absolute inset-0 bg-[radial-gradient(920px_430px_at_6%_8%,hsl(var(--accent)/0.12),transparent_72%),radial-gradient(980px_440px_at_95%_9%,hsl(var(--primary)/0.12),transparent_74%)]" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-2xl"
          >
            <Card className="border border-border/70 bg-card/95 shadow-[0_22px_65px_hsl(var(--foreground)/0.12)] backdrop-blur">
              <CardHeader className="space-y-3">
                <h1 className="text-3xl font-bold">
                  Create Your <span className="text-primary">LMS Account</span>
                </h1>
                <p className="text-muted-foreground">
                  Register and start learning practical tech skills with Lucky.
                </p>
                <p className="text-xs text-muted-foreground">
                  Auth mode:{" "}
                  {authMode === "supabase" ? "Supabase" : "Local (development)"}
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
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
                      : "Sign up with Google"}
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
                      : "Sign up with GitHub"}
                  </Button>
                </div>

                {authMode !== "supabase" && (
                  <p className="rounded-2xl border border-border/80 bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                    Social signup is disabled in local auth mode. Enable Supabase
                    auth to use Google or GitHub sign-in.
                  </p>
                )}

                <div className="relative py-1 text-center">
                  <span className="bg-card px-3 text-xs uppercase tracking-wide text-muted-foreground">
                    Or register with email
                  </span>
                  <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        maxLength={80}
                        autoComplete="name"
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: event.target.value,
                          }))
                        }
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        maxLength={20}
                        autoComplete="tel"
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="+2547..."
                        required
                      />
                    </div>
                  </div>

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

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        maxLength={128}
                        autoComplete="new-password"
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: event.target.value,
                          }))
                        }
                        placeholder="At least 8 characters"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        maxLength={128}
                        autoComplete="new-password"
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    disabled={isBusy}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative hidden overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 text-white shadow-2xl lg:block"
          >
            <img
              src={heroImage}
              alt="Students collaborating in a training workshop"
              width={1200}
              height={900}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/85 via-primary/70 to-accent/35" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="space-y-4">
                <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-white/90">
                  Start Learning Today
                </p>
                <h2 className="max-w-xl text-4xl font-extrabold leading-tight">
                  Build real skills with guided projects and mentorship.
                </h2>
                <p className="max-w-lg text-sm text-white/85">
                  Create your account and access roadmaps, course lessons, and
                  assessments designed for practical career growth.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-xs text-white/80">Practical lessons</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-white/80">Learning tracks</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">1:1</p>
                  <p className="text-xs text-white/80">Mentor support</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Register;
