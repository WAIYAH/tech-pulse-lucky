import { motion } from "framer-motion";
import { Target, Globe, Lightbulb, Award, BookOpen, Users } from "lucide-react";
import luckyProfile from "@/assets/lucky-profile-full.webp";

const About = () => {
  const achievements = [
    { icon: Users, text: "Trained 5,000+ learners across Kenya" },
    { icon: BookOpen, text: "50+ webinars and masterclasses" },
    { icon: Award, text: "Contributing to Vision 2030 goals" },
    { icon: Globe, text: "Supporting UN SDG 4 & 9" },
  ];

  const sdgs = [
    {
      number: "4",
      title: "Quality Education",
      description: "Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.",
    },
    {
      number: "9",
      title: "Industry, Innovation & Infrastructure",
      description: "Building resilient infrastructure, promoting inclusive and sustainable industrialization and fostering innovation.",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Lucky Nakola</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fullstack Software Developer | Tech Educator | Community Builder
          </p>
        </motion.div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={luckyProfile}
                alt="Lucky Nakola"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-3xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Meet Lucky Nakola</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Based in Nairobi, Kenya, Lucky Nakola is a passionate junior software developer and tech educator 
              dedicated to empowering individuals through digital literacy and innovation.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              With a mission to bridge the digital divide, Lucky founded <strong>Tech Pulse Insider</strong> to 
              provide accessible tech education, cybersecurity awareness, and career development opportunities 
              to aspiring tech professionals across Africa.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Through weekly tips, live webinars, and a supportive community, Lucky is contributing to Kenya's 
              Vision 2030 and the United Nations Sustainable Development Goals.
            </p>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Impact & <span className="text-primary">Achievements</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="text-primary" size={28} />
                </div>
                <p className="font-medium">{achievement.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-primary rounded-3xl p-8 text-white"
          >
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/90 leading-relaxed">
              To empower individuals with practical tech skills, cybersecurity awareness, and digital literacy, 
              enabling them to thrive in the digital economy and contribute to Africa's technological advancement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-primary rounded-3xl p-8"
          >
            <Lightbulb className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A digitally empowered Africa where everyone has access to quality tech education, creating 
              opportunities for innovation, entrepreneurship, and sustainable development across the continent.
            </p>
          </motion.div>
        </div>

        {/* SDG Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Aligned with <span className="text-primary">UN SDGs</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tech Pulse Insider directly supports the United Nations Sustainable Development Goals
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sdgs.map((sdg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {sdg.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{sdg.title}</h3>
                    <p className="text-sm text-muted-foreground">{sdg.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision 2030 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-secondary/30 rounded-3xl p-8 md:p-12 text-center"
        >
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Supporting Kenya Vision 2030</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tech Pulse Insider contributes to Kenya's Vision 2030 by fostering a knowledge-based economy 
            through digital skills training, innovation promotion, and youth empowerment in technology. 
            We're helping build a globally competitive and prosperous Kenya.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
