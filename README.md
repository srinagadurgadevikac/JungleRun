# Jungle Run

A responsive endless runner game for desktop and mobile. Run through a deep forest, move between three lanes, dodge fallen trees, collect coins, and stay ahead of the lion.

## Stack

- Next.js 16 App Router
- TypeScript and responsive CSS
- Supabase for player profiles, sessions, stats, and leaderboard
- Vercel for hosting
- GitHub for source control

## Local setup

1. Install dependencies with `pnpm install`.
2. In Supabase SQL Editor, run the complete script in `lib/supabase-schema.sql`.
3. Add these variables in Vercel Project Settings > Vars or a local `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

4. Start the app with `pnpm dev`.

## Supabase security

The included schema enables RLS and only exposes the public gameplay data needed by this prototype. For a production launch, add Supabase Auth and replace the open player policies with authenticated ownership policies.

## Controls

- Desktop: Arrow Left and Arrow Right
- Mobile: Swipe left or right
- Avoid trees, collect coins, and keep running

## Deploy

Push the project to GitHub, import the repository into Vercel, add the two public Supabase variables, and deploy. Never expose a Supabase service-role key in the browser.

## Add the opening video

The intro currently uses a lightweight in-app scene so the game works immediately. To use a cinematic opening, add a hosted MP4 or Supabase Storage URL to `IntroOverlay.tsx` and replace the scene panel with a native `<video controls={false} autoPlay muted playsInline />` element.

## Project structure

- `app/page.tsx`: game orchestration and screen states
- `components/GameCanvas.tsx`: runner loop, lanes, obstacles, coins, collisions
- `components/*Screen.tsx`: intro, menu, pause, game over, leaderboard, stats
- `lib/supabase-client.ts`: browser-safe Supabase data functions
- `lib/supabase-schema.sql`: database schema, indexes, RLS, and leaderboard view
- `public/images/jungle-runner-forest.png`: generated forest artwork

## Important note

This is a playable prototype. The SQL uses public gameplay policies so anonymous players can create and update scores. Before publishing a competitive leaderboard, add authentication and server-side score validation to prevent clients from submitting fake scores.
