import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock3,
  Code2,
  GitBranch,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SEO from "@/components/common/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCourseBySlug } from "@/data/courses";
import { formatKesAmount } from "@/data/lmsConfig";
import { lmsProvider } from "@/lib/lms";
import {
  PROGRAM_SLUG,
  readMasterclassProgram,
  readMasterclassWeeks,
} from "@/lib/masterclass";
import { routes } from "@/routes/routeConfig";
import type { EnrollmentAccessStatus, LmsCourse } from "@/types/lms";
import type { MasterclassProgram, MasterclassWeek } from "@/types/masterclass";

const MasterclassLanding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<LmsCourse | null>(() => getCourseBySlug(PROGRAM_SLUG) ?? null);
  const [program, setProgram] = useState<MasterclassProgram | null>(null);
  const [weeks, setWeeks] = useState<MasterclassWeek[]>([]);
  const [accessStatus, setAccessStatus] = useState<EnrollmentAccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const [courseRow, programRow] = await Promise.all([
        lmsProvider.getCourseBySlug(PROGRAM_SLUG),
        readMasterclassProgram(PROGRAM_SLUG),
      ]);
      if (!isMounted) return;

      setCourse(courseRow ?? getCourseBySlug(PROGRAM_SLUG) ?? null);
      setProgram(programRow);

      if (programRow) {
        const weekRows = await readMasterclassWeeks(programRow.id);
        if (!isMounted) return;
        setWeeks(weekRows);
      }

      if (user && courseRow) {
        const enrollments = await lmsProvider.getEnrollments(user.id);
        if (!isMounted) return;
        const enrollment = enrollments.find((row) => row.courseId === courseRow.id);
        setAccessStatus(enrollment?.accessStatus ?? null);
      }

      setIsLoading(false);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const sortedWeeks = useMemo(() => [...weeks].sort((a, b) => a.weekNumber - b.weekNumber), [weeks]);

  const handleEnrollCTA = () => {
    if (!isAuthenticated) {
      navigate(routes.auth.login, { state: { from: routes.public.masterclass } });
      return;
    }
    if (!course) return;
    navigate(routes.student.payment(course.slug));
  };

  if (isLoading && !course) {
    return (
      <div className="min-h-screen py-20 text-center text-muted-foreground">
        Loading the Web Development Masterclass...
      </div>
    );
  }

  if (!course || !program) {
    return (
      <div className="min-h-screen py-20 text-center text-muted-foreground">
        The Web Development Masterclass is not configured yet. Check back soon.
      </div>
    );
  }

  const technologies = program.technologies.length > 0 ? program.technologies : [
    "HTML", "CSS", "Tailwind CSS", "JavaScript", "PHP", "MySQL", "Git", "GitHub", "Vercel", "Docker", "SDLC",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SEO
        title={`${program.title} | Tech Pulse Insider`}
        description={program.summary}
        canonicalPath={routes.public.masterclass}
        keywords="web development masterclass, learn web development Kenya, HTML CSS JavaScript PHP MySQL course"
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold"
            >
              <Sparkles size={16} className="text-accent-foreground" />
              {course.currency} {course.price.toLocaleString("en-KE")} Cohort with Lucky Nakola
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
              Web Development Masterclass
              <span className="mt-2 block bg-gradient-hero bg-clip-text text-transparent">
                2026 Cohort
              </span>
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">{program.tagline}</p>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {["8 WEEKS", "INTENSIVE", "PRACTICAL", "PROJECT-BASED"].map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs font-semibold">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mb-8 rounded-2xl border-2 border-accent bg-accent/10 p-6">
              <p className="text-sm font-semibold uppercase text-muted-foreground">
                Complete Program Fee
              </p>
              <p className="text-5xl font-bold text-primary">{formatKesAmount(course.price)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                One payment for the full 8-week program &mdash; no hidden costs.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {accessStatus === "approved" ? (
                <Button variant="hero" size="lg" asChild>
                  <Link to={routes.student.masterclass}>Go to Your Masterclass</Link>
                </Button>
              ) : accessStatus === "pending_payment" ? (
                <Button variant="hero" size="lg" disabled>
                  Payment Pending Review
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={handleEnrollCTA}>
                  <Rocket className="mr-2 h-4 w-4" />
                  {accessStatus === "rejected" ? "Resubmit Payment" : "Enroll for 2026 Cohort"}
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <a href="#curriculum">View Curriculum</a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Starts 7 September 2026
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Beginners welcome
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" /> Certificate eligible
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">About the Masterclass</h2>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2 font-bold">Who Should Join</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {course.targetAudience.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2 font-bold">What You Will Learn</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {course.learningOutcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="curriculum" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">8-Week Curriculum</h2>
          <p className="mb-10 text-center text-muted-foreground">
            Concept &rarr; Understand &rarr; Practice &rarr; Build &rarr; Test &rarr; Deploy &rarr; Explain.
          </p>
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {sortedWeeks.map((week) => (
              <AccordionItem key={week.id} value={week.id}>
                <AccordionTrigger className="text-left">
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Week {week.weekNumber}
                    </span>
                    <span className="font-semibold">{week.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-sm text-muted-foreground">{week.theme}</p>
                  <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" /> {week.estimatedStudyTime}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {week.topics.slice(0, 10).map((topic) => (
                      <Badge key={topic} variant="outline" className="font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">Technologies You Will Use</h2>
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                <Code2 className="mr-1 h-3.5 w-3.5" /> {tech}
              </Badge>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <GitBranch className="mx-auto mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 font-bold">Git &amp; GitHub</h3>
                <p className="text-sm text-muted-foreground">
                  Professional version control and collaboration workflow.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Rocket className="mx-auto mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 font-bold">Real Deployment</h3>
                <p className="text-sm text-muted-foreground">
                  Ship a live project, not just code on your laptop.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="mx-auto mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 font-bold">Full-Scale Capstone</h3>
                <p className="text-sm text-muted-foreground">
                  Build, test, document, deploy, and present a complete application.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {course.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl border-2 border-primary bg-primary/5 text-center">
            <CardHeader>
              <h2 className="text-3xl font-bold">Ready to Build Real Software?</h2>
            </CardHeader>
            <CardContent className="pb-8">
              <p className="mb-6 text-muted-foreground">
                Join the 2026 Cohort for {formatKesAmount(course.price)} and go from web
                fundamentals to a deployed, full-stack capstone project in 8 weeks.
              </p>
              {accessStatus === "approved" ? (
                <Button variant="hero" size="lg" asChild>
                  <Link to={routes.student.masterclass}>Go to Your Masterclass</Link>
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={handleEnrollCTA}>
                  Enroll for 2026 Cohort
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MasterclassLanding;
