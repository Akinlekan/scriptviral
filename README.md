# ScriptViral

AI-powered viral video script generator. Create hooks, narration scripts, cinematic AI video prompts, titles, and social captions for YouTube, TikTok, and Reels.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript** + **Tailwind CSS** + **Shadcn/ui**
- **Supabase** (auth + database)
- **Google Gemini API** (free tier — `gemini-2.0-flash`)

## Features

- Email/password + Google OAuth authentication
- Story settings UI with genre pills, platform selector, tone/length dropdowns
- AI script generation with tabbed output (Script, Video prompts, Titles & caption)
- Saved scripts library (save, rename, delete, view)
- Usage tracking (analytics only — no limits, free forever)
- Dark mode UI with indigo/purple theme

## Getting started

### 1. Clone and install

```bash
cd scriptviral
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Enable Google OAuth under Authentication → Providers (optional)
4. Add redirect URL: `http://localhost:3000/auth/callback`

### 3. Get a free Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key (free tier available)

### 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── api/generate/     # AI script generation
│   ├── api/scripts/      # Saved scripts CRUD
│   ├── dashboard/        # Protected app routes
│   ├── login/ signup/    # Auth pages
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Generator, sidebar, output
│   ├── landing/          # Marketing sections
│   └── auth/             # Login/signup forms
└── lib/
    ├── gemini.ts         # Google Gemini integration
    ├── parse-script.ts   # Response parser
    └── supabase/         # Supabase clients
```

## License

MIT
