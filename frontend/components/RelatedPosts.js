import { getArticles, getArticlesByCategory } from "../lib/strapi";

export default async function RelatedPosts({
  currentSlug,
  contentType,
  category,
}) {
  let related = [];

  if (category) {
    related = await getArticlesByCategory(category);
  }

  if (related.length < 4 && contentType) {
    const byType = await getArticles(contentType, { limit: "10" });
    const existing = new Set(related.map((r) => r.id));
    for (const article of byType) {
      if (!existing.has(article.id)) {
        related.push(article);
      }
    }
  }

  related = related.filter((a) => a.slug !== currentSlug).slice(0, 4);

  if (related.length === 0) return null;

  const prefixes = {
    listicle: "/best",
    "directory-item": "",
    comparison: "/compare",
    blog: "/blog",
  };

  return (
    <section className="mt-14 pt-10 border-t border-brand-200">
      <h2 className="font-display text-xl font-bold mb-6 text-ink-950">Related Articles</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {related.map((article) => {
          const prefix = prefixes[article.contentType] || "";
          return (
            <a
              key={article.id}
              href={`${prefix}/${article.slug}`}
              className="block bg-white border border-brand-200 rounded-xl p-5 hover:shadow-lg hover:border-accent-300 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full">
                  {article.contentType === "directory-item"
                    ? "Review"
                    : article.contentType === "listicle"
                      ? "Best Of"
                      : article.contentType === "comparison"
                        ? "vs"
                        : "Guide"}
                </span>
                {article.category && (
                  <span className="text-xs text-ink-300">
                    {article.category}
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-ink-900 mb-1 leading-snug">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-ink-400 line-clamp-2 leading-relaxed">
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
