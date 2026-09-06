# 07-routing-nextjs — NoteHub

NoteHub homework project built with Next.js App Router, TypeScript, TanStack Query, Axios, and CSS Modules.

## Implemented routes

- `/` — home page.
- `/notes` — redirects to `/notes/filter/all`.
- `/notes/filter/all` — all notes without a `tag` API parameter.
- `/notes/filter/{tag}` — notes filtered by `Todo`, `Work`, `Personal`, `Meeting`, or `Shopping`.
- `/notes/[id]` — full note details page on direct navigation.
- `/notes/[id]` — opens as a modal on client-side navigation from the notes list via an intercepting route.
- Unknown routes — custom `404 - Page not found` page.

## Routing structure

- `app/notes/filter/@sidebar` — parallel route with the tag menu.
- `app/notes/filter/[...slug]` — catch-all route for tag filtering.
- `app/@modal/(.)notes/[id]` — parallel + intercepting route for note preview in a modal.

## Setup

1. Install dependencies: `npm install`.
2. Create `.env.local` in the project root.
3. Add `NEXT_PUBLIC_NOTEHUB_TOKEN=your_token`.
4. Run locally: `npm run dev`.
5. Check production build: `npm run build`.
6. Format the code: `npm run format`.

For Vercel, add `NEXT_PUBLIC_NOTEHUB_TOKEN` in Project Settings → Environment Variables before deploying.
