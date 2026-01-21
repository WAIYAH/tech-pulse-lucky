import { motion } from "framer-motion";
import { Calendar, Clock, Users, Video, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const Webinars = () => {
  const upcomingWebinars = [
    {
      title: "Cybersecurity Essentials for Small Businesses",
      date: "January 20, 2026",
      time: "2:00 PM - 4:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: 50,
      description: "Learn how to protect your business from cyber threats. Covers password management, data encryption, and incident response.",
      topics: ["Password Security", "Data Protection", "Threat Prevention"],
    },
    {
      title: "Web Development Bootcamp: React & TypeScript",
      date: "January 25, 2026",
      time: "10:00 AM - 5:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 200",
      spots: 30,
      description: "Intensive hands-on workshop building modern web applications. Perfect for beginners looking to start their development career.",
      topics: ["React Basics", "TypeScript", "API Integration", "Deployment"],
    },
    {
      title: "AI & Machine Learning: Getting Started",
      date: "January 30, 2026",
      time: "3:00 PM - 5:00 PM EAT",
      duration: "2 hours",
      type: "free",
      spots: 100,
      description: "Introduction to AI concepts and practical applications. No coding experience required - perfect for curious beginners!",
      topics: ["AI Basics", "ML Applications", "AI Tools", "Future Trends"],
    },
    {
      title: "Advanced Python Programming Masterclass",
      date: "February 5, 2026",
      time: "9:00 AM - 6:00 PM EAT",
      duration: "Full Day",
      type: "paid",
      price: "KES 300",
      spots: 25,
      description: "Deep dive into Python for data science and automation. Includes real-world projects and certification.",
      topics: ["Data Analysis", "Automation", "APIs", "Best Practices"],
    },
    {
      title: "Digital Marketing for Tech Startups",
      date: "February 18, 2026",
      time: "2:00 PM - 4:30 PM EAT",
      duration: "2.5 hours",
      type: "free",
      spots: 75,
      description: "Learn how to market your tech product effectively. SEO, social media, and content marketing strategies.",
      topics: ["SEO", "Social Media", "Content Strategy", "Analytics"],
    },
    {
      title: "Blockchain & Cryptocurrency Masterclass",
      date: "March 25, 2026",
      time: "1:00 PM - 6:00 PM EAT",
      duration: "5 hours",
      type: "paid",
      price: "KES 500",
      spots: 20,
      description: "Comprehensive guide to blockchain technology and cryptocurrency. Learn to build smart contracts and DApps.",
      topics: ["Blockchain Basics", "Smart Contracts", "DeFi", "NFTs"],
    },
  ];

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
                  <Button 
                    variant={webinar.type === 'free' ? 'hero' : 'accent'} 
                    className="w-full"
                  >
                    {webinar.type === 'free' ? 'Register Now' : 'Book Your Spot'}
                  </Button>
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
            <Button variant="hero" size="lg">
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
    </div>
  );
};

export default Webinars;
