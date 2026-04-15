import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { type Quote } from "~/data/mock-data";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const quoteCopy = {
  en: {
    title: "Quotes",
    intro: "Create and manage sales quotes",
    newQuote: "New Quote",
    totalQuotes: "Total Quotes",
    acceptedQuotes: "Accepted Quotes",
    pendingReview: "Pending Review",
    totalValue: (value: number) => `${value.toFixed(2)}M total value`,
    acceptedValue: (value: number) => `${value.toFixed(2)}M value`,
    awaitingResponse: "Awaiting customer response",
    statusLabels: {
      All: "All",
      Draft: "Draft",
      Sent: "Sent",
      Accepted: "Accepted",
      Rejected: "Rejected",
    },
    searchPlaceholder: "Search quotes by name or account...",
    filters: "Filters",
    export: "Export",
    table: {
      number: "Quote Number",
      account: "Account",
      amount: "Amount",
      status: "Status",
      validUntil: "Valid Until",
      actions: "Actions",
    },
    view: "View",
    edit: "Edit",
    empty: "No quotes found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} quotes`,
    previous: "Previous",
    next: "Next",
    daysLeft: (days: number) => `${days} days left`,
    expired: "Expired",
    csvHeaders: ["Number", "Account", "Amount", "Status", "Valid Until"],
  },
  tr: {
    title: "Teklifler",
    intro: "Satış teklifleri oluşturun ve yönetin",
    newQuote: "Yeni Teklif",
    totalQuotes: "Toplam Teklif",
    acceptedQuotes: "Kabul Edilen Teklif",
    pendingReview: "İnceleniyor",
    totalValue: (value: number) => `${value.toFixed(2)}M toplam değer`,
    acceptedValue: (value: number) => `${value.toFixed(2)}M değer`,
    awaitingResponse: "Müşteri yanıtı bekleniyor",
    statusLabels: {
      All: "Tümü",
      Draft: "Taslak",
      Sent: "Gönderildi",
      Accepted: "Kabul Edildi",
      Rejected: "Reddedildi",
    },
    searchPlaceholder: "Ad veya hesaba göre teklif ara...",
    filters: "Filtreler",
    export: "Dışa Aktar",
    table: {
      number: "Teklif No",
      account: "Hesap",
      amount: "Tutar",
      status: "Durum",
      validUntil: "Geçerlilik Tarihi",
      actions: "İşlemler",
    },
    view: "Görüntüle",
    edit: "Düzenle",
    empty: "Kriterlerinize uyan teklif bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} teklif gösteriliyor`,
    previous: "Önceki",
    next: "Sonraki",
    daysLeft: (days: number) => `${days} gün kaldı`,
    expired: "Süresi doldu",
    csvHeaders: ["No", "Hesap", "Tutar", "Durum", "Geçerlilik Tarihi"],
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = quoteCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const statusFilter = useSignal<string>("All");
  const localeCode = locale.value === "tr" ? "tr-TR" : "en-US";

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Teklifler" : "Quotes";
  });

  const filteredQuotes = demoData.quotes.filter((quote) => {
    const matchesSearch =
      quote.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      quote.account.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      statusFilter.value === "All" || quote.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: demoData.quotes.length,
    Draft: demoData.quotes.filter((item) => item.status === "Draft").length,
    Sent: demoData.quotes.filter((item) => item.status === "Sent").length,
    Accepted: demoData.quotes.filter((item) => item.status === "Accepted")
      .length,
    Rejected: demoData.quotes.filter((item) => item.status === "Rejected")
      .length,
  };

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-800";
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800";
      case "Rejected":
        return "bg-rose-100 text-rose-800";
    }
  };

  const totalValue = filteredQuotes.reduce(
    (sum, quote) => sum + quote.amount,
    0,
  );
  const acceptedValue = filteredQuotes
    .filter((quote) => quote.status === "Accepted")
    .reduce((sum, quote) => sum + quote.amount, 0);

  const handleExport = $(() => {
    downloadCsv(
      "quotes.csv",
      csvHeaders,
      filteredQuotes.map((quote) => [
        quote.name,
        quote.account,
        quote.amount,
        quote.status,
        quote.validUntil,
      ]),
    );
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {copy.title}
          </h1>
          <p class="mt-1 text-sm text-slate-600 sm:text-base">{copy.intro}</p>
        </div>
        <Link
          href="/quotes/new"
          class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          {copy.newQuote}
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.totalQuotes}
          value={filteredQuotes.length}
          subtitle={copy.totalValue(totalValue / 1_000_000)}
          icon={FileTextIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.acceptedQuotes}
          value={statusCounts.Accepted}
          subtitle={copy.acceptedValue(acceptedValue / 1_000_000)}
          icon={FileTextIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.pendingReview}
          value={statusCounts.Sent}
          subtitle={copy.awaitingResponse}
          icon={FileTextIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick$={() => {
              statusFilter.value = status;
            }}
            class={[
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
              statusFilter.value === status
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {copy.statusLabels[status as keyof typeof copy.statusLabels]} (
            {count})
          </button>
        ))}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="relative flex-1">
            <SearchIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery.value}
              onInput$={(event) => {
                searchQuery.value = (event.target as HTMLInputElement).value;
              }}
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <FilterIcon class="h-5 w-5" />
            <span>{copy.filters}</span>
          </button>
          <button
            type="button"
            onClick$={handleExport}
            class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <DownloadIcon class="h-5 w-5" />
            <span>{copy.export}</span>
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b border-slate-200 bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.number}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.account}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.amount}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.status}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.validUntil}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => {
                const validDate = new Date(quote.validUntil);
                const today = new Date();
                const daysLeft = Math.ceil(
                  (validDate.getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
                const isExpired = daysLeft <= 0;

                return (
                  <tr key={quote.id} class="transition hover:bg-slate-50/70">
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <FileTextIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <p class="text-sm font-medium text-slate-900">
                          {quote.name}
                        </p>
                      </div>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="text-sm text-slate-900">{quote.account}</p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="text-sm font-semibold text-slate-900">
                        ${quote.amount.toLocaleString()}
                      </p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(quote.status)}`}
                      >
                        {copy.statusLabels[quote.status]}
                      </span>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div class="flex items-center gap-2">
                        <CalendarIcon class="h-4 w-4 text-slate-400" />
                        <div>
                          <p class="text-sm text-slate-900">
                            {validDate.toLocaleDateString(localeCode)}
                          </p>
                          {isExpiringSoon ? (
                            <p class="mt-1 text-xs text-amber-600">
                              {copy.daysLeft(daysLeft)}
                            </p>
                          ) : null}
                          {isExpired ? (
                            <p class="mt-1 text-xs text-rose-600">
                              {copy.expired}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div class="flex items-center gap-2">
                        <Link
                          href={`/quotes/${quote.id}`}
                          class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                        >
                          {copy.view}
                        </Link>
                        <span class="text-slate-300">|</span>
                        <button class="text-sm font-medium text-blue-700 transition hover:text-blue-800">
                          {copy.edit}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-600">
            {copy.showing(filteredQuotes.length, demoData.quotes.length)}
          </p>
          <div class="flex gap-2">
            <button class="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-50">
              {copy.previous}
            </button>
            <button class="rounded-xl bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700">
              1
            </button>
            <button class="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-50">
              {copy.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Quotes",
  meta: [
    {
      name: "description",
      content: "Browse quotes in the Qwik CRM demo.",
    },
  ],
};
