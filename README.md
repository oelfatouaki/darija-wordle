# Darija Wordle

A clean, daily word-guessing game in Latin-script Moroccan Arabic (Darija). Five characters, six tries, one word a day.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Vitest for logic tests
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the official one-screen edition.

Routes:

- `/` — official poster edition (the deployed site).
- `/editorial` — the original scrolling editorial edition, available only in local development (404 on the deployed site).
- `/one-page` — redirects to `/`.

The official edition opens with a short animated overture (count-up, letter reveal, skip control). It plays once per year via a `darija_intro` cookie. The `darija.` wordmark scatters under the pointer, and a contextual cursor follows the mouse with a lagging halo.

Useful scripts:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # unit tests
npm run build       # production build
npm run words:fetch # regenerate the word list from darija.io
```

## Word data

`src/data/words.json` is a committed snapshot of 69 five-character Darija words built from darija.io's publicly rendered schema.org JSON-LD (word pages plus category pages). It includes the Latin word, English meaning, Arabic script, pronunciation, category, and a link back to the source entry.

The app has **no runtime dependency** on darija.io — the page reads the local JSON file.

darija.io content is licensed [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). Attribution is shown in the site footer. Keep the project non-commercial, or contact darija.io before publishing a commercial or derivative version.

## Game rules

- The answer is chosen deterministically from the date (Morocco time), so everyone gets the same word on the same day. A fixed-seed shuffle means the full 69-word cycle completes before any word repeats.
- Guesses accept `a–z` plus the digits `3` (ع) and `7` (ح). Any five valid characters can be submitted; the list of answers is smaller than the list of allowed guesses.
- Scoring uses classic Wordle duplicate handling: exact matches are claimed first, then remaining letters are matched.
- Progress, stats, and streaks are stored in `localStorage`.

## Deployment on Vercel

- Repository: https://github.com/oelfatouaki/darija-wordle
- Live site: https://darija-wordle.vercel.app
- Vercel project: `darija-wordle` (Next.js preset, no environment variables needed).
- The homepage is dynamic (`force-dynamic`) so the daily word flips correctly at midnight rather than being frozen at build time.
- `/editorial` is local-only: it returns 404 on Vercel, but remains available with `npm run dev`.
- Manual deploys use `npx vercel deploy --prod`. Automatic Git deploys require authorizing the Vercel GitHub App for the repository.

## Project layout

```
src/
  app/            # layout, page, global styles
  components/     # Game, Grid, Tile, Keyboard, modals, icons
  lib/            # scoring, daily selection, storage, types
  data/words.json # generated word snapshot
scripts/
  fetch-words.mjs # data pipeline
```
