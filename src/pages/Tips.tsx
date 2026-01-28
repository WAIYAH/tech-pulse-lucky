import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { allArticles, getSortedArticles } from "@/content/articles";
import { useState, useMemo } from "react";

const Tips = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use articles from the new content system
  const sortedArticles = getSortedArticles();

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return sortedArticles;
    const lowerQuery = searchQuery.toLowerCase();
    return sortedArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, sortedArticles]);

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            In-depth guides, best practices, and insights on web development, cybersecurity, AI,
            and digital skills. Written for professionals and beginners alike.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-3 rounded-lg border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="flex-grow pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {article.readingTime} min read
                    </span>

                    <Link to={`/articles/${article.slug}`}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No articles found matching your search. Try different keywords!
            </p>
          </motion.div>
        )}

        {/* View All Link */}
        {filteredArticles.length > 0 && filteredArticles.length < allArticles.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <Link to="/articles">
              <Button variant="outline">View All Articles</Button>
            </Link>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Want Even More Learning?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our interactive webinars, custom training, and community for hands-on learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/webinars">
              <Button variant="hero" size="lg">
                Explore Webinars
              </Button>
            </Link>
            <Link to="/articles">
              <Button variant="outline" size="lg">
                All Articles
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tips;
