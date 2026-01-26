import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Globe, Award, BookOpen, Users, 
  Twitter, Linkedin, Github, Mail, ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TipCard from "@/components/TipCard";
import luckyProfile from "@/assets/lucky-profile.jpg";

// Author data - in a real app, this would come from a database
const authors: Record<string, {
  id: string;
  name: string;
  title: string;
  bio: string;
  longBio: string;
  image: string;
  location: string;
  joinedDate: string;
  website?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  stats: {
    articles: number;
    webinars: number;
    students: number;
  };
  expertise: string[];
  achievements: string[];
}> = {
  "lucky-nakola": {
    id: "lucky-nakola",
    name: "Lucky Nakola",
    title: "Founder & Lead Educator",
    bio: "Fullstack Software Developer | Tech Educator | Community Builder",
    longBio: `Lucky Nakola is a passionate junior software developer and tech educator based in Nairobi, Kenya. 
    With a mission to bridge the digital divide, Lucky founded Tech Pulse Insider to provide accessible 
    tech education, cybersecurity awareness, and career development opportunities to aspiring tech 
    professionals across Africa.

    Through weekly tips, live webinars, and a supportive community, Lucky is contributing to Kenya's 
    Vision 2030 and the United Nations Sustainable Development Goals (SDG 4 & 9). His teaching style 
    is known for being practical, engaging, and beginner-friendly, making complex tech concepts 
    accessible to everyone.`,
    image: luckyProfile,
    location: "Nairobi, Kenya",
    joinedDate: "January 2024",
    website: "https://techpulseinsider.com",
    social: {
      twitter: "https://twitter.com/techpulseinsider",
      linkedin: "https://linkedin.com/in/luckynakola",
      github: "https://github.com/luckynakola",
      email: "lucky@techpulseinsider.com",
    },
    stats: {
      articles: 50,
      webinars: 25,
      students: 5000,
    },
    expertise: [
      "Web Development",
      "Cybersecurity",
      "React & TypeScript",
      "Python",
      "Cloud Computing",
      "AI & Machine Learning",
      "Digital Marketing",
      "Tech Education",
    ],
    achievements: [
      "Trained 5,000+ learners across Kenya",
      "Hosted 50+ webinars and masterclasses",
      "Built Kenya's growing tech education community",
      "Contributing to Vision 2030 digital goals",
      "Supporting UN SDG 4 (Education) & 9 (Innovation)",
    ],
  },
};

const Author = () => {
  const { authorId } = useParams();
  const author = authors[authorId || "lucky-nakola"];

  // Sample articles by this author
  const authorArticles = [
    {
      title: "Essential Cybersecurity Tips for Remote Workers",
      summary: "Learn how to protect your data and privacy while working from home. Discover VPN usage, strong passwords, and 2FA authentication strategies.",
      date: "May 15, 2025",
      tags: ["Cybersecurity", "Remote Work", "Privacy"],
    },
    {
      title: "Getting Started with Web Development in 2025",
      summary: "A beginner's guide to modern web development tools and frameworks. Learn HTML, CSS, JavaScript, and React.",
      date: "May 10, 2025",
      tags: ["Web Dev", "Beginners", "Career"],
    },
    {
      title: "AI Tools Every Professional Should Know",
      summary: "Boost your productivity with these essential AI tools. From ChatGPT to automation software.",
      date: "May 5, 2025",
      tags: ["AI", "Productivity", "Tools"],
    },
    {
      title: "Understanding Cloud Computing Basics",
      summary: "Demystifying cloud computing for beginners. Learn about AWS, Azure, and Google Cloud.",
      date: "April 30, 2025",
      tags: ["Cloud", "Infrastructure", "Beginners"],
    },
  ];

  if (!author) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The author you're looking for doesn't exist.
          </p>
          <Button variant="hero" asChild>
            <Link to="/tips">Browse Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Author Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/30 rounded-full blur-2xl"
                />
              </motion.div>
            </div>

            {/* Author Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{author.name}</h1>
                <p className="text-xl text-primary font-medium mb-2">{author.title}</p>
                <p className="text-lg text-muted-foreground">{author.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{author.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span>Joined {author.joinedDate}</span>
                </div>
                {author.website && (
                  <a 
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Globe size={16} className="text-primary" />
                    <span>Website</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {author.social.github && (
                  <a
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Github size={18} />
                  </a>
                )}
                {author.social.email && (
                  <a
                    href={`mailto:${author.social.email}`}
                    className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BookOpen size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">{author.stats.articles}+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">{author.stats.webinars}+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Webinars</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">{(author.stats.students / 1000).toFixed(0)}K+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">About {author.name.split(" ")[0]}</h2>
          <div className="bg-card border border-border rounded-2xl p-8">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {author.longBio}
            </p>
          </div>
        </motion.div>

        {/* Expertise & Achievements */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {author.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Key Achievements</h2>
            <ul className="space-y-3">
              {author.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Award className="text-accent flex-shrink-0 mt-1" size={18} />
                  <span className="text-muted-foreground">{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Author's Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Articles by {author.name.split(" ")[0]}
            </h2>
            <Button variant="outline" asChild>
              <Link to="/tips">View All Articles</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {authorArticles.map((article, index) => (
              <TipCard key={index} {...article} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Want to Learn from {author.name.split(" ")[0]}?</h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join our community for weekly tech tips, live webinars, and hands-on masterclasses. 
            Start your tech journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link to="/community">Join Community</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/webinars">View Webinars</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Author;
