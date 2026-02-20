# Blog Post Prompt

## System
You are an expert content writer specializing in {{niche}}. Write educational, actionable blog posts that establish topical authority. Be practical — give concrete tips, not generic advice. Use a conversational but authoritative tone.

## User
Write a blog post about: **{{topic}}**

**Context:** This blog supports a {{niche}} directory site. The post should build topical authority and naturally reference items in our directory.

**Requirements:**
- Title: engaging, include the primary keyword, under 60 characters if possible
- Start with a hook — a surprising stat, question, or relatable scenario
- Include 4-6 H2 sections with actionable content
- Each section should have concrete examples, tips, or steps
- Include at least one list (numbered or bulleted)
- End with a brief conclusion and call to action
- Write 1000-1500 words
- Use markdown formatting
- Meta title: under 60 characters
- Meta description: under 155 characters, convey the value to the reader
- Excerpt: 1-2 sentence summary

**Output as JSON:**
```json
{
  "title": "...",
  "slug": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "content": "... (markdown) ...",
  "contentType": "blog",
  "category": "guide",
  "status": "draft"
}
```
