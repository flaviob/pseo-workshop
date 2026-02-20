require("dotenv").config();

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

async function listArticles(filter) {
  const params = new URLSearchParams({
    "pagination[pageSize]": "100",
    "sort[0]": "createdAt:desc",
  });

  if (filter) {
    params.append("filters[contentType][$eq]", filter);
  }

  const res = await fetch(`${STRAPI_URL}/api/articles?${params}`, { headers });
  const json = await res.json();

  if (!json.data || json.data.length === 0) {
    console.log("No articles found.");
    return;
  }

  console.log(`\n  ${"ID".padEnd(6)} ${"Status".padEnd(12)} ${"Type".padEnd(16)} Title`);
  console.log("  " + "-".repeat(80));

  for (const item of json.data) {
    const id = String(item.id).padEnd(6);
    const status = (item.publishedAt ? "published" : "draft").padEnd(12);
    const type = (item.contentType || "—").padEnd(16);
    console.log(`  ${id} ${status} ${type} ${item.title}`);
  }

  console.log(`\n  Total: ${json.data.length} articles`);
}

async function getArticle(id) {
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, { headers });
  if (!res.ok) throw new Error(`Article ${id} not found`);
  const json = await res.json();
  const a = json.data;

  console.log(`\n  Title: ${a.title}`);
  console.log(`  Slug: ${a.slug}`);
  console.log(`  Type: ${a.contentType}`);
  console.log(`  Status: ${a.publishedAt ? "published" : "draft"}`);
  console.log(`  Meta Title: ${a.metaTitle}`);
  console.log(`  Meta Description: ${a.metaDescription}`);
  console.log(`\n  Content preview:`);
  console.log(`  ${(a.content || "").substring(0, 300)}...`);
}

async function publishArticle(id) {
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
  if (!res.ok) throw new Error(`Failed to publish: HTTP ${res.status}`);
  console.log(`✓ Article ${id} published`);
}

async function unpublishArticle(id) {
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { publishedAt: null } }),
  });
  if (!res.ok) throw new Error(`Failed to unpublish: HTTP ${res.status}`);
  console.log(`✓ Article ${id} unpublished`);
}

async function updateArticle(id, field, value) {
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { [field]: value } }),
  });
  if (!res.ok) throw new Error(`Failed to update: HTTP ${res.status}`);
  console.log(`✓ Article ${id} updated: ${field}`);
}

async function deleteArticle(id) {
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error(`Failed to delete: HTTP ${res.status}`);
  console.log(`✓ Article ${id} deleted`);
}

async function publishAll() {
  const res = await fetch(
    `${STRAPI_URL}/api/articles?filters[publishedAt][$null]=true&pagination[pageSize]=100`,
    { headers }
  );
  const json = await res.json();
  const drafts = json.data || [];

  if (drafts.length === 0) {
    console.log("No draft articles to publish.");
    return;
  }

  console.log(`Publishing ${drafts.length} draft articles...`);
  for (const article of drafts) {
    await publishArticle(article.id);
  }
  console.log(`✓ All ${drafts.length} articles published`);
}

async function main() {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("Error: STRAPI_URL and STRAPI_TOKEN must be set in .env");
    process.exit(1);
  }

  const [, , command, ...args] = process.argv;

  switch (command) {
    case "list":
      await listArticles(args[0]); // optional filter by content type
      break;
    case "get":
      if (!args[0]) { console.error("Usage: manage get <id>"); break; }
      await getArticle(args[0]);
      break;
    case "publish":
      if (!args[0]) { console.error("Usage: manage publish <id>"); break; }
      await publishArticle(args[0]);
      break;
    case "unpublish":
      if (!args[0]) { console.error("Usage: manage unpublish <id>"); break; }
      await unpublishArticle(args[0]);
      break;
    case "update":
      if (args.length < 3) { console.error("Usage: manage update <id> <field> <value>"); break; }
      await updateArticle(args[0], args[1], args.slice(2).join(" "));
      break;
    case "delete":
      if (!args[0]) { console.error("Usage: manage delete <id>"); break; }
      await deleteArticle(args[0]);
      break;
    case "publish-all":
      await publishAll();
      break;
    default:
      console.log(`
  Strapi Content Manager

  Usage: npm run manage -- <command> [args]

  Commands:
    list [type]              List all articles (optional: filter by content type)
    get <id>                 Show article details
    publish <id>             Publish a draft article
    unpublish <id>           Unpublish an article
    update <id> <field> <v>  Update a field (e.g. title, content, metaTitle)
    delete <id>              Delete an article
    publish-all              Publish all draft articles

  Content types: directory-item, listicle, comparison, blog

  Examples:
    npm run manage -- list
    npm run manage -- list listicle
    npm run manage -- get 5
    npm run manage -- publish 5
    npm run manage -- update 5 title "New Title Here"
    npm run manage -- publish-all
      `);
  }
}

main().catch(console.error);
