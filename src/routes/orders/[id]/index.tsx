import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  ShoppingCartIcon,
} from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { DetailNotesPanel } from "~/components/detail-notes-panel";
import { useDemoData } from "~/data/demo-state";
import { updateOrder } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const orderDetailCopy = {
  en: {
    notFound: "Order not found",
    back: "Back to Orders",
    edit: "Edit Order",
    trackShipment: "Track Shipment",
    created: "Created",
    amount: "Amount",
    orderDate: "Order Date",
    daysSince: "Days Since",
    orderId: "Order ID",
    orderItems: "Order Items",
    item: "Item",
    qty: "Qty",
    price: "Price",
    fulfillmentTimeline: "Fulfillment Timeline",
    account: "Account",
    noAccountRecord: "No matching account record found.",
    fulfillmentNotes: "Fulfillment Notes",
    statusLabels: {
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },
    lineItems: [
      { name: "Core platform license", quantity: 1, share: 0.55 },
      { name: "Implementation services", quantity: 1, share: 0.3 },
      { name: "Success support package", quantity: 1, share: 0.15 },
    ],
    activityItems: [
      {
        title: "Order processing started",
        description:
          "Operations confirmed all deliverables and scheduled fulfillment.",
        time: "Today",
      },
      {
        title: "Shipment prepared",
        description:
          "Warehouse packed the order and created the shipping label.",
        time: "Yesterday",
      },
      {
        title: "Customer notified",
        description:
          "Tracking details and expected delivery window were shared.",
        time: "2 days ago",
      },
    ],
    noteItems: [
      {
        title: "Carrier Booking",
        text: "Shipping label created and queued for carrier pickup.",
      },
      {
        title: "Provisioning Check",
        text: "Operations confirmed all services were provisioned successfully.",
      },
      {
        title: "Customer Follow-up",
        text: "Customer success will follow up after delivery confirmation.",
      },
    ],
  },
  tr: {
    notFound: "Sipariş bulunamadı",
    back: "Siparişlere geri dön",
    edit: "Siparişi Düzenle",
    trackShipment: "Sevkiyatı Takip Et",
    created: "Oluşturulma",
    amount: "Tutar",
    orderDate: "Sipariş Tarihi",
    daysSince: "Geçen Gün",
    orderId: "Sipariş No",
    orderItems: "Sipariş Kalemleri",
    item: "Kalem",
    qty: "Adet",
    price: "Fiyat",
    fulfillmentTimeline: "Teslimat Zaman Çizelgesi",
    account: "Hesap",
    noAccountRecord: "Eşleşen hesap kaydı bulunamadı.",
    fulfillmentNotes: "Teslimat Notları",
    statusLabels: {
      Processing: "İşleniyor",
      Shipped: "Kargolandı",
      Delivered: "Teslim Edildi",
      Cancelled: "İptal Edildi",
    },
    lineItems: [
      { name: "Temel platform lisansı", quantity: 1, share: 0.55 },
      { name: "Uygulama hizmetleri", quantity: 1, share: 0.3 },
      { name: "Başarı destek paketi", quantity: 1, share: 0.15 },
    ],
    activityItems: [
      {
        title: "Sipariş işleme başladı",
        description:
          "Operasyon tüm teslimat kalemlerini onayladı ve hazırlık planladı.",
        time: "Bugün",
      },
      {
        title: "Sevkiyat hazırlandı",
        description: "Depo siparişi paketledi ve kargo etiketini oluşturdu.",
        time: "Dün",
      },
      {
        title: "Müşteri bilgilendirildi",
        description: "Takip detayları ve beklenen teslimat aralığı paylaşıldı.",
        time: "2 gün önce",
      },
    ],
    noteItems: [
      {
        title: "Taşıyıcı Rezervasyonu",
        text: "Kargo etiketi oluşturuldu ve taşıyıcı alımı için sıraya alındı.",
      },
      {
        title: "Sağlama Kontrolü",
        text: "Operasyon tüm hizmetlerin başarıyla sağlandığını doğruladı.",
      },
      {
        title: "Müşteri Takibi",
        text: "Müşteri başarısı, teslimat onayından sonra takip edecek.",
      },
    ],
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = orderDetailCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const order = demoData.orders.find((item) => item.id === id);

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

  if (!order) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/orders"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  const relatedAccount = demoData.accounts.find(
    (item) => item.name === order.account,
  );
  const canTrackShipment = order.status === "Processing";
  const orderDate = new Date(order.date);
  const daysSinceOrder = Math.max(
    Math.ceil(
      (new Date().getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
    0,
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Sipariş Detayı" : "Order Detail";
  });

  const activity = copy.activityItems.map((item, index) => ({
    ...item,
    icon: [ShoppingCartIcon, CheckCircleIcon, ClockIcon][index],
    color: [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-violet-100 text-violet-600",
    ][index],
  }));

  const items = copy.lineItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: order.amount * item.share,
  }));

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/orders"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {order.orderNumber}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {order.account}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/orders/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
          <button
            disabled={!canTrackShipment}
            onClick$={() => {
              if (!canTrackShipment) {
                return;
              }
              updateOrder(demoData, id, {
                status:
                  order.status === "Processing" ? "Shipped" : order.status,
              });
              navigate(`/orders/${id}?action=tracked`);
            }}
            class={[
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2 sm:px-4",
              canTrackShipment
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none",
            ].join(" ")}
          >
            <CheckCircleIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">
              {copy.trackShipment}
            </span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(order.status)}`}
        >
          {copy.statusLabels[order.status]}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {copy.created} {order.date}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-blue-50 p-2">
              <ShoppingCartIcon class="h-5 w-5 text-blue-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.amount}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            ${order.amount.toLocaleString()}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2">
              <CalendarIcon class="h-5 w-5 text-emerald-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.orderDate}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {orderDate.toLocaleDateString()}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-violet-50 p-2">
              <ClockIcon class="h-5 w-5 text-violet-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.daysSince}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{daysSinceOrder}</p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2">
              <ShoppingCartIcon class="h-5 w-5 text-amber-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.orderId}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{order.id}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.orderItems}
            </h2>
            <div class="overflow-hidden rounded-xl border border-slate-200">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.item}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.qty}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.price}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
                    {items.map((item) => (
                      <tr
                        key={item.name}
                        class="transition hover:bg-slate-50/70"
                      >
                        <td class="px-4 py-4 text-sm font-medium text-slate-900">
                          {item.name}
                        </td>
                        <td class="px-4 py-4 text-sm text-slate-700">
                          {item.quantity}
                        </td>
                        <td class="px-4 py-4 text-sm font-semibold text-slate-900">
                          ${Math.round(item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.fulfillmentTimeline}
            </h2>
            <div class="space-y-4">
              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} class="flex gap-3 sm:gap-4">
                    <div class="flex flex-col items-center flex-shrink-0">
                      <div
                        class={`flex h-8 w-8 items-center justify-center rounded-full ${item.color}`}
                      >
                        <Icon class="h-4 w-4" />
                      </div>
                      {index < activity.length - 1 ? (
                        <div class="mt-2 h-full w-0.5 bg-slate-200" />
                      ) : null}
                    </div>
                    <div class="min-w-0 flex-1 pb-4">
                      <p class="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                        {item.description}
                      </p>
                      <p class="mt-2 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.account}
            </h3>
            {relatedAccount ? (
              <div class="space-y-3">
                <p class="text-base font-semibold text-slate-900">
                  {relatedAccount.name}
                </p>
                <p class="text-sm text-slate-600">{relatedAccount.industry}</p>
                <Link
                  href={`/accounts/${relatedAccount.id}`}
                  class="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Open Account
                </Link>
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noAccountRecord}</p>
            )}
          </div>

          <DetailNotesPanel
            title={copy.fulfillmentNotes}
            items={[
              {
                id: "label",
                title: copy.noteItems[0].title,
                text: copy.noteItems[0].text,
                icon: ShoppingCartIcon,
                tone: "blue",
              },
              {
                id: "provision",
                title: copy.noteItems[1].title,
                text: copy.noteItems[1].text,
                icon: CheckCircleIcon,
                tone: "emerald",
              },
              {
                id: "follow-up",
                title: copy.noteItems[2].title,
                text: copy.noteItems[2].text,
                icon: ClockIcon,
                tone: "violet",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Order Detail",
  meta: [
    {
      name: "description",
      content: "Inspect an order in the Qwik CRM demo.",
    },
  ],
};
