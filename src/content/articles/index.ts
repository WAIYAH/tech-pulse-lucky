// Article metadata and content management
// Import markdown content as text

export interface ArticleMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  author: string;
  tags: string[];
  readingTime: number;
  content: string;
  coverImage?: string;
}

// Article 1: Essential Cybersecurity Remote Workers
import cybersecurityContent from "./essential-cybersecurity-remote-workers.md?raw";

export const essentialCybersecurityArticle: ArticleMetadata = {
  id: "cybersecurity-remote",
  slug: "essential-cybersecurity-remote-workers",
  title: "Essential Cybersecurity Tips for Remote Workers",
  description:
    "Master 10 critical cybersecurity practices every remote worker should implement to protect themselves, their families, and their organizations.",
  publishDate: "2025-01-15",
  author: "Lucky Nakola",
  tags: ["Cybersecurity", "Remote Work", "Safety", "Best Practices"],
  readingTime: 12,
  content: cybersecurityContent,
  coverImage:
    "https://images.unsplash.com/photo-1563986768609-322d80bbf980?w=1200&q=80",
};

// Article 2: Getting Started with Web Development
import webDevContent from "./getting-started-web-development-2025.md?raw";

export const webDevelopmentArticle: ArticleMetadata = {
  id: "web-dev-2025",
  slug: "getting-started-web-development-2025",
  title: "Getting Started with Web Development in 2025: A Beginner's Guide",
  description:
    "A comprehensive guide to starting your web development journey with clear learning paths, essential tools, and practical projects.",
  publishDate: "2025-01-18",
  author: "Lucky Nakola",
  tags: ["Web Development", "Beginners", "HTML", "CSS", "JavaScript"],
  readingTime: 15,
  content: webDevContent,
  coverImage:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
};

// Article 3: AI Tools Every Professional Should Know
import aiToolsContent from "./ai-tools-every-professional-should-know.md?raw";

export const aiToolsArticle: ArticleMetadata = {
  id: "ai-tools-2025",
  slug: "ai-tools-every-professional-should-know",
  title: "AI Tools Every Professional Should Know in 2025",
  description:
    "Discover the most practical AI tools transforming how professionals work across industries, with guides on how to use them effectively.",
  publishDate: "2025-01-22",
  author: "Lucky Nakola",
  tags: ["AI", "Productivity", "Tools", "Professional Development"],
  readingTime: 14,
  content: aiToolsContent,
  coverImage:
    "https://images.unsplash.com/photo-1677442d019cecf8d88aef2e34aaf1f7?w=1200&q=80",
};

// Article 4: Cloud Computing Fundamentals
import cloudComputingContent from "./cloud-computing-fundamentals.md?raw";

export const cloudComputingArticle: ArticleMetadata = {
  id: "cloud-computing-fundamentals",
  slug: "cloud-computing-fundamentals",
  title: "Cloud Computing Fundamentals: AWS, Azure, and Google Cloud",
  description:
    "Complete guide to cloud computing basics, major platforms (AWS, Azure, GCP), deployment models, and getting started with cloud services.",
  publishDate: "2025-01-24",
  author: "Lucky Nakola",
  tags: ["Cloud Computing", "AWS", "Azure", "GCP", "Infrastructure"],
  readingTime: 16,
  content: cloudComputingContent,
  coverImage:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
};

// Article 5: Data Science for Beginners
import dataScienceContent from "./data-science-beginners-guide.md?raw";

export const dataScienceArticle: ArticleMetadata = {
  id: "data-science-beginners",
  slug: "data-science-beginners-guide",
  title: "Data Science for Beginners: Tools, Techniques, and Career Path",
  description:
    "Comprehensive introduction to data science covering skills, workflow, tools, learning pathways, and career opportunities in the field.",
  publishDate: "2025-01-25",
  author: "Lucky Nakola",
  tags: ["Data Science", "Machine Learning", "Python", "Analytics"],
  readingTime: 17,
  content: dataScienceContent,
  coverImage:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
};

