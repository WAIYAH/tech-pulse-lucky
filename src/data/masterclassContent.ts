import type { MasterclassCohort, MasterclassProgram, MasterclassWeek } from "@/types/masterclass";

/**
 * Fallback content for a Supabase outage only. This file ships in the public JS bundle,
 * so it must never contain gated content: no lesson bodies, no terminology, no quiz
 * questions/answers. Those always come from Supabase (RLS-gated) or render empty/loading
 * on failure. Only the publicly-readable curriculum shape (program + week metadata) lives
 * here, mirroring src/data/courses.ts's role as the mock/offline course catalog.
 */

const now = new Date().toISOString();

export const masterclassProgram: MasterclassProgram = {
  id: "masterclass-program-web-dev",
  slug: "web-development-masterclass",
  title: "Web Development Masterclass",
  tagline: "Build Real Websites. Understand Real Software.",
  summary:
    "An 8-week intensive, practical, project-based software development masterclass covering the full journey from web fundamentals to a deployed full-stack capstone project.",
  philosophy:
    "CONCEPT -> UNDERSTAND -> PRACTICE -> BUILD -> TEST -> DEPLOY -> EXPLAIN. Every module answers what this is, why it exists, how it works, where it is used, and how it connects to what came before.",
  technologies: ["HTML", "CSS", "Tailwind CSS", "JavaScript", "PHP", "MySQL", "Git", "GitHub", "Vercel", "Docker", "SDLC"],
  totalWeeks: 8,
  createdAt: now,
  updatedAt: now,
};

export const masterclassCohort2026: MasterclassCohort = {
  id: "masterclass-cohort-2026",
  programId: masterclassProgram.id,
  courseId: "masterclass-course-web-dev-2026",
  courseSlug: "web-development-masterclass",
  cohortLabel: "2026 Cohort",
  startDate: "2026-09-07",
  endDate: "2026-11-01",
  status: "upcoming",
  createdAt: now,
  updatedAt: now,
};

const createWeek = (
  weekNumber: number,
  title: string,
  theme: string,
  learningObjectives: string[],
  topics: string[],
  estimatedStudyTime: string,
): MasterclassWeek => ({
  id: `masterclass-week-${weekNumber}`,
  programId: masterclassProgram.id,
  weekNumber,
  title,
  theme,
  learningObjectives,
  topics,
  estimatedStudyTime,
  createdAt: now,
  updatedAt: now,
});

