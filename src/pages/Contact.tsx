import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send to a backend
    toast({
      title: "Message Sent! 🎉",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "lucky@techpulseinsider.com",
      link: "mailto:lucky@techpulseinsider.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+254 123 456 789",
      link: "https://wa.me/254715674828",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Nairobi, Kenya",
      link: null,
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+254 715674828",
      link: "tel:+254715674828",
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
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Want to collaborate? Or just want to say hi? 
            We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Send us a Message</h2>
                <p className="text-muted-foreground">Fill out the form below and we'll respond within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Tell us more..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    <Send size={18} />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                Reach out through any of these channels. We're here to help!
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <info.icon className="text-primary" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.title}</p>
                          <p className="font-semibold">{info.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <info.icon className="text-primary" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.title}</p>
                          <p className="font-semibold">{info.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-primary text-white">
              <CardHeader>
                <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
                <p className="text-white/90">Get weekly tech tips and updates!</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button variant="accent">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action */}
            <Card className="border-2 border-accent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <MessageCircle className="text-accent" size={32} />
                  <div className="flex-grow">
                    <h3 className="font-semibold mb-1">Need Quick Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Chat with us on WhatsApp for instant support!
                    </p>
                  </div>
                  <Button variant="accent" asChild>
                    <a
                      href="https://wa.me/254123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
