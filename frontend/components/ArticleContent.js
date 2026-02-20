import { buildLinkMap, injectInternalLinks } from "../lib/internal-links";

function markdownToHtml(markdown) {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks (must be before inline code)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-brand-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm"><code>$2</code></pre>'
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code class="bg-brand-100 px-1.5 py-0.5 rounded text-sm text-ink-700">$1</code>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Tables — find consecutive lines starting with |
  html = html.replace(/(^\|.+\|$\n?)+/gm, (tableBlock) => {
    const rows = tableBlock.trim().split("\n").filter((r) => r.trim());
    if (rows.length < 2) return tableBlock;

    const isSeparator = (row) => /^\|[\s\-:]+(\|[\s\-:]+)+\|?$/.test(row);
    const hasSeparator = isSeparator(rows[1]);

    const parseRow = (row, tag) => {
      const cells = row.split("|").filter((c) => c.trim() !== "");
      return "<tr>" + cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") + "</tr>";
    };

    let tableHtml = '<div class="overflow-x-auto mb-6 rounded-lg border border-brand-200"><table class="w-full border-collapse text-sm">';
    if (hasSeparator) {
      tableHtml += "<thead>" + parseRow(rows[0], "th") + "</thead><tbody>";
      for (let i = 2; i < rows.length; i++) {
        if (!isSeparator(rows[i])) tableHtml += parseRow(rows[i], "td");
      }
      tableHtml += "</tbody>";
    } else {
      tableHtml += "<tbody>";
      for (const row of rows) {
        if (!isSeparator(row)) tableHtml += parseRow(row, "td");
      }
      tableHtml += "</tbody>";
    }
    tableHtml += "</table></div>";
    return tableHtml;
  });

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="my-10 border-brand-200" />');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote>$1</blockquote>'
  );

  // Paragraphs (lines that aren't already wrapped in HTML tags)
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<")) return block;
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

export default function ArticleContent({ content, currentSlug, allArticles, title }) {
  let processedContent = content;

  // Strip the first H1 if it matches the article title (avoids duplicate)
  if (title && processedContent) {
    processedContent = processedContent.replace(/^#\s+.+\n+/, "");
  }

  // Build link map and inject internal links
  if (allArticles && allArticles.length > 0) {
    const linkMap = buildLinkMap(allArticles);
    processedContent = injectInternalLinks(processedContent, currentSlug, linkMap);
  }

  const html = markdownToHtml(processedContent);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
