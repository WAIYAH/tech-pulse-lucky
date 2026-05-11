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

If domain changes from `https://techpulseinsider.com`:

1. Update canonical and social URLs in `index.html`
2. Update sitemap URL in `public/robots.txt`
3. Update `<loc>` entries in `public/sitemap.xml`
4. Re-deploy and submit sitemap in Google Search Console
