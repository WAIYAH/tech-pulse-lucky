import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
import heroVideoMp4 from "@/assets/hero-video-optimized.mp4";
import heroVideoWebm from "@/assets/hero-video-optimized.webm";
import heroVideoPoster from "@/assets/hero-video-poster.webp";
import heroImage from "@/assets/hero-image.webp";
import heroImageAlt from "@/assets/hero-image-alt.webp";
import luckyProfile from "@/assets/lucky-profile-thumb.webp";
import githubLogo from "@/assets/logos/github.svg";
import googleCloudLogo from "@/assets/logos/google-cloud.svg";
import openSourceInitiativeLogo from "@/assets/logos/open-source-initiative.svg";
import reactLogo from "@/assets/logos/react.svg";
import supabaseLogo from "@/assets/logos/supabase.svg";
import vercelLogo from "@/assets/logos/vercel.svg";
import learnerEsther from "@/assets/learner-esther.svg";
import learnerBrian from "@/assets/learner-brian.svg";
import learnerGrace from "@/assets/learner-grace.svg";
import learnerDavid from "@/assets/learner-david.svg";
import learnerFaith from "@/assets/learner-faith.svg";
import learnerKevin from "@/assets/learner-kevin.svg";
import { getSortedArticles } from "@/content/articles";

