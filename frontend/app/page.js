import { getAllArticles } from "../lib/strapi";

const config = require("../config");

export const revalidate = 60;

export default async function HomePage() {
  const articles = await getAllArticles({ limit: "50" });
  const listicles = articles.filter((a) => a.contentType === "listicle");
  const directoryItems = articles.filter(
    (a) => a.contentType === "directory-item"
  );
  const comparisons = articles.filter((a) => a.contentType === "comparison");
  const blogPosts = articles.filter((a) => a.contentType === "blog");
  const totalArticles = articles.length;
  const totalCities = new Set(
    listicles.map((a) => a.category).filter(Boolean)
  ).size;

  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="text-sm font-medium text-red-500 uppercase tracking-wide">
            {config.siteName}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6 leading-tight">
            Find the Best{" "}
            {config.niche.charAt(0).toUpperCase() + config.niche.slice(1)}{" "}
            <span className="text-red-500">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {config.nicheDescription}. In-depth reviews, head-to-head
            comparisons, and curated city guides to help you find the perfect
            workspace.
          </p>
          {totalArticles > 0 && (
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-2xl font-bold text-gray-900 block">
                  {totalCities}+
                </span>
                <span className="text-gray-500">Cities covered</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 block">
                  {directoryItems.length}
                </span>
                <span className="text-gray-500">Spaces reviewed</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 block">
                  {totalArticles}
                </span>
                <span className="text-gray-500">Articles published</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Listicles — Best Of */}
      {listicles.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">City Guides</h2>
              <p className="text-gray-500 text-sm mt-1">
                The best {config.niche} by location
              </p>
            </div>
            {listicles.length > 6 && (
              <span className="text-sm text-red-500 font-medium">
                {listicles.length} guides
              </span>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {listicles.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/best/${article.slug}`}
                badge={article.category || "Best Of"}
                variant="featured"
              />
            ))}
          </div>
        </section>
      )}

      {/* Directory Items */}
      {directoryItems.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Reviews</h2>
              <p className="text-gray-500 text-sm mt-1">
                In-depth looks at individual spaces
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {directoryItems.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/${article.slug}`}
                badge="Review"
              />
            ))}
          </div>
        </section>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Comparisons</h2>
              <p className="text-gray-500 text-sm mt-1">
                Side-by-side breakdowns to help you decide
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {comparisons.slice(0, 4).map((article) => (
              <ComparisonCard
                key={article.id}
                article={article}
                href={`/compare/${article.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Guides & Tips</h2>
              <p className="text-gray-500 text-sm mt-1">
                Expert advice for remote workers and teams
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {blogPosts.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/blog/${article.slug}`}
                badge="Guide"
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && (
        <section className="text-center py-16 text-gray-500">
          <h2 className="text-2xl font-bold mb-4">No articles yet</h2>
          <p className="mb-4">
            Generate content with{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              npm run generate
            </code>{" "}
            and import it with{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              npm run import
            </code>
            .
          </p>
        </section>
      )}

      {/* Browse by Location */}
      {config.primaryModifiers.length > 0 && (
        <section className="mb-16 py-12 -mx-4 px-4 bg-gray-50 rounded-2xl">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Browse by City
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            Explore the best {config.niche} around the world
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {config.primaryModifiers.map((mod) => {
              const matchingArticle = listicles.find(
                (a) => a.category === mod
              );
              const href = matchingArticle
                ? `/best/${matchingArticle.slug}`
                : null;
              return href ? (
                <a
                  key={mod}
                  href={href}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors shadow-sm"
                >
                  {mod}
                </a>
              ) : (
                <span
                  key={mod}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-400"
                >
                  {mod}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function ArticleCard({ article, href, badge, variant }) {
  const isFeatured = variant === "featured";
  return (
    <a
      href={href}
      className={`block border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all ${
        isFeatured ? "bg-gradient-to-br from-white to-gray-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isFeatured
              ? "bg-red-500 text-white"
              : "bg-red-50 text-red-600"
          }`}
        >
          {badge}
        </span>
        {article.category && !isFeatured && (
          <span className="text-xs text-gray-400">{article.category}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      )}
      <span className="inline-block mt-3 text-xs font-medium text-red-500">
        Read more &rarr;
      </span>
    </a>
  );
}

function ComparisonCard({ article, href }) {
  // Try to extract the two items from the title (e.g. "WeWork vs Regus: ...")
  const titleMatch = article.title.match(/^(.+?)\s+vs\.?\s+(.+?)(?::|$)/i);
  const itemA = titleMatch ? titleMatch[1].trim() : null;
  const itemB = titleMatch ? titleMatch[2].trim() : null;

  return (
    <a
      href={href}
      className="block border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all"
    >
      {itemA && itemB ? (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
            {itemA}
          </span>
          <span className="text-xs font-bold text-red-500">VS</span>
          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
            {itemB}
          </span>
        </div>
      ) : (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 mb-3 inline-block">
          vs
        </span>
      )}
      <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      )}
      <span className="inline-block mt-3 text-xs font-medium text-red-500">
        Compare &rarr;
      </span>
    </a>
  );
}
