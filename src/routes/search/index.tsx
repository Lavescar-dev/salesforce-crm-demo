import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useLocation } from "@builder.io/qwik-city";
import {
  Building2Icon,
  ContactIcon,
  DollarSignIcon,
  FileTextIcon,
  SearchIcon,
  ShoppingCartIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";

export default component$(() => {
  const location = useLocation();
  const demoData = useDemoData();
  const query = (location.url.searchParams.get("q") ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const matches = (...values: string[]) =>
    values.some((value) => value.toLowerCase().includes(normalizedQuery));

  const leadResults = hasQuery
    ? demoData.leads.filter((lead) =>
        matches(
          lead.name,
          lead.company,
          lead.email,
          lead.phone,
          lead.status,
          lead.source,
        ),
      )
    : [];
  const accountResults = hasQuery
    ? demoData.accounts.filter((account) =>
        matches(
          account.name,
          account.industry,
          account.type,
          account.status,
          account.owner,
        ),
      )
    : [];
  const contactResults = hasQuery
    ? demoData.contacts.filter((contact) =>
        matches(
          contact.name,
          contact.title,
          contact.account,
          contact.email,
          contact.phone,
          contact.status,
        ),
      )
    : [];
  const opportunityResults = hasQuery
    ? demoData.opportunities.filter((opportunity) =>
        matches(
          opportunity.name,
          opportunity.account,
          opportunity.stage,
          opportunity.owner,
          opportunity.closeDate,
        ),
      )
    : [];
  const quoteResults = hasQuery
    ? demoData.quotes.filter((quote) =>
        matches(quote.name, quote.account, quote.status, quote.validUntil),
      )
    : [];
  const orderResults = hasQuery
    ? demoData.orders.filter((order) =>
        matches(order.orderNumber, order.account, order.status, order.date),
      )
    : [];
  const invoiceResults = hasQuery
    ? demoData.invoices.filter((invoice) =>
        matches(
          invoice.invoiceNumber,
          invoice.account,
          invoice.status,
          invoice.dueDate,
          invoice.paidDate ?? "",
        ),
      )
    : [];

  const totalResults =
    leadResults.length +
    accountResults.length +
    contactResults.length +
    opportunityResults.length +
    quoteResults.length +
    orderResults.length +
    invoiceResults.length;

  const quickLinks = [
    {
      label: "Leads",
      description: "Open the pipeline lead list.",
      href: "/leads",
      icon: UsersIcon,
    },
    {
      label: "Opportunities",
      description: "Jump into the sales pipeline.",
      href: "/opportunities",
      icon: TargetIcon,
    },
    {
      label: "Accounts",
      description: "Browse customer accounts.",
      href: "/accounts",
      icon: Building2Icon,
    },
    {
      label: "Contacts",
      description: "Review stakeholder records.",
      href: "/contacts",
      icon: ContactIcon,
    },
    {
      label: "Quotes",
      description: "Check proposals and approvals.",
      href: "/quotes",
      icon: FileTextIcon,
    },
    {
      label: "Orders",
      description: "Track active orders.",
      href: "/orders",
      icon: ShoppingCartIcon,
    },
    {
      label: "Invoices",
      description: "Review billing status.",
      href: "/invoices",
      icon: DollarSignIcon,
    },
  ];

  const renderSection = (section: any) => {
    const Icon = section.icon;

    return (
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-slate-50 p-2 text-slate-700">
              <Icon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 sm:text-lg">
                {section.title}
              </h2>
              <p class="text-xs text-slate-500 sm:text-sm">
                {section.count} matches
              </p>
            </div>
          </div>
          <Link
            href={section.href}
            class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
          >
            View all
          </Link>
        </div>

        <div class="space-y-3">
          {section.items.length > 0 ? (
            section.items.map((item: any) => section.renderItem(item))
          ) : (
            <p class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {section.emptyMessage}
            </p>
          )}
        </div>
      </section>
    );
  };

  const sections = [
    {
      title: "Leads",
      href: "/leads",
      icon: UsersIcon,
      count: leadResults.length,
      items: leadResults.slice(0, 4),
      emptyMessage: "No leads matched this search.",
      renderItem: (lead: (typeof leadResults)[number]) => (
        <div
          key={lead.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/leads/${lead.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {lead.name}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">{lead.company}</p>
            </div>
            <span class="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {lead.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{lead.source}</span>
            <span>${lead.value.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Accounts",
      href: "/accounts",
      icon: Building2Icon,
      count: accountResults.length,
      items: accountResults.slice(0, 4),
      emptyMessage: "No accounts matched this search.",
      renderItem: (account: (typeof accountResults)[number]) => (
        <div
          key={account.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/accounts/${account.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {account.name}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {account.industry}
              </p>
            </div>
            <span class="rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
              {account.type}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{account.status}</span>
            <span>{account.owner}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Contacts",
      href: "/contacts",
      icon: ContactIcon,
      count: contactResults.length,
      items: contactResults.slice(0, 4),
      emptyMessage: "No contacts matched this search.",
      renderItem: (contact: (typeof contactResults)[number]) => (
        <div
          key={contact.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/contacts/${contact.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {contact.name}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {contact.title}
              </p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              {contact.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{contact.account}</span>
            <span>{contact.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Opportunities",
      href: "/opportunities",
      icon: TargetIcon,
      count: opportunityResults.length,
      items: opportunityResults.slice(0, 4),
      emptyMessage: "No opportunities matched this search.",
      renderItem: (opportunity: (typeof opportunityResults)[number]) => (
        <div
          key={opportunity.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/opportunities/${opportunity.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {opportunity.name}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {opportunity.account}
              </p>
            </div>
            <span class="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {opportunity.stage}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{opportunity.owner}</span>
            <span>${opportunity.value.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Quotes",
      href: "/quotes",
      icon: FileTextIcon,
      count: quoteResults.length,
      items: quoteResults.slice(0, 4),
      emptyMessage: "No quotes matched this search.",
      renderItem: (quote: (typeof quoteResults)[number]) => (
        <div
          key={quote.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/quotes/${quote.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {quote.name}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {quote.account}
              </p>
            </div>
            <span class="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              {quote.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{quote.validUntil}</span>
            <span>${quote.amount.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Orders",
      href: "/orders",
      icon: ShoppingCartIcon,
      count: orderResults.length,
      items: orderResults.slice(0, 4),
      emptyMessage: "No orders matched this search.",
      renderItem: (order: (typeof orderResults)[number]) => (
        <div
          key={order.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/orders/${order.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {order.orderNumber}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {order.account}
              </p>
            </div>
            <span class="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {order.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{order.date}</span>
            <span>${order.amount.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Invoices",
      href: "/invoices",
      icon: DollarSignIcon,
      count: invoiceResults.length,
      items: invoiceResults.slice(0, 4),
      emptyMessage: "No invoices matched this search.",
      renderItem: (invoice: (typeof invoiceResults)[number]) => (
        <div
          key={invoice.id}
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <Link
                href={`/invoices/${invoice.id}`}
                class="truncate text-sm font-semibold text-slate-900 transition hover:text-blue-700"
              >
                {invoice.invoiceNumber}
              </Link>
              <p class="mt-1 truncate text-xs text-slate-500">
                {invoice.account}
              </p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              {invoice.status}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{invoice.dueDate}</span>
            <span>${invoice.amount.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
  ];

  const visibleSections = sections.filter((section) => section.count > 0);

  return (
    <div class="space-y-6 p-4 sm:space-y-8 sm:p-6">
      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <SearchIcon class="h-6 w-6" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Global Search
              </p>
              <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Search across the CRM
              </h1>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Search across leads, accounts, contacts, opportunities, quotes,
                orders, and invoices from one place.
              </p>
            </div>
          </div>

          {hasQuery ? (
            <div class="flex flex-wrap items-center gap-3">
              <span class="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                "{query}"
              </span>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {totalResults} results
              </span>
              <Link
                href="/dashboard"
                class="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to dashboard
              </Link>
            </div>
          ) : (
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Type a name, company, email, owner, or document number and press
              Enter.
            </div>
          )}
        </div>
      </section>

      {!hasQuery ? (
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div class="flex items-start gap-3">
                  <div class="rounded-xl bg-slate-50 p-2 text-slate-700">
                    <Icon class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900">
                      {link.label}
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : totalResults > 0 ? (
        <div class="grid gap-4 xl:grid-cols-2">
          {visibleSections.map((section) => renderSection(section))}
        </div>
      ) : (
        <div class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p class="text-base font-medium text-slate-900">
            No matches found for "{query}".
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Try another company, account owner, email address, or document
            number.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            {quickLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search",
  meta: [
    {
      name: "description",
      content: "Search across the Qwik CRM demo.",
    },
  ],
};
