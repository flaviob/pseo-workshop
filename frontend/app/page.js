import { getAllArticles, getArticles } from "../lib/strapi";

const config = require("../../config");

export default async function HomePage() {
  const articles = await getAllArticles({ limit: "50" });
  const listicles = articles.filter((a) => a.contentType === "listicle");
  const directoryItems = articles.filter(
    (a) => a.contentType === "directory-item"
  );
  const comparisons = articles.filter((a) => a.contentType === "comparison");
  const blogPosts = articles.filter((a) => a.contentType === "blog");

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Find the Best {config.niche.charAt(0).toUpperCase() + config.niche.slice(1)}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {config.nicheDescription}. In-depth reviews, comparisons, and curated
          lists to help you choose the perfect option.
        </p>
      </section>

      {/* Listicles — Best Of */}
      {listicles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Of Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {listicles.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/best/${article.slug}`}
                badge="Best Of"
              />
            ))}
          </div>
        </section>
      )}

      {/* Directory Items */}
      {directoryItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
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
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Comparisons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {comparisons.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/compare/${article.slug}`}
                badge="vs"
              />
            ))}
          </div>
        </section>
      )}

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Guides & Tips</h2>
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
            Generate content with <code className="bg-gray-100 px-2 py-1 rounded">npm run generate</code> and
            import it with <code className="bg-gray-100 px-2 py-1 rounded">npm run import</code>.
          </p>
          <p className="text-sm">
            Then publish articles in your Strapi admin panel.
          </p>
        </section>
      )}

      {/* Browse by Category */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          Browse by {config.primaryModifiers.length > 0 ? "Location" : "Category"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {config.primaryModifiers.map((mod) => (
            <span
              key={mod}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
            >
              {mod}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article, href, badge }) {
  return (
    <a
      href={href}
      className="block border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded">
          {badge}
        </span>
        {article.category && (
          <span className="text-xs text-gray-400">{article.category}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
      {article.excerpt && (
        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
      )}
    </a>
  );
}
