# Salesforce CRM Demo

A full-featured Salesforce CRM demo application built with **SvelteKit 2.x**, **Svelte 5**, **TypeScript**, and **Tailwind CSS**. All data is stored locally in the browser using LocalStorage.

## Features

### Implemented Modules

✅ **Authentication System**
- Mock login with 4 user roles (admin, sales_rep, service_agent, marketing_user)
- Session persistence
- Route guards

✅ **Core UI Components**
- Button, Input, Select, Textarea, Card, Badge, Modal, Toast
- DataTable with sorting and pagination
- Search and filter components
- Salesforce-like design system

✅ **Sales Cloud**
- Leads management (list, create, view, edit, delete)
- Opportunities (list, create, view, edit, delete, pipeline kanban with drag-and-drop)
- Accounts management (list, create, view, edit, delete)
- Contacts management (list, create, view, edit, delete)
- Activity logging and timeline for Leads, Opportunities, Accounts, and Contacts
- Data persistence with LocalStorage

✅ **Service Cloud**
- Case management (list, create, view, edit, delete)
- Case timeline with comments
- Knowledge base (list, create, view, edit, delete)
- Knowledge article content with Rich Text Editor
- Suggested knowledge articles for cases

✅ **Marketing Module**
- Campaign management (list, create, view, edit, delete)
- Campaign ROI calculations
- Campaign member management (add, remove, view)
- Email template library (list, create, view, edit, delete)
- Email template preview with Rich Text Editor

✅ **Analytics & Reporting**
- Chart components (Bar, Pie, Line, Funnel, Metric cards)
- Pre-built reports: Sales Pipeline, Lead Source, Case Status, Campaign ROI
- Dashboard management (list, create, view, edit, delete)
- Dashboard builder with drag-and-drop widget configuration

✅ **Polish & Optimization**
- Loading states (implicit in SvelteKit)
- Form validation with error messages
- Confirmation dialogs for delete actions
- Empty states for lists
- Global search across all entities

## Tech Stack

- **Frontend Framework**: SvelteKit 2.x + Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide Svelte
- **Charts**: Chart.js (integrated)
- **Date Handling**: date-fns
- **Drag & Drop**: @thisux/sveltednd (for pipeline view and dashboard builder)
- **Build Tool**: Vite
- **Adapter**: @sveltejs/adapter-static

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

4. **Login with demo account:**
   - **Admin**: admin@demo.com / admin123
   - **Sales Rep**: sales@demo.com / sales123
   - **Service Agent**: service@demo.com / service123
   - **Marketing User**: marketing@demo.com / marketing123

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
salesforce-crm-demo/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/          # AppShell, Sidebar, TopNav
│   │   │   ├── ui/              # Button, Input, Modal, Card, Badge, Toast, Select, Textarea
│   │   │   ├── data/            # DataTable, Pagination, SearchBar, DateRangeFilter
│   │   │   ├── forms/           # AddressInput, RichTextEditor
│   │   │   ├── charts/          # BarChart, PieChart, LineChart, FunnelChart, MetricCard
│   │   │   ├── sales/           # ActivityForm, ActivityLog, PipelineView
│   │   │   ├── service/         # CaseForm, CaseTimeline
│   │   │   ├── marketing/       # CampaignForm, CampaignMemberList, EmailTemplateForm
│   │   │   └── analytics/       # DashboardBuilder, DashboardWidget
│   │   ├── stores/              # auth, leads, opportunities, accounts, contacts, activities,
│   │   │                        # cases, caseTimelineEvents, knowledgeArticles, campaigns,
│   │   │                        # campaignMembers, emailTemplates, dashboards (Svelte 5 runes)
│   │   ├── utils/               # storage, crud, validation, formatting, helpers, seedData
│   │   ├── types/               # TypeScript interfaces (common, sales, service, marketing, analytics, auth)
│   │   └── constants/           # navigation, storage-keys, mock-users
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout with AppShell and seed data initialization
│   │   ├── +page.svelte         # Home dashboard
│   │   ├── login/               # Login page
│   │   ├── sales/               # leads, opportunities, accounts, contacts, activities
│   │   │   ├── leads/           # Leads list, new, detail, edit pages
│   │   │   ├── opportunities/   # Opportunities list, new, detail, edit, pipeline pages
│   │   │   ├── accounts/        # Accounts list, new, detail, edit pages
│   │   │   └── contacts/        # Contacts list, new, detail, edit pages
│   │   ├── service/             # cases, knowledge
│   │   │   ├── cases/           # Cases list, new, detail, edit pages
│   │   │   └── knowledge/       # Knowledge articles list, new, detail, edit pages
│   │   ├── marketing/           # campaigns, email-templates
│   │   │   ├── campaigns/       # Campaigns list, new, detail, edit, members pages
│   │   │   └── email-templates/ # Email templates list, new, detail, edit pages
│   │   └── analytics/           # dashboards, reports
│   │       ├── dashboards/      # Dashboards list, new, detail, edit pages
│   │       └── reports/         # Pre-built reports (sales-pipeline, lead-source, case-status, campaign-roi)
│   └── app.css                  # Tailwind imports + custom styles
├── static/
├── package.json
├── svelte.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Data Management

### LocalStorage Keys

