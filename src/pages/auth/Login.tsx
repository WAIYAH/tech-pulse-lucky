import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, authMode } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <Card className="border-2">
            <CardHeader className="space-y-2">
              <h1 className="text-3xl font-bold">
                Login to <span className="text-primary">Your LMS Account</span>
              </h1>
              <p className="text-muted-foreground">
                Continue your learning journey with Get Techy With Lucky.
              </p>
              <p className="text-xs text-muted-foreground">
                Auth mode: {authMode === "supabase" ? "Supabase" : "Local (development)"}
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
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
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-2 text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
                <p className="text-muted-foreground">
                  New learner?{" "}
                  <Link to="/register" className="text-primary hover:underline font-semibold">
                    Create an account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

