require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk").default;
const fs = require("fs");
const path = require("path");
const config = require("../config");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const OUTPUT_DIR = path.join(__dirname, "..", "output");
const PROMPTS_DIR = path.join(__dirname, "..", "prompts");

// Rate limiting — pause between API calls
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DELAY_MS = 2000;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadPrompt(filename) {
  return fs.readFileSync(path.join(PROMPTS_DIR, filename), "utf-8");
}

function fillTemplate(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

async function generateArticle(systemPrompt, userPrompt) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const text = response.content[0].text;

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonStr);
}

async function generateDirectoryItems() {
  if (!config.contentTypes.directoryItem) return;
  const template = loadPrompt("directory-item.md");
  const year = new Date().getFullYear();

  for (const item of config.directoryItems) {
    console.log(`  Generating directory item: ${item}`);
    const vars = {
      niche: config.niche,
      itemName: item,
      year: String(year),
      category: config.niche,
    };

    const sections = template.split("## User");
    const systemPrompt = fillTemplate(sections[0].replace("## System\n", ""), vars);
    const userPrompt = fillTemplate("## User" + sections[1], vars);

    try {
      const article = await generateArticle(systemPrompt, userPrompt);
      const filename = `directory-item-${slugify(item)}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(article, null, 2)
      );
      console.log(`    ✓ Saved ${filename}`);
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
}

async function generateListicles() {
  if (!config.contentTypes.listicle) return;
  const template = loadPrompt("listicle.md");
  const year = new Date().getFullYear();

  for (const modifier of config.primaryModifiers) {
    console.log(`  Generating listicle: Best ${config.niche} in ${modifier}`);
    const vars = {
      niche: config.niche,
      modifier,
      year: String(year),
      number: "7",
      "niche-slug": slugify(config.niche),
      "modifier-slug": slugify(modifier),
    };

    const sections = template.split("## User");
    const systemPrompt = fillTemplate(sections[0].replace("## System\n", ""), vars);
    const userPrompt = fillTemplate("## User" + sections[1], vars);

    try {
      const article = await generateArticle(systemPrompt, userPrompt);
      const filename = `listicle-best-${slugify(config.niche)}-in-${slugify(modifier)}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(article, null, 2)
      );
      console.log(`    ✓ Saved ${filename}`);
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
}

async function generateComparisons() {
  if (!config.contentTypes.comparison) return;
  const template = loadPrompt("comparison.md");
  const year = new Date().getFullYear();
  const items = config.directoryItems;

  // Generate comparisons for consecutive pairs
  for (let i = 0; i < items.length - 1; i++) {
    const itemA = items[i];
    const itemB = items[i + 1];
    console.log(`  Generating comparison: ${itemA} vs ${itemB}`);
    const vars = {
      niche: config.niche,
      itemA,
      itemB,
      year: String(year),
      "itemA-slug": slugify(itemA),
      "itemB-slug": slugify(itemB),
    };

    const sections = template.split("## User");
    const systemPrompt = fillTemplate(sections[0].replace("## System\n", ""), vars);
    const userPrompt = fillTemplate("## User" + sections[1], vars);

    try {
      const article = await generateArticle(systemPrompt, userPrompt);
      const filename = `comparison-${slugify(itemA)}-vs-${slugify(itemB)}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(article, null, 2)
      );
      console.log(`    ✓ Saved ${filename}`);
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
}

async function generateBlogPosts() {
  if (!config.contentTypes.blog) return;
  const template = loadPrompt("blog.md");

  for (const topic of config.blogTopics) {
    console.log(`  Generating blog post: ${topic}`);
    const vars = {
      niche: config.niche,
      topic,
    };

    const sections = template.split("## User");
    const systemPrompt = fillTemplate(sections[0].replace("## System\n", ""), vars);
    const userPrompt = fillTemplate("## User" + sections[1], vars);

    try {
      const article = await generateArticle(systemPrompt, userPrompt);
      const filename = `blog-${slugify(topic)}.json`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(article, null, 2)
      );
      console.log(`    ✓ Saved ${filename}`);
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
}

async function main() {
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY not set in .env");
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n🚀 Generating content for: ${config.siteName}`);
  console.log(`   Niche: ${config.niche}`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);

  console.log("📝 Directory Items...");
  await generateDirectoryItems();

  console.log("\n📋 Listicles...");
  await generateListicles();

  console.log("\n⚖️  Comparisons...");
  await generateComparisons();

  console.log("\n📰 Blog Posts...");
  await generateBlogPosts();

  // Count generated files
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".json"));
  console.log(`\n✅ Done! Generated ${files.length} articles in output/`);
  console.log('   Next: run "npm run import" to push to Strapi');
}

main().catch(console.error);
