/**
 * Internal linking engine — pillar/cluster strategy with anchor text variation.
 *
 * Rules:
 * - Max 3-5 internal links per article
 * - Never place links inside headings
 * - Always vary anchor text (never use the same phrase for every link)
 * - Track links per slug to avoid spam patterns
 */

const MAX_LINKS_PER_ARTICLE = 4;

/**
 * Build a link map from a list of articles.
 * Each article gets 3-4 anchor text variations.
 */
export function buildLinkMap(articles) {
  const linkMap = {};

  for (const article of articles) {
    const slug = article.slug;
    const title = article.title;
    const type = article.contentType;

    // Build the correct URL path
    let urlPath = `/${slug}`;
    if (type === "listicle") urlPath = `/best/${slug}`;
    if (type === "comparison") urlPath = `/compare/${slug}`;
    if (type === "blog") urlPath = `/blog/${slug}`;

    // Generate anchor text variations
    const anchors = generateAnchorVariations(title, article.category, type);

    linkMap[slug] = { url: urlPath, anchors, type };
  }

  return linkMap;
}

/**
 * Generate 3-4 anchor text variations for an article.
 * Uses different strategies: exact title, shortened, with category, descriptive.
 */
function generateAnchorVariations(title, category, type) {
  const variations = [];

  // 1. Shortened title (remove year, common suffixes)
  const shortTitle = title
    .replace(/\s*\(\d{4}\)\s*/g, "")
    .replace(/\s*-\s*(?:Complete Guide|Full Review|Everything You Need).*$/i, "")
    .trim();
  variations.push(shortTitle);

  // 2. Category-based variation
  if (category && !title.toLowerCase().includes(category.toLowerCase())) {
    variations.push(`${category} guide`);
  }

  // 3. Type-based descriptive anchor
  switch (type) {
    case "directory-item":
      variations.push(`our ${shortTitle.split(":")[0].trim()} review`);
      variations.push(`the full ${shortTitle.split(":")[0].trim()} breakdown`);
      break;
    case "listicle":
      variations.push(`top picks for ${category || "this category"}`);
      variations.push(`our ${category || ""} recommendations`.trim());
      break;
    case "comparison":
      variations.push(`this side-by-side comparison`);
      variations.push(`see how they compare`);
      break;
    case "blog":
      variations.push(`this helpful guide`);
      variations.push(`learn more about ${category || "this topic"}`);
      break;
  }

  // Return unique variations (max 4)
  return [...new Set(variations)].slice(0, 4);
}

/**
 * Inject internal links into markdown content.
 * Avoids headings, respects max links, uses varied anchors.
 */
export function injectInternalLinks(content, currentSlug, linkMap) {
  if (!content || !linkMap) return content;

  let linksAdded = 0;
  let result = content;
  const usedSlugs = new Set();

  // Get candidate articles to link to (exclude self)
  const candidates = Object.entries(linkMap).filter(
    ([slug]) => slug !== currentSlug
  );

  // Shuffle candidates for variety
  const shuffled = candidates.sort(() => Math.random() - 0.5);

  for (const [slug, { url, anchors }] of shuffled) {
    if (linksAdded >= MAX_LINKS_PER_ARTICLE) break;
    if (usedSlugs.has(slug)) continue;

    // Pick a random anchor variation
    const anchor = anchors[Math.floor(Math.random() * anchors.length)];

    // Find a paragraph (not a heading) that could mention this topic
    // We insert the link as a natural reference at the end of a paragraph
    const paragraphs = result.split("\n");
    let inserted = false;

    for (let i = 0; i < paragraphs.length; i++) {
      const line = paragraphs[i];

      // Skip headings, empty lines, lists, code blocks, existing links
      if (
        line.startsWith("#") ||
        line.trim() === "" ||
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        line.startsWith("|") ||
        line.startsWith("```") ||
        line.includes(`](${url})`)
      ) {
        continue;
      }

      // Only insert in substantial paragraphs (more than 50 chars)
      if (line.length > 50 && !inserted) {
        // Append link reference naturally
        paragraphs[i] = `${line} Check out [${anchor}](${url}) for more details.`;
        inserted = true;
        break;
      }
    }

    if (inserted) {
      result = paragraphs.join("\n");
      linksAdded++;
      usedSlugs.add(slug);
    }
  }

  return result;
}
