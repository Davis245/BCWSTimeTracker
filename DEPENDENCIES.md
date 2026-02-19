# BCWSTimeTracker — Dependency Inventory

> **Last updated:** 2026-02-19
>
> Update this file whenever you add, remove, or upgrade a package.

## Runtime Dependencies

| Package | Version | Purpose | Where it's used |
|---|---|---|---|
| `next` | 16.1.6 | React framework — App Router, SSR, API routes, static generation | Entire app |
| `react` | 19.2.3 | UI component library | All components |
| `react-dom` | 19.2.3 | React DOM renderer | Entry point / layout |
| `@prisma/client` | 7.4.0 | Type-safe database client generated from schema | Server components, API routes, server actions |
| `prisma` | 7.4.0 | CLI + engine for schema modeling, migrations, introspection | `prisma/schema.prisma`, migration commands |
| `zod` | 4.3.6 | Runtime schema validation & TypeScript type inference | Form validation, API input validation, server actions |
| `date-fns` | 4.1.0 | Lightweight date/time utilities (no Moment.js bloat) | Pay-period math, accrual calculations, date formatting |
| `lucide-react` | 0.575.0 | MIT-licensed icon library (tree-shakeable) | Dashboard UI, buttons, navigation, status indicators |

## Dev Dependencies

| Package | Version | Purpose | Where it's used |
|---|---|---|---|
| `typescript` | 5.9.3 | TypeScript compiler | All `.ts` / `.tsx` files |
| `@types/node` | 20.19.33 | Node.js type definitions | Server-side code, scripts |
| `@types/react` | 19.2.14 | React type definitions | All components |
| `@types/react-dom` | 19.2.3 | ReactDOM type definitions | Entry point |
| `tailwindcss` | 4.2.0 | Utility-first CSS framework | `globals.css`, all components |
| `@tailwindcss/postcss` | 4.2.0 | Tailwind PostCSS plugin | `postcss.config.mjs` |
| `eslint` | 9.39.2 | Linter for code quality | `npm run lint` |
| `eslint-config-next` | 16.1.6 | Next.js-specific ESLint rules | `eslint.config.mjs` |
| `ts-node` | 10.9.2 | Run TypeScript files directly in Node | Seed scripts, one-off maintenance scripts |
| `dotenv` | 17.3.1 | Load `.env` variables in non-Next contexts | Prisma config, seed scripts, CLI tools |

## npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start dev server with hot reload |
| `build` | `next build` | Production build (Turbopack) |
| `start` | `next start` | Serve production build |
| `lint` | `eslint` | Run ESLint across the project |

## Adding a New Dependency

When you install a new package, add a row to the appropriate table above:

```bash
# Runtime
npm install <package>

# Dev-only
npm install -D <package>
```

Then update the table with: **package name**, **installed version** (`npm ls <package>`), **purpose**, and **where it's used**.

## npm Overrides (Security Patches)

These force patched versions of transitive dependencies to resolve known vulnerabilities.
Defined in the `"overrides"` field of `package.json`.

| Package | Override Version | Why |
|---|---|---|
| `minimatch` | `^10.2.1` | Fixes ReDoS via repeated wildcards (GHSA-3ppc-4f35-3m26, was **High**) |
| `hono` | `^4.12.0` | Fixes XSS, cache deception, IP spoofing in Prisma's internal tooling (was **Moderate**) |

> **Note:** 17 moderate-severity vulnerabilities remain in `ajv` (eslint internals) and `lodash` (Prisma CLI internals). These are dev-only, have no production exposure, and cannot be fixed without breaking changes. See `SECURITY.md` for full details.
