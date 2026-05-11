import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await sendPasswordReset(validation.data.email);
    setIsSubmitting(false);

    if (!result.success) {
      toast({
        title: "Reset Request Failed",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reset Request Submitted",
      description: result.message,
    });
    setEmail("");
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
                Reset <span className="text-primary">Your Password</span>
              </h1>
              <p className="text-muted-foreground">
                Enter your account email and we will guide you through password reset.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    maxLength={120}
                    autoComplete="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Send Reset Instructions"}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Back to login
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