export const masterclassWeeks: MasterclassWeek[] = [
  createWeek(
    1,
    "Web Fundamentals + HTML",
    "Understanding the Web and Building Website Structure",
    [
      "Explain how the internet, browsers, servers, and HTTP/HTTPS work together.",
      "Describe the difference between frontend and backend, and client and server.",
      "Structure a web page using semantic HTML elements.",
      "Build forms, links, images, lists, and tables with correct markup.",
      "Build and publish a multi-section personal or business website.",
    ],
    [
      "What is software", "Frontend vs backend", "Client vs server", "How websites work",
      "HTTP and HTTPS", "URLs, domains, DNS, web hosting", "HTML document structure",
      "Semantic HTML", "Forms, inputs, buttons", "Single-page vs multi-page websites",
    ],
    "6-8 hours",
  ),
  createWeek(
    2,
    "CSS + Responsive Design",
    "Turning HTML into Professional Interfaces",
    [
      "Apply CSS selectors, the cascade, and specificity correctly.",
      "Use the box model, margin, padding, and positioning to build layouts.",
      "Build layouts with Flexbox and CSS Grid.",
      "Design mobile-first, responsive pages using media queries.",
      "Transform the Week 1 website into a professional responsive site.",
    ],
    [
      "CSS syntax and selectors", "Specificity, cascade, inheritance", "Box model",
      "Flexbox", "CSS Grid", "Responsive design and media queries", "Mobile-first design",
      "Hover states and transitions",
    ],
    "6-8 hours",
  ),
  createWeek(
    3,
    "Tailwind CSS + Modern Frontend Development",
    "Building Modern Interfaces Faster",
    [
      "Explain why CSS frameworks exist and compare traditional CSS, Bootstrap, and Tailwind CSS.",
      "Use Tailwind utility classes for spacing, color, typography, flex, and grid.",
      "Apply Tailwind responsive breakpoints and interactive states.",
      "Think in reusable components and consistent design systems.",
      "Rebuild an existing website using Tailwind CSS.",
    ],
    [
      "Why CSS frameworks exist", "Utility-first CSS", "Tailwind spacing and typography utilities",
      "Responsive breakpoints", "Hover and focus states", "Component thinking and design systems",
    ],
    "6-8 hours",
  ),
  createWeek(
    4,
    "JavaScript + Git + GitHub",
    "Making Websites Interactive and Professional Development Workflow",
    [
      "Use JavaScript variables, functions, arrays, objects, and loops.",
      "Manipulate the DOM and respond to events, including form validation.",
      "Fetch and work with JSON data.",
      "Use Git for local version control: init, add, commit, branch, merge.",
      "Collaborate on GitHub using remotes, push, pull, and pull requests.",
    ],
    [
      "JavaScript fundamentals", "DOM and events", "Fetch API and JSON", "Version control with Git",
      "Branching and merging", "GitHub and pull requests", "README and .gitignore",
    ],
    "8-10 hours",
  ),
  createWeek(
    5,
    "PHP + Backend Fundamentals",
    "Moving From Static Websites to Functional Applications",
    [
      "Explain what backend/server-side development is and how PHP fits in.",
      "Write PHP variables, conditions, loops, functions, and arrays.",
      "Handle GET and POST form data, sessions, and cookies.",
      "Trace a request from browser through Apache, PHP, and the database, and back.",
      "Distinguish frontend validation from backend validation.",
    ],
    [
      "Backend development and PHP", "GET and POST", "Sessions and cookies",
      "Authentication and authorization", "XAMPP, Apache, phpMyAdmin",
      "Frontend vs backend validation",
    ],
    "8-10 hours",
  ),
  createWeek(
    6,
    "MySQL + Databases + Full-Stack Integration",
    "Making Applications Store and Manage Real Data",
    [
      "Explain what a database and DBMS are.",
      "Design tables with primary keys, foreign keys, and relationships.",
      "Write CRUD SQL: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, JOIN.",
      "Connect PHP to MySQL safely using prepared statements.",
      "Explain SQL injection and how prepared statements prevent it.",
    ],
    [
      "Databases and MySQL", "Tables, rows, columns", "Primary and foreign keys", "CRUD and SQL",
      "JOIN and WHERE", "Prepared statements and SQL injection",
    ],
    "8-10 hours",
  ),
  createWeek(
    7,
    "SDLC + Deployment + DevOps + Docker",
    "From Local Development to Production",
    [
      "Describe the SDLC phases and Agile, Scrum, and Kanban basics.",
      "Explain deployment concepts: environments, environment variables, hosting, DNS, SSL.",
      "Explain what DevOps and CI/CD mean at a beginner level.",
      "Explain Docker containers, images, and Dockerfiles without advanced complexity.",
      "Deploy a frontend project and inspect a basic containerized application.",
    ],
    [
      "SDLC phases", "Agile, Scrum, Kanban", "Deployment and environments", "Hosting, DNS, SSL",
      "CI/CD and DevOps", "Docker containers and images",
    ],
    "6-8 hours",
  ),
  createWeek(
    8,
    "Full-Scale Capstone Project",
    "BUILD. TEST. DOCUMENT. DEPLOY. PRESENT.",
    [
      "Scope a capstone project with a clear problem statement, target users, and requirements.",
      "Design a system architecture and database for the chosen project.",
      "Build the project using the full stack covered in Weeks 1-7.",
      "Test, document, and deploy the finished application.",
      "Present and explain the project, including the reasoning behind key decisions.",
    ],
    [
      "Problem statement and requirements", "System and database design", "Development and testing",
      "GitHub repository and README", "Deployment", "Presentation",
    ],
    "10-12 hours",
  ),
];

export const getMasterclassWeekByNumber = (weekNumber: number): MasterclassWeek | undefined =>
  masterclassWeeks.find((week) => week.weekNumber === weekNumber);
