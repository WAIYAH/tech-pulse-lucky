import { motion } from "framer-motion";
import { Search } from "lucide-react";
import TipCard from "@/components/TipCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Tips = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const allTips = [
    {
      title: "Essential Cybersecurity Tips for Remote Workers",
      summary: "Learn how to protect your data and privacy while working from home. Discover VPN usage, strong passwords, and 2FA authentication strategies that keep you safe online.",
      date: "May 15, 2025",
      tags: ["Cybersecurity", "Remote Work", "Privacy"],
    },
    {
      title: "Getting Started with Web Development in 2025",
      summary: "A beginner's guide to modern web development tools and frameworks. Learn HTML, CSS, JavaScript, and React to start your coding journey today!",
      date: "May 10, 2025",
      tags: ["Web Dev", "Beginners", "Career"],
    },
    {
      title: "AI Tools Every Professional Should Know",
      summary: "Boost your productivity with these essential AI tools. From ChatGPT to automation software, discover how AI can transform your workflow.",
      date: "May 5, 2025",
      tags: ["AI", "Productivity", "Tools"],
    },
    {
      title: "Understanding Cloud Computing Basics",
      summary: "Demystifying cloud computing for beginners. Learn about AWS, Azure, and Google Cloud, and how they're changing the tech landscape.",
      date: "April 30, 2025",
      tags: ["Cloud", "Infrastructure", "Beginners"],
    },
    {
      title: "Mobile App Development: Native vs Cross-Platform",
      summary: "Choosing the right approach for your mobile app. Compare React Native, Flutter, and native development to make informed decisions.",
      date: "April 25, 2025",
      tags: ["Mobile", "Development", "Flutter"],
    },
    {
      title: "Data Privacy Laws You Should Know in Kenya",
      summary: "Understanding Kenya's data protection regulations and how they affect your business and personal data handling practices.",
      date: "April 20, 2025",
      tags: ["Privacy", "Legal", "Kenya"],
    },
    {
      title: "Building Your First E-commerce Website",
      summary: "Step-by-step guide to creating an online store. Learn about payment integration, inventory management, and customer experience.",
      date: "April 15, 2025",
      tags: ["E-commerce", "Business", "Web Dev"],
    },
    {
      title: "Introduction to Blockchain Technology",
      summary: "Understanding blockchain beyond cryptocurrency. Explore real-world applications and how this technology is reshaping industries.",
      date: "April 10, 2025",
      tags: ["Blockchain", "Innovation", "Finance"],
    },
    {
      title: "Git & GitHub for Beginners",
      summary: "Master version control essentials. Learn how to collaborate on code projects and manage your development workflow effectively.",
      date: "April 5, 2025",
      tags: ["Git", "Collaboration", "Tools"],
    },
  ];

  const filteredTips = allTips.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            Tech Tips & <span className="text-primary">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Weekly insights on technology, cybersecurity, career development, and digital innovation.
            Stay ahead with expert knowledge shared by Lucky Nakola.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search tips and articles..."
              className="pl-10 pr-4 py-6 rounded-2xl border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip, index) => (
            <TipCard key={index} {...tip} index={index} />
          ))}
        </div>

        {filteredTips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No articles found matching your search. Try different keywords!
            </p>
          </motion.div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-primary rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Never Miss a Tip!</h2>
          <p className="text-lg mb-6 text-white/90">
            Subscribe to our newsletter and get weekly tech insights delivered to your inbox.
          </p>
          <button className="bg-accent text-accent-foreground px-8 py-3 rounded-2xl font-semibold hover:bg-accent/90 transition-all hover:scale-105">
            Subscribe Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Tips;
