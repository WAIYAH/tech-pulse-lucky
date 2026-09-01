import { useEffect } from "react";

interface SEOInput {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://gettechy.nakolaexpertsystems.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.webp`;
const DEFAULT_IMAGE_ALT = "Tech Pulse Insider learning platform";

const ensureMeta = (selector: string, attr: "name" | "property", value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  return el;
};

const ensureLink = (selector: string, rel: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
};

const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const useSEO = ({
  title,
  description,
  canonicalPath,
  keywords,
  image,
  imageAlt,
  type = "website",
  noindex = false,
}: SEOInput) => {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = toAbsoluteUrl(canonicalPath);
    const imageUrl = toAbsoluteUrl(image ?? DEFAULT_IMAGE);
    const robotsValue = noindex
      ? "noindex, nofollow, max-image-preview:none"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

    ensureMeta('meta[name="description"]', "name", "description").setAttribute(
      "content",
      description,
    );
    ensureMeta('meta[name="keywords"]', "name", "keywords").setAttribute(
      "content",
      keywords ?? "",
    );
    ensureMeta('meta[name="robots"]', "name", "robots").setAttribute(
      "content",
      robotsValue,
    );

    ensureMeta('meta[property="og:title"]', "property", "og:title").setAttribute(
      "content",
      title,
    );
    ensureMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
    ).setAttribute("content", description);
    ensureMeta('meta[property="og:type"]', "property", "og:type").setAttribute(
      "content",
      type,
    );
    ensureMeta('meta[property="og:url"]', "property", "og:url").setAttribute(
      "content",
      canonicalUrl,
    );
    ensureMeta('meta[property="og:image"]', "property", "og:image").setAttribute(
      "content",
      imageUrl,
    );
    ensureMeta(
      'meta[property="og:image:alt"]',
      "property",
      "og:image:alt",
    ).setAttribute("content", imageAlt ?? DEFAULT_IMAGE_ALT);
    ensureMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
    ).setAttribute("content", "Tech Pulse Insider");

    ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").setAttribute(
      "content",
      title,
    );
    ensureMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
    ).setAttribute("content", description);
    ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").setAttribute(
      "content",
      imageUrl,
    );
    ensureMeta('meta[name="twitter:card"]', "name", "twitter:card").setAttribute(
      "content",
      "summary_large_image",
    );
    ensureMeta(
      'meta[name="twitter:image:alt"]',
      "name",
      "twitter:image:alt",
    ).setAttribute("content", imageAlt ?? DEFAULT_IMAGE_ALT);

    ensureLink('link[rel="canonical"]', "canonical").setAttribute("href", canonicalUrl);
  }, [canonicalPath, description, image, imageAlt, keywords, noindex, title, type]);
};
