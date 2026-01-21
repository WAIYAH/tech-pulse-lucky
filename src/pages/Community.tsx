import { motion } from "framer-motion";
import { MessageCircle, Facebook, Instagram, Users, Heart, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Community = () => {
  const testimonials = [
    {
      name: "Jane Wanjiku",
      role: "Web Developer",
      image: "👩‍💻",
      text: "Lucky's webinars changed my career! I went from knowing nothing about coding to building my first website in 3 months.",
      rating: 5,
    },
    {
      name: "David Omondi",
      role: "Cybersecurity Analyst",
      image: "👨‍💼",
      text: "The community support is amazing. Everyone is willing to help and share knowledge. Best tech community in Kenya!",
      rating: 5,
    },
    {
      name: "Sarah Achieng",
      role: "Student",
      image: "👩‍🎓",
      text: "As a beginner, I felt welcomed and supported. The weekly tips are practical and easy to follow.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: "5,000+", label: "Community Members" },
    { icon: Star, value: "200+", label: "Success Stories" },
    { icon: Trophy, value: "50+", label: "Webinars Hosted" },
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
            Join Our <span className="text-primary">Tech Community</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with thousands of tech enthusiasts, share knowledge, and grow together. 
            Be part of Kenya's most vibrant digital learning community!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center p-8 hover:shadow-lg transition-all border-2 hover:border-primary/50">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-primary p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Join our community channels to stay updated, get help, and connect with fellow learners.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/254715674828?text=Hi!%20I%20want%20to%20join%20Tech%20Pulse%20Insider%20community!"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20"
                >
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">WhatsApp Group</h3>
                  <p className="text-sm text-white/80 mb-4">Daily tips & instant support</p>
                  <Button variant="accent" className="w-full">Join Now</Button>
                </motion.a>

                {/* Facebook */}
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20"
                >
                  <Facebook className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Facebook Page</h3>
                  <p className="text-sm text-white/80 mb-4">Updates & community posts</p>
                  <Button variant="accent" className="w-full">Follow Us</Button>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20"
                >
                  <Instagram className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Instagram</h3>
                  <p className="text-sm text-white/80 mb-4">Tips, stories & inspiration</p>
                  <Button variant="accent" className="w-full">Follow Us</Button>
                </motion.a>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Success <span className="text-primary">Stories</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{testimonial.image}</div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-secondary/30 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Community Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Inclusive</h3>
              <p className="text-sm text-muted-foreground">Everyone is welcome regardless of skill level</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Supportive</h3>
              <p className="text-sm text-muted-foreground">We help each other grow and succeed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">We strive for quality in everything we do</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Growth-Focused</h3>
              <p className="text-sm text-muted-foreground">Continuous learning and improvement</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
