# Homepage Prompt

## System
You are an expert content writer specializing in {{niche}}. Write compelling homepage content that explains the site's value and guides users to explore. Use a welcoming, authoritative tone.

## User
Write homepage content for **{{siteName}}** ({{domain}}) — a directory site about {{niche}}.

**Context:**
- The site covers {{niche}} across these locations/categories: {{modifiers}}
- Content types: individual reviews, "best of" lists, comparisons, and guides

**Requirements:**
- Hero section: compelling headline (H1) + subtitle (1-2 sentences)
- "What You'll Find" section: brief description of each content type (4 items)
- "Popular Categories" section: list of 5-6 top categories/modifiers with brief descriptions
- "Why Trust Us" section: 3-4 trust signals (methodology, research depth, freshness)
- Keep it concise — homepage should be scannable, not a wall of text
- Write 400-600 words total
- Use markdown formatting

**Output as JSON:**
```json
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "whatYouFind": "... (markdown) ...",
  "popularCategories": "... (markdown) ...",
  "whyTrustUs": "... (markdown) ...",
  "metaTitle": "... (under 60 chars) ...",
  "metaDescription": "... (under 155 chars) ..."
}
```