const Home = () => {
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

  const businessFunctions = [
    {
      icon: BookOpen,
      title: "Structured Courses",
      description:
        "Browse beginner to advanced programs, including free lessons and paid masterclasses.",
    },
    {
      icon: Video,
      title: "Live Webinars",
      description:
        "Join interactive sessions where practical topics are broken down with demos and Q&A.",
    },
    {
      icon: Sparkles,
      title: "Weekly Tech Tips",
      description:
        "Get timely articles on coding, AI, cybersecurity, and digital career growth.",
    },
    {
      icon: Users,
      title: "Learning Community",
      description:
        "Stay accountable through peer support, feedback, and collaboration with other learners.",
    },
    {
      icon: Target,
      title: "Custom Training",
      description:
        "Teams and organizations can request tailored training programs for specific outcomes.",
    },
    {
      icon: TrendingUp,
      title: "Career Progression",
      description:
        "Build practical portfolios and skills aligned with freelancing, jobs, and business growth.",
    },
  ];

  const trustedEcosystem = [
    { name: "GitHub", note: "Collaboration workflows", logo: githubLogo },
    { name: "Google Cloud", note: "Cloud foundations", logo: googleCloudLogo },
    { name: "Supabase", note: "Modern backend patterns", logo: supabaseLogo },
    { name: "React", note: "Frontend learning stack", logo: reactLogo },
    { name: "Vercel", note: "Modern deployment culture", logo: vercelLogo },
    {
      name: "Open Source Initiative",
      note: "Open standards mindset",
      logo: openSourceInitiativeLogo,
    },
  ];

  const whyLearn = [
    {
      icon: BookOpen,
      title: "Beginner-Friendly Lessons",
      description:
        "Practical, jargon-free lessons designed for first-time learners.",
    },
    {
      icon: Award,
      title: "Africa-Relevant Skills",
      description:
        "Curriculum tailored for Kenyan and African tech opportunities.",
    },
    {
      icon: Sparkles,
      title: "Free and Paid Paths",
      description:
        "Start free and upgrade to premium masterclasses when you are ready.",
    },
    {
      icon: Users,
      title: "Active Community",
      description:
        "Get help and motivation from a supportive WhatsApp community.",
    },
    {
      icon: Code2,
      title: "Real-World Projects",
      description:
        "Build a portfolio with hands-on projects, not just theory.",
    },
    {
      icon: TrendingUp,
      title: "Career-Focused",
      description:
        "Skills that lead to jobs, freelancing, and tech entrepreneurship.",
    },
  ];

  const learningPaths = [
    {
      icon: MonitorSmartphone,
      title: "Computer and Internet Basics",
      description:
        "Master devices, files, and web navigation with confidence.",
    },
    {
      icon: Shield,
      title: "Safe Browsing and Cybersecurity",
      description: "Protect your accounts, devices, and personal data online.",
    },
    {
      icon: Code2,
      title: "HTML, CSS, and JavaScript",
      description:
        "Build modern responsive websites from scratch using frontend fundamentals.",
    },
    {
      icon: Github,
      title: "Git and GitHub",
      description:
        "Learn version control and collaborative workflows used by professional teams.",
    },
    {
      icon: Brain,
      title: "AI and Machine Learning",
      description:
        "Understand AI concepts, practical prompts, and beginner-friendly ML workflows.",
    },
    {
      icon: Database,
      title: "PHP, MySQL, and Backend",
      description:
        "Build dynamic applications with data models and server-side logic.",
    },
    {
      icon: Cloud,
      title: "DevOps and Cloud Intro",
      description:
        "Deploy, automate, and scale modern applications with confidence.",
    },
    {
      icon: Megaphone,
      title: "Digital Marketing for Startups",
      description:
        "Grow your tech product visibility and customer acquisition strategy.",
    },
    {
      icon: GraduationCap,
      title: "Career Readiness",
      description:
        "Strengthen your portfolio, interview confidence, and professional positioning.",
    },
  ];

  const steps = [
    {
      icon: BookOpen,
      title: "Choose a Course",
      description: "Browse free and premium courses or upcoming webinars.",
    },
    {
      icon: UserPlus,
      title: "Create Your Account",
      description: "Register in seconds to unlock your learner dashboard.",
    },
    {
      icon: CreditCard,
      title: "Access or Pay",
      description:
        "Start free instantly or unlock premium content with a simple payment process.",
    },
    {
      icon: GraduationCap,
      title: "Learn and Build",
      description:
        "Follow lessons, complete projects, and apply skills in practical tasks.",
    },
    {
      icon: CheckCircle2,
      title: "Track and Grow",
      description:
        "Monitor progress and keep building toward your career and business goals.",
    },
  ];

  const testimonials = [
    {
      quote:
        "I came for one webinar and stayed for the full learning path. The lessons are practical and easy to apply immediately.",
      name: "Esther W.",
      role: "Frontend Learner",
      image: learnerEsther,
    },
    {
      quote:
        "The platform combines courses, community, and accountability in one place. That made my transition into tech much faster.",
      name: "Brian K.",
      role: "Career Switcher",
      image: learnerBrian,
    },
    {
      quote:
        "From zero confidence in coding to building my first responsive portfolio, the guidance was clear and practical.",
      name: "Grace M.",
      role: "Junior Developer",
      image: learnerGrace,
    },
    {
      quote:
        "The mentorship and assignments helped me apply concepts at work immediately instead of just watching tutorials.",
      name: "David O.",
      role: "IT Support Specialist",
      image: learnerDavid,
    },
    {
      quote:
        "I loved the structure. Every week had clear milestones, and the community kept me consistent and motivated.",
      name: "Faith N.",
      role: "University Student",
      image: learnerFaith,
    },
    {
      quote:
        "The training gave me direction, practical projects, and confidence to apply for internships in tech.",
      name: "Kevin M.",
      role: "Internship Candidate",
      image: learnerKevin,
    },
  ];

  const testimonialsPerSlide = 3;
  const totalTestimonialSlides = Math.ceil(testimonials.length / testimonialsPerSlide);
  const [activeTestimonialSlide, setActiveTestimonialSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonialSlide((current) => (current + 1) % totalTestimonialSlides);
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [totalTestimonialSlides]);

  const visibleTestimonials = testimonials.slice(
    activeTestimonialSlide * testimonialsPerSlide,
    activeTestimonialSlide * testimonialsPerSlide + testimonialsPerSlide,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImageAlt}
            alt=""
            aria-hidden="true"
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="low"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-7"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/85 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur"
              >
                <Sparkles size={16} className="text-accent" />
                Practical Tech Learning for Africa
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                Build Skills with
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Tech Pulse Insider
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                One platform for courses, webinars, tech tips, custom training, and community support.
                Learn at your pace, build real projects, and grow your digital career with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/webinars">Book a Masterclass</Link>
                </Button>
                <Button variant="accent" size="lg" asChild>
                  <Link to="/community">Join Community</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  "Free + premium learning paths",
                  "Live practical webinars",
                  "Career-focused projects",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-primary/15 bg-card/90 px-4 py-3 text-sm font-medium text-foreground/90 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={heroVideoPoster}
                  width={1280}
                  height={720}
                  className="w-full h-auto"
                >
                  <source src={heroVideoWebm} type="video/webm" />
                  <source src={heroVideoMp4} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-7 -left-4 sm:-left-8 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <img
                    src={luckyProfile}
                    alt="Lucky Nakola"
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-xl object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-semibold">Mentor-Led Learning</p>
                    <p className="text-xs text-muted-foreground">Courses, webinars, and guided growth</p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-accent/25 blur-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Ecosystem */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Learning with tools and standards used across modern teams
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedEcosystem.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border/80 bg-card p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-inner">
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <p className="text-lg font-semibold tracking-wide">{item.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
              </motion.div>
            ))}
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
              What This Platform <span className="text-primary">Actually Does</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tech Pulse Insider is not only an LMS. It is a full learning ecosystem built for skill development,
              live mentorship, knowledge publishing, and practical career progression.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessFunctions.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
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
      <section className="py-20 bg-secondary/20">
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
                key={item.title}
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
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
              Choose a path and build practical skills with content designed for real-world application.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="p-6 bg-card/95 backdrop-blur border border-border rounded-2xl hover:shadow-lg hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                  <path.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{path.description}</p>
                <Link to="/courses" className="text-sm font-semibold text-primary hover:underline">
                  Explore
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
              A simple learner flow from discovery to measurable progress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
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

      {/* Quotes Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learner <span className="text-primary">Voices</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real feedback from people using the platform for growth, transition, and team learning.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`voices-slide-${activeTestimonialSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleTestimonials.map((item) => (
                <motion.figure
                  key={item.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 rounded-full object-cover border border-border/70"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-foreground leading-relaxed text-sm">
                    "{item.quote}"
                  </blockquote>
                </motion.figure>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalTestimonialSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveTestimonialSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeTestimonialSlide === index ? "w-8 bg-primary" : "w-2.5 bg-border"
                }`}
                aria-label={`Show learner voices slide ${index + 1}`}
              />
            ))}
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
              Stay updated with weekly insights on software, AI, cybersecurity, and digital careers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestTips.map((tip, index) => (
              <TipCard key={tip.title} {...tip} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/tips">View All Tips and Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-95" />
        </div>

        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.22, 0.36, 0.22] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.22, 0.34, 0.22] }}
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
              Join learners building practical digital skills through guided courses, live webinars,
              and a supportive growth-focused community.
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
