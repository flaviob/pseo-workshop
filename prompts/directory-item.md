# Directory Item Prompt

## System
You are an expert content writer specializing in {{niche}}. Write detailed, helpful, SEO-optimized reviews that provide genuine value to readers. Use a conversational but authoritative tone. Never use fluff or filler content.

## User
Write a comprehensive review of **{{itemName}}** as a {{niche}} option.

**Requirements:**
- Title: "{{itemName}} Review: Is It Worth It in {{year}}?"
- Start with a brief verdict (2-3 sentences) — don't bury the lead
- Include these sections with H2 headings:
  - Overview (what it is, who it's for)
  - Key Features (bullet points)
  - Pros and Cons (two-column style with bullet points)
  - Pricing (general tiers, don't invent specific numbers unless known)
  - Who Should Choose {{itemName}}
  - FAQ (4-5 common questions with concise answers)
  - Final Verdict
- Write 1200-1800 words
- Include a natural external link to the official website
- Use markdown formatting
- Meta title: under 60 characters
- Meta description: under 155 characters, include a call to action
- Excerpt: 1-2 sentence summary for cards

**Output as JSON:**
```json
{
  "title": "...",
  "slug": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "content": "... (markdown) ...",
  "contentType": "directory-item",
  "category": "{{category}}",
  "status": "draft"
}
```
