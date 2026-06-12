# ScriptViral

AI-powered viral video script generator. No signup required — open the app and generate instantly.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript** + **Tailwind CSS** + **Shadcn/ui**
- **Google Gemini API** (free tier — `gemini-2.0-flash`)

## Features

- No authentication — use immediately
- 10 content niches with genre pills, platform selector, tone/length dropdowns
- AI script generation with tabbed output (Script, Video prompts, Titles & caption)
- Saved scripts library in browser localStorage
- Usage counter stored locally
- Dark mode UI with indigo/purple theme

## Getting started

### 1. Install

```bash
npm install
```

### 2. Get a free Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key

### 3. Environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Add your `GEMINI_API_KEY`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Deploy to Vercel

Only one secret is required in production:

| Variable | Value |
|----------|--------|
| `GEMINI_API_KEY` | Your Gemini API key |

Live app: [scriptviral-peach.vercel.app](https://scriptviral-peach.vercel.app)

## License

MIT
