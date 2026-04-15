# Salesforce CRM Qwik Demo

Qwik tabanlı satış CRM demo uygulaması. Bu demo, lead, opportunity, account, contact, quote, order ve invoice akışlarını tek bir dense workspace içinde gösterir.

## Run

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Build

```bash
npm run build
```

## Demo Readiness

Before a walkthrough or preview deploy, run:

```bash
npm run fmt.check
npm run build.types
npm run lint
npm run build
```

To smoke test a local or Cloudflare preview URL:

```bash
npm run smoke:routes -- https://<preview-url>
```

## Cloudflare Pages

This project is configured for Cloudflare Pages Functions through the Qwik City
Cloudflare Pages adapter.

Recommended Pages settings:

- Framework preset: `None`
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Node version: `20.19.0` through `.node-version` or `NODE_VERSION`
- Compatibility date: pinned in `wrangler.toml`
- Compatibility flags: `nodejs_compat`
- Root directory: leave blank when the repo contains only this app, otherwise set
  it to the app folder

Build output should include:

- `dist/_worker.js`
- `dist/_routes.json`
- `dist/assets/*`

For a direct Wrangler deploy after authenticating Cloudflare:

```bash
npm run deploy -- --project-name <cloudflare-pages-project>
```

Use a branch flag for preview deploys:

```bash
npm run deploy -- --project-name <cloudflare-pages-project> --branch preview
```

## Main Routes

- `/` - Product landing page
- `/dashboard` - Sales dashboard
- `/leads` - Lead list
- `/leads/:id` - Lead detail
- `/leads/:id/edit` - Lead edit
- `/opportunities` - Opportunity pipeline
- `/accounts` - Account list
- `/contacts` - Contact directory
- `/quotes` - Quote list
- `/orders` - Order tracking
- `/invoices` - Invoice tracking

## Notes

- Mock data lives in `src/data/mock-data.ts`.
- Shared shell/navigation lives in `src/routes/layout.tsx`.
- The dashboard now includes a revenue trend chart plus forecast tables for a more CRM-like 1:1 feel.
