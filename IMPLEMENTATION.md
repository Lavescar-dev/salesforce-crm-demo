# IMPLEMENTATION — Cirrus (Execution-Ready)
Date: 2026-02-04

## 1) Problem List (Evidence)

1. Public DNS resolve fail.
- Evidence: `getent ahostsv4 cirrus.lavescar.com.tr` => unresolved.
- Evidence: `curl -I https://cirrus.lavescar.com.tr` => host resolve fail.
- Hypothesis: Cloudflare A/CNAME record eksik veya yanlış.

2. `/api/*` static fallback ile maskeleniyor.
- Evidence: `curl -I --resolve cirrus.../api/health` => `200 text/html`.
- Hypothesis: API guard yok, `try_files` fallback devrede.

3. Browser smoke matrisi eksik.
- Evidence: CLI smoke tamam, DevTools evidence yok.

## 2) Fix Plan (Smallest Safe Steps)

### 2.1 DNS/Cloudflare fix
- Files/Systems:
  - Cloudflare DNS zone (`cirrus` record)
- Change type: infra
- Change:
  - `cirrus.lavescar.com.tr` -> `91.99.192.155` (proxied policy kararıyla)
- Risk: medium (yanlış record downtime yaratır)
- Rollback:
  - Eski DNS kaydına dön; TTL bitimini bekle.

### 2.2 Nginx `/api` guard
- Files:
  - `/etc/nginx/sites-available/cirrus.lavescar.com.tr`
- Change type: config
- Change:
  - `location ^~ /api/ { return 404; }`
- Risk: low
- Rollback:
  - Vhost revert + `nginx -t && systemctl reload nginx`.

### 2.3 Runtime smoke checklist
- Files:
  - `demos/salesforce-crm-demo/src/routes/login/+page.svelte`
  - `demos/salesforce-crm-demo/src/routes/analytics/dashboards/+page.svelte`
- Change type: test/procedural (gerekirse küçük code)
- Change:
  - Login flow, role gating, analytics dashboard render için DevTools kanıtı topla.
- Risk: low
- Rollback: N/A.

## 3) UI/UX Value Plan (0-bloat)

1. Login helper copy:
- File: `demos/salesforce-crm-demo/src/routes/login/+page.svelte`
- Add: “Demo credentials” açıklamasını daha net ve kısa yap.

2. Empty dashboard state:
- File: `demos/salesforce-crm-demo/src/routes/analytics/dashboards/+page.svelte`
- Add: widget yokken onboarding card.

3. Error banner:
- File: `demos/salesforce-crm-demo/src/routes/sales/opportunities/+page.svelte`
- Add: localStorage parse/fetch fail durumunda non-blocking banner.

## 4) DoD

1. Public DNS resolves and HTTPS root `200`.
2. SPA refresh `200`.
3. `/api/*` explicit behavior (fallback HTML değil).
4. Console uncaught error yok.
5. Cloudflare Dev Mode OFF iken davranış stabil.
