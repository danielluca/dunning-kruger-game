# Dunning-Kruger Game

An interactive quiz game that compares what players know vs. how sure they feel.

The app uses themed question sets and confidence self-ratings to place each player on a simplified Dunning-Kruger curve.

## Features

- Three themed quiz modes:
  - Product development and tech
  - DATEV ecosystem
  - Marketing and growth
- Confidence tracking per question (1 to 5)
- Result breakdown with:
  - Accuracy percentage
  - Average confidence
  - Overconfidence score
  - Dunning-Kruger phase classification
- Single-page app routing ready for static hosting (fallback to `index.html` via Nginx)

## Tech Stack

- React 19
- TypeScript
- Vite 8
- ESLint 10
- Docker (multi-stage build) + Nginx

## Requirements

- Node.js 22+
- pnpm 10+

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm run dev
```

Create a production build:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

Run linting:

```bash
pnpm run lint
```

Run tests:

```bash
pnpm run test
```

## Deploy to GitHub Pages

This repository includes a workflow at `.github/workflows/deploy-pages.yml` that deploys the app to GitHub Pages on every push to `main`.

One-time GitHub setup:

1. Open the repository on GitHub.
2. Go to **Settings** -> **Pages**.
3. Set **Source** to **GitHub Actions**.

After that, push to `main` and GitHub will publish the site.

Expected URL:

- `https://danielluca.github.io/dunning-kruger-game/`

Notes:

- The Vite base path defaults to `/dunning-kruger-game/` so assets work on Pages.
- You can override it via `VITE_BASE_PATH` (for example, `/` when using a custom domain).

## Docker

Build the image:

```bash
docker build -t dunning-kruger-game .
```

Run the container:

```bash
docker run --rm -p 8080:80 dunning-kruger-game
```

Then open <http://localhost:8080>.

## Project Structure

```text
src/
  components/
    dunning-kruger-game.tsx   # Main game flow, questions, scoring, and results
  App.tsx                     # App shell
  main.tsx                    # App bootstrap
```

## Scoring Model (Current)

- Accuracy = correct answers / total answers
- Average confidence = mean selected confidence (1 to 5)
- Confidence percentage = `(avgConfidence / 5) * 100`
- Overconfidence score = `confidencePct - accuracy`
- Phase is mapped from confidence-vs-accuracy gap into four ranges

This is an educational game model, not a clinical or psychometric assessment.
