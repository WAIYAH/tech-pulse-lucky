import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/common/SEO";
import CourseCard from "@/components/lms/CourseCard";
import { getCourseStats } from "@/data/courses";
import { lmsProvider } from "@/lib/lms";
import { routes } from "@/routes/routeConfig";
import type { LmsCourse } from "@/types/lms";

const LMSLanding = () => {
  const [featuredCourses, setFeaturedCourses] = useState<LmsCourse[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const rows = await lmsProvider.getFeaturedCourses(4);
      setFeaturedCourses(rows);
    };

    loadFeatured();
  }, []);

  const stats = getCourseStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SEO
        title="LMS | Tech Pulse Insider"
        description="Start learning on the Tech Pulse Insider LMS with structured pathways, featured beginner courses, and practical tech training."
        canonicalPath={routes.public.lms}
        keywords="LMS for beginner tech learners, online tech courses in Kenya, digital skills training platform"
      />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold mb-6"
            >
              <Sparkles size={16} className="text-accent-foreground" />
              Learn Practical Tech Skills with Get Techy With Lucky
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              Build Real-World Digital Skills for{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Kenya and Africa
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Access free beginner courses, enroll in paid masterclasses, and grow through
              practical learning pathways built for modern tech careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to={routes.public.courses}>Browse Courses</Link>
              </Button>
              <Button variant="accent" size="lg" asChild>
                <Link to={routes.public.course("basics-of-computers-phones-internet-101")}>
                  Start Free Course
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={routes.auth.login}>Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Courses</p>
                <p className="text-3xl font-bold">{stats.totalCourses}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Learners</p>
                <p className="text-3xl font-bold">5,000+</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Free Lessons</p>
                <p className="text-3xl font-bold">{stats.freeCourses}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Paid Masterclasses</p>
                <p className="text-3xl font-bold">{stats.paidCourses}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Button variant="outline" asChild>
              <Link to={routes.public.courses}>View All Courses</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/60 border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Learn with Lucky</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="mx-auto text-primary mb-4" />
                <h3 className="font-bold mb-2">Practical Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Lessons are project-focused, simple to follow, and built for real outcomes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <GraduationCap className="mx-auto text-primary mb-4" />
                <h3 className="font-bold mb-2">Career-Ready Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Courses are aligned with employable skills in software, AI, and digital work.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Layers3 className="mx-auto text-primary mb-4" />
                <h3 className="font-bold mb-2">Flexible Pathways</h3>
                <p className="text-sm text-muted-foreground">
                  Start free, upgrade to paid, and progress at your own pace across devices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              "Create your account",
              "Choose free or paid course",
              "Submit payment for paid access",
              "Learn and track your progress",
            ].map((step, index) => (
              <Card key={step}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Testimonials</h3>
                <p className="text-muted-foreground">
                  Learner success stories will appear here as the LMS expands.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-semibold">Can I start for free?</span> Yes, free
                    courses are available after registration.
                  </p>
                  <p>
                    <span className="font-semibold">How do paid courses work?</span> Submit
                    KCB Paybill payment details, then admin reviews your request.
                  </p>
                  <p>
                    <span className="font-semibold">Do you offer certificates?</span> Certificate
                    workflow is planned and will be added in future phases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LMSLanding;
