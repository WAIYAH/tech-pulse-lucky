import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Megaphone, Users, Eye, TrendingUp, Globe, Mail, 
  FileText, Video, Newspaper, Podcast, CheckCircle2, Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MediaKit = () => {
  const audienceStats = [
    { icon: Users, value: "5,000+", label: "Community Members", growth: "+150% YoY" },
    { icon: Eye, value: "25,000+", label: "Monthly Page Views", growth: "+200% YoY" },
    { icon: TrendingUp, value: "3,500+", label: "Newsletter Subscribers", growth: "+180% YoY" },
    { icon: Globe, value: "15+", label: "Countries Reached", growth: "Growing" },
  ];

  const audienceDemographics = [
    { label: "Age 18-24", percentage: 35 },
    { label: "Age 25-34", percentage: 45 },
    { label: "Age 35-44", percentage: 15 },
    { label: "Age 45+", percentage: 5 },
  ];

  const audienceInterests = [
    "Software Development",
    "Cybersecurity",
    "AI & Machine Learning",
    "Cloud Computing",
    "Data Science",
    "Tech Startups",
    "Digital Marketing",
    "Career Development",
  ];

  const sponsorshipTiers = [
    {
      name: "Starter",
      price: "KES 15,000",
      period: "/month",
      features: [
        "Logo on website footer",
        "1 social media mention",
        "Newsletter mention (1x)",
        "Thank you post",
      ],
      popular: false,
    },
    {
      name: "Growth",
      price: "KES 50,000",
      period: "/month",
      features: [
        "Everything in Starter",
        "Sponsored article (1x)",
        "Banner ad on website",
        "Weekly newsletter feature",
        "Dedicated social media post",
        "Webinar mention",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "KES 150,000",
      period: "/month",
      features: [
        "Everything in Growth",
        "Co-branded webinar",
        "Premium article series (4x)",
        "Homepage banner placement",
        "Podcast/video feature",
        "Exclusive community access",
        "Custom analytics reports",
      ],
      popular: false,
    },
  ];

  const adFormats = [
    {
      icon: FileText,
      title: "Sponsored Articles",
      description: "In-depth content pieces written by our team or yours, clearly labeled as sponsored.",
      price: "From KES 25,000",
    },
    {
      icon: Newspaper,
      title: "Newsletter Sponsorship",
      description: "Featured placement in our weekly newsletter reaching 3,500+ engaged subscribers.",
      price: "From KES 10,000",
    },
    {
      icon: Video,
      title: "Webinar Sponsorship",
      description: "Brand visibility during our live webinars with 50-100+ attendees per session.",
      price: "From KES 30,000",
    },
    {
      icon: Megaphone,
      title: "Display Advertising",
      description: "Banner ads strategically placed across our high-traffic pages.",
      price: "From KES 8,000/month",
    },
    {
      icon: Podcast,
      title: "Podcast Feature",
      description: "Coming soon! Audio sponsorship for our upcoming podcast series.",
      price: "Contact us",
    },
  ];

  const pastPartners = [
    "Tech companies",
    "EdTech platforms",
    "Fintech startups",
    "Software training academies",
    "Coworking spaces",
    "Developer tools",
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
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Megaphone className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Partner with <span className="text-primary">Tech Pulse Insider</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Reach Kenya's most engaged tech community. Connect your brand with developers, 
            entrepreneurs, students, and tech enthusiasts who are shaping Africa's digital future.
          </p>
        </motion.div>

        {/* Audience Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Our <span className="text-primary">Audience</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50">
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="text-3xl font-bold text-primary mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground mb-2">{stat.label}</p>
                  <span className="text-xs text-accent font-semibold bg-accent/10 px-2 py-1 rounded-full">
                    {stat.growth}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 grid md:grid-cols-2 gap-12"
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Age Demographics</h3>
            <div className="space-y-4">
              {audienceDemographics.map((demo, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{demo.label}</span>
                    <span className="text-primary font-semibold">{demo.percentage}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${demo.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Audience Interests</h3>
            <div className="flex flex-wrap gap-3">
              {audienceInterests.map((interest, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl">
              <h4 className="font-semibold mb-2">Geographic Focus</h4>
              <p className="text-muted-foreground">
                <strong>70%</strong> Kenya | <strong>20%</strong> East Africa | <strong>10%</strong> Global
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sponsorship Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Sponsorship <span className="text-primary">Packages</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Flexible options to match your marketing goals and budget. All packages include 
            performance reports and direct communication with our team.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full flex flex-col ${tier.popular ? 'border-2 border-primary shadow-lg relative' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={14} /> Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-primary">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={tier.popular ? "hero" : "outline"} 
                      className="w-full mt-6"
                      asChild
                    >
                      <Link to="/contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ad Formats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Advertising <span className="text-primary">Formats</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adFormats.map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <format.icon className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{format.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{format.description}</p>
                    <p className="text-primary font-semibold">{format.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Partner With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 bg-gradient-primary rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Engaged Audience</h3>
              <p className="text-white/80">
                Our community actively engages with content, attends webinars, and trusts our recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Growth</h3>
              <p className="text-white/80">
                We're one of Kenya's fastest-growing tech education platforms with consistent month-over-month growth.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pan-African Reach</h3>
              <p className="text-white/80">
                Connect with tech talent across Kenya, East Africa, and the broader African continent.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Past Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Types of Partners We Work With</h2>
          <p className="text-muted-foreground mb-8">
            We partner with organizations aligned with our mission of tech education and digital empowerment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {pastPartners.map((partner, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-card border border-border rounded-2xl font-medium hover:border-primary/50 transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-card border border-border rounded-3xl p-8 md:p-12"
        >
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Partner?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss how we can help your brand reach Kenya's most engaged tech audience. 
            Download our full media kit or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://wa.me/254715674828?text=Hi!%20I'm%20interested%20in%20sponsorship%20opportunities" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Email: <a href="mailto:partnerships@techpulseinsider.com" className="text-primary hover:underline">partnerships@techpulseinsider.com</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaKit;
