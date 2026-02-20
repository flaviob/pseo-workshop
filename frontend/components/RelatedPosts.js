import { getArticles, getArticlesByCategory } from "../lib/strapi";

export default async function RelatedPosts({
  currentSlug,
  contentType,
  category,
}) {
  // Fetch related articles: same category first, then same content type
  let related = [];

  if (category) {
    related = await getArticlesByCategory(category);
  }

  // If not enough from category, fetch by content type
  if (related.length < 4 && contentType) {
    const byType = await getArticles(contentType, { limit: "10" });
    const existing = new Set(related.map((r) => r.id));
    for (const article of byType) {
      if (!existing.has(article.id)) {
        related.push(article);
      }
    }
  }

  // Remove current article and limit to 4
  related = related.filter((a) => a.slug !== currentSlug).slice(0, 4);

  if (related.length === 0) return null;

  const prefixes = {
    listicle: "/best",
    "directory-item": "",
    comparison: "/compare",
    blog: "/blog",
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {related.map((article) => {
          const prefix = prefixes[article.contentType] || "";
          return (
            <a
              key={article.id}
              href={`${prefix}/${article.slug}`}
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {article.contentType === "directory-item"
                    ? "Review"
                    : article.contentType === "listicle"
                      ? "Best Of"
                      : article.contentType === "comparison"
                        ? "vs"
                        : "Guide"}
                </span>
                {article.category && (
                  <span className="text-xs text-gray-400">
                    {article.category}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
