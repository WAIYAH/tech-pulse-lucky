import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import SEO from "@/components/common/SEO";
import {
  containsUnsafeContent,
  createSafeTextSchema,
  emailSchema,
  honeypotSchema,
} from "@/lib/validation";
import { routes } from "@/routes/routeConfig";

const contactSchema = z.object({
  name: createSafeTextSchema("Name", 2, 80),
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .max(120, "Subject must be 120 characters or less.")
    .refine((value) => !containsUnsafeContent(value), {
      message: "Subject contains unsupported characters.",
    })
    .optional()
    .or(z.literal("")),
  message: createSafeTextSchema("Message", 10, 1500),
  website: honeypotSchema.optional().or(z.literal("")),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    });
    setIsSubmitting(false);
  };

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = emailSchema.safeParse(newsletterEmail);
    if (!validation.success) {
      toast({
        title: "Invalid Email",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    setIsNewsletterSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setIsNewsletterSubmitting(false);
    setNewsletterEmail("");

    toast({
      title: "Subscribed",
      description: "You have joined the newsletter updates list.",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "lucky@nakolaexpertsystems.com",
      link: "mailto:lucky@nakolaexpertsystems.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+254 715674828",
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
      <SEO
        title="Contact | Tech Pulse Insider"
        description="Contact Tech Pulse Insider for course guidance, custom training requests, webinar questions, and beginner-friendly tech support."
        canonicalPath={routes.public.contact}
        keywords="contact Tech Pulse Insider, custom training Kenya, tech courses support, get techy with lucky contact"
      />
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
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      maxLength={80}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      maxLength={120}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      maxLength={120}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us more..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      maxLength={1500}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending..." : "Send Message"}
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
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    autoComplete="email"
                    maxLength={120}
                    required
                  />
                  <Button variant="accent" type="submit" disabled={isNewsletterSubmitting}>
                    {isNewsletterSubmitting ? "Saving..." : "Subscribe"}
                  </Button>
                </form>
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
                      href="https://wa.me/254715674828"
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
