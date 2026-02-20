# Deploy on Railway — Full Guide

Deploy your pSEO site (Strapi + PostgreSQL + Next.js) on Railway from scratch.

**Time:** ~30 minutes | **Cost:** Railway free trial includes $5 of usage

---

## Part 1: Create Your Railway Project

1. Go to [railway.app](https://railway.app) and sign up (GitHub login is easiest)
2. Click **New Project** from the dashboard
3. You'll see your empty project — this is where all 3 services will live

---

## Part 2: Add PostgreSQL

1. Inside your project, click **+ New** → **Database** → **PostgreSQL**
2. Railway creates the database instantly — no configuration needed
3. Click the PostgreSQL service → **Variables** tab
4. You'll see auto-generated credentials (`DATABASE_URL`, `PGHOST`, etc.) — Strapi will use these automatically

---

## Part 3: Deploy Strapi

### Option A: Use the Strapi template (recommended)

1. In the same project, click **+ New** → **Template**
2. Search for **"Strapi"** and select the official Strapi template
3. Railway will ask you to configure it — connect it to the PostgreSQL database you just created
4. Click **Deploy**

### Option B: Deploy from Docker

1. Click **+ New** → **Docker Image**
2. Enter: `strapi/strapi`
3. Add these environment variables in the **Variables** tab (click the PostgreSQL service to find the values):

```
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
APP_KEYS=generate-random-string-1,generate-random-string-2
API_TOKEN_SALT=generate-a-random-string
ADMIN_JWT_SECRET=generate-a-random-string
JWT_SECRET=generate-a-random-string
```

> **Tip:** Use Railway's variable references (`${{Postgres.VARIABLE}}`) so credentials stay in sync automatically.

### Wait for Strapi to deploy

- Watch the **Deploy Logs** tab — first deploy takes 2-3 minutes
- Once you see `Strapi started`, click the service URL (or go to **Settings** → **Networking** → **Generate Domain**)
- Open the URL — you should see the Strapi welcome page
- Go to `/admin` to create your admin account

---

## Part 4: Create the Article Content Type

In the Strapi admin panel:

1. Go to **Content-Type Builder** (left sidebar)
2. Click **+ Create new collection type**
3. Name it: `article`
4. Add these fields one by one:

| Field | Type | Config |
|-------|------|--------|
| `title` | Text | Short text |
| `slug` | UID | Attached field: `title` |
| `content` | Rich Text (Markdown) | — |
| `metaTitle` | Text | Short text |
| `metaDescription` | Text | Long text |
| `contentType` | Enumeration | Values: `directory-item`, `listicle`, `comparison`, `blog` |
| `category` | Text | Short text |
| `excerpt` | Text | Long text |

5. Click **Save** — Strapi will restart (takes ~30 seconds)

---

## Part 5: Create an API Token

1. Go to **Settings** → **API Tokens** → **Create new API Token**
2. Name: `workshop` (or whatever you want)
3. Token type: **Full access**
4. Click **Save**
5. **Copy the token immediately** — you won't see it again

Add it to your local `.env` file:

```env
STRAPI_URL=https://your-strapi-service.up.railway.app
STRAPI_TOKEN=paste-your-token-here
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-service.up.railway.app
```

---

## Part 6: Configure Public API Permissions

The frontend needs to read articles without authentication. You have two options:

### Option A: Run the setup script (from your local machine)

Make sure your `.env` has `STRAPI_URL` and `STRAPI_TOKEN` set, then:

```bash
npm run setup-permissions
```

You should see:
```
✅ Public API permissions updated!
   The frontend can now read articles without authentication.
```

### Option B: Manual setup in Strapi admin

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll down to **Article**
3. Check **find** and **findOne**
4. Click **Save**

### Verify it works

Open this URL in your browser (replace with your Strapi URL):
```
https://your-strapi-service.up.railway.app/api/articles
```

You should see `{"data":[],"meta":{...}}` — an empty array is fine, you just need it to not return a 403 error.

---

## Part 7: Deploy the Next.js Frontend

1. **Push your repo to GitHub** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. In your Railway project, click **+ New** → **GitHub Repo**
3. Select your repository
4. Once added, click the new service → **Settings**:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

5. Go to the **Variables** tab and add:

```
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-service.up.railway.app
STRAPI_TOKEN=your-api-token-here
NEXT_PUBLIC_SITE_URL=https://your-frontend-service.up.railway.app
```

> Replace the URLs with your actual Railway service URLs. You can find the Strapi URL by clicking the Strapi service → Settings → Networking.

6. Go to **Settings** → **Networking** → **Generate Domain** to get a public URL for the frontend
7. **Update `NEXT_PUBLIC_SITE_URL`** with the generated domain (e.g. `https://your-app.up.railway.app`)
8. Railway will auto-redeploy when variables change

---

## Part 8: Custom Domain (Optional)

To use your own domain instead of `*.up.railway.app`:

1. Click your frontend service → **Settings** → **Networking** → **Custom Domain**
2. Enter your domain (e.g. `bestcoffeeshops.com`)
3. Railway will show you DNS records to add
4. Go to your domain registrar (Namecheap, Cloudflare, etc.) and add:
   - **CNAME record:** `@` → the value Railway provides
   - Or **A record** if Railway gives you an IP
5. Wait for DNS propagation (usually 5-30 minutes)
6. Update `NEXT_PUBLIC_SITE_URL` in Railway to `https://yourdomain.com`

---

## Troubleshooting

**Strapi won't start?**
- Check Deploy Logs for errors
- Make sure PostgreSQL is running (click the PostgreSQL service, check its status)
- Verify the database environment variables are set correctly

**Frontend shows empty / no articles?**
- Check that public permissions are configured (Part 6)
- Verify `NEXT_PUBLIC_STRAPI_URL` points to the correct Strapi URL
- Make sure you have published articles (drafts won't show up)

**"502 Bad Gateway" on frontend?**
- Check Deploy Logs — the build might have failed
- Verify the root directory is set to `frontend`
- Make sure all environment variables are set

**Build fails with "module not found"?**
- Make sure the root directory is `frontend` (not the repo root)
- Check that `frontend/package.json` exists and has all dependencies

**Can't access Strapi admin?**
- The admin URL is `https://your-strapi.up.railway.app/admin`
- First visit will prompt you to create an admin account

---

## Quick Reference

| Service | URL Pattern | Purpose |
|---------|------------|---------|
| PostgreSQL | (internal only) | Database |
| Strapi | `https://xxx.up.railway.app` | CMS API + Admin |
| Frontend | `https://xxx.up.railway.app` | Your live site |

### Environment Variables Cheat Sheet

**Frontend service:**
| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | `https://strapi-xxx.up.railway.app` | Yes |
| `STRAPI_TOKEN` | `abc123...` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://frontend-xxx.up.railway.app` | Yes |

**Local `.env` (for scripts):**
| Variable | Purpose |
|----------|---------|
| `STRAPI_URL` | Same as NEXT_PUBLIC_STRAPI_URL |
| `STRAPI_TOKEN` | Your API token |
| `ANTHROPIC_API_KEY` | For content generation |
| `NEXT_PUBLIC_STRAPI_URL` | For local frontend dev |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
