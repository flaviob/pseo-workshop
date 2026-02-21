import { buildLinkMap, injectInternalLinks } from "../lib/internal-links";

function extractHeadings(markdown) {
  if (!markdown) return [];
  const headings = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ text, id });
    }
  }
  return headings;
}

function markdownToHtml(markdown) {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks (must be before inline code)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-brand-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm"><code>$2</code></pre>'
  );

  // Headings — add id for TOC anchor links
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    return `<h3 id="${id}">${text.trim()}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    return `<h2 id="${id}">${text.trim()}</h2>`;
  });
  html = html.replace(/^# (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    return `<h2 id="${id}">${text.trim()}</h2>`;
  });

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

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote>$1</blockquote>'
  );

  // Mark unordered list items (handles - , * , and • prefixes)
  html = html.replace(/^[-*•]\s+(.+)$/gm, '<!--ul-li-->$1<!--/ul-li-->');

  // Mark ordered list items
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<!--ol-li-->$1<!--/ol-li-->');

  // Paragraphs (lines that aren't already wrapped in HTML tags)
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<")) return block;

      // Check if this block contains list items
      const lines = block.split("\n");
      const ulLines = lines.filter((l) => l.includes("<!--ul-li-->"));
      const olLines = lines.filter((l) => l.includes("<!--ol-li-->"));

      if (ulLines.length > 0) {
        // Process mixed content: non-list lines become paragraphs before/after the list
        let result = "";
        let listItems = [];
        for (const line of lines) {
          if (line.includes("<!--ul-li-->")) {
            listItems.push(`<li>${line.replace("<!--ul-li-->", "").replace("<!--/ul-li-->", "")}</li>`);
          } else {
            if (listItems.length > 0) {
              result += `<ul>${listItems.join("")}</ul>`;
              listItems = [];
            }
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("<")) {
              result += `<p>${trimmed}</p>`;
            } else if (trimmed) {
              result += trimmed;
            }
          }
        }
        if (listItems.length > 0) {
          result += `<ul>${listItems.join("")}</ul>`;
        }
        return result;
      }

      if (olLines.length > 0) {
        let result = "";
        let listItems = [];
        for (const line of lines) {
          if (line.includes("<!--ol-li-->")) {
            listItems.push(`<li>${line.replace("<!--ol-li-->", "").replace("<!--/ol-li-->", "")}</li>`);
          } else {
            if (listItems.length > 0) {
              result += `<ol>${listItems.join("")}</ol>`;
              listItems = [];
            }
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("<")) {
              result += `<p>${trimmed}</p>`;
            } else if (trimmed) {
              result += trimmed;
            }
          }
        }
        if (listItems.length > 0) {
          result += `<ol>${listItems.join("")}</ol>`;
        }
        return result;
      }

      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  // Clean up any stray markers
  html = html.replace(/<!--\/?[uo]l-li-->/g, "");

  return html;
}

function TableOfContents({ headings }) {
  if (!headings || headings.length < 2) return null;

  return (
    <nav className="bg-white rounded-2xl border border-brand-200 p-6 mb-10">
      <h2 className="font-display text-sm font-bold text-ink-400 uppercase tracking-wider mb-4">
        On This Page
      </h2>
      <ol className="space-y-2">
        {headings.map((h, i) => (
          <li key={h.id} className="flex items-baseline gap-3">
            <span className="text-sm font-bold text-accent-500 tabular-nums">{i + 1}.</span>
            <a
              href={`#${h.id}`}
              className="text-ink-800 hover:text-accent-600 transition-colors font-medium"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ShareButtons({ title, slug }) {
  const url = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${slug}`);
  const text = encodeURIComponent(title);

  return (
    <div className="bg-white rounded-2xl border border-brand-200 p-6 mb-10">
      <h2 className="font-display text-sm font-bold text-ink-400 uppercase tracking-wider mb-4">
        Share
      </h2>
      <div className="flex gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-ink-600 hover:bg-brand-50 hover:border-accent-300 transition-all text-sm font-medium"
        >
          <span>&#120143;</span>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-ink-600 hover:bg-brand-50 hover:border-accent-300 transition-all text-sm font-medium"
        >
          in
        </a>
      </div>
    </div>
  );
}

export default function ArticleContent({ content, currentSlug, allArticles, title }) {
  let processedContent = content;

  // Strip the first H1 if it matches the article title (avoids duplicate)
  if (title && processedContent) {
    processedContent = processedContent.replace(/^#\s+.+\n+/, "");
  }

  // Extract headings for TOC before injecting links
  const headings = extractHeadings(processedContent);

  // Build link map and inject internal links
  if (allArticles && allArticles.length > 0) {
    const linkMap = buildLinkMap(allArticles);
    processedContent = injectInternalLinks(processedContent, currentSlug, linkMap);
  }

  const html = markdownToHtml(processedContent);

  return (
    <>
      <TableOfContents headings={headings} />
      <ShareButtons title={title} slug={currentSlug} />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
