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
