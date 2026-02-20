# pSEO Workshop — Claude Code Instructions

## Project Overview
This is a programmatic SEO (pSEO) site builder. It generates niche directory sites with hundreds of pages using Claude API for content, Strapi as CMS, and Next.js for the frontend.

## Architecture
- **config.js** — Single source of truth for the niche (site name, modifiers, content types, colors)
- **prompts/** — Markdown templates for each content type with `{{placeholders}}`
- **scripts/** — Node.js scripts for content generation, Strapi import, and CMS management
- **frontend/** — Next.js App Router site with TailwindCSS that fetches from Strapi

## Content Types
1. **Directory Item** — Deep review of a single item (e.g. "WeWork Review"). Route: `/[slug]`
2. **Listicle** — "Best X in Y" roundup (e.g. "Best Coworking Spaces in Berlin"). Route: `/best/[slug]`
3. **Comparison** — "X vs Y" article (e.g. "WeWork vs Regus"). Route: `/compare/[slug]`
4. **Blog** — Educational/how-to guides. Route: `/blog/[slug]`

## Key Commands
```bash
# Generate content (outputs JSON to output/ folder)
npm run generate

# Push generated content to Strapi as drafts
npm run import

# Manage Strapi content from CLI
npm run manage -- list
npm run manage -- publish <id>
npm run manage -- unpublish <id>
npm run manage -- delete <id>

# Setup Strapi API permissions
npm run setup-permissions

# Run frontend
npm run dev
```

## Content Generation Workflow
1. Read config.js for niche details and modifiers
2. Load the appropriate prompt template from prompts/
3. Replace `{{placeholders}}` with values from config
4. Call Claude API to generate the article
5. Save as JSON in output/ directory with: title, slug, metaTitle, metaDescription, content (markdown), category, contentType, status: "draft"
6. Import to Strapi with push-to-strapi.js
7. Review in Strapi admin, edit if needed
8. Publish when ready

## Internal Linking Strategy
- **Pillar pages** = Listicles ("Best X in Y")
- **Cluster pages** = Directory items, comparisons, blog posts
- Pillar pages link DOWN to cluster pages
- Cluster pages link UP to pillar pages
- Max 3-5 internal links per article
- **CRITICAL: Always vary anchor text.** Never use the same anchor phrase for every link to a page. Use natural-language variations. For example, instead of always linking "WeWork" → use "this popular coworking chain", "WeWork's offices", "the WeWork review", etc.
- Never place links inside headings
- Track links per slug to avoid spam patterns

## Strapi Content Type
The Strapi collection type is called `article` with these fields:
- `title` (text) — Article title
- `slug` (uid, based on title) — URL slug
- `content` (rich text / markdown) — Article body
- `metaTitle` (text) — SEO title tag
- `metaDescription` (text) — Meta description
- `contentType` (enumeration: directory-item, listicle, comparison, blog) — Type of content
- `category` (text) — Category/modifier (e.g. city name)
- `excerpt` (text) — Short summary for cards

## Environment Variables
- `STRAPI_URL` — Strapi API URL (e.g. https://your-app.up.railway.app)
- `STRAPI_TOKEN` — Strapi API token (full access)
- `ANTHROPIC_API_KEY` — For content generation
- `NEXT_PUBLIC_STRAPI_URL` — Same as STRAPI_URL, exposed to frontend
- `NEXT_PUBLIC_SITE_URL` — Your frontend domain

## When Asked to Generate Content
1. Read config.js to understand the niche
2. Use `npm run generate` or create custom generation by reading prompts/ templates
3. Generated files go to output/ as JSON
4. Always generate as draft — never auto-publish

## When Asked to Edit Content
1. Use `npm run manage -- list` to find the article
2. Use the Strapi API directly or `npm run manage -- update <id>` with the changes
3. Or edit the JSON in output/ and re-import

## When Asked to Add a New City/Modifier
1. Update config.js primaryModifiers array
2. Run content generation for the new modifier only
3. Import to Strapi
4. Frontend picks it up automatically (ISR/revalidate)

## SEO Rules
- Every page needs unique metaTitle (under 60 chars) and metaDescription (under 155 chars)
- Include schema markup (Article, FAQPage, ItemList as appropriate)
- Sitemap at /sitemap.xml includes all published articles
- robots.txt allows all crawlers
- OG images generated dynamically at /api/og
- Canonical URLs on every page
