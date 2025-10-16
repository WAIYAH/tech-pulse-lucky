import { motion } from "framer-motion";
import { Calendar, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface TipCardProps {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  image?: string;
  index?: number;
}

const TipCard = ({ title, summary, date, tags, image, index = 0 }: TipCardProps) => {
  const handleShare = (platform: 'whatsapp' | 'facebook') => {
    const url = window.location.href;
    const text = `Check out this tip: ${title}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card h-full">
        {image && (
          <div className="relative h-48 overflow-hidden bg-gradient-primary">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <h3 className="text-xl font-bold text-foreground line-clamp-2">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{summary}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">Read More</Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              aria-label="Share on WhatsApp"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TipCard;
