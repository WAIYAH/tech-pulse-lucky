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
  Clock3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { z } from "zod";
import SEO from "@/components/common/SEO";
import heroImage from "@/assets/hero-image.webp";
import heroImageAlt from "@/assets/hero-image-alt.webp";
import showcaseCourse from "@/assets/global-showcase-course.webp";
import showcaseAnalytics from "@/assets/global-showcase-analytics.webp";
import showcaseCoach from "@/assets/global-showcase-coach.webp";
import luckyProfile from "@/assets/lucky-profile-full.webp";
import { routes } from "@/routes/routeConfig";
import {
  containsUnsafeContent,
  createSafeTextSchema,
  emailSchema,
  honeypotSchema,
  phoneSchema,
} from "@/lib/validation";

const customTrainingSchema = z.object({
  organizationName: createSafeTextSchema("Organization name", 2, 120),
  contactPerson: createSafeTextSchema("Contact person", 2, 80),
  email: emailSchema,
  phone: phoneSchema,
  trainingTopics: createSafeTextSchema("Training topic", 2, 120),
  participants: z
    .string()
    .trim()
    .regex(/^\d+$/, "Participants must be a valid number.")
    .refine((value) => Number(value) >= 1, {
      message: "Participants must be at least 1.",
    })
    .refine((value) => Number(value) <= 5000, {
      message: "Participants cannot exceed 5000.",
    }),
  deliveryMode: createSafeTextSchema("Delivery mode", 3, 80),
  notes: z
    .string()
    .trim()
    .max(1500, "Notes must be 1500 characters or less.")
    .refine((value) => !containsUnsafeContent(value), {
      message: "Notes contain unsupported characters.",
    })
    .optional()
    .or(z.literal("")),
  website: honeypotSchema.optional().or(z.literal("")),
});

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
    website: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const trackImages = [showcaseCourse, showcaseAnalytics, showcaseCoach];

  const trainingAreas = [
    {
      icon: Laptop,
      title: "Computer and Internet Basics",
      description: "Essential digital literacy for beginners and non-tech users.",
    },
    {
      icon: Shield,
      title: "Cybersecurity and Safe Browsing",
      description: "Protect your organization from online threats, scams, and weak access practices.",
    },
    {
      icon: Code,
      title: "Web Development (HTML, CSS, JavaScript)",
      description: "Build modern, responsive websites from the ground up.",
    },
    {
      icon: Brain,
      title: "AI and Machine Learning Fundamentals",
      description: "Explore AI applications and practical ML workflows for teams.",
    },
    {
      icon: TrendingUp,
      title: "Digital Skills for Productivity",
      description: "Boost team efficiency using modern digital tools and automation habits.",
    },
    {
      icon: Cloud,
      title: "Cloud, DevOps, and Modern IT Practices",
      description: "Scale your infrastructure and delivery with cloud and DevOps essentials.",
    },
  ].map((area, idx) => ({
    ...area,
    image: trackImages[idx % trackImages.length],
  }));

  const steps = [
    {
      number: 1,
      title: "Submit Your Request",
      description: "Tell us your team goals, current skill level, and priority outcomes.",
    },
    {
      number: 2,
      title: "Needs Assessment",
      description: "We scope a practical training plan with relevant modules and pacing.",
    },
    {
      number: 3,
      title: "Schedule Sessions",
      description: "Pick preferred dates, cadence, and delivery format with your stakeholders.",
    },
    {
      number: 4,
      title: "Delivery and Support",
      description: "Get live facilitation, actionable resources, and post-training follow-up.",
    },
  ];

  const deliveryOptions = [
    {
      icon: Monitor,
      title: "Online",
      description: "Zoom or Google Meet sessions with flexible scheduling.",
      image: showcaseAnalytics,
    },
    {
      icon: MapPin,
      title: "On-site",
      description: "In-person facilitation at your office or selected venue.",
      image: showcaseCourse,
    },
    {
      icon: Users,
      title: "Hybrid",
      description: "Mix virtual and physical sessions for distributed teams.",
      image: showcaseCoach,
    },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = customTrainingSchema.safeParse(formData);
    if (!validation.success) {
      setFormErrorMessage(validation.error.issues[0]?.message ?? "Invalid form data.");
      setFormStatus("error");
      return;
    }

    try {
      setFormStatus("submitting");
      setFormErrorMessage("");

      const subject = `Custom Training Request from ${formData.organizationName}`;
      const body = `
Organization: ${validation.data.organizationName}
Contact Person: ${validation.data.contactPerson}
Email: ${validation.data.email}
Phone: ${validation.data.phone}
Training Topic(s): ${validation.data.trainingTopics}
Number of Participants: ${validation.data.participants}
Preferred Delivery Mode: ${validation.data.deliveryMode}
Additional Notes: ${validation.data.notes || "N/A"}
      `.trim();

      const mailtoLink = `mailto:luckiesadabwoy@gmail.com?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;
      setFormStatus("success");

      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        trainingTopics: "",
        participants: "",
        deliveryMode: "",
        notes: "",
        website: "",
      });
    } catch (error) {
      setFormStatus("error");
      setFormErrorMessage(
        "Something went wrong while preparing your request email. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <SEO
        title="Custom Training | Tech Pulse Insider"
        description="Request tailored digital skills training for your team in web development, AI, cybersecurity, and modern tech workflows."
        canonicalPath={routes.public.customTraining}
        keywords="custom tech training Kenya, corporate tech training Nairobi, cybersecurity training, AI training for teams"
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImageAlt}
            alt=""
            aria-hidden="true"
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/85 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Sparkles size={16} className="text-accent" />
                Tailored Team Upskilling Programs
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                Custom Tech Training for
                <span className="block text-primary">Teams and Organizations</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Practical, Africa-relevant training designed around your business goals.
                From digital literacy to cloud and AI, we build a program that your team can
                apply immediately in real work.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "Curriculum tailored to your context",
                  "Flexible online, onsite, or hybrid delivery",
                  "Post-training support and resources",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-primary/15 bg-card/85 px-4 py-3 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
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
                    document.getElementById("training-areas")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Training Areas
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-border/70 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Custom training workshop"
                  width={1920}
                  height={1080}
                  loading="eager"
                  decoding="async"
                  className="h-[430px] w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl backdrop-blur max-w-[270px]">
                <p className="text-sm font-semibold mb-1">Response Time</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock3 size={14} className="text-primary" />
                  We normally respond within 24 hours.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section id="training-areas" className="py-20 px-4 bg-card/45">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Training Areas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose one focus area or combine multiple tracks into a single blended program.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingAreas.map((area, idx) => {
              const IconComponent = area.icon;

              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full overflow-hidden border-border/70 bg-card/95 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                    <img
                      src={area.image}
                      alt={area.title}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      decoding="async"
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2 leading-tight">{area.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery + Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-border/70 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="text-muted-foreground">
                  A clear process from your request to delivery and follow-up.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-xl border border-border/70 bg-background/80 p-4 flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-3">Flexible Delivery Options</h2>
                <p className="text-muted-foreground">
                  Pick the format that matches your team structure and schedule.
                </p>
              </div>

              <div className="space-y-4">
                {deliveryOptions.map((option, idx) => {
                  const IconComponent = option.icon;

                  return (
                    <motion.div
                      key={option.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <Card className="overflow-hidden border-border/70 bg-card/95 hover:border-primary/40 transition-colors">
                        <div className="grid sm:grid-cols-[160px_1fr]">
                          <img
                            src={option.image}
                            alt={option.title}
                            width={1024}
                            height={1024}
                            loading="lazy"
                            decoding="async"
                            className="h-40 sm:h-full w-full object-cover"
                          />
                          <CardContent className="pt-6">
                            <div className="flex gap-3 items-start">
                              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                                <IconComponent size={20} className="text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold mb-1">{option.title}</h3>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="training-form" className="py-20 px-4 bg-card/45">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                <h2 className="text-3xl font-bold">Request Custom Training</h2>
                <p className="text-muted-foreground mt-2">
                  Fill this form and we will respond with a tailored proposal.
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
                      <h4 className="font-semibold mb-1">Request Submitted</h4>
                      <p className="text-sm">
                        Your request has been opened in your email client. Send it and we will review quickly.
                      </p>
                    </div>
                  </motion.div>
                )}

                {formStatus === "error" && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {formErrorMessage ||
                      "Something went wrong while preparing your email request. Please try again."}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    className="hidden"
                    value={formData.website}
                    onChange={handleFormChange}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="organizationName" className="block text-sm font-semibold mb-2">Organization Name *</label>
                      <input
                        id="organizationName"
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleFormChange}
                        required
                        maxLength={120}
                        autoComplete="organization"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your organization name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPerson" className="block text-sm font-semibold mb-2">Contact Person *</label>
                      <input
                        id="contactPerson"
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleFormChange}
                        required
                        maxLength={80}
                        autoComplete="name"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="trainingEmail" className="block text-sm font-semibold mb-2">Email Address *</label>
                      <input
                        id="trainingEmail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        maxLength={120}
                        autoComplete="email"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="trainingPhone" className="block text-sm font-semibold mb-2">Phone Number *</label>
                      <input
                        id="trainingPhone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        maxLength={20}
                        autoComplete="tel"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="trainingTopics" className="block text-sm font-semibold mb-2">Training Topic(s) *</label>
                    <select
                      id="trainingTopics"
                      name="trainingTopics"
                      value={formData.trainingTopics}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a training topic...</option>
                      <option value="Computer and Internet Basics">Computer and Internet Basics</option>
                      <option value="Cybersecurity and Safe Browsing">Cybersecurity and Safe Browsing</option>
                      <option value="Web Development (HTML, CSS, JavaScript)">
                        Web Development (HTML, CSS, JavaScript)
                      </option>
                      <option value="AI and Machine Learning Fundamentals">
                        AI and Machine Learning Fundamentals
                      </option>
                      <option value="Digital Skills for Productivity">Digital Skills for Productivity</option>
                      <option value="Cloud, DevOps, and Modern IT Practices">
                        Cloud, DevOps, and Modern IT Practices
                      </option>
                      <option value="Multiple topics">Multiple topics (specify in notes)</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="participants" className="block text-sm font-semibold mb-2">Number of Participants *</label>
                      <input
                        id="participants"
                        type="number"
                        name="participants"
                        value={formData.participants}
                        onChange={handleFormChange}
                        required
                        min="1"
                        max="5000"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 20"
                      />
                    </div>

                    <div>
                      <label htmlFor="deliveryMode" className="block text-sm font-semibold mb-2">Preferred Delivery Mode *</label>
                      <select
                        id="deliveryMode"
                        name="deliveryMode"
                        value={formData.deliveryMode}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select delivery mode...</option>
                        <option value="Online (Zoom / Google Meet)">Online (Zoom / Google Meet)</option>
                        <option value="Physical / On-site">Physical / On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold mb-2">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={4}
                      maxLength={1500}
                      placeholder="Share timeline, budget range, specific tools, or any requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? "Submitting..." : "Submit Training Request"}
                    {formStatus !== "submitting" && <ArrowRight size={20} />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/70 bg-card/95">
                <CardContent className="pt-6">
                  <img
                    src={luckyProfile}
                    alt="Lucky Nakola"
                    width={1200}
                    height={1196}
                    loading="lazy"
                    decoding="async"
                    className="h-56 w-full rounded-xl object-cover mb-5"
                  />
                  <h3 className="text-xl font-bold mb-1">Lucky Nakola</h3>
                  <p className="text-sm text-muted-foreground mb-4">Lead Trainer, Tech Pulse Insider</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Practical facilitation across web development, cloud, DevOps, AI foundations,
                    and workforce digital upskilling for organizations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="pt-6 space-y-4">
                  <h4 className="font-bold text-lg">What happens after you submit?</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      We review your goals and current team level.
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      We send a recommended module plan and schedule options.
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      We align on delivery and begin your training rollout.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() =>
                      (window.location.href =
                        "mailto:luckiesadabwoy@gmail.com?subject=Custom Training Inquiry")
                    }
                  >
                    <Mail size={18} />
                    Email Us Directly
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden border-2 border-primary/30">
            <div className="relative">
              <img
                src={heroImageAlt}
                alt="Custom training call to action"
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover absolute inset-0 opacity-25"
              />
              <CardContent className="relative z-10 py-14 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-5">
                  Ready to Build a Future-Ready Team?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let us design a training program your team can apply immediately.
                  Share your goals and we will shape a practical learning roadmap.
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
                    Talk to Us
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CustomTraining;
