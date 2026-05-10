import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, authMode } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2">
            <CardHeader className="space-y-2">
              <h1 className="text-3xl font-bold">
                Create Your <span className="text-primary">LMS Account</span>
              </h1>
              <p className="text-muted-foreground">
                Register and start learning practical tech skills with Lucky.
              </p>
              <p className="text-xs text-muted-foreground">
                Auth mode: {authMode === "supabase" ? "Supabase" : "Local (development)"}
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, fullName: event.target.value }))
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
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, phone: event.target.value }))
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
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, password: event.target.value }))
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

                <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

