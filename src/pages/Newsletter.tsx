import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Zap, Shield, BookOpen, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const benefits = [
    {
      icon: Zap,
      title: "Weekly Tech Tips",
      description: "Actionable insights on cybersecurity, coding, and digital skills delivered every week.",
    },
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Get early access to articles, tutorials, and resources before they go public.",
    },
    {
      icon: Shield,
      title: "Cyber Safety Alerts",
      description: "Stay informed about the latest security threats and how to protect yourself online.",
    },
    {
      icon: Users,
      title: "Community Updates",
      description: "Be the first to know about webinars, masterclasses, and community events.",
    },
  ];

  const testimonials = [
    {
      name: "Peter Kamau",
      role: "Software Developer",
      text: "The weekly tips have genuinely helped me stay updated with the latest in tech. Highly recommend!",
    },
    {
      name: "Grace Muthoni",
      role: "Cybersecurity Student",
      text: "Lucky's newsletter is my go-to source for cybersecurity insights. Clear, practical, and relevant.",
    },
    {
      name: "James Otieno",
      role: "Tech Entrepreneur",
      text: "I've learned so much about AI and emerging tech from this newsletter. It's a must-subscribe!",
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.trim().toLowerCase(), name: name.trim() }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: "Welcome to Tech Pulse Insider! 🎉",
          description: "You've been successfully subscribed to our newsletter.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-accent" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're In! 🚀</h1>
          <p className="text-muted-foreground mb-6">
            Welcome to Tech Pulse Insider! Check your inbox for a welcome message 
            and get ready for weekly tech insights.
          </p>
          <Button variant="hero" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="text-primary">5,000+</span> Tech Enthusiasts
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get weekly tech tips, cybersecurity insights, career advice, and exclusive content 
            delivered straight to your inbox. Free forever, unsubscribe anytime.
          </p>

          {/* Subscription Form */}
          <motion.form
            onSubmit={handleSubscribe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-xl mx-auto"
          >
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe Now"}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              We respect your privacy and will never spam you.
            </p>
          </motion.form>
        </motion.div>

        {/* What You'll Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            What You'll <span className="text-primary">Receive</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sample Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            A Sneak Peek at Our <span className="text-primary">Content</span>
          </h2>
          <div className="bg-card border border-border rounded-3xl p-8 max-w-3xl mx-auto">
            <div className="border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-semibold">
                  LATEST ISSUE
                </span>
                <span>•</span>
                <span>January 2026</span>
              </div>
              <h3 className="text-xl font-bold">🔐 5 Password Mistakes You're Probably Making</h3>
            </div>
            <div className="text-muted-foreground space-y-3">
              <p>Hey there, tech enthusiast! 👋</p>
              <p>
                Did you know that 81% of data breaches are caused by weak or reused passwords? 
                In this week's issue, I'm sharing the 5 most common password mistakes I see — 
                and how to fix them today...
              </p>
              <p className="text-primary font-medium">Continue reading →</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            What Subscribers <span className="text-primary">Say</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-2">How often will I receive emails?</h3>
              <p className="text-muted-foreground">
                We send one email per week, typically on Fridays. Occasionally, you may receive 
                special announcements about webinars or important security alerts.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-2">Is the newsletter really free?</h3>
              <p className="text-muted-foreground">
                Yes, 100% free! We believe in accessible tech education. You'll never be charged 
                for our newsletter content.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-2">Can I unsubscribe anytime?</h3>
              <p className="text-muted-foreground">
                Absolutely. Every email includes an unsubscribe link. We respect your inbox and 
                make it easy to leave if our content isn't valuable to you.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-2">Will you share my email?</h3>
              <p className="text-muted-foreground">
                Never. We take privacy seriously. Your email is used only for sending our 
                newsletter and will never be sold or shared with third parties.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of tech professionals and enthusiasts who are leveling up their 
            skills every week. Subscribe now and get instant access to our welcome guide!
          </p>
          <Button 
            variant="accent" 
            size="lg" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Subscribe Now — It's Free!
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Newsletter;
