import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const STRUCTURED_DATA_ID = "page-structured-data";

const SEO = ({
  title,
  description,
  canonicalPath,
  keywords,
  image,
  imageAlt,
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  useSEO({
    title,
    description,
    canonicalPath,
    keywords,
    image,
    imageAlt,
    type,
    noindex,
  });

  useEffect(() => {
    const existing = document.getElementById(STRUCTURED_DATA_ID);
    if (!structuredData) {
      if (existing) existing.remove();
      return;
    }

    const script = existing ?? document.createElement("script");
    script.id = STRUCTURED_DATA_ID;
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(structuredData);

    if (!existing) {
      document.head.appendChild(script);
    }

    return () => {
      const latest = document.getElementById(STRUCTURED_DATA_ID);
      if (latest) latest.remove();
    };
  }, [structuredData]);

  return null;
};

export default SEO;
