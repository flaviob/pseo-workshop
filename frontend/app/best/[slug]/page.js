import { getArticleBySlug, getAllArticles } from "../../../lib/strapi";
import { generateMetadata as genMeta, articleSchema } from "../../../lib/seo";
import ArticleContent from "../../../components/ArticleContent";
import RelatedPosts from "../../../components/RelatedPosts";

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };
  return genMeta(article);
}

export default async function ListiclePage({ params }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <a href="/" className="text-red-500 hover:underline">
          Go back home
        </a>
      </div>
    );
  }

  const allArticles = await getAllArticles();
  const schema = articleSchema(article);

  return (
    <article>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-600 rounded">
            Best Of
          </span>
          {article.category && (
            <span className="text-xs text-gray-400">{article.category}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        {article.excerpt && (
          <p className="text-lg text-gray-600">{article.excerpt}</p>
        )}
      </header>

      <ArticleContent
        content={article.content}
        currentSlug={article.slug}
        allArticles={allArticles}
      />

      <RelatedPosts
        currentSlug={article.slug}
        contentType="listicle"
        category={article.category}
      />
    </article>
  );
}
