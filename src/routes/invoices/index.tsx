import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { DownloadIcon, FileTextIcon, PlusIcon, SearchIcon } from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const invoiceCopy = {
  en: {
    title: "Invoices",
    intro: "Manage and track customer invoices",
    newInvoice: "New Invoice",
    totalInvoices: "Total Invoices",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    totalValue: (value: number) => `${value.toFixed(2)}M total`,
    received: (value: number) => `${value.toFixed(2)}M received`,
    awaitingPayment: "Awaiting payment",
    overdueValue: (value: number) => `${value.toFixed(2)}M overdue`,
    searchPlaceholder: "Search invoices by number or account...",
    export: "Export",
    table: {
      number: "Invoice Number",
      account: "Account",
      amount: "Amount",
      status: "Status",
      dueDate: "Due Date",
      paidDate: "Paid Date",
      actions: "Actions",
    },
    view: "View",
    download: "Download",
    empty: "No invoices found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} invoices`,
    previous: "Previous",
    next: "Next",
    daysLeft: (days: number) => `${days} days left`,
    statusLabels: {
      Paid: "Paid",
      Pending: "Pending",
      Overdue: "Overdue",
      Cancelled: "Cancelled",
    },
    csvHeaders: [
      "Invoice Number",
      "Account",
      "Amount",
      "Status",
      "Due Date",
      "Paid Date",
    ],
  },
  tr: {
    title: "Faturalar",
    intro: "Müşteri faturalarını yönetin ve takip edin",
    newInvoice: "Yeni Fatura",
    totalInvoices: "Toplam Fatura",
    paid: "Ödendi",
    pending: "Beklemede",
    overdue: "Vadesi Geçmiş",
    totalValue: (value: number) => `${value.toFixed(2)}M toplam`,
    received: (value: number) => `${value.toFixed(2)}M alındı`,
    awaitingPayment: "Ödeme bekleniyor",
    overdueValue: (value: number) => `${value.toFixed(2)}M gecikmiş`,
    searchPlaceholder: "Numara veya hesaba göre fatura ara...",
    export: "Dışa Aktar",
    table: {
      number: "Fatura No",
      account: "Hesap",
      amount: "Tutar",
      status: "Durum",
      dueDate: "Son Tarih",
      paidDate: "Ödeme Tarihi",
      actions: "İşlemler",
    },
    view: "Görüntüle",
    download: "İndir",
    empty: "Kriterlerinize uyan fatura bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} fatura gösteriliyor`,
    previous: "Önceki",
    next: "Sonraki",
    daysLeft: (days: number) => `${days} gün kaldı`,
    statusLabels: {
      Paid: "Ödendi",
      Pending: "Beklemede",
      Overdue: "Gecikmiş",
      Cancelled: "İptal Edildi",
    },
    csvHeaders: [
      "Fatura No",
      "Hesap",
      "Tutar",
      "Durum",
      "Son Tarih",
      "Ödeme Tarihi",
    ],
  },
} as const;

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-800";
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Overdue":
      return "bg-rose-100 text-rose-800";
    case "Cancelled":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export default component$(() => {
  const locale = useLocale();
  const copy = invoiceCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const filteredInvoices = demoData.invoices.filter(
    (invoice) =>
      invoice.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      invoice.account.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
  const filteredValue = filteredInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const paidInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "Paid",
  );
  const pendingInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "Pending",
  );
  const overdueInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "Overdue",
  );
  const paidValue = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const overdueValue = overdueInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Faturalar" : "Invoices";
  });

  const handleExport = $(() => {
    downloadCsv(
      "invoices.csv",
      csvHeaders,
      filteredInvoices.map((invoice) => [
        invoice.invoiceNumber,
        invoice.account,
        invoice.amount,
        invoice.status,
        invoice.dueDate,
        invoice.paidDate ?? "",
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
          href="/invoices/new"
          class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          {copy.newInvoice}
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-4 sm:gap-6">
        <MetricCard
          title={copy.totalInvoices}
          value={filteredInvoices.length}
          subtitle={copy.totalValue(filteredValue / 1_000_000)}
          icon={FileTextIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.paid}
          value={paidInvoices.length}
          subtitle={copy.received(paidValue / 1_000_000)}
          icon={FileTextIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.pending}
          value={pendingInvoices.length}
          subtitle={copy.awaitingPayment}
          icon={FileTextIcon}
          iconColor="text-amber-600"
          badgeClass="bg-amber-50"
        />
        <MetricCard
          title={copy.overdue}
          value={overdueInvoices.length}
          subtitle={copy.overdueValue(overdueValue / 1_000_000)}
          icon={FileTextIcon}
          iconColor="text-rose-600"
          badgeClass="bg-rose-50"
        />
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
                  {copy.table.dueDate}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.paidDate}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => {
                const dueDate = new Date(invoice.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil(
                  (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                );

                return (
                  <tr key={invoice.id} class="transition hover:bg-slate-50/70">
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <FileTextIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <p class="text-sm font-medium text-slate-900">
                          {invoice.invoiceNumber}
                        </p>
                      </div>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="text-sm text-slate-900">{invoice.account}</p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="text-sm font-semibold text-slate-900">
                        ${invoice.amount.toLocaleString()}
                      </p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(invoice.status)}`}
                      >
                        {copy.statusLabels[invoice.status]}
                      </span>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div>
                        <p class="text-sm text-slate-900">
                          {dueDate.toLocaleDateString(
                            locale.value === "tr" ? "tr-TR" : "en-US",
                          )}
                        </p>
                        {invoice.status === "Pending" &&
                        daysUntilDue > 0 &&
                        daysUntilDue <= 7 ? (
                          <p class="mt-1 text-xs text-amber-600">
                            {copy.daysLeft(daysUntilDue)}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="text-sm text-slate-600">
                        {invoice.paidDate
                          ? new Date(invoice.paidDate).toLocaleDateString(
                              locale.value === "tr" ? "tr-TR" : "en-US",
                            )
                          : "-"}
                      </p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <div class="flex items-center gap-2">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                        >
                          {copy.view}
                        </Link>
                        <span class="text-slate-300">|</span>
                        <button class="text-sm font-medium text-blue-700 transition hover:text-blue-800">
                          {copy.download}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-slate-600">
            {copy.showing(filteredInvoices.length, demoData.invoices.length)}
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
  title: "Invoices",
  meta: [
    {
      name: "description",
      content: "Browse invoices in the Qwik CRM demo.",
    },
  ],
};
