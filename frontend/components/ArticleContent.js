"use client";

import { buildLinkMap, injectInternalLinks } from "../lib/internal-links";

function markdownToHtml(markdown) {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks (must be before inline code)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4"><code>$2</code></pre>'
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-red-500 hover:text-red-700 underline">$1</a>'
  );

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter((c) => c.trim() !== "");
    return cells.map((c) => `<td class="border border-gray-200 px-4 py-2">${c.trim()}</td>`).join("");
  });

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="my-8 border-gray-200" />');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li class="mb-1">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="mb-1">$1</li>');

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>'
  );

  // Paragraphs (lines that aren't already wrapped in HTML tags)
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<")) return block;
      return `<p class="mb-4 leading-relaxed">${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

export default function ArticleContent({ content, currentSlug, allArticles }) {
  // Build link map and inject internal links
  let processedContent = content;

  if (allArticles && allArticles.length > 0) {
    const linkMap = buildLinkMap(allArticles);
    processedContent = injectInternalLinks(content, currentSlug, linkMap);
  }

  const html = markdownToHtml(processedContent);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
