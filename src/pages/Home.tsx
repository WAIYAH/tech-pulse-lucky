import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Video,
  Sparkles,
  Target,
  Award,
  Shield,
  Code2,
  Brain,
  Database,
  Cloud,
  Megaphone,
  Github,
  MonitorSmartphone,
  UserPlus,
  CreditCard,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TipCard from "@/components/TipCard";
import heroVideo from "@/assets/hero-video.mp4";
import { getSortedArticles } from "@/content/articles";

const Home = () => {
  // Get the 3 latest articles for the tips section
  const latestArticles = getSortedArticles().slice(0, 3);
  
  const latestTips = latestArticles.map((article) => ({
    title: article.title,
    summary: article.description,
    date: new Date(article.publishDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    tags: article.tags,
  }));

  const features = [
    {
      icon: BookOpen,
      title: "Weekly Tech Tips",
      description: "Get expert insights on cybersecurity, coding, and innovation delivered weekly.",
    },
    {
      icon: Video,
      title: "Live Webinars",
      description: "Join free webinars and masterclasses with industry experts.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded tech enthusiasts and grow together.",
    },
    {
      icon: Award,
      title: "Vision 2030 Aligned",
      description: "Supporting Kenya's digital transformation and UN SDG goals.",
    },
  ];

  const whyLearn = [
    { icon: BookOpen, title: "Beginner-Friendly Lessons", description: "Practical, jargon-free lessons designed for first-time learners." },
    { icon: Award, title: "Africa-Relevant Skills", description: "Curriculum tailored for Kenyan and African tech opportunities." },
    { icon: Sparkles, title: "Free & Paid Paths", description: "Start free and upgrade to premium masterclasses when you're ready." },
    { icon: Users, title: "Active Community", description: "Get help and motivation from a supportive WhatsApp community." },
    { icon: Code2, title: "Real-World Projects", description: "Build a portfolio with hands-on projects, not just theory." },
    { icon: TrendingUp, title: "Career-Focused", description: "Skills that lead to jobs, freelancing, and tech entrepreneurship." },
  ];

  const learningPaths = [
    { icon: MonitorSmartphone, title: "Computer & Internet Basics", description: "Master devices, files, and the web with confidence." },
    { icon: Shield, title: "Safe Browsing & Cybersecurity", description: "Protect yourself and your data online." },
    { icon: Code2, title: "HTML, CSS & JavaScript", description: "Build modern, responsive websites from scratch." },
    { icon: Github, title: "Git & GitHub", description: "Version control essentials every developer needs." },
    { icon: Brain, title: "AI & Machine Learning", description: "Understand AI fundamentals and start using AI tools." },
    { icon: Database, title: "PHP, MySQL & Backend", description: "Build dynamic apps with databases and server logic." },
    { icon: Cloud, title: "DevOps & Cloud Intro", description: "Deploy, automate, and scale modern applications." },
    { icon: Megaphone, title: "Digital Marketing for Startups", description: "Grow your tech brand and reach customers online." },
  ];

  const steps = [
    { icon: BookOpen, title: "Choose a Course", description: "Browse free and premium courses or upcoming webinars." },
    { icon: UserPlus, title: "Create Your Account", description: "Register in seconds to unlock the LMS dashboard." },
    { icon: CreditCard, title: "Access or Pay", description: "Start free instantly or unlock premium with a simple payment." },
    { icon: GraduationCap, title: "Learn & Build", description: "Follow lessons, complete projects, and download resources." },
    { icon: CheckCircle2, title: "Track & Grow", description: "Monitor your progress and grow your tech career." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full font-medium"
              >
                <Sparkles size={18} className="text-accent" />
                Get Techy with Lucky
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Tech Pulse Insider
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Your gateway to tech education, cybersecurity, and digital innovation. 
                Join a thriving community of learners from Nairobi and beyond!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/community">Join the Community</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/webinars">Book a Masterclass</Link>
                </Button>
                <Button variant="accent" size="lg" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <video
                  src={heroVideo}
                  autoPlay
                  muted
                  loop
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Tech Pulse Insider</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering the next generation of tech leaders through education and community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Learn With <span className="text-primary">Get Techy With Lucky</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A trusted learning home for African beginners and aspiring tech professionals.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyLearn.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You Can <span className="text-primary">Learn</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick a learning path and start building real skills today.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                  <path.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{path.description}</p>
                <Link to="/courses" className="text-sm font-semibold text-primary hover:underline">
                  Explore →
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="hero" size="lg" asChild>
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How the <span className="text-primary">Platform Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Five simple steps from sign-up to your first tech win.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative p-6 bg-card border border-border rounded-2xl text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 mt-2">
                  <step.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Start Learning Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Tips Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-primary">Tech Tips</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with our weekly insights on tech, security, and career growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestTips.map((tip, index) => (
              <TipCard key={index} {...tip} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/tips">View All Tips & Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Target size={48} className="mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of learners building their future in tech. Get access to exclusive content, 
              live webinars, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link to="/community">Join Community Now</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/webinars">Explore Webinars</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
