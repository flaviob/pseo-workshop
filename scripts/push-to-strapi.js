require("dotenv").config();
const fs = require("fs");
const path = require("path");

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const OUTPUT_DIR = path.join(__dirname, "..", "output");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function checkConnection() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    console.log("✓ Connected to Strapi");
    return true;
  } catch (err) {
    console.error(`✗ Cannot connect to Strapi: ${err.message}`);
    console.error(`  URL: ${STRAPI_URL}`);
    console.error("  Check your STRAPI_URL and STRAPI_TOKEN in .env");
    return false;
  }
}

async function pushArticle(article) {
  const payload = {
    data: {
      title: article.title,
      slug: article.slug,
      content: article.content,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      contentType: article.contentType,
      category: article.category || "",
      excerpt: article.excerpt || "",
    },
  };

  const res = await fetch(`${STRAPI_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  return await res.json();
}

async function main() {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("Error: STRAPI_URL and STRAPI_TOKEN must be set in .env");
    process.exit(1);
  }

  // Check connection first
  const connected = await checkConnection();
  if (!connected) process.exit(1);

  // Read all JSON files from output/
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error("Error: output/ directory not found. Run 'npm run generate' first.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error("No JSON files found in output/. Run 'npm run generate' first.");
    process.exit(1);
  }

  console.log(`\n📤 Importing ${files.length} articles to Strapi...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(OUTPUT_DIR, file);

    try {
      const article = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      process.stdout.write(`  [${i + 1}/${files.length}] ${article.title}... `);

      await pushArticle(article);
      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    if (i < files.length - 1) await sleep(300);
  }

  console.log(`\n✅ Import complete: ${success} succeeded, ${failed} failed`);
  console.log("   All articles imported as drafts. Review them in Strapi admin.");
}

main().catch(console.error);
