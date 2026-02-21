import { getArticleBySlug, getAllArticles } from "../../../lib/strapi";
import { generateMetadata as genMeta, articleSchema } from "../../../lib/seo";
import ArticleContent from "../../../components/ArticleContent";
import RelatedPosts from "../../../components/RelatedPosts";

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };
  return genMeta(article);
}

export default async function BlogPage({ params }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="text-center py-16">
        <h1 className="font-display text-2xl font-bold mb-4 text-ink-900">Article not found</h1>
        <a href="/" className="text-accent-600 hover:underline">
          Go back home
        </a>
      </div>
    );
  }

  const allArticles = await getAllArticles();
  const schema = articleSchema(article);

  const updatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    : null;

  return (
    <article className="max-w-3xl mx-auto">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <a href="/" className="text-sm text-ink-400 hover:text-accent-600 transition-colors">Home</a>
          <span className="text-ink-300">/</span>
          <span className="text-sm font-medium text-accent-700">Guide</span>
          {updatedDate && (
            <span className="ml-auto text-xs font-medium text-accent-700 bg-accent-100 px-3 py-1 rounded-full">
              Updated {updatedDate}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-ink-950 leading-tight">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-ink-500 leading-relaxed border-l-4 border-accent-300 pl-4">
            {article.excerpt}
          </p>
        )}
      </header>

      <ArticleContent
        content={article.content}
        currentSlug={article.slug}
        allArticles={allArticles}
        title={article.title}
      />

      <RelatedPosts
        currentSlug={article.slug}
        contentType="blog"
        category={article.category}
      />
    </article>
  );
}
