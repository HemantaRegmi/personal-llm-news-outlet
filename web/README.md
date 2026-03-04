# Signal Weekly (MVP)

Professional-grade, minimal news outlet for:

- software development
- computer science
- AI/ML

The app pulls from evidence-oriented sources, filters alarmist language, generates concise LLM summaries, and sends a weekly Friday digest email.

## Source strategy

The source catalog is seeded from your deep-research PDF recommendations, including:

- GitHub Blog
- AWS What's New
- Kubernetes releases/blog
- ACM Queue
- Python release notes
- arXiv (CS)
- Journal of the ACM
- Theory of Computing
- USENIX publications
- JMLR
- ACL Anthology
- MLCommons
- Stanford HAI AI Index
- NIST AI RMF

When a feed is unavailable, the app falls back to accredited source links and still keeps that source visible.

## Stack and constraints

- Next.js App Router + TypeScript + Tailwind CSS
- no extra npm packages added for MVP
- LLM/API usage done with native `fetch`

## Features

- Home dashboard for quick scanning:
  - overall weekly summary
  - per-category summaries
  - per-article key points and source links
- Digest API:
  - `GET /api/digest`
  - optional `?categories=software-development,computer-science,ai-ml`
- Weekly email endpoint:
  - `GET|POST /api/cron/weekly-newsletter`
  - secret-protected via `CRON_SECRET`
- Friday automation:
  - `vercel.json` cron is configured for every Friday at 14:00 UTC.

## Environment setup

Copy `.env.example` values into your `.env.local` and fill them:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
RESEND_API_KEY=
NEWSLETTER_FROM_EMAIL=Signal Weekly <newsletter@yourdomain.com>
NEWSLETTER_TO_EMAIL=you@example.com
NEWSLETTER_CATEGORIES=software-development,computer-science,ai-ml
CRON_SECRET=replace-with-a-long-random-secret
```

Notes:

- If `OPENAI_API_KEY` is missing, deterministic fallback summarization is used.
- If Resend env vars are missing, cron execution still builds the digest but skips sending email.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Manual weekly run

Call the cron route manually:

```bash
curl "http://localhost:3000/api/cron/weekly-newsletter?secret=<CRON_SECRET>"
```