// Article 6: Mobile App Development
import mobileAppContent from "./mobile-app-development-ios-android.md?raw";

export const mobileAppArticle: ArticleMetadata = {
  id: "mobile-app-development",
  slug: "mobile-app-development-ios-android",
  title: "Mobile App Development: Building iOS and Android Apps",
  description:
    "Guide to mobile development covering native iOS/Android development, cross-platform frameworks, and best practices for app development.",
  publishDate: "2025-01-26",
  author: "Lucky Nakola",
  tags: ["Mobile Development", "iOS", "Android", "React Native", "Flutter"],
  readingTime: 16,
  content: mobileAppContent,
  coverImage:
    "https://images.unsplash.com/photo-1512941691920-25bda36fe0c9?w=1200&q=80",
};

// Article 7: DevOps and CI/CD
import devopsContent from "./devops-ci-cd-pipelines.md?raw";

export const devopsArticle: ArticleMetadata = {
  id: "devops-ci-cd",
  slug: "devops-ci-cd-pipelines",
  title: "DevOps and CI/CD Pipelines: Automate Your Deployments",
  description:
    "Master DevOps practices, CI/CD pipelines, automation tools, infrastructure as code, and modern deployment strategies.",
  publishDate: "2025-01-27",
  author: "Lucky Nakola",
  tags: ["DevOps", "CI/CD", "Automation", "Infrastructure", "Docker", "Kubernetes"],
  readingTime: 18,
  content: devopsContent,
  coverImage:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
};

// Article 8: Database Design and SQL
import databaseContent from "./database-design-sql.md?raw";

export const databaseArticle: ArticleMetadata = {
  id: "database-design-sql",
  slug: "database-design-sql",
  title: "Database Design and SQL: Building Efficient Data Systems",
  description:
    "Comprehensive guide to relational databases, normalization, SQL queries, optimization, and best practices for data system design.",
  publishDate: "2025-01-28",
  author: "Lucky Nakola",
  tags: ["Database", "SQL", "PostgreSQL", "Data Design", "Performance"],
  readingTime: 17,
  content: databaseContent,
  coverImage:
    "https://images.unsplash.com/photo-1516321318423-f06f70504c8a?w=1200&q=80",
};

// Article 9: REST APIs
import restApisContent from "./rest-apis-development.md?raw";

export const restApisArticle: ArticleMetadata = {
  id: "rest-apis-development",
  slug: "rest-apis-development",
  title: "REST APIs: Building Robust Web Services",
  description:
    "Complete guide to REST API design, HTTP methods, status codes, authentication, documentation, and best practices for API development.",
  publishDate: "2025-01-28",
  author: "Lucky Nakola",
  tags: ["API", "REST", "Web Services", "Backend", "Node.js"],
  readingTime: 15,
  content: restApisContent,
  coverImage:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
};

// All articles array
export const allArticles: ArticleMetadata[] = [
  restApisArticle,
  databaseArticle,
  devopsArticle,
  mobileAppArticle,
  dataScienceArticle,
  cloudComputingArticle,
  aiToolsArticle,
  webDevelopmentArticle,
  essentialCybersecurityArticle,
];

// Get article by slug
export const getArticleBySlug = (slug: string): ArticleMetadata | undefined => {
  return allArticles.find((article) => article.slug === slug);
};

// Get all unique tags
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  allArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

// Get articles by tag
export const getArticlesByTag = (tag: string): ArticleMetadata[] => {
  return allArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
};

// Search articles
export const searchArticles = (query: string): ArticleMetadata[] => {
  const lowerQuery = query.toLowerCase();
  return allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get related articles
export const getRelatedArticles = (
  currentSlug: string,
  limit: number = 3
): ArticleMetadata[] => {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const related = allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      let score = 0;
      // Score based on shared tags
      currentArticle.tags.forEach((tag) => {
        if (article.tags.includes(tag)) score++;
      });
      return { article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);

  return related;
};

// Sort articles by date (newest first)
export const getSortedArticles = (articles: ArticleMetadata[] = allArticles) => {
  return [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
};
