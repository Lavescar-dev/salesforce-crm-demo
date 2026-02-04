# Cirrus CRM — Implementation Guide

## Overview
- **Name**: Cirrus CRM
- **Type**: Static files (Nginx)
- **Stack**: SvelteKit, Svelte 5, TypeScript, Tailwind CSS v4, Chart.js, lucide-svelte
- **Subdomain**: cirrus.lavescar.com.tr
- **Idle RAM**: 0MB (static)
- **Disk**: ~10MB

## Architecture
Fully client-side SvelteKit application inspired by Salesforce CRM. Built as static files with no backend. The app implements role-based access control (RBAC) with 4 user roles that restrict module visibility and actions. A `StorageManager` utility class abstracts all localStorage operations for consistent data persistence. The application is organized into 4 major modules (Sales, Service, Marketing, Analytics), each with full CRUD entity management. The Analytics module includes a drag-and-drop dashboard builder for creating custom report layouts.

## Features
- **4 Modules**:
  - **Sales**: Accounts, Contacts, Leads, Opportunities (with pipeline view), full CRUD with create/edit/detail views
  - **Service**: Cases (with resolution tracking), Knowledge Base articles, full CRUD
  - **Marketing**: Campaigns (with member management), Email Templates, full CRUD
  - **Analytics**: Custom dashboard builder (drag-and-drop), pre-built reports (sales pipeline, lead source, case status, campaign ROI)
- **4 User Roles** with RBAC:
  - `admin` -- full access to all modules
  - `sales_rep` -- Sales module access
  - `service_agent` -- Service module access
  - `marketing_user` -- Marketing module access
- Drag-and-drop dashboard builder with widget configuration
- Opportunity pipeline view (Kanban-style)
- Campaign member management
- StorageManager with localStorage persistence
- Responsive design for desktop and tablet
- Login page with role selection

## Demo Credentials
| Username | Password | Role |
|---|---|---|
| admin | admin123 | Full access |
| sales_rep | sales123 | Sales only |
| service_agent | service123 | Service only |
| marketing_user | marketing123 | Marketing only |

## Demo Safety Measures
- DEMO watermark displayed on all authenticated pages
- `noindex` meta tag and `robots.txt` with `Disallow: /`
- Console warning indicating this is a demo environment
- All data stored in localStorage only
- No external API calls or backend services
- Fictional CRM data (seed data)
- Role-based restrictions prevent cross-module access

## Build & Deploy
```bash
# Install dependencies
cd demos/salesforce-crm-demo
bun install   # or npm install

# Build static files
bun run build
# Output: build/ directory

# Deploy
sudo cp -r build/* /var/www/cirrus/

# Nginx serves the build/ directory with SPA fallback:
# try_files $uri $uri/ /index.html;
```

## File Structure
```
salesforce-crm-demo/
├── package.json                # Dependencies
├── svelte.config.js            # SvelteKit config (static adapter)
├── vite.config.ts              # Vite config
├── tsconfig.json               # TypeScript config
├── postcss.config.js           # PostCSS / Tailwind
├── tailwind.config.ts          # Tailwind configuration
├── static/
│   └── robots.txt              # noindex directive
├── build/                      # Production output
└── src/
    ├── app.html                # HTML shell
    ├── app.css                 # Global styles
    ├── app.d.ts                # Type declarations
    ├── lib/
    │   ├── index.ts            # Lib barrel export
    │   ├── assets/             # Static assets
    │   ├── constants/          # App constants and configuration
    │   ├── stores/             # Svelte stores (auth, entities, StorageManager)
    │   ├── types/              # TypeScript type definitions
    │   ├── utils/              # Utility modules (StorageManager, helpers)
    │   └── components/
    │       ├── layout/         # App shell, navigation, sidebar
    │       ├── ui/             # Shared UI primitives
    │       ├── data/           # Data display components (tables, grids)
    │       ├── forms/          # Form components
    │       ├── charts/         # Chart.js wrapper components
    │       ├── sales/          # Sales module-specific components
    │       ├── service/        # Service module-specific components
    │       ├── marketing/      # Marketing module-specific components
    │       └── analytics/      # Analytics/dashboard builder components
    └── routes/
        ├── +layout.svelte      # Root layout
        ├── +page.svelte        # Root redirect
        ├── login/
        │   └── +page.svelte    # Login page with role selection
        ├── sales/
        │   ├── accounts/       # /sales/accounts, [id], [id]/edit, new
        │   ├── contacts/       # /sales/contacts, [id], [id]/edit, new
        │   ├── leads/          # /sales/leads, [id], [id]/edit, new
        │   └── opportunities/  # /sales/opportunities, [id], [id]/edit, new, pipeline
        ├── service/
        │   ├── cases/          # /service/cases, [id], [id]/edit, new
        │   └── knowledge/      # /service/knowledge, [id], [id]/edit, new
        ├── marketing/
        │   ├── campaigns/      # /marketing/campaigns, [id], [id]/edit, [id]/members, new
        │   └── email-templates/# /marketing/email-templates, [id], [id]/edit, new
        └── analytics/
            ├── dashboards/     # /analytics/dashboards, [id], [id]/edit, new
            └── reports/        # Pre-built reports: sales-pipeline, lead-source, case-status, campaign-roi
```

## Key Design Decisions
- **Role-based access control**: Demonstrates enterprise-grade permission modeling with 4 distinct roles, showcasing how different team members interact with a CRM.
- **StorageManager abstraction**: Centralizes all localStorage access with typed methods, making it easy to swap to a real API layer later.
- **Drag-and-drop dashboard builder**: Differentiates from simpler CRM demos by providing a configurable analytics experience.
- **Module-per-route structure**: Each CRM module (Sales, Service, Marketing, Analytics) maps to a top-level route, matching Salesforce's navigation paradigm.
- **Pipeline view for opportunities**: Kanban-style board provides an intuitive sales pipeline visualization beyond simple list views.
- **Separate login with role picker**: Allows demo visitors to experience different permission levels without managing multiple accounts.

## Verification Checklist
- [ ] `bun install` completes without errors
- [ ] `bun run build` produces a `build/` directory with `index.html`
- [ ] Login works with all 4 credential sets
- [ ] Admin sees all modules in navigation
- [ ] `sales_rep` can only access Sales module
- [ ] `service_agent` can only access Service module
- [ ] `marketing_user` can only access Marketing module
- [ ] Sales: Accounts, Contacts, Leads, Opportunities CRUD all work
- [ ] Opportunities pipeline (Kanban) view renders
- [ ] Service: Cases and Knowledge Base CRUD work
- [ ] Marketing: Campaigns and Email Templates CRUD work
- [ ] Campaign member management page loads
- [ ] Analytics: Dashboard list loads
- [ ] Dashboard builder drag-and-drop works
- [ ] Pre-built reports render with charts (pipeline, lead source, case status, campaign ROI)
- [ ] DEMO watermark is visible on all pages
- [ ] `robots.txt` contains `Disallow: /`
- [ ] Data persists after page reload (localStorage)
