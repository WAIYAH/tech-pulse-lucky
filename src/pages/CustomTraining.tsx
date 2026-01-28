import { motion } from "framer-motion";
import {
  Laptop,
  Shield,
  Code,
  Brain,
  TrendingUp,
  Cloud,
  ArrowRight,
  CheckCircle2,
  Monitor,
  MapPin,
  Users,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";

const CustomTraining = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    trainingTopics: "",
    participants: "",
    deliveryMode: "",
    notes: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  const trainingAreas = [
    {
      icon: Laptop,
      title: "Computer & Internet Basics",
      description: "Essential digital literacy for beginners and non-tech users",
    },
    {
      icon: Shield,
      title: "Cybersecurity & Safe Browsing",
      description: "Protect your organization from online threats and scams",
    },
    {
      icon: Code,
      title: "Web Development (HTML, CSS, JavaScript)",
      description: "Build modern, responsive websites from the ground up",
    },
    {
      icon: Brain,
      title: "AI & Machine Learning Fundamentals",
      description: "Explore AI applications and practical ML solutions",
    },
    {
      icon: TrendingUp,
      title: "Digital Skills for Business & Productivity",
      description: "Boost team efficiency with modern digital tools",
    },
    {
      icon: Cloud,
      title: "Cloud, DevOps & Modern IT Practices",
      description: "Scale your infrastructure with cloud and DevOps expertise",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Submit Your Request",
      description: "Tell us about your organization and training needs",
    },
    {
      number: 2,
      title: "Needs Assessment",
      description: "We evaluate and customize a program tailored to you",
    },
    {
      number: 3,
      title: "Schedule Sessions",
      description: "Choose dates, times, and delivery method that work best",
    },
    {
      number: 4,
      title: "Delivery & Support",
      description: "Professional training with ongoing resources and follow-up",
    },
  ];

  const deliveryOptions = [
    {
      icon: Monitor,
      title: "Online",
      description: "Zoom / Google Meet - flexible and accessible",
    },
    {
      icon: MapPin,
      title: "Physical / On-site",
      description: "At your location - immersive team experience",
    },
    {
      icon: Users,
      title: "Hybrid",
      description: "Mix of online and in-person sessions",
    },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      // Construct email data
      const subject = `Custom Training Request from ${formData.organizationName}`;
      const body = `
Organization: ${formData.organizationName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
Training Topic(s): ${formData.trainingTopics}
Number of Participants: ${formData.participants}
Preferred Delivery Mode: ${formData.deliveryMode}
Additional Notes: ${formData.notes}
      `.trim();

      const mailtoLink = `mailto:luckiesadabwoy@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Open mailto link
      window.location.href = mailtoLink;

      // Show success message
      setFormStatus("success");

      // Reset form
      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        trainingTopics: "",
        participants: "",
        deliveryMode: "",
        notes: "",
      });

      // Reset status after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 px-4"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Custom Tech Training for
            <span className="text-primary"> Teams & Organizations</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Tailored, practical, and Africa-relevant digital skills training designed to
            transform your team's capabilities. From computer basics to advanced DevOps, we
            customize every program to your organization's unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="hero"
              onClick={() =>
                document.getElementById("training-form")?.scrollIntoView({ behavior: "smooth" })
              }
              className="gap-2"
            >
              Request Custom Training
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline">
              Join Waitlist
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Training Areas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-card/50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Training Areas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer specialized training across multiple tech domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingAreas.map((area, idx) => {
              const IconComponent = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <CardContent className="pt-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                          <IconComponent size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, straightforward process to get your team trained
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative h-full">
                  <CardContent className="pt-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>

                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2">
                      <ArrowRight className="text-primary/30" size={24} />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Delivery Options */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-card/50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Flexible Delivery Options</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the training format that works best for your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {deliveryOptions.map((option, idx) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <CardContent className="pt-8">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                        <IconComponent size={32} className="text-accent" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{option.title}</h3>
                      <p className="text-muted-foreground text-sm">{option.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Training Request Form */}
      <motion.section
        id="training-form"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="container mx-auto max-w-3xl">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
              <h2 className="text-3xl font-bold">Request Custom Training</h2>
              <p className="text-muted-foreground mt-2">
                Fill out the form below and we'll be in touch within 24 hours
              </p>
            </CardHeader>

            <CardContent className="pt-8">
              {formStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Request Submitted!</h4>
                    <p className="text-sm">
                      Your training request has been sent. We'll review it and contact you
                      shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Training Topic(s) *
                  </label>
                  <select
                    name="trainingTopics"
                    value={formData.trainingTopics}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a training topic...</option>
                    <option value="Computer & Internet Basics">
                      Computer & Internet Basics
                    </option>
                    <option value="Cybersecurity & Safe Browsing">
                      Cybersecurity & Safe Browsing
                    </option>
                    <option value="Web Development (HTML, CSS, JavaScript)">
                      Web Development (HTML, CSS, JavaScript)
                    </option>
                    <option value="AI & Machine Learning Fundamentals">
                      AI & Machine Learning Fundamentals
                    </option>
                    <option value="Digital Skills for Business & Productivity">
                      Digital Skills for Business & Productivity
                    </option>
                    <option value="Cloud, DevOps & Modern IT Practices">
                      Cloud, DevOps & Modern IT Practices
                    </option>
                    <option value="Multiple topics">Multiple topics (specify in notes)</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Number of Participants *
                    </label>
                    <input
                      type="number"
                      name="participants"
                      value={formData.participants}
                      onChange={handleFormChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Preferred Delivery Mode *
                    </label>
                    <select
                      name="deliveryMode"
                      value={formData.deliveryMode}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select delivery mode...</option>
                      <option value="Online (Zoom / Google Meet)">
                        Online (Zoom / Google Meet)
                      </option>
                      <option value="Physical / On-site">Physical / On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={4}
                    placeholder="Tell us more about your training needs, timeline, budget, or any special requirements..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  {formStatus === "submitting" ? "Submitting..." : "Submit Training Request"}
                  {formStatus !== "submitting" && <ArrowRight size={20} />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your request will be sent to luckiesadabwoy@gmail.com. We'll contact you within
                  24 hours to discuss your specific needs.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Trust & Credibility */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-card/50"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Tech Pulse Insider?</h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Expert Trainer</h4>
                    <p className="text-sm text-muted-foreground">
                      Led by Lucky Nakola with proven industry experience
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Tailored Solutions</h4>
                    <p className="text-sm text-muted-foreground">
                      Every program is customized to your organization's goals
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Africa-Relevant Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Training designed for African contexts and opportunities
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Ongoing Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Resources and follow-up support after training completion
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Flexible & Scalable</h4>
                    <p className="text-sm text-muted-foreground">
                      Works for small teams to large organizations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-2 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="pt-8">
                <div className="space-y-6 text-center">
                  <div>
                    <h3 className="text-3xl font-bold text-primary mb-2">Lucky Nakola</h3>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Tech Pulse Insider Founder & Lead Trainer
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">
                      With years of experience in tech education and real-world industry
                      practice, Lucky brings practical, job-ready training that makes a real
                      difference to teams and organizations across Africa.
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Experience in:</strong> Web Development, Cloud Computing, DevOps,
                      Digital Marketing, and Tech Education
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Team's Skills?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get in touch today to discuss your custom training needs. We're ready to partner
                with you to build a tech-skilled, future-ready team.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() =>
                    document.getElementById("training-form")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="gap-2"
                >
                  Request Custom Training
                  <ArrowRight size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    (window.location.href =
                      "mailto:luckiesadabwoy@gmail.com?subject=Custom Training Inquiry")
                  }
                  className="gap-2"
                >
                  <Mail size={20} />
                  Email Us
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                Or contact us directly at{" "}
                <a
                  href="mailto:luckiesadabwoy@gmail.com"
                  className="text-primary font-semibold hover:underline"
                >
                  luckiesadabwoy@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default CustomTraining;
