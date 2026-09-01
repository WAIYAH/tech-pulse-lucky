# SEO and Crawl Guide

This project uses static SEO configuration for search discoverability.

## Files

- `index.html`
  - Canonical URL
  - Meta description / Open Graph / Twitter cards
  - Structured data (`EducationalOrganization`, `WebSite`)

- `public/robots.txt`
  - Allows public pages
  - Blocks private LMS/account/admin paths from indexing
  - Declares sitemap location

- `public/sitemap.xml`
  - Includes key public routes
  - Includes article, webinar/event, and course detail pages

## When to Update

Update sitemap and SEO files when:

- A new public page is added
- A route slug changes (article, event, course)
- The production domain changes

## Domain Change Checklist

Current production domain: `https://gettechy.nakolaexpertsystems.com` (migrated from `https://techpulseinsider.com`).

If the domain changes again:

1. Update canonical and social URLs in `index.html`
2. Update the `SITE_URL` fallback in `src/hooks/useSEO.ts`, and the `VITE_SITE_URL` build env var wherever the site is hosted
3. Update sitemap URL in `public/robots.txt`
4. Update `<loc>` entries in `public/sitemap.xml`
5. Update the domain in `README.md`
6. Update contact email domains referenced in `src/data/lmsConfig.ts`, `src/components/Footer.tsx`, and the Contact/Terms/Privacy/Editorial/MediaKit/Author pages
7. Re-deploy and submit the sitemap in Google Search Console
