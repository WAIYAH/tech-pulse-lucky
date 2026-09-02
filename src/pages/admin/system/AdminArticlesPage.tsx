import { Clock3, FileText, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allArticles, getSortedArticles } from "@/content/articles";
import { routes } from "@/routes/routeConfig";

const AdminArticlesPage = () => {
  const sorted = getSortedArticles(allArticles);
  const totalTags = new Set(sorted.flatMap((article) => article.tags)).size;

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Article Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Audit article metadata, publication dates, and linking destinations.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Articles</p>
                <p className="text-3xl font-semibold">{sorted.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Tags</p>
                <p className="text-3xl font-semibold">{totalTags}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <Tags className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Reading Time</p>
                <p className="text-3xl font-semibold">
                  {Math.round(
                    sorted.reduce((sum, item) => sum + item.readingTime, 0) / sorted.length,
                  )}
                  m
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Content Index</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Reading Time</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <p className="font-medium">{article.title}</p>
                        <p className="break-all text-xs text-muted-foreground">{article.slug}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(article.publishDate).toLocaleDateString("en-KE")}
                      </TableCell>
                      <TableCell>{article.readingTime} min</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={`${article.id}-${tag}`} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="outline">+{article.tags.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={routes.public.article(article.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminArticlesPage;
