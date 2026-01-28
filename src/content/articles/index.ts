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

// All articles array
export const allArticles: ArticleMetadata[] = [
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
