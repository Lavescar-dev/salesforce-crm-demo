import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const orderCopy = {
  en: {
    title: "Orders",
    intro: "Track and manage customer orders",
    newOrder: "New Order",
    totalOrders: "Total Orders",
    processing: "Processing",
    delivered: "Delivered",
    totalValue: (value: number) => `${value.toFixed(2)}M total value`,
    beingPrepared: "Being prepared",
    successfullyCompleted: "Successfully completed",
    searchPlaceholder: "Search orders by number or account...",
    export: "Export",
    table: {
      number: "Order Number",
      account: "Account",
      amount: "Amount",
      status: "Status",
      date: "Order Date",
      actions: "Actions",
    },
    view: "View",
    track: "Track",
    empty: "No orders found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} orders`,
    previous: "Previous",
    next: "Next",
    csvHeaders: ["Order Number", "Account", "Amount", "Status", "Date"],
    statusLabels: {
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },
  },
  tr: {
    title: "Siparişler",
    intro: "Müşteri siparişlerini takip edin ve yönetin",
    newOrder: "Yeni Sipariş",
    totalOrders: "Toplam Sipariş",
    processing: "İşleniyor",
    delivered: "Teslim Edildi",
    totalValue: (value: number) => `${value.toFixed(2)}M toplam değer`,
    beingPrepared: "Hazırlanıyor",
    successfullyCompleted: "Başarıyla tamamlandı",
    searchPlaceholder: "Numara veya hesaba göre sipariş ara...",
    export: "Dışa Aktar",
    table: {
      number: "Sipariş No",
      account: "Hesap",
      amount: "Tutar",
      status: "Durum",
      date: "Sipariş Tarihi",
      actions: "İşlemler",
    },
    view: "Görüntüle",
    track: "Takip Et",
    empty: "Kriterlerinize uyan sipariş bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} sipariş gösteriliyor`,
    previous: "Önceki",
    next: "Sonraki",
    csvHeaders: ["Sipariş No", "Hesap", "Tutar", "Durum", "Tarih"],
    statusLabels: {
      Processing: "İşleniyor",
      Shipped: "Kargolandı",
      Delivered: "Teslim Edildi",
      Cancelled: "İptal Edildi",
    },
  },
} as const;

const getStatusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-amber-100 text-amber-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Delivered":
      return "bg-emerald-100 text-emerald-800";
    case "Cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export default component$(() => {
  const locale = useLocale();
  const copy = orderCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const filteredOrders = demoData.orders.filter(
    (order) =>
      order.orderNumber
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      order.account.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
  const filteredValue = filteredOrders.reduce(
    (sum, order) => sum + order.amount,
    0,
  );
  const processingCount = filteredOrders.filter(
    (order) => order.status === "Processing",
  ).length;
  const deliveredCount = filteredOrders.filter(
    (order) => order.status === "Delivered",
  ).length;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Siparişler" : "Orders";
  });

  const handleExport = $(() => {
    downloadCsv(
      "orders.csv",
      csvHeaders,
      filteredOrders.map((order) => [
        order.orderNumber,
        order.account,
        order.amount,
        order.status,
        order.date,
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
          href="/orders/new"
          class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          {copy.newOrder}
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.totalOrders}
          value={filteredOrders.length}
          subtitle={copy.totalValue(filteredValue / 1_000_000)}
          icon={ShoppingCartIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.processing}
          value={processingCount}
          subtitle={copy.beingPrepared}
          icon={ShoppingCartIcon}
          iconColor="text-amber-600"
          badgeClass="bg-amber-50"
        />
        <MetricCard
          title={copy.delivered}
          value={deliveredCount}
          subtitle={copy.successfullyCompleted}
          icon={ShoppingCartIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
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
                  {copy.table.date}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} class="transition hover:bg-slate-50/70">
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <ShoppingCartIcon class="h-5 w-5 text-blue-600" />
                      </div>
                      <p class="text-sm font-medium text-slate-900">
                        {order.orderNumber}
                      </p>
                    </div>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm text-slate-900">{order.account}</p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm font-semibold text-slate-900">
                      ${order.amount.toLocaleString()}
                    </p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {copy.statusLabels[order.status]}
                    </span>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm text-slate-600">
                      {new Date(order.date).toLocaleDateString(
                        locale.value === "tr" ? "tr-TR" : "en-US",
                      )}
                    </p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div class="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.id}`}
                        class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                      >
                        {copy.view}
                      </Link>
                      <span class="text-slate-300">|</span>
                      <button class="text-sm font-medium text-blue-700 transition hover:text-blue-800">
                        {copy.track}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-slate-600">
            {copy.showing(filteredOrders.length, demoData.orders.length)}
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
  title: "Orders",
  meta: [
    {
      name: "description",
      content: "Browse orders in the Qwik CRM demo.",
    },
  ],
};
