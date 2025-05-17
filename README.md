# Starter Prompt‑Engine Repo

> Quickly spin up a form‑driven prompt builder (Next.js 14 + TypeScript + Supabase + Vercel AI SDK).

## What’s Inside?

| Path | Purpose |
|------|---------|
| `/pages/index.tsx` | Demo page that renders **`<PromptBuilder />`** |
| `/components/PromptBuilder.tsx` | Dynamic form → prompt preview → OpenAI stream |
| `/lib/renderTemplate.ts` | Handlebars wrapper for filling placeholders |
| `/lib/types.ts` | Shared TypeScript types |
| `/lib/supabaseClient.ts` | Lightweight Supabase client |
| `/pages/api/ai.ts` | API route that streams completions (Vercel AI SDK) |
| `/supabase/schema.sql` | Minimal schema for `style_profiles`, `prompt_templates`, `prompts_log` |

### Quick Start

```bash
pnpm i          # or npm install
pnpm dev        # next dev
```

Set the following env vars (e.g. in `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

Enjoy!  
–– Generated 2025-05-02
