import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle2,
  Timer,
  Building2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lmsConfig } from "@/data/lmsConfig";

type Webinar = {
  id: number;
  title: string;
  slug: string;
  date: string;
  startsAt: string; // ISO date for countdown
  time: string;
  duration: string;
  type: "free" | "paid";
  price?: string;
  priceAmount?: number;
  spots: number;
  description: string;
  topics: string[];
  bookingLink: string;
};

const useCountdown = (target: string) => {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isLive: diff === 0 };
};

const CountdownBlock = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 min-w-[60px]">
    <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
);

const Webinars = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [activeWebinar, setActiveWebinar] = useState<Webinar | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [txCode, setTxCode] = useState("");

  const upcomingWebinars: Webinar[] = [
    {
      id: 1,
      title: "Basics of IT & Safe Internet Browsing",
      slug: "basics-of-it-safe-internet-browsing",
      date: "March 13, 2026",
      startsAt: "2026-03-13T19:00:00+03:00",
      time: "07:00 PM - 09:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: 100,
      description: "Computer basics, smartphones, internet fundamentals, online safety, scams, and digital hygiene.",
      topics: ["Internet Fundamentals", "Online Safety", "Avoiding Scams", "Digital Hygiene"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    {
      id: 2,
      title: "Web Development Using HTML, CSS & JavaScript",
      slug: "web-development-html-css-javascript",
      date: "March 20, 2026",
      startsAt: "2026-03-20T19:00:00+03:00",
      time: "7:00 PM - 9:00 PM EAT",
      duration: "3 Days, Friday to Sunday",
      type: "paid",
      price: "KES 300",
      priceAmount: 300,
      spots: 30,
      description: "Practical frontend web development from scratch with real projects.",
      topics: ["HTML Essentials", "CSS Styling", "JavaScript Fundamentals", "Real Projects"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    {
      id: 3,
      title: "AI & Machine Learning: Getting Started",
      slug: "ai-machine-learning-getting-started",
      date: "March 27, 2026",
      startsAt: "2026-03-27T19:00:00+03:00",
      time: "7:00 PM - 9:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: 75,
      description: "Introduction to AI, ML concepts, real-world use cases, and beginner tools.",
      topics: ["AI Basics", "ML Concepts", "Real-World Applications", "ML Tools"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    {
      id: 4,
      title: "Advanced Software Engineering (JavaScript + XAMPP & MySQL)",
      slug: "advanced-software-engineering-javascript-xampp-mysql",
      date: "April 22, 2026",
      startsAt: "2026-04-22T19:00:00+03:00",
      time: "7:00 PM - 9:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 500",
      priceAmount: 500,
      spots: 25,
      description: "Backend development, databases, APIs, and full-stack workflows.",
      topics: ["Backend Development", "Database Design", "API Development", "Full-Stack Workflows"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    {
      id: 5,
      title: "Digital Marketing for Tech Startups",
      slug: "digital-marketing-for-tech-startups",
      date: "May 20, 2026",
      startsAt: "2026-05-20T19:00:00+03:00",
      time: "7:00 PM - 9:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: 80,
      description: "Branding, online growth, social media, and customer acquisition for tech products.",
      topics: ["Tech Branding", "Social Media Strategy", "Customer Acquisition", "Growth Hacking"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    {
      id: 6,
      title: "DevOps & Cloud Computing",
      slug: "devops-cloud-computing",
      date: "July 29, 2026",
      startsAt: "2026-07-29T19:00:00+03:00",
      time: "7:00 PM - 9:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 800",
      priceAmount: 800,
      spots: 20,
      description: "CI/CD, cloud fundamentals, deployment, and modern DevOps practices.",
      topics: ["CI/CD Pipelines", "Cloud Fundamentals", "Deployment Strategies", "DevOps Tools"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
  ];

  const featured = useMemo(() => {
    const now = Date.now();
    return (
      [...upcomingWebinars]
        .filter((w) => new Date(w.startsAt).getTime() > now)
        .sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        )[0] ?? upcomingWebinars[0]
    );
  }, [upcomingWebinars]);

  const countdown = useCountdown(featured.startsAt);

  const openCheckout = (w: Webinar) => {
    setActiveWebinar(w);
    setTxCode("");
    setCheckoutOpen(true);
  };

  const openWaitlist = (w: Webinar) => {
    setActiveWebinar(w);
    setWaitlistEmail("");
    setWaitlistOpen(true);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied`, description: text });
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  const submitPayment = () => {
    if (txCode.trim().length < 5) {
      toast({
        title: "Enter a valid M-Pesa code",
        description: "The transaction code looks too short.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Payment submitted",
      description: `We received code ${txCode.trim().toUpperCase()}. You'll get confirmation on WhatsApp shortly.`,
    });
    setCheckoutOpen(false);
  };

  const submitWaitlist = () => {
    if (!/^\S+@\S+\.\S+$/.test(waitlistEmail)) {
      toast({
        title: "Enter a valid email",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "You're on the waitlist",
      description: `We'll notify ${waitlistEmail} as soon as a spot opens.`,
    });
    setWaitlistOpen(false);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Webinars & <span className="text-primary">Masterclasses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join live interactive sessions with Lucky Nakola. Learn from industry experts and 
            accelerate your tech career with hands-on training.
          </p>
          <p className="text-sm text-accent font-semibold mt-4">
            Secure checkout via KCB Bank Paybill {lmsConfig.payment.paybillNumber}
          </p>
        </motion.div>

        {/* Featured countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-10"
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Timer size={14} /> Next live session
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mb-4">{featured.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} className="text-primary" /> {featured.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} className="text-primary" /> {featured.time}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {featured.type === "free" ? (
                  <Button
                    variant="hero"
                    onClick={() => window.open(featured.bookingLink, "_blank")}
                  >
                    Register Free
                  </Button>
                ) : (
                  <Button variant="hero" onClick={() => openCheckout(featured)}>
                    Book for {featured.price}
                  </Button>
                )}
                <Button variant="outline" onClick={() => openWaitlist(featured)}>
                  Join Waitlist
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-3">
                {countdown.isLive ? "We're live now" : "Starts in"}
              </p>
              <div className="flex justify-center gap-2 md:gap-3">
                <CountdownBlock label="Days" value={countdown.days} />
                <CountdownBlock label="Hours" value={countdown.hours} />
                <CountdownBlock label="Mins" value={countdown.minutes} />
                <CountdownBlock label="Secs" value={countdown.seconds} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Webinar Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingWebinars.map((webinar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      webinar.type === 'free' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {webinar.type === 'free' ? 'FREE WEBINAR' : 'PAID MASTERCLASS'}
                    </span>
                    {webinar.type === 'paid' && (
                      <span className="text-primary font-bold text-lg">{webinar.price}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-2">{webinar.title}</h3>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                  <p className="text-muted-foreground">{webinar.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} className="text-primary" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} className="text-primary" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video size={16} className="text-primary" />
                      <span>{webinar.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users size={16} className="text-primary" />
                      <span>{webinar.spots} spots available</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">What you'll learn:</p>
                    <div className="space-y-1">
                      {webinar.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex flex-col w-full gap-2">
                    {webinar.type === "free" ? (
                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={() => window.open(webinar.bookingLink, "_blank")}
                      >
                        Register Now
                      </Button>
                    ) : (
                      <Button
                        variant="accent"
                        className="w-full"
                        onClick={() => openCheckout(webinar)}
                      >
                        Pay & Book — {webinar.price}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openWaitlist(webinar)}
                    >
                      Join Waitlist
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Want a Custom Training for Your Team?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            We offer tailored training sessions for organizations and teams. Contact us to discuss 
            your specific needs and get a personalized learning experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/custom-training")}>
              Request Custom Training
            </Button>
            <Button variant="outline" size="lg">
              Join Waitlist
            </Button>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6">
            <Video className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Live & Interactive</h3>
            <p className="text-sm text-muted-foreground">
              All sessions are live with Q&A opportunities and hands-on exercises.
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Community Access</h3>
            <p className="text-sm text-muted-foreground">
              Join our exclusive WhatsApp group for continued learning and support.
            </p>
          </div>
          <div className="text-center p-6">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Certificate of Completion</h3>
            <p className="text-sm text-muted-foreground">
              Receive a certificate for paid masterclasses to showcase your skills.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="text-primary" size={20} />
              Secure Checkout — KCB Bank
            </DialogTitle>
            <DialogDescription>
              {activeWebinar?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-bold text-primary text-lg">
                  {activeWebinar?.price ?? "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paybill (KCB)</span>
                <button
                  type="button"
                  onClick={() => copyText(lmsConfig.payment.paybillNumber, "Paybill")}
                  className="font-semibold inline-flex items-center gap-1 hover:text-primary"
                >
                  {lmsConfig.payment.paybillNumber} <Copy size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account No.</span>
                <button
                  type="button"
                  onClick={() => copyText(lmsConfig.payment.accountNumber, "Account number")}
                  className="font-semibold inline-flex items-center gap-1 hover:text-primary"
                >
                  {lmsConfig.payment.accountNumber} <Copy size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Name</span>
                <span className="font-semibold">{lmsConfig.payment.accountName}</span>
              </div>
            </div>

            <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-5">
              <li>Open M-Pesa → Lipa na M-Pesa → Paybill.</li>
              <li>Enter Business Number {lmsConfig.payment.paybillNumber} (KCB Bank).</li>
              <li>Enter Account {lmsConfig.payment.accountNumber}.</li>
              <li>Enter the exact amount above and confirm.</li>
              <li>Paste the M-Pesa confirmation code below.</li>
            </ol>

            <div className="space-y-2">
              <Label htmlFor="txCode">M-Pesa Transaction Code</Label>
              <Input
                id="txCode"
                placeholder="e.g. SK1A2B3C4D"
                value={txCode}
                onChange={(e) => setTxCode(e.target.value)}
                className="uppercase tracking-wider"
              />
            </div>

            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <ShieldCheck size={14} className="text-accent" />
              Payments are verified manually within 1 hour during business hours.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={submitPayment}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join the Waitlist</DialogTitle>
            <DialogDescription>
              We'll email you the moment a spot opens for {activeWebinar?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="wlEmail">Email address</Label>
            <Input
              id="wlEmail"
              type="email"
              placeholder="you@example.com"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaitlistOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={submitWaitlist}>
              Notify Me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Webinars;
