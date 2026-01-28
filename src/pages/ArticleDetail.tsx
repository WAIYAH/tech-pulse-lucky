import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleBySlug, getRelatedArticles } from "@/content/articles";
import { useEffect } from "react";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : null;
  const relatedArticles = article ? getRelatedArticles(article.slug, 3) : [];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/articles")} className="gap-2">
            <ArrowLeft size={18} />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out: ${article.title} by Lucky Nakola`;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
        return;
    }
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/articles")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Articles</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Hero Image */}
            {article.coverImage && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={article.coverImage}
                alt={article.title}
                className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg"
              />
            )}

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 text-muted-foreground mb-8 pb-8 border-b">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>
                    {new Date(article.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span>{article.readingTime} min read</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm font-semibold text-muted-foreground">Share:</span>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors group"
                  title="Share on Twitter"
                >
                  <Twitter size={20} className="text-blue-500 group-hover:text-blue-600" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 hover:bg-blue-600/10 rounded-lg transition-colors group"
                  title="Share on Facebook"
                >
                  <Facebook size={20} className="text-blue-600 group-hover:text-blue-700" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-2 hover:bg-gray-500/10 rounded-lg transition-colors group"
                  title="Copy link"
                >
                  <Share2 size={20} className="text-gray-600 group-hover:text-gray-700" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
            >
              <div className="space-y-6 text-base leading-relaxed">
                {article.content.split("\n").map((line, idx) => {
                  // Handle headings
                  if (line.startsWith("###")) {
                    return (
                      <h3 key={idx} className="text-2xl font-bold mt-8 mb-4">
                        {line.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (line.startsWith("##")) {
                    return (
                      <h2 key={idx} className="text-3xl font-bold mt-10 mb-6">
                        {line.replace("##", "").trim()}
                      </h2>
                    );
                  }
                  if (line.startsWith("#")) {
                    return (
                      <h1 key={idx} className="text-4xl font-bold mt-12 mb-6">
                        {line.replace("#", "").trim()}
                      </h1>
                    );
                  }

                  // Handle bold text
                  if (line.includes("**")) {
                    return (
                      <p key={idx} className="text-muted-foreground">
                        {line
                          .split(/\*\*(.+?)\*\*/g)
                          .map((part, i) =>
                            i % 2 === 1 ? (
                              <strong key={i}>{part}</strong>
                            ) : (
                              part
                            )
                          )}
                      </p>
                    );
                  }

                  // Handle code blocks
                  if (line.startsWith("```")) {
                    return null; // Skip code fence markers for now
                  }

                  // Handle lists
                  if (line.startsWith("-")) {
                    return (
                      <li key={idx} className="text-muted-foreground list-disc list-inside">
                        {line.replace("-", "").trim()}
                      </li>
                    );
                  }

                  // Regular paragraphs
                  if (line.trim()) {
                    return (
                      <p key={idx} className="text-muted-foreground">
                        {line}
                      </p>
                    );
                  }

                  return null;
                })}
              </div>
            </motion.div>

            {/* Bottom Share & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 pt-12 border-t"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">About Lucky Nakola</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Tech educator, developer, and founder of Tech Pulse Insider. Passionate
                        about making quality tech education accessible to everyone in Africa.
                      </p>
                    </div>
                    <Button variant="hero" size="sm">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Table of Contents / CTA */}
            <Card className="sticky top-20 mb-6">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Didn't find what you need?</h3>
                <Button
                  variant="outline"
                  className="w-full mb-3"
                  onClick={() => navigate("/articles")}
                >
                  View All Articles
                </Button>
                <Button variant="hero" className="w-full" onClick={() => navigate("/contact")}>
                  Contact Us
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((relArticle) => (
                    <Link
                      key={relArticle.slug}
                      to={`/articles/${relArticle.slug}`}
                      className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                    >
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {relArticle.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {relArticle.readingTime} min read
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
