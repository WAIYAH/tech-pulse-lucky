import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import globalShowcaseCourse from "@/assets/global-showcase-course.webp";
import globalShowcaseAnalytics from "@/assets/global-showcase-analytics.webp";
import globalShowcaseCoach from "@/assets/global-showcase-coach.webp";
import { routes } from "@/routes/routeConfig";

const showcaseItems = [
  {
    title: "Project-Driven Learning",
    description:
      "Build portfolio-ready outcomes from guided courses in frontend, AI, cloud, and digital growth.",
    image: globalShowcaseCourse,
    alt: "Course learning visual",
  },
  {
    title: "Data and Systems Thinking",
    description:
      "Strengthen practical decision-making with analytics-led workflows and modern digital tools.",
    image: globalShowcaseAnalytics,
    alt: "Analytics dashboard visual",
  },
  {
    title: "Mentorship and Live Guidance",
    description:
      "Move faster with webinars, community support, and customized team coaching programs.",
    image: globalShowcaseCoach,
    alt: "Mentorship and coaching visual",
  },
];

const GlobalShowcaseSection = () => {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-border/70 bg-card/85 backdrop-blur-md p-6 md:p-10 shadow-xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary mb-3">
              Platform Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learning That Looks Modern and Feels Practical
            </h2>
            <p className="text-muted-foreground text-lg">
              Every page now carries a stronger visual identity with image-backed storytelling and
              a cleaner content rhythm.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showcaseItems.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-border/80 bg-background/70 shadow-md transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="h-52 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to={routes.public.courses}>Explore Courses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to={routes.public.customTraining}>Request Custom Training</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalShowcaseSection;
