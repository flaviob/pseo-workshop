const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function fetchAPI(path, params = {}) {
  const url = new URL(`/api${path}`, STRAPI_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: STRAPI_TOKEN
        ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
        : {},
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Strapi API error: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`Strapi fetch failed: ${err.message}`);
    return null;
  }
}

export async function getArticles(contentType, options = {}) {
  const params = {
    "pagination[pageSize]": options.limit || "25",
    "sort[0]": options.sort || "createdAt:desc",
    "filters[contentType][$eq]": contentType,
  };

  if (options.category) {
    params["filters[category][$eq]"] = options.category;
  }

  const data = await fetchAPI("/articles", params);
  return data?.data || [];
}

export async function getArticleBySlug(slug) {
  const data = await fetchAPI("/articles", {
    "filters[slug][$eq]": slug,
  });
  return data?.data?.[0] || null;
}

export async function getAllArticles(options = {}) {
  const params = {
    "pagination[pageSize]": options.limit || "100",
    "sort[0]": options.sort || "createdAt:desc",
  };

  const data = await fetchAPI("/articles", params);
  return data?.data || [];
}

export async function getArticlesByCategory(category) {
  const data = await fetchAPI("/articles", {
    "filters[category][$eq]": category,
    "pagination[pageSize]": "25",
  });
  return data?.data || [];
}
