import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/common/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getWebinarBySlug } from "@/data/webinars";
import { routes } from "@/routes/routeConfig";

const EventDetails = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();

  const event = eventSlug ? getWebinarBySlug(eventSlug) : undefined;

  if (!event) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <SEO
          title="Event Not Found | Tech Pulse Insider"
          description="The requested webinar event could not be found."
          canonicalPath={routes.public.webinars}
          noindex
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(routes.public.webinars)} className="gap-2">
            <ArrowLeft size={18} />
            Back to Webinars
          </Button>
        </div>
      </div>
    );
  }

  const getSpotStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (available === 0) return { label: "Sold Out", color: "bg-red-500" };
    if (percentage <= 20) return { label: "Almost Full", color: "bg-orange-500" };
    return { label: "Open", color: "bg-green-500" };
  };

  const spotStatus = getSpotStatus(event.spots.available, event.spots.total);

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-background via-background to-accent/5">
      <SEO
        title={`${event.title} | Tech Pulse Insider Webinar`}
        description={event.description}
        canonicalPath={routes.public.event(event.slug)}
        type="article"
        keywords={`${event.title}, tech webinars Kenya, ${event.topics.slice(0, 4).join(", ")}`}
      />
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(routes.public.webinars)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Webinars</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                        event.type === "free" ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      {event.type === "free" ? "FREE WEBINAR" : "PAID MASTERCLASS"}
                    </span>
                    {event.type === "paid" && (
                      <span className="text-3xl font-bold text-primary">
                        {event.price}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {event.title}
                  </h1>
                </div>
              </div>

              {/* Event Meta */}
              <div className="flex flex-col sm:flex-row gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary flex-shrink-0" size={20} />
                  <span>{event.time}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Long Description Card */}
            <Card className="mb-8 border-2">
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed">{event.longDescription}</p>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Who Should Attend?</h2>
              <p className="text-muted-foreground text-lg">{event.targetAudience}</p>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.topics.map((topic, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trainer Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Your Trainer</h3>
                <p className="text-muted-foreground">
                  {event.trainer} brings real-world industry experience and practical insights to every session.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Spots Available Card */}
            <Card className="mb-6 border-2 sticky top-20">
              <CardHeader>
                <h3 className="text-lg font-bold">Availability</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Slots Available</span>
                    <span className="text-2xl font-bold text-primary">
                      {event.spots.available}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(event.spots.available / event.spots.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {event.spots.available} of {event.spots.total} spots remaining
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${spotStatus.color}`}
                    >
                      {spotStatus.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card (Paid Only) */}
            {event.type === "paid" && (
              <Card className="mb-6 border-2">
                <CardHeader>
                  <h3 className="text-lg font-bold">Payment Methods</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.paymentMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">{method}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    ✓ Payment confirmation unlocks access
                  </p>
                </CardContent>
              </Card>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                size="lg"
                className="w-full gap-2"
                variant={event.type === "free" ? "hero" : "accent"}
                onClick={() => window.open(event.bookingLink, "_blank")}
              >
                {event.type === "free" ? "Register via Google Form" : "Register via Google Form"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  (window.location.href = `mailto:luckiesadabwoy@gmail.com?subject=Support for ${event.title}`)
                }
              >
                <Mail size={18} />
                Contact Support
              </Button>
            </div>

            {/* Info Box */}
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6 text-sm text-muted-foreground">
                <p className="mb-3">
                  <span className="font-semibold text-foreground">Questions?</span> Reach
                  out to our support team anytime.
                </p>
                <a
                  href="mailto:luckiesadabwoy@gmail.com"
                  className="text-primary font-semibold hover:underline"
                >
                  luckiesadabwoy@gmail.com
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
