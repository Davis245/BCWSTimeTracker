# BCWSTimeTracker — Security Audit Status

> **Last audited:** 2026-02-19
>
> Update this file after each `npm audit` review or dependency upgrade.

## Current Status

| Metric | Value |
|---|---|
| Total vulnerabilities | 17 |
| Critical | 0 |
| High | **0** (all resolved) |
| Moderate | 17 (accepted — see below) |
| Low | 0 |

## Resolved via Overrides

These were fixed by adding `overrides` in `package.json` to force patched transitive versions:

| Package | Vulnerability | Severity | Override Version | CVE |
|---|---|---|---|---|
| `minimatch` | ReDoS via repeated wildcards | **High → Fixed** | `^10.2.1` | GHSA-3ppc-4f35-3m26 |
| `hono` | XSS in ErrorBoundary, cache deception, IP spoofing, arbitrary key read | **Moderate → Fixed** | `^4.12.0` | GHSA-9r54, GHSA-6wqw, GHSA-r354, GHSA-w332 |

## Accepted (Cannot Fix Without Breaking Changes)

### 1. `ajv` < 8.18.0 — ReDoS with `$data` option (Moderate)

- **Advisory:** [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6)
- **Root cause:** `eslint` v9 → `@eslint/eslintrc` → `ajv` v6
- **Why we can't fix:** Overriding to ajv v8 breaks eslint's internal schema validation (incompatible API). Upgrading eslint to v10+ would fix it, but `eslint-config-next` 16.x does not support eslint v10 yet.
- **Risk assessment:** **Low actual risk.** ajv is only used at lint-time (dev only), never runs in production. The ReDoS requires specially crafted `$data` schemas which are not user-controlled.
- **Action:** Will resolve automatically when `eslint-config-next` supports eslint v10+. Monitor Next.js releases.

### 2. `lodash` 4.x — Prototype Pollution in `_.unset` / `_.omit` (Moderate)

- **Advisory:** [GHSA-xxjr-mmjv-4gpg](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg)
- **Root cause:** `prisma` v7 → `@prisma/dev` → `@mrleebo/prisma-ast` → `chevrotain` → `lodash` 4.x
- **Why we can't fix:** lodash v5 does not exist. The vulnerability is in `_.unset()` and `_.omit()` which require attacker-controlled property paths—not applicable in the Prisma CLI context.
- **Risk assessment:** **Low actual risk.** lodash is only used inside Prisma's CLI tooling for schema parsing. It never processes user input from the web app. No production exposure.
- **Action:** Will resolve when Prisma updates chevrotain or removes lodash dependency. Monitor Prisma releases.

## How to Re-audit

```bash
# Full audit
npm audit

# Safe fixes only (non-breaking)
npm audit fix

# Show overrides
cat package.json | grep -A 10 '"overrides"'
```

## Policy

- **Critical / High:** Must be fixed or mitigated before deployment.
- **Moderate (dev-only transitive):** Accepted with documented rationale. Reviewed monthly.
- **Low:** Accepted. Reviewed quarterly.
