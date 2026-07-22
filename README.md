# ZHT — AI Workspace Suite

A dark, polished TanStack Start application that bundles three practical AI tools into one responsive workspace: a smart email generator, an AI task planner, and a general-purpose chatbot.

Built with **TanStack Start**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Live Demo

- **Preview**: https://id-preview--78907211-4245-47f2-ba10-d4a7cfef3be2.lovable.app
- **Published**: https://homebased-project.lovable.app

---

## Features

| Tool | Route | What it does |
|------|-------|--------------|
| **Smart Email Generator** | `/ai-tools/email` | Draft polished, on-tone emails from a few inputs (recipient, purpose, tone). |
| **AI Task Planner** | `/ai-tools/planner` | Turn a messy task list into a prioritized, time-blocked markdown plan. |
| **AI Chatbot** | `/ai-tools/chat` | A fast, persistent general-purpose assistant with quick-start suggestions. |

Shared design language:

- Dark navy/black theme with metallic silver accents
- Sticky responsive navigation with mobile menu
- SEO-ready metadata, JSON-LD, sitemap, and `robots.txt`
- Server-side AI routing through `/api/ai` using the Lovable AI Gateway

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Vite + SSR/SSG)
- **UI**: React 19, Tailwind CSS v4, Radix UI primitives, Lucide icons
- **Language**: TypeScript (strict mode)
- **Forms & Validation**: React Hook Form + Zod
- **AI Backend**: Lovable AI Gateway (`/api/ai` server route)
- **State**: TanStack Query for server-state hydration

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Install

```sh
git clone <your-github-repo-url>
cd <your-repo-name>
npm install
```

### Run locally

```sh
npm run dev
```

Open http://localhost:8080 in your browser.

### Build for production

```sh
npm run build
npm run preview
```

---

## Project Structure

```text
src/
├── components/          # Reusable UI components (nav, footer, tool forms)
├── lib/
│   └── site.ts          # Brand config, tool metadata, SEO defaults
├── routes/
│   ├── __root.tsx       # Root layout, SEO, JSON-LD
│   ├── index.tsx        # Home / landing page
│   ├── ai-tools.tsx     # AI tools tab layout
│   ├── ai-tools.index.tsx
│   ├── ai-tools.email.tsx
│   ├── ai-tools.planner.tsx
│   ├── ai-tools.chat.tsx
│   └── api/
│       └── ai.ts        # Server route: AI gateway proxy
├── styles.css           # Tailwind v4 theme tokens + custom utilities
└── router.tsx           # TanStack Router bootstrap
public/
├── robots.txt
└── (static assets)
```

---

## AI Backend

The `/api/ai` server route accepts a JSON payload with a `mode` (`email`, `planner`, or `chat`) and mode-specific fields. It validates input with Zod, attaches a tailored system prompt, and forwards the request to the Lovable AI Gateway.

Example request:

```sh
curl -X POST https://homebased-project.lovable.app/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "email",
    "recipient": "team@example.com",
    "purpose": "delay the launch by one week",
    "tone": "professional"
  }'
```

---

## Customization

- **Brand**: edit `src/lib/site.ts`
- **Colors & theme**: edit `src/styles.css` (Tailwind v4 `@theme` block and `@utility` classes)
- **AI prompts**: edit `src/routes/api/ai.ts`
- **Routes**: add new files under `src/routes/`; TanStack Router generates the route tree automatically

---

## Deployment

This project is designed to deploy on Lovable. Connect your GitHub repository in the Lovable editor (Plus menu → GitHub → Connect project) to enable two-way sync between Lovable and your repo.

---

## License

This code is yours. Use it, modify it, and ship it however you like.
