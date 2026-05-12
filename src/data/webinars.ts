export type WebinarType = "free" | "paid";

export interface WebinarRecord {
  id: number;
  title: string;
  slug: string;
  date: string;
  startsAt: string;
  time: string;
  duration: string;
  type: WebinarType;
  price?: string;
  priceAmount?: number;
  spots: {
    total: number;
    available: number;
  };
  description: string;
  longDescription: string;
  targetAudience: string;
  topics: string[];
  trainer: string;
  bookingLink: string;
  paymentMethods?: string[];
}

export const webinars: WebinarRecord[] = [
  {
    id: 1,
    title: "Basics of IT & Safe Internet Browsing",
    slug: "basics-of-it-safe-internet-browsing",
    date: "March 13, 2026",
    startsAt: "2026-03-13T19:00:00+03:00",
    time: "07:00 PM - 09:00 PM EAT",
    duration: "2 hours",
    type: "free",
    spots: {
      total: 100,
      available: 87,
    },
    description:
      "Master the fundamentals of IT and learn essential practices for safe internet browsing. This comprehensive webinar covers computer basics, smartphone essentials, internet fundamentals, and practical strategies to protect yourself from online scams and threats.",
    longDescription:
      "In today's digital age, understanding the basics of information technology and practicing safe internet habits is crucial. This webinar is designed for anyone looking to strengthen their digital literacy and online safety practices. Whether you're a beginner or someone wanting to refresh your knowledge, this session will equip you with practical skills to navigate the internet securely.",
    targetAudience:
      "Beginners, small business owners, anyone new to digital technology",
    topics: [
      "Computer and smartphone fundamentals",
      "Internet basics and how it works",
      "Online safety best practices",
      "Identifying and avoiding scams",
      "Digital hygiene and password management",
      "Safe browsing habits",
    ],
    trainer: "Lucky Nakola",
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
  {
    id: 2,
    title: "Web Development Using HTML, CSS & JavaScript",
    slug: "web-development-html-css-javascript",
    date: "March 20, 2026",
    startsAt: "2026-03-20T19:00:00+03:00",
    time: "7:00 PM - 9:00 PM EAT",
    duration: "3 Days, Friday to Sunday",
    type: "paid",
    price: "KES 300",
    priceAmount: 300,
    spots: {
      total: 30,
      available: 12,
    },
    description:
      "Learn practical frontend web development from scratch with real-world projects. Build your first website using HTML, CSS, and JavaScript while working on hands-on exercises and real-world projects.",
    longDescription:
      "This intensive full-day masterclass is perfect for aspiring web developers. You'll learn to build responsive, modern websites using HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of the session, you'll have a solid foundation and a working project portfolio.",
    targetAudience:
      "Aspiring web developers, career changers, entrepreneurs wanting to build web products",
    topics: [
      "HTML essentials and semantic markup",
      "CSS styling and responsive design",
      "JavaScript fundamentals and DOM manipulation",
      "Building real-world projects",
      "Version control with Git",
      "Deploying your first website",
    ],
    trainer: "Lucky Nakola",
    paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
  {
    id: 3,
    title: "AI & Machine Learning: Getting Started",
    slug: "ai-machine-learning-getting-started",
    date: "March 27, 2026",
    startsAt: "2026-03-27T19:00:00+03:00",
    time: "7:00 PM - 9:00 PM EAT",
    duration: "2 hours",
    type: "free",
    spots: {
      total: 75,
      available: 54,
    },
    description:
      "Introduction to artificial intelligence and machine learning concepts. Explore real-world applications, beginner-friendly tools, and how AI is transforming industries.",
    longDescription:
      "Curious about AI and machine learning but don't know where to start? This webinar demystifies AI concepts and shows you practical applications. You'll learn about machine learning basics, explore real-world use cases, and discover tools you can use today.",
    targetAudience:
      "Tech enthusiasts, career explorers, anyone interested in AI/ML basics",
    topics: [
      "What is AI and Machine Learning?",
      "Real-world applications of AI",
      "ML algorithms explained simply",
      "Popular AI tools and platforms",
      "Ethics in AI",
      "Future trends and opportunities",
    ],
    trainer: "Lucky Nakola",
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
  {
    id: 4,
    title: "Advanced Software Engineering (JavaScript + XAMPP & MySQL)",
    slug: "advanced-software-engineering-javascript-xampp-mysql",
    date: "April 22, 2026",
    startsAt: "2026-04-22T19:00:00+03:00",
    time: "7:00 PM - 9:00 PM EAT",
    duration: "Full Day",
    type: "paid",
    price: "KES 500",
    priceAmount: 500,
    spots: {
      total: 25,
      available: 8,
    },
    description:
      "Dive into backend development, database design, API development, and full-stack workflows. Learn to build complete, production-ready applications.",
    longDescription:
      "Take your development skills to the next level. This comprehensive masterclass covers backend development using JavaScript, working with XAMPP for local development, and MySQL for database management. You'll learn professional software engineering practices and build a complete full-stack application.",
    targetAudience:
      "Web developers wanting to expand to backend, junior developers, aspiring full-stack engineers",
    topics: [
      "Backend development fundamentals",
      "Node.js and Express frameworks",
      "Database design with MySQL",
      "RESTful API development",
      "Authentication and security",
      "Deployment and DevOps basics",
    ],
    trainer: "Lucky Nakola",
    paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
  {
    id: 5,
    title: "Digital Marketing for Tech Startups",
    slug: "digital-marketing-for-tech-startups",
    date: "May 20, 2026",
    startsAt: "2026-05-20T19:00:00+03:00",
    time: "7:00 PM - 9:00 PM EAT",
    duration: "2 hours",
    type: "free",
    spots: {
      total: 80,
      available: 62,
    },
    description:
      "Learn effective digital marketing strategies for tech products. Master branding, social media, customer acquisition, and growth hacking for startups.",
    longDescription:
      "Building an amazing tech product is just the first step. This webinar teaches you how to market it effectively. Learn proven strategies for building your brand, growing your audience, and acquiring customers on a startup budget.",
    targetAudience:
      "Tech entrepreneurs, startup founders, product managers, solo developers",
    topics: [
      "Tech branding essentials",
      "Social media strategy for tech",
      "Content marketing for growth",
      "Customer acquisition tactics",
      "Growth hacking principles",
      "Building community around your product",
    ],
    trainer: "Lucky Nakola",
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
  {
    id: 6,
    title: "DevOps & Cloud Computing",
    slug: "devops-cloud-computing",
    date: "July 29, 2026",
    startsAt: "2026-07-29T19:00:00+03:00",
    time: "7:00 PM - 9:00 PM EAT",
    duration: "Full Day",
    type: "paid",
    price: "KES 800",
    priceAmount: 800,
    spots: {
      total: 20,
      available: 3,
    },
    description:
      "Master CI/CD pipelines, cloud fundamentals, deployment strategies, and modern DevOps practices. Learn to scale applications efficiently.",
    longDescription:
      "DevOps is transforming how applications are built and deployed. This masterclass covers tools, practices, and mindset needed for modern infrastructure management. You'll learn cloud platforms, containerization, automation, and deployment best practices.",
    targetAudience:
      "Backend developers, system administrators, tech leads, engineering teams",
    topics: [
      "Cloud computing fundamentals",
      "Docker and containerization",
      "CI/CD pipelines and automation",
      "Infrastructure as Code",
      "Monitoring and logging",
      "Scaling and performance optimization",
    ],
    trainer: "Lucky Nakola",
    paymentMethods: ["M-Pesa", "Bank Transfer", "PayPal"],
    bookingLink: "https://forms.gle/nvioKLZqe4dN3ZTK8",
  },
];

export const webinarsBySlug = webinars.reduce<Record<string, WebinarRecord>>(
  (acc, webinar) => {
    acc[webinar.slug] = webinar;
    return acc;
  },
  {},
);

export const getWebinarBySlug = (slug: string): WebinarRecord | undefined => {
  return webinarsBySlug[slug];
};
