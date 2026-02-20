import { getAllArticles } from "../lib/strapi";

const config = require("../../config");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${config.domain}`;

export default async function sitemap() {
  const articles = await getAllArticles({ limit: "1000" });

  const priorities = {
    listicle: 0.9,
    "directory-item": 0.8,
    comparison: 0.7,
    blog: 0.6,
  };

  const prefixes = {
    listicle: "/best",
    "directory-item": "",
    comparison: "/compare",
    blog: "/blog",
  };

  const articleUrls = (articles || []).map((article) => {
    const prefix = prefixes[article.contentType] || "";
    return {
      url: `${SITE_URL}${prefix}/${article.slug}`,
      lastModified: article.updatedAt || article.createdAt || new Date(),
      priority: priorities[article.contentType] || 0.5,
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      priority: 0.3,
    },
    ...articleUrls,
  ];
}
