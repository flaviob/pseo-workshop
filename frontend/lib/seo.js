const config = require("../../config");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateMetadata(article) {
  if (!article) return {};

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt || "";
  const slug = article.slug;

  let urlPath = `/${slug}`;
  if (article.contentType === "listicle") urlPath = `/best/${slug}`;
  if (article.contentType === "comparison") urlPath = `/compare/${slug}`;
  if (article.contentType === "blog") urlPath = `/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${urlPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${urlPath}`,
      siteName: config.siteName,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || "")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function articleSchema(article) {
  if (!article) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    publisher: {
      "@type": "Organization",
      name: config.siteName,
      url: SITE_URL,
    },
  };
}

export function faqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function itemListSchema(title, items) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.title,
      url: `${SITE_URL}/${item.slug}`,
    })),
  };
}
