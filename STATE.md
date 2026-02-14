# STATE — Cirrus (Salesforce CRM Demo)
Date: 2026-02-04 (UTC snapshot)

Status: `DEGRADED`

Public URL: `https://cirrus.lavescar.com.tr`  
Origin URL (resolve): `curl -I --resolve cirrus.lavescar.com.tr:443:91.99.192.155 https://cirrus.lavescar.com.tr`

Current Deploy:
- Symlink: `/var/www/lavescar/demos/cirrus/current -> /var/www/lavescar/demos/cirrus/releases/20260204_071957`
- Runtime model: static via nginx
- Active Port: `443` (nginx)

Evidence (commands + observed result):
- DNS probe (VPS):
  - `getent ahostsv4 cirrus.lavescar.com.tr` -> unresolved
- Public probe:
  - `curl -I https://cirrus.lavescar.com.tr` -> host resolve fail
- Origin probe:
  - `curl -I --resolve cirrus.lavescar.com.tr:443:91.99.192.155 https://cirrus.lavescar.com.tr`
  - Result: `HTTP/2 200`, `content-type: text/html`, `cache-control: no-store...`, `x-robots-tag: noindex...`
- Asset cache probe (origin):
  - `curl -I --resolve cirrus.lavescar.com.tr:443:91.99.192.155 https://cirrus.lavescar.com.tr/_app/immutable/entry/start.B2y8YNhw.js`
  - Result: `cache-control: public, immutable`
- `/api` behavior probe (origin):
  - `curl -I --resolve cirrus.lavescar.com.tr:443:91.99.192.155 https://cirrus.lavescar.com.tr/api/health` -> `200 text/html` (SPA fallback)
- Nginx vhost proof:
  - `nginx -T | grep -nE 'server_name (cirrus)\\.lavescar\\.com\\.tr'`

Known Issues:
1. Public DNS/Cloudflare record tutarsız: domain çözümlenemiyor.  
   Evidence: `getent ahostsv4 cirrus.lavescar.com.tr`
2. `/api/*` static fallback’e düşüyor; API health sinyalini maskeliyor.  
   Evidence: `curl -I --resolve ... /api/health`
3. Browser-level runtime smoke (console/network) henüz kanıtlanmadı.  
   Evidence gap: DevTools snapshot yok.

Next Actions:
- `IMPLEMENTATION.md` §2.1 (DNS fix)
- `IMPLEMENTATION.md` §2.2 (`/api` guard)
- `IMPLEMENTATION.md` §3 (UX reliability polish)
