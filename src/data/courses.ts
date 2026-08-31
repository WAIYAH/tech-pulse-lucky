import type {
  CourseLevel,
  LmsCourse,
  LmsCourseFilters,
  LmsLesson,
  LessonType,
} from "@/types/lms";

const now = new Date().toISOString();

const createLesson = (
  courseId: string,
  lessonOrder: number,
  lessonType: LessonType,
  title: string,
  content: string,
  options?: Partial<Omit<LmsLesson, "id" | "courseId" | "lessonOrder" | "lessonType" | "title" | "content">>,
): LmsLesson => {
  return {
    id: `${courseId}-lesson-${lessonOrder}`,
    courseId,
    lessonOrder,
    lessonType,
    title,
    content,
    resourceDownloads: options?.resourceDownloads ?? [],
    videoUrl: options?.videoUrl,
    quiz: options?.quiz,
    assignment: options?.assignment,
  };
};

const createCourse = (
  input: Omit<LmsCourse, "lessonsCount" | "createdAt" | "updatedAt">,
): LmsCourse => {
  return {
    ...input,
    lessonsCount: input.lessons.length,
    createdAt: now,
    updatedAt: now,
  };
};

const course001Id = "course-001";
const course002Id = "course-002";
const course003Id = "course-003";
const course004Id = "course-004";
const course005Id = "course-005";
const course006Id = "course-006";
const course007Id = "course-007";
const course008Id = "course-008";
const course009Id = "course-009";
const COURSE_STORAGE_KEY = "lms_courses";
const isBrowser = typeof window !== "undefined";

