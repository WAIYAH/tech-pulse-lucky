import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Calendar, Clock, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  allArticles,
  getAllTags,
  getArticlesByTag,
  searchArticles,
  getSortedArticles,
} from "@/content/articles";
import { useState, useMemo } from "react";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [sortBy, setSortBy] = useState("latest");

  const allTags = getAllTags();

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let articles = [...allArticles];

    // Filter by tag
    if (selectedTag) {
      articles = getArticlesByTag(selectedTag);
    }

    // Search by query
    if (searchQuery) {
      articles = articles.filter((article) =>
        searchArticles(searchQuery).some((a) => a.id === article.id)
      );
    }

    // Sort
    if (sortBy === "latest") {
      articles = getSortedArticles(articles);
    } else if (sortBy === "oldest") {
      articles = getSortedArticles(articles).reverse();
    } else if (sortBy === "reading-time") {
      articles.sort((a, b) => b.readingTime - a.readingTime);
    }

    return articles;
  }, [searchQuery, selectedTag, sortBy]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("");
      setSearchParams({});
    } else {
      setSelectedTag(tag);
      setSearchParams({ tag });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSortBy("latest");
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedTag || sortBy !== "latest";

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tech Tips & <span className="text-primary">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In-depth guides, best practices, and insights on web development, cybersecurity, AI,
            and digital skills. Written for professionals and beginners alike.
          </p>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>
          </form>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Tags Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={18} className="text-primary" />
                <span className="text-sm font-semibold">Filter by topic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="reading-time">Reading Time</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <X size={16} />
              Clear all filters
            </button>
          )}
        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:border-primary/50 border-2 overflow-hidden group">
                  {/* Cover Image */}
                  {article.coverImage && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                          +{article.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="flex-grow pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(article.publishDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{article.readingTime} min</span>
                      </div>
                    </div>

                    <Link
                      to={`/articles/${article.slug}`}
                      className="inline-block"
                    >
                      <Button variant="ghost" size="sm" className="gap-2 group/btn">
                        Read
                        <svg
                          className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        {filteredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            <p className="text-sm">
              Showing {filteredArticles.length} of {allArticles.length} articles
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Looking for More Resources?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our webinars, custom training programs, and community for hands-on learning
            and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/webinars">
              <Button variant="hero" size="lg">
                Explore Webinars
              </Button>
            </Link>
            <Link to="/custom-training">
              <Button variant="outline" size="lg">
                Custom Training
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Articles;
