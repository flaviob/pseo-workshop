# pSEO Workshop

Build a full programmatic SEO site with **Claude Code + Strapi + Next.js**, deployed on Railway.

Generate hundreds of SEO-optimized pages in minutes. Works for any directory-style niche.

## Quick Start (5 steps)

```bash
# 1. Clone and install
git clone https://github.com/flaviob/pseo-workshop.git
cd pseo-workshop
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Set up env files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
# Then edit .env and add your ANTHROPIC_API_KEY

# 3. Start Strapi locally (uses SQLite — no database setup needed)
cd backend && npm run develop
# → Opens admin at http://localhost:1337/admin
# → Create your admin account, then create the "article" content type (see Step 2 below)
# → Create an API token: Settings → API Tokens → Full access
# → Paste the token into .env and frontend/.env.local as STRAPI_TOKEN

# 4. Generate content and import
npm run generate        # Creates articles in output/
npm run import          # Pushes them to Strapi as drafts

# 5. Start the frontend
npm run dev             # Opens site at http://localhost:3000
```

> **Tip:** See `config.example.js` for a second niche (coffee shops) showing how to customize the site for any topic.

---

## Before the Workshop

1. **Install Node.js 18+** — [nodejs.org](https://nodejs.org)
2. **Install Claude Code** — `npm i -g @anthropic-ai/claude-code`
3. **Create accounts:**
   - [Railway](https://railway.app) (for deployment)
   - [GitHub](https://github.com) (for the repo)
   - [Anthropic](https://console.anthropic.com) (for the API key)
4. **Clone this repo:**
   ```bash
   git clone https://github.com/flaviob/pseo-workshop.git
   cd pseo-workshop
   ```
5. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```
6. **Copy env files:**
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   ```

---

## Workshop Steps

### Step 1: Choose Your Niche (5 min)

Edit `config.js` with your niche:

```js
module.exports = {
  siteName: "BestCoffeeShops",
  domain: "bestcoffeeshops.com",
  niche: "coffee shops",
  primaryModifiers: ["New York", "London", "Paris", ...],
  secondaryModifiers: ["for remote work", "with wifi", ...],
  // ...
}
```

Ideas: coworking spaces, coffee shops, gyms, SaaS tools, restaurants, hiking trails, digital nomad cities...

> **See `config.example.js`** for a fully commented coffee shops example.

### Step 2: Set Up Strapi (15 min)

**Option A — Local (recommended for the workshop):**
Run Strapi locally with SQLite (no database setup needed):
```bash
cd backend && npm run develop
```
This opens the admin at `http://localhost:1337/admin`. Create your admin account on first run.

**Option B — Railway (for production):**
1. Go to [Railway](https://railway.app) and create a new project
2. Deploy Strapi using the template or Docker image

**Then create the content type:**

3. Create the `article` content type in Strapi admin with these fields:
   - `title` (text)
   - `slug` (uid, based on title)
   - `content` (rich text, markdown)
   - `metaTitle` (text)
   - `metaDescription` (text)
   - `contentType` (enumeration: directory-item, listicle, comparison, blog)
   - `category` (text)
   - `excerpt` (text)
4. Create an API token: Settings → API Tokens → Create (Full access)
5. Add to your `.env`:
   ```
   STRAPI_URL=https://your-strapi.up.railway.app
   STRAPI_TOKEN=your-token-here
   ```
6. Run permissions setup:
   ```bash
   npm run setup-permissions
   ```

### Step 3: Generate Content with Claude (30 min)

Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Generate all content:
```bash
npm run generate
```

This creates JSON files in the `output/` folder — one per article. Check them out!

Or use Claude Code to generate specific content:
```
> Generate 5 listicle articles for my top cities
```

### Step 4: Push to CMS (10 min)

Import everything to Strapi:
```bash
npm run import
```

Open your Strapi admin — you'll see all articles in **draft** status.

### Step 5: Review & Edit (20 min)

Browse your articles in Strapi. Want to fix something? Tell Claude Code:

```
> Rewrite the intro of "Best Coworking Spaces in Berlin" to be more engaging
> Add a FAQ section to the WeWork review
> Update the comparison between Regus and Spaces
```

Publish articles when you're happy:
```bash
npm run manage -- publish 1
```

### Step 6: Deploy Frontend on Railway (15 min)

1. Push your repo to GitHub
2. In Railway, add a new service → Deploy from GitHub repo
3. Set root directory to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi.up.railway.app
   STRAPI_TOKEN=your-token-here
   NEXT_PUBLIC_SITE_URL=https://your-frontend.up.railway.app
   ```
5. Deploy! Add your custom domain in Railway settings
6. Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`

### Step 7: Keep Growing (ongoing)

Add new content anytime:
```
> Add 3 new cities to my site: Miami, Dubai, Singapore
> Write a blog post about remote work productivity
> Create a comparison between WeWork and Industrious
```

---

## Project Structure

```
pseo-workshop/
├── config.js              # Your niche configuration (edit this!)
├── config.example.js      # Example config (coffee shops) for reference
├── CLAUDE.md              # Instructions for Claude Code
├── .env.example           # Environment variables template
├── prompts/               # Content generation templates
├── scripts/               # Generation, import, and management scripts
├── frontend/              # Next.js site
│   ├── app/               # Pages (App Router)
│   ├── lib/               # Strapi client, SEO helpers, internal linking
│   ├── components/        # Reusable components
│   └── .env.example       # Frontend env template
├── backend/               # Strapi v5 CMS (SQLite locally, Postgres on Railway)
├── output/                # Generated content (JSON files)
└── .env                   # Your API keys (not committed)
```

## Tech Stack

- **Next.js 14** (App Router) — Frontend
- **TailwindCSS** — Styling
- **Strapi v5** — Headless CMS
- **Claude API** — Content generation
- **Railway** — Deployment
- **Claude Code** — Your AI coding assistant

## License

MIT
