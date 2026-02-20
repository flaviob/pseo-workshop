# Setup Instructions

## Prerequisites

Make sure you have these installed before the workshop:

- **Node.js 18+** — [Download here](https://nodejs.org)
- **Claude Code** — `npm i -g @anthropic-ai/claude-code`
- **A code editor** — VS Code, Cursor, or whatever you prefer

You'll also need accounts on:
- [Anthropic](https://console.anthropic.com) — for your API key
- [Railway](https://railway.app) — for deploying Strapi and the frontend
- [GitHub](https://github.com) — to push your repo

## 1. Clone the repo

```bash
git clone https://github.com/flaviob/pseo-workshop.git
cd pseo-workshop
```

## 2. Install dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

## 3. Set up your environment

```bash
cp .env.example .env
```

Open `.env` in your editor and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

We'll add the Strapi keys together during the workshop.

## 4. Verify it works

```bash
npm run dev
```

Open http://localhost:3000 — you should see the site with an empty state. That's correct! We'll fill it with content during the workshop.

## 5. Pick your niche

Open `config.js` and start thinking about what niche you want to build. Some ideas:

- Best coffee shops in [city]
- Best SaaS tools for [use case]
- Best gyms in [city]
- Best restaurants for [cuisine] in [city]
- Best hiking trails in [region]
- Best digital nomad cities for [type]

You'll configure this at the start of the workshop.

## Troubleshooting

**`node -v` shows less than 18?**
Update Node.js from [nodejs.org](https://nodejs.org) or use `nvm install 18`.

**`npm run dev` fails?**
Make sure you ran `npm install` in both the root AND `frontend/` directories.

**Port 3000 already in use?**
Next.js will automatically try 3001, 3002, etc. Check the terminal output for the actual URL.