All data is stored in LocalStorage with prefixed keys:
- `crm_auth_user` - Current user session
- `crm_leads` - Leads data
- `crm_opportunities` - Opportunities data
- `crm_accounts` - Accounts data
- `crm_contacts` - Contacts data
- `crm_activities` - Activities data
- `crm_initialized` - Initialization flag
- `crm_data_version` - Data schema version

### Seed Data

On first load, the app automatically generates demo data:
- 25 Leads
- 15 Accounts
- 20 Opportunities
- 30 Contacts
- 40 Activities

To reset data, clear LocalStorage from browser dev tools.

## Development Guide

### Svelte 5 Runes Best Practices

This project uses Svelte 5 runes mode:

- Use `$state()` for reactive variables
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Use `$props()` for component props
- Avoid `<svelte:component>` - use `{@const Icon = icon} <Icon />` pattern
- Use `$derived()` for dynamic class composition

### Creating a New Entity Store

Follow the pattern in `src/lib/stores/leads.svelte.ts`:

```typescript
import { browser } from '$app/environment';
import type { YourEntity } from '$lib/types';
import { STORAGE_KEYS } from '$lib/constants';
import { StorageManager } from '$lib/utils';

class YourEntityStore {
  private storage: StorageManager<YourEntity>;
  items = $state<YourEntity[]>([]);

  constructor() {
    this.storage = new StorageManager<YourEntity>(STORAGE_KEYS.YOUR_ENTITY);
    if (browser) this.load();
  }

  load() {
    this.items = this.storage.getAll();
  }

  getById(id: string): YourEntity | null {
    return this.storage.getById(id);
  }

  create(data: Omit<YourEntity, 'id' | 'createdAt' | 'updatedAt'>): YourEntity {
    const entity = this.storage.create(data);
    this.load();
    return entity;
  }

  update(id: string, data: Partial<YourEntity>): YourEntity | null {
    const entity = this.storage.update(id, data);
    if (entity) this.load();
    return entity;
  }

  delete(id: string): boolean {
    const success = this.storage.delete(id);
    if (success) this.load();
    return success;
  }
}

export const yourEntityStore = new YourEntityStore();
```

### Creating CRUD Pages

Follow the pattern in `/sales/leads/`:

1. **List Page** - DataTable, search, filters, pagination, sorting
2. **Create Page** - Form with validation, toast notifications
3. **Detail Page** - Display data, edit/delete buttons, confirmation modal
4. **Edit Page** - Pre-populated form, update functionality

## Styling Guidelines

- Use Tailwind utility classes
- Custom Salesforce colors in `tailwind.config.ts`
- Semantic classes in `app.css`: `btn-primary`, `form-label`, `badge`, `card`
- Maintain consistent spacing with Tailwind scale

## Verification Plan

### End-to-End Test Scenarios

**Scenario 1: Sales Flow**
1. Login as `sales@demo.com`
2. Create new lead
3. Convert lead to opportunity (link to account)
4. Move opportunity through pipeline stages (using drag-and-drop on the pipeline view)
5. Mark opportunity as "Closed Won"
6. View sales pipeline report

**Scenario 2: Service Flow**
1. Login as `service@demo.com`
2. Create new case from contact
3. Search knowledge base for relevant article
4. Link article to case (via suggested articles)
5. Add a comment to the case timeline
6. Update case status to "Closed"
7. View case status report

**Scenario 3: Marketing Flow**
1. Login as `marketing@demo.com`
2. Create new campaign
3. Add leads and contacts as campaign members
4. Update member statuses (sent, responded, attended)
5. View campaign ROI calculation on campaign detail
6. View campaign ROI report

**Scenario 4: Analytics**
1. Login as `admin@demo.com`
2. Create custom dashboard
3. Add multiple widgets (bar chart, pie chart, metric cards)
4. Configure widget data sources and filters (basic filter is by data source)
5. Drag and drop widgets to rearrange layout
6. View all pre-built reports
7. Test date range filtering on reports

**Data Persistence:**
1. Perform CRUD operations across all entities.
2. Refresh browser.
3. Verify data persists (LocalStorage).
4. Test LocalStorage quota handling (simulate by adding many items - not automated, observe console).

**Responsive Design:**
1. Test all pages on mobile viewport (e.g., 375px width).
2. Test tablet viewport (e.g., 768px width).
3. Verify collapsible sidebar.
4. Check table horizontal scrolling.

## Success Criteria

- ✅ All 4 modules fully functional (Sales, Service, Marketing, Analytics)
- ✅ Complete CRUD operations for all entities (Leads, Opportunities, Accounts, Contacts, Cases, Knowledge Articles, Campaigns, Email Templates)
- ✅ Data persistence via LocalStorage
- ✅ Mock authentication with 4 user roles
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional Salesforce-like UI
- ✅ All relationships working (accounts-contacts, opportunities-accounts, case-contact/account, campaign-members)
- ✅ Pipeline kanban with drag-and-drop
- ✅ Knowledge base with search and ratings (inline)
- ✅ Case timeline with comments
- ✅ Campaign ROI calculations
- ✅ 4+ pre-built reports with charts
- ✅ Custom dashboard builder with drag-and-drop widgets
- ✅ Global search across entities
- ✅ Form validation and error handling
- ✅ Loading and empty states
- ✅ Toast notifications


## License

MIT License - Demo project for educational purposes.

## Credits

Built with SvelteKit, Svelte 5, TypeScript, and Tailwind CSS.