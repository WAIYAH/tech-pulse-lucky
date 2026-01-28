import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EventDetails = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();

  // Event data mapping - centralized data
  const eventsData: Record<string, any> = {
    "basics-of-it-safe-internet-browsing": {
      title: "Basics of IT & Safe Internet Browsing",
      date: "February 10, 2026",
      time: "10:00 AM - 12:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: {
        total: 100,
        available: 87,
      },
      description:
        "Master the fundamentals of IT and learn essential practices for safe internet browsing. This comprehensive webinar covers computer basics, smartphone essentials, internet fundamentals, and practical strategies to protect yourself from online scams and threats.",
      longDescription:
        "In today's digital age, understanding the basics of information technology and practicing safe internet habits is crucial. This webinar is designed for anyone looking to strengthen their digital literacy and online safety practices. Whether you're a beginner or someone wanting to refresh your knowledge, this session will equip you with practical skills to navigate the internet securely.",
      targetAudience: "Beginners, small business owners, anyone new to digital technology",
      topics: [
        "Computer and smartphone fundamentals",
        "Internet basics and how it works",
        "Online safety best practices",
        "Identifying and avoiding scams",
        "Digital hygiene and password management",
        "Safe browsing habits",
      ],
      trainer: "Lucky Nakola",
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    "web-development-html-css-javascript": {
      title: "Web Development Using HTML, CSS & JavaScript",
      date: "February 24, 2026",
      time: "9:00 AM - 5:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 250",
      spots: {
        total: 30,
        available: 12,
      },
      description:
        "Learn practical frontend web development from scratch with real-world projects. Build your first website using HTML, CSS, and JavaScript while working on hands-on exercises and real-world projects.",
      longDescription:
        "This intensive full-day masterclass is perfect for aspiring web developers. You'll learn to build responsive, modern websites using HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of the session, you'll have a solid foundation and a working project portfolio.",
      targetAudience:
        "Aspiring web developers, career changers, entrepreneurs wanting to build web products",
      topics: [
        "HTML essentials and semantic markup",
        "CSS styling and responsive design",
        "JavaScript fundamentals and DOM manipulation",
        "Building real-world projects",
        "Version control with Git",
        "Deploying your first website",
      ],
      trainer: "Lucky Nakola",
      paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    "ai-machine-learning-getting-started": {
      title: "AI & Machine Learning: Getting Started",
      date: "March 18, 2026",
      time: "2:00 PM - 4:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: {
        total: 75,
        available: 54,
      },
      description:
        "Introduction to artificial intelligence and machine learning concepts. Explore real-world applications, beginner-friendly tools, and how AI is transforming industries.",
      longDescription:
        "Curious about AI and machine learning but don't know where to start? This webinar demystifies AI concepts and shows you practical applications. You'll learn about machine learning basics, explore real-world use cases, and discover tools you can use today.",
      targetAudience:
        "Tech enthusiasts, career explorers, anyone interested in AI/ML basics",
      topics: [
        "What is AI and Machine Learning?",
        "Real-world applications of AI",
        "ML algorithms explained simply",
        "Popular AI tools and platforms",
        "Ethics in AI",
        "Future trends and opportunities",
      ],
      trainer: "Lucky Nakola",
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    "advanced-software-engineering-javascript-xampp-mysql": {
      title: "Advanced Software Engineering (JavaScript + XAMPP & MySQL)",
      date: "April 22, 2026",
      time: "9:00 AM - 6:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 350",
      spots: {
        total: 25,
        available: 8,
      },
      description:
        "Dive into backend development, database design, API development, and full-stack workflows. Learn to build complete, production-ready applications.",
      longDescription:
        "Take your development skills to the next level. This comprehensive masterclass covers backend development using JavaScript, working with XAMPP for local development, and MySQL for database management. You'll learn professional software engineering practices and build a complete full-stack application.",
      targetAudience:
        "Web developers wanting to expand to backend, junior developers, aspiring full-stack engineers",
      topics: [
        "Backend development fundamentals",
        "Node.js and Express frameworks",
        "Database design with MySQL",
        "RESTful API development",
        "Authentication and security",
        "Deployment and DevOps basics",
      ],
      trainer: "Lucky Nakola",
      paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    "digital-marketing-for-tech-startups": {
      title: "Digital Marketing for Tech Startups",
      date: "May 20, 2026",
      time: "3:00 PM - 5:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: {
        total: 80,
        available: 62,
      },
      description:
        "Learn effective digital marketing strategies for tech products. Master branding, social media, customer acquisition, and growth hacking for startups.",
      longDescription:
        "Building an amazing tech product is just the first step. This webinar teaches you how to market it effectively. Learn proven strategies for building your brand, growing your audience, and acquiring customers—all on a startup budget.",
      targetAudience:
        "Tech entrepreneurs, startup founders, product managers, solo developers",
      topics: [
        "Tech branding essentials",
        "Social media strategy for tech",
        "Content marketing for growth",
        "Customer acquisition tactics",
        "Growth hacking principles",
        "Building community around your product",
      ],
      trainer: "Lucky Nakola",
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
    "devops-cloud-computing": {
      title: "DevOps & Cloud Computing",
      date: "July 29, 2026",
      time: "10:00 AM - 5:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 400",
      spots: {
        total: 20,
        available: 3,
      },
      description:
        "Master CI/CD pipelines, cloud fundamentals, deployment strategies, and modern DevOps practices. Learn to scale applications efficiently.",
      longDescription:
        "DevOps is transforming how applications are built and deployed. This masterclass covers the tools, practices, and mindset needed for modern infrastructure management. You'll learn cloud platforms, containerization, automation, and deployment best practices.",
      targetAudience:
        "Backend developers, system administrators, tech leads, engineering teams",
      topics: [
        "Cloud computing fundamentals",
        "Docker and containerization",
        "CI/CD pipelines and automation",
        "Infrastructure as Code",
        "Monitoring and logging",
        "Scaling and performance optimization",
      ],
      trainer: "Lucky Nakola",
      paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
      bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
    },
  };

  const event = eventsData[eventSlug || ""];

  if (!event) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/webinars")} className="gap-2">
            <ArrowLeft size={18} />
            Back to Webinars
          </Button>
        </div>
      </div>
    );
  }

  const getSpotStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (available === 0) return { label: "Sold Out", color: "bg-red-500" };
    if (percentage <= 20) return { label: "Almost Full", color: "bg-orange-500" };
    return { label: "Open", color: "bg-green-500" };
  };

  const spotStatus = getSpotStatus(event.spots.available, event.spots.total);

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/webinars")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Webinars</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                        event.type === "free" ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      {event.type === "free" ? "FREE WEBINAR" : "PAID MASTERCLASS"}
                    </span>
                    {event.type === "paid" && (
                      <span className="text-3xl font-bold text-primary">
                        {event.price}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {event.title}
                  </h1>
                </div>
              </div>

              {/* Event Meta */}
              <div className="flex flex-col sm:flex-row gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary flex-shrink-0" size={20} />
                  <span>{event.time}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Long Description Card */}
            <Card className="mb-8 border-2">
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed">{event.longDescription}</p>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Who Should Attend?</h2>
              <p className="text-muted-foreground text-lg">{event.targetAudience}</p>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.topics.map((topic: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trainer Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Your Trainer</h3>
                <p className="text-muted-foreground">
                  {event.trainer} brings real-world industry experience and practical insights to every session.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Spots Available Card */}
            <Card className="mb-6 border-2 sticky top-20">
              <CardHeader>
                <h3 className="text-lg font-bold">Availability</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Slots Available</span>
                    <span className="text-2xl font-bold text-primary">
                      {event.spots.available}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(event.spots.available / event.spots.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {event.spots.available} of {event.spots.total} spots remaining
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${spotStatus.color}`}
                    >
                      {spotStatus.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card (Paid Only) */}
            {event.type === "paid" && (
              <Card className="mb-6 border-2">
                <CardHeader>
                  <h3 className="text-lg font-bold">Payment Methods</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.paymentMethods?.map((method: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">{method}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    ✓ Payment confirmation unlocks access
                  </p>
                </CardContent>
              </Card>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                size="lg"
                className="w-full gap-2"
                variant={event.type === "free" ? "hero" : "accent"}
                onClick={() => window.open(event.bookingLink, "_blank")}
              >
                {event.type === "free" ? "Register via Google Form" : "Register via Google Form"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  (window.location.href = `mailto:luckiesadabwoy@gmail.com?subject=Support for ${event.title}`)
                }
              >
                <Mail size={18} />
                Contact Support
              </Button>
            </div>

            {/* Info Box */}
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6 text-sm text-muted-foreground">
                <p className="mb-3">
                  <span className="font-semibold text-foreground">Questions?</span> Reach
                  out to our support team anytime.
                </p>
                <a
                  href="mailto:luckiesadabwoy@gmail.com"
                  className="text-primary font-semibold hover:underline"
                >
                  luckiesadabwoy@gmail.com
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
