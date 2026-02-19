# BCWSTimeTracker — Project Architecture

> **Last updated:** 2026-02-19
>
> Update this file whenever you add folders, move files, or change the project layout.

## Folder Structure

```
BCWSTimeTracker/
│
├── src/                        # All application source code
│   └── app/                    # Next.js App Router (routes, layouts, pages)
│       ├── layout.tsx          # Root layout — HTML shell, fonts, global providers
│       ├── page.tsx            # Home page (/)
│       ├── globals.css         # Global Tailwind CSS styles
│       └── favicon.ico         # Browser tab icon
│
├── prisma/                     # Database layer
│   └── schema.prisma           # Prisma data models & relations
│
├── public/                     # Static assets served at /
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── prisma.config.ts            # Prisma v7 runtime config (DB URL, migration path)
├── .env                        # Environment variables (DATABASE_URL, secrets)
├── .gitignore                  # Git ignore rules
├── tsconfig.json               # TypeScript compiler config
├── next.config.ts              # Next.js framework config
├── eslint.config.mjs           # ESLint rules
├── postcss.config.mjs          # PostCSS / Tailwind pipeline
├── package.json                # Dependencies & npm scripts
├── package-lock.json           # Lockfile for reproducible installs
├── ARCHITECTURE.md             # ← This file
├── DEPENDENCIES.md             # Dependency inventory & rationale
└── README.md                   # Project overview & quick-start
```

## Planned Folders (add as you build)

| Folder | Purpose |
|---|---|
| `src/app/(dashboard)/` | Grouped route for authenticated dashboard pages |
| `src/app/api/` | API route handlers (REST endpoints) |
| `src/components/` | Reusable React components (buttons, cards, modals) |
| `src/components/ui/` | Base UI primitives (design system) |
| `src/lib/` | Shared utilities, helpers, constants |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/validations/` | Zod schemas for form & API validation |
| `src/types/` | Shared TypeScript type definitions |
| `prisma/migrations/` | Auto-generated migration files |
| `prisma/seed.ts` | Database seed script |
| `scripts/` | One-off maintenance / backfill scripts |

## Key Conventions

- **App Router only** — no `pages/` directory; all routes live under `src/app/`.
- **`src/` prefix** — all app code is in `src/` to keep the root clean.
- **`@/*` path alias** — import from `src/` via `@/components/...`, `@/lib/...`, etc.
- **Server-first** — default to React Server Components; add `"use client"` only when needed.
