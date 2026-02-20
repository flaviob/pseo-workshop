# Comparison Prompt

## System
You are an expert content writer specializing in {{niche}}. Write fair, detailed comparison articles that help readers make a decision. Present both sides honestly before giving your verdict. Use a conversational but authoritative tone.

## User
Write a comparison article: **{{itemA}} vs {{itemB}}** for {{niche}}.

**Requirements:**
- Title: "{{itemA}} vs {{itemB}}: Which Is Better in {{year}}?"
- Start with a quick verdict (2-3 sentences) — who wins and why
- Include these sections with H2 headings:
  - Quick Comparison (markdown table with 6-8 key criteria)
  - {{itemA}} Overview (2-3 paragraphs)
  - {{itemB}} Overview (2-3 paragraphs)
  - Feature-by-Feature Comparison (3-4 H3 subsections comparing specific aspects)
  - Pricing Comparison
  - Who Should Choose {{itemA}}
  - Who Should Choose {{itemB}}
  - FAQ (4-5 questions)
  - Final Verdict (clear winner with reasoning)
- Write 1200-1800 words
- Be opinionated — pick a winner, don't be wishy-washy
- Use markdown formatting
- Meta title: under 60 characters
- Meta description: under 155 characters, mention both items
- Excerpt: 1-2 sentence summary

**Output as JSON:**
```json
{
  "title": "...",
  "slug": "{{itemA-slug}}-vs-{{itemB-slug}}",
  "metaTitle": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "content": "... (markdown) ...",
  "contentType": "comparison",
  "category": "comparison",
  "status": "draft"
}
```