export const allCourses: LmsCourse[] = [
  createCourse({
    id: course001Id,
    title: "Basics of Computers, Phones & Internet 101",
    slug: "basics-of-computers-phones-internet-101",
    shortDescription: "Start your digital literacy journey with practical computer and smartphone basics.",
    description:
      "A beginner-friendly course for learners who want confidence using computers, smartphones, and the internet in daily life and work.",
    category: "Digital Literacy",
    level: "Beginner",
    duration: "3 weeks",
    price: 0,
    currency: "KES",
    isFree: true,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Use a computer and smartphone confidently.",
      "Understand essential internet concepts and terminology.",
      "Perform common online tasks safely.",
      "Apply basic digital hygiene habits every day.",
    ],
    requirements: [
      "No technical background required.",
      "A smartphone or computer with internet access.",
    ],
    targetAudience: [
      "Complete beginners to digital tools.",
      "Students and job seekers building digital confidence.",
      "Small business owners moving operations online.",
    ],
    faqs: [
      {
        question: "Do I need prior IT knowledge?",
        answer: "No. This course is designed for absolute beginners.",
      },
      {
        question: "Can I access this course on mobile?",
        answer: "Yes. Lessons are mobile-friendly.",
      },
    ],
    lessons: [
      createLesson(
        course001Id,
        1,
        "video",
        "Welcome to Digital Skills Foundations",
        "Understand the learning path and how to use the LMS to complete this course successfully.",
        {
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      ),
      createLesson(
        course001Id,
        2,
        "text",
        "Computer and Smartphone Essentials",
        "Learn core device components, settings basics, and safe setup practices.",
      ),
      createLesson(
        course001Id,
        3,
        "text",
        "Internet Basics and Everyday Use Cases",
        "Explore browsers, search, email, and reliable information discovery.",
      ),
      createLesson(
        course001Id,
        4,
        "quiz",
        "Digital Literacy Checkpoint",
        "Answer short questions to validate your understanding of core concepts.",
        {
          quiz: {
            title: "Digital Literacy Quiz",
            instructions: "Complete all questions. Minimum pass score: 70%.",
            totalQuestions: 10,
          },
        },
      ),
      createLesson(
        course001Id,
        5,
        "assignment",
        "Practical Assignment: Your Daily Digital Routine",
        "Document a safe digital routine you can apply daily at home, school, or work.",
        {
          assignment: {
            title: "Digital Routine Checklist",
            instructions:
              "Submit a checklist with at least 8 practical actions for safe and productive daily digital use.",
            dueInDays: 5,
          },
          resourceDownloads: [
            {
              id: "resource-001",
              title: "Digital Routine Template",
              url: "#",
              type: "doc",
            },
          ],
        },
      ),
    ],
  }),
  createCourse({
    id: course002Id,
    title: "Safe Internet Browsing & Online Security",
    slug: "safe-internet-browsing-online-security",
    shortDescription: "Build strong cyber safety habits and protect yourself from scams and online threats.",
    description:
      "A practical cybersecurity essentials course focused on safe browsing, privacy, phishing defense, and account security.",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "2 weeks",
    price: 0,
    currency: "KES",
    isFree: true,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Recognize phishing and common scam patterns.",
      "Set up stronger account security practices.",
      "Manage passwords and 2FA effectively.",
      "Browse the web more safely on public and private networks.",
    ],
    requirements: ["Basic internet usage knowledge."],
    targetAudience: [
      "Remote workers and students.",
      "Anyone concerned about online scams.",
      "Beginners in cybersecurity.",
    ],
    faqs: [
      {
        question: "Is this course technical?",
        answer: "It is practical and beginner-friendly, not heavily technical.",
      },
    ],
    lessons: [
      createLesson(
        course002Id,
        1,
        "video",
        "Cyber Threat Landscape for Everyday Users",
        "Discover the most common attacks targeting regular internet users.",
      ),
      createLesson(
        course002Id,
        2,
        "text",
        "Phishing, Social Engineering, and Scam Red Flags",
        "Learn to spot suspicious links, fake support calls, and urgent payment traps.",
      ),
      createLesson(
        course002Id,
        3,
        "text",
        "Passwords, 2FA, and Device Security Basics",
        "Implement account protection and secure mobile/computer settings.",
      ),
      createLesson(
        course002Id,
        4,
        "assignment",
        "Assignment: Secure Your Top 5 Accounts",
        "Apply course guidance and submit a short checklist of improvements made.",
        {
          assignment: {
            title: "Account Security Upgrade",
            instructions:
              "Enable or confirm 2FA, unique passwords, and recovery options on five key accounts.",
            dueInDays: 4,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course003Id,
    title: "AI & Machine Learning: Getting Started",
    slug: "ai-machine-learning-getting-started",
    shortDescription: "Understand AI and ML fundamentals with practical beginner examples.",
    description:
      "An introductory course that explains artificial intelligence and machine learning in simple terms with local and global use cases.",
    category: "AI & Machine Learning",
    level: "Beginner",
    duration: "2 weeks",
    price: 0,
    currency: "KES",
    isFree: true,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Explain AI and ML core concepts clearly.",
      "Identify practical ML use cases.",
      "Understand the basic model lifecycle.",
      "Use beginner-friendly AI productivity tools responsibly.",
    ],
    requirements: ["Curiosity and willingness to learn."],
    targetAudience: [
      "Beginners exploring AI careers.",
      "Non-technical professionals interested in AI literacy.",
      "Students preparing for future digital roles.",
    ],
    faqs: [
      {
        question: "Do I need coding skills?",
        answer: "No coding is required for this starter course.",
      },
    ],
    lessons: [
      createLesson(
        course003Id,
        1,
        "video",
        "AI and ML Concepts Without Jargon",
        "Understand what AI can and cannot do in real-world settings.",
      ),
      createLesson(
        course003Id,
        2,
        "text",
        "How Machine Learning Models Learn",
        "Learn about data, training, inference, and iteration.",
      ),
      createLesson(
        course003Id,
        3,
        "text",
        "Responsible AI, Ethics, and Bias Awareness",
        "Explore fairness, transparency, and safe AI adoption practices.",
      ),
      createLesson(
        course003Id,
        4,
        "quiz",
        "AI Foundations Quiz",
        "Validate your understanding of AI and ML terminology and use cases.",
        {
          quiz: {
            title: "AI Intro Quiz",
            instructions: "Answer all 8 questions to complete this lesson.",
            totalQuestions: 8,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course004Id,
    title: "Digital Marketing for Tech Startups",
    slug: "digital-marketing-for-tech-startups",
    shortDescription: "Learn practical growth strategies for startup visibility and customer acquisition.",
    description:
      "A practical course for founders and teams building audience, trust, and traction with digital marketing channels.",
    category: "Digital Skills",
    level: "Beginner",
    duration: "2 weeks",
    price: 0,
    currency: "KES",
    isFree: true,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Build a focused startup marketing plan.",
      "Create clear messaging and brand positioning.",
      "Use social media and email for growth.",
      "Track marketing performance with key metrics.",
    ],
    requirements: ["Basic understanding of your startup idea or product."],
    targetAudience: [
      "Startup founders and co-founders.",
      "Marketing beginners in tech teams.",
      "Freelancers and creators building digital products.",
    ],
    faqs: [
      {
        question: "Will this cover paid ads?",
        answer: "Yes, with a beginner-friendly budget approach.",
      },
    ],
    lessons: [
      createLesson(
        course004Id,
        1,
        "text",
        "Positioning and Messaging for Tech Products",
        "Define your niche and communicate value clearly.",
      ),
      createLesson(
        course004Id,
        2,
        "video",
        "Social Media and Community-Led Growth",
        "Use platform-specific content strategies to attract your ideal audience.",
      ),
      createLesson(
        course004Id,
        3,
        "text",
        "Email Funnels and Conversion Basics",
        "Design simple lead capture and follow-up workflows.",
      ),
      createLesson(
        course004Id,
        4,
        "assignment",
        "Assignment: 14-Day Startup Growth Plan",
        "Draft and submit your short growth plan for feedback.",
        {
          assignment: {
            title: "Two-Week Growth Plan",
            instructions: "Submit objectives, channels, and success metrics for 14 days.",
            dueInDays: 7,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course005Id,
    title: "Web Development Using HTML, CSS & JavaScript",
    slug: "web-development-html-css-javascript",
    shortDescription: "Build responsive websites from scratch with practical frontend projects.",
    description:
      "A paid foundational web development course designed to move learners from beginner to confident frontend builder.",
    category: "Web Development",
    level: "Intermediate",
    duration: "4 weeks",
    price: 300,
    currency: "KES",
    isFree: false,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Structure semantic HTML documents.",
      "Style responsive interfaces with modern CSS.",
      "Add interactivity with JavaScript DOM patterns.",
      "Ship a mini portfolio-ready web project.",
    ],
    requirements: [
      "Basic computer skills.",
      "Consistent practice time each week.",
    ],
    targetAudience: [
      "Beginners transitioning to frontend development.",
      "Students building first job-ready web projects.",
    ],
    faqs: [
      {
        question: "Is this beginner-friendly?",
        answer: "Yes, but learners should commit to regular practice.",
      },
    ],
    lessons: [
      createLesson(course005Id, 1, "video", "HTML Fundamentals and Semantic Structure", "Build clean and accessible page structure."),
      createLesson(course005Id, 2, "text", "CSS Layout, Flexbox, and Responsive Design", "Use CSS to create modern mobile-first layouts."),
      createLesson(course005Id, 3, "video", "JavaScript Essentials and DOM Interaction", "Add dynamic behavior and user interaction."),
      createLesson(
        course005Id,
        4,
        "assignment",
        "Project Assignment: Landing Page Build",
        "Create and submit a responsive landing page with semantic HTML and interactive features.",
        {
          assignment: {
            title: "Frontend Landing Page",
            instructions: "Submit source files and a short video walkthrough.",
            dueInDays: 10,
          },
        },
      ),
      createLesson(
        course005Id,
        5,
        "quiz",
        "Frontend Fundamentals Assessment",
        "Demonstrate your understanding of HTML, CSS, and JavaScript basics.",
        {
          quiz: {
            title: "Frontend Assessment",
            instructions: "12 questions. Pass mark is 75%.",
            totalQuestions: 12,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course006Id,
    title: "Advanced Software Engineering with JavaScript, XAMPP & MySQL",
    slug: "advanced-software-engineering-javascript-xampp-mysql",
    shortDescription: "Move beyond frontend by building full-stack systems with backend and database workflows.",
    description:
      "An advanced paid course for learners ready to build robust web applications using backend JavaScript and relational database fundamentals.",
    category: "Software Engineering",
    level: "Advanced",
    duration: "6 weeks",
    price: 500,
    currency: "KES",
    isFree: false,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Design scalable backend architecture.",
      "Model and query relational data effectively.",
      "Build APIs and secure endpoints.",
      "Ship a full-stack capstone project.",
    ],
    requirements: [
      "Basic JavaScript knowledge.",
      "Comfort with HTML/CSS fundamentals.",
    ],
    targetAudience: [
      "Junior developers growing into full-stack roles.",
      "Learners preparing for software engineering interviews.",
    ],
    faqs: [
      {
        question: "Will we build a complete project?",
        answer: "Yes. This course includes a guided capstone project.",
      },
    ],
    lessons: [
      createLesson(course006Id, 1, "text", "Software Architecture and System Thinking", "Plan maintainable systems and clear responsibilities."),
      createLesson(course006Id, 2, "video", "Backend JavaScript and API Foundations", "Create RESTful APIs and structure backend modules."),
      createLesson(course006Id, 3, "text", "Database Design with MySQL", "Design schemas, relationships, and query patterns."),
      createLesson(
        course006Id,
        4,
        "assignment",
        "Capstone Assignment: Build a Full-Stack Module",
        "Implement authentication, data model, and API endpoints for a feature module.",
        {
          assignment: {
            title: "Full-Stack Module Capstone",
            instructions: "Submit repo link, ER diagram, and deployment notes.",
            dueInDays: 12,
          },
        },
      ),
      createLesson(
        course006Id,
        5,
        "quiz",
        "Advanced Engineering Quiz",
        "Assessment on architecture, API design, and SQL fundamentals.",
        {
          quiz: {
            title: "Advanced Engineering Quiz",
            instructions: "15 questions. Includes scenario-based problems.",
            totalQuestions: 15,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course007Id,
    title: "DevOps & Cloud Computing",
    slug: "devops-cloud-computing",
    shortDescription: "Learn cloud and DevOps fundamentals for deployment, automation, and reliability.",
    description:
      "A paid practical course on CI/CD pipelines, cloud infrastructure basics, and deployment workflows used in modern teams.",
    category: "DevOps",
    level: "Advanced",
    duration: "4 weeks",
    price: 800,
    currency: "KES",
    isFree: false,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Understand DevOps culture and workflow design.",
      "Set up simple CI/CD pipelines.",
      "Deploy applications to cloud infrastructure.",
      "Monitor and troubleshoot production services.",
    ],
    requirements: [
      "Basic backend or scripting knowledge recommended.",
      "Familiarity with Git fundamentals.",
    ],
    targetAudience: [
      "Developers transitioning into DevOps.",
      "Teams modernizing deployment practices.",
    ],
    faqs: [
      {
        question: "Is Linux knowledge required?",
        answer: "Basic terminal familiarity is recommended.",
      },
    ],
    lessons: [
      createLesson(course007Id, 1, "video", "DevOps Mindset and Delivery Lifecycle", "Understand collaboration, automation, and continuous improvement."),
      createLesson(course007Id, 2, "text", "Cloud Computing Essentials", "Learn compute, storage, networking, and shared responsibility."),
      createLesson(course007Id, 3, "video", "CI/CD Pipeline Setup Basics", "Automate testing and deployment for consistent release cycles."),
      createLesson(
        course007Id,
        4,
        "assignment",
        "Assignment: Build a CI/CD Pipeline Blueprint",
        "Create a practical pipeline plan for an application of your choice.",
        {
          assignment: {
            title: "CI/CD Blueprint",
            instructions: "Submit pipeline stages, tools, and rollback strategy.",
            dueInDays: 8,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course008Id,
    title: "Git, GitHub & Developer Portfolio Masterclass",
    slug: "git-github-developer-portfolio-masterclass",
    shortDescription: "Master version control workflows and build a strong developer portfolio.",
    description:
      "A paid course focused on professional Git usage, GitHub collaboration, and portfolio strategy for career growth.",
    category: "Career Development",
    level: "Intermediate",
    duration: "3 weeks",
    price: 600,
    currency: "KES",
    isFree: false,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Use Git confidently in solo and team environments.",
      "Collaborate via pull requests and code reviews on GitHub.",
      "Design a portfolio that communicates technical impact.",
      "Present projects effectively for hiring and client opportunities.",
    ],
    requirements: [
      "Basic coding familiarity.",
      "A GitHub account.",
    ],
    targetAudience: [
      "Learners applying for internships and junior roles.",
      "Freelancers and developers building personal brand credibility.",
    ],
    faqs: [
      {
        question: "Will this include portfolio review guidance?",
        answer: "Yes. The course includes structure, examples, and review checklists.",
      },
    ],
    lessons: [
      createLesson(course008Id, 1, "text", "Git Foundations and Workflow Patterns", "Learn commits, branches, merges, and conflict handling."),
      createLesson(course008Id, 2, "video", "GitHub Collaboration in Real Projects", "Work with pull requests, issue tracking, and review flow."),
      createLesson(course008Id, 3, "text", "Portfolio Strategy for Tech Careers", "Craft project narratives and highlight measurable outcomes."),
      createLesson(
        course008Id,
        4,
        "assignment",
        "Assignment: Publish Your Portfolio Roadmap",
        "Create a structured portfolio improvement plan and publish it in your repository.",
        {
          assignment: {
            title: "Portfolio Roadmap",
            instructions: "Submit GitHub repo link and README with roadmap milestones.",
            dueInDays: 7,
          },
          resourceDownloads: [
            {
              id: "resource-008",
              title: "Portfolio Review Checklist",
              url: "#",
              type: "pdf",
            },
          ],
        },
      ),
      createLesson(
        course008Id,
        5,
        "quiz",
        "Git and GitHub Mastery Quiz",
        "Evaluate your understanding of practical version control scenarios.",
        {
          quiz: {
            title: "GitHub Workflow Quiz",
            instructions: "Complete all 10 questions to finish the module.",
            totalQuestions: 10,
          },
        },
      ),
    ],
  }),
  createCourse({
    id: course009Id,
    title: "Web Development Masterclass — 2026 Cohort",
    slug: "web-development-masterclass",
    shortDescription:
      "An intensive 8-week, project-based web development program covering HTML, CSS, Tailwind, JavaScript, PHP, MySQL, Git and GitHub, deployment, and DevOps fundamentals.",
    description:
      "The Web Development Masterclass is an intensive 8-week, project-based program that takes learners from web fundamentals to a deployed, full-stack capstone project. Each week builds on the last, moving from HTML and CSS, through Tailwind CSS and JavaScript, into PHP, MySQL, Git and GitHub, and finally software development lifecycle, deployment, and DevOps basics with Docker.",
    category: "Masterclass Cohort",
    level: "Beginner",
    duration: "8 weeks",
    price: 2000,
    currency: "KES",
    isFree: false,
    imageUrl: "/placeholder.svg",
    instructor: "Lucky Nakola",
    learningOutcomes: [
      "Understand how the web, browsers, servers, and HTTP/HTTPS work together.",
      "Build responsive, accessible interfaces with HTML, CSS, and Tailwind CSS.",
      "Add interactivity with JavaScript and manage code professionally with Git and GitHub.",
      "Build server-side logic and store real data with PHP and MySQL.",
      "Understand the SDLC, deployment, DevOps, and basic Docker containerization.",
      "Design, build, test, document, and deploy a complete full-stack capstone project.",
    ],
    requirements: [
      "A laptop or computer with internet access.",
      "No prior coding experience required, beginners are welcome.",
      "Consistent weekly practice time across the 8 weeks.",
    ],
    targetAudience: [
      "Beginners and university/ICT students exploring software development.",
      "Aspiring developers who want a stronger practical foundation.",
      "Students building academic or portfolio projects.",
      "Entrepreneurs who want to understand how web development actually works.",
    ],
    faqs: [
      {
        question: "Do I need any coding experience to join?",
        answer:
          "No. The masterclass is designed for beginners and builds up week by week, though it is intensive and requires consistent practice.",
      },
      {
        question: "How much does the program cost?",
        answer: "KES 2,000 for the complete 8-week program, payable via KCB Paybill.",
      },
    ],
    lessons: [],
  }),
];

export const getCoursesSnapshot = (): LmsCourse[] => {
  if (!isBrowser) {
    return allCourses;
  }

  const raw = window.localStorage.getItem(COURSE_STORAGE_KEY);
  if (!raw) {
    return allCourses;
  }

  try {
    const parsed = JSON.parse(raw) as LmsCourse[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return allCourses;
    }
    return parsed;
  } catch {
    return allCourses;
  }
};

export const featuredCourseSlugs = [
  "basics-of-computers-phones-internet-101",
  "safe-internet-browsing-online-security",
  "web-development-html-css-javascript",
  "git-github-developer-portfolio-masterclass",
];

export const getCourseBySlug = (slug: string): LmsCourse | undefined => {
  return getCoursesSnapshot().find((course) => course.slug === slug);
};

export const getCourseById = (id: string): LmsCourse | undefined => {
  return getCoursesSnapshot().find((course) => course.id === id);
};

export const getCourseCategories = (): string[] => {
  return Array.from(
    new Set(getCoursesSnapshot().map((course) => course.category)),
  ).sort();
};

export const getCourseLevels = (): CourseLevel[] => {
  return ["Beginner", "Intermediate", "Advanced"];
};

export const getFeaturedCourses = (limit = 4): LmsCourse[] => {
  const featured = getCoursesSnapshot().filter((course) =>
    featuredCourseSlugs.includes(course.slug),
  );
  return featured.slice(0, limit);
};

export const searchCourses = (query: string): LmsCourse[] => {
  const snapshot = getCoursesSnapshot();
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return snapshot;

  return snapshot.filter((course) => {
    return (
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.shortDescription.toLowerCase().includes(normalizedQuery) ||
      course.description.toLowerCase().includes(normalizedQuery) ||
      course.category.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const filterCourses = (
  courses: LmsCourse[],
  filters?: LmsCourseFilters,
): LmsCourse[] => {
  if (!filters) return [...courses];

  let filtered = [...courses];

  if (filters.query) {
    const query = filters.query.trim().toLowerCase();
    filtered = filtered.filter((course) => {
      return (
        course.title.toLowerCase().includes(query) ||
        course.shortDescription.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    });
  }

  if (filters.category) {
    filtered = filtered.filter((course) => course.category === filters.category);
  }

  if (filters.pricing) {
    filtered = filtered.filter((course) =>
      filters.pricing === "free" ? course.isFree : !course.isFree,
    );
  }

  if (filters.level) {
    filtered = filtered.filter((course) => course.level === filters.level);
  }

  if (filters.sortBy === "price_low_to_high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "price_high_to_low") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
};

export const getCourseStats = () => {
  const snapshot = getCoursesSnapshot();
  const paidCourses = snapshot.filter((course) => !course.isFree).length;
  const freeCourses = snapshot.filter((course) => course.isFree).length;
  const totalLessons = snapshot.reduce(
    (sum, course) => sum + course.lessons.length,
    0,
  );

  return {
    totalCourses: snapshot.length,
    freeCourses,
    paidCourses,
    totalLessons,
  };
};
