/**
 * Internal linking engine — pillar/cluster strategy with anchor text variation.
 *
 * Rules:
 * - Max 3-5 internal links per article
 * - Never place links inside headings
 * - Always vary anchor text (never use the same phrase for every link)
 * - Track links per slug to avoid spam patterns
 * - Spread links across the article, not clustered together
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

// Varied link sentence templates — {anchor} and {url} are placeholders
const LINK_TEMPLATES = [
  (anchor, url) => `For a deeper dive, see [${anchor}](${url}).`,
  (anchor, url) => `You might also find [${anchor}](${url}) useful.`,
  (anchor, url) => `We cover this in more detail in [${anchor}](${url}).`,
  (anchor, url) => `Related reading: [${anchor}](${url}).`,
  (anchor, url) => `If you're exploring options, [${anchor}](${url}) is worth a look.`,
  (anchor, url) => `See also [${anchor}](${url}).`,
];

/**
 * Simple seeded random based on string hash — avoids Math.random()
 * so server and client produce identical output.
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Inject internal links into markdown content.
 * Avoids headings, respects max links, uses varied anchors.
 * Spreads links evenly across the article.
 */
export function injectInternalLinks(content, currentSlug, linkMap) {
  if (!content || !linkMap) return content;

  const usedSlugs = new Set();

  // Get candidate articles to link to (exclude self)
  const candidates = Object.entries(linkMap).filter(
    ([slug]) => slug !== currentSlug
  );

  // Deterministic shuffle based on current slug (no Math.random)
  const seed = hashCode(currentSlug);
  const shuffled = candidates
    .map((c, i) => [c, hashCode(currentSlug + c[0] + i)])
    .sort((a, b) => a[1] - b[1])
    .map((c) => c[0]);

  // Find eligible paragraphs (not headings, lists, tables, code, short lines)
  const paragraphs = content.split("\n");
  const eligibleIndices = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const line = paragraphs[i];
    if (
      line.startsWith("#") ||
      line.trim() === "" ||
      line.startsWith("- ") ||
      line.startsWith("* ") ||
      line.startsWith("|") ||
      line.startsWith("```") ||
      line.startsWith(">") ||
      line.length <= 80
    ) {
      continue;
    }
    eligibleIndices.push(i);
  }

  if (eligibleIndices.length === 0) return content;

  // Spread links evenly across eligible paragraphs
  const linksToAdd = Math.min(MAX_LINKS_PER_ARTICLE, shuffled.length, eligibleIndices.length);
  const spacing = Math.max(1, Math.floor(eligibleIndices.length / (linksToAdd + 1)));

  let linksAdded = 0;

  for (let linkIdx = 0; linkIdx < linksToAdd; linkIdx++) {
    const [slug, { url, anchors }] = shuffled[linkIdx];
    if (usedSlugs.has(slug)) continue;

    // Pick paragraph position — spread evenly
    const paraIdx = eligibleIndices[Math.min(
      spacing * (linkIdx + 1),
      eligibleIndices.length - 1
    )];

    // Skip if this paragraph already has an injected link
    if (paragraphs[paraIdx].includes("](")) continue;

    // Pick anchor and template deterministically
    const anchorIdx = hashCode(currentSlug + slug) % anchors.length;
    const templateIdx = (seed + linkIdx) % LINK_TEMPLATES.length;
    const anchor = anchors[anchorIdx];
    const linkSentence = LINK_TEMPLATES[templateIdx](anchor, url);

    paragraphs[paraIdx] = `${paragraphs[paraIdx]} ${linkSentence}`;
    usedSlugs.add(slug);
    linksAdded++;
  }

  return paragraphs.join("\n");
}
