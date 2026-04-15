import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  EditIcon,
  FileTextIcon,
} from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { DetailNotesPanel } from "~/components/detail-notes-panel";
import { useDemoData } from "~/data/demo-state";
import { updateQuote } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const quoteDetailCopy = {
  en: {
    notFound: "Quote not found",
    back: "Back to Quotes",
    edit: "Edit Quote",
    sendUpdate: "Send Update",
    expires: "Expires",
    amount: "Amount",
    validUntil: "Valid Until",
    daysLeft: "Days Left",
    quoteId: "Quote ID",
    lineItemsTitle: "Line Items",
    item: "Item",
    share: "Share",
    approvalTimeline: "Approval Timeline",
    account: "Account",
    noAccountRecord: "No matching account record found.",
    quoteNotes: "Quote Notes",
    statusLabels: {
      Draft: "Draft",
      Sent: "Sent",
      Accepted: "Accepted",
      Rejected: "Rejected",
    },
    accountStatusLabels: {
      Active: "Active",
      Inactive: "Inactive",
      Prospect: "Prospect",
    },
    noteItems: [
      {
        title: "Pricing Lock",
        text: "Discounting is already reflected in the current amount.",
      },
      {
        title: "Implementation Timeline",
        text: "Customer agreed to the implementation timeline during the last review.",
      },
      {
        title: "Procurement Ready",
        text: "Ready for procurement once the final approval is confirmed.",
      },
    ],
    activityItems: [
      {
        title: "Quote sent to customer",
        description: "Draft finalized and shared with procurement.",
        time: "Today",
      },
      {
        title: "Pricing reviewed",
        description: "Commercial terms checked by sales leadership.",
        time: "2 days ago",
      },
      {
        title: "Scope confirmed",
        description: "Implementation scope aligned with the customer team.",
        time: "4 days ago",
      },
    ],
    lineItems: [
      { name: "Platform subscription", share: 0.6 },
      { name: "Implementation services", share: 0.25 },
      { name: "Success package", share: 0.15 },
    ],
  },
  tr: {
    notFound: "Teklif bulunamadı",
    back: "Tekliflere geri dön",
    edit: "Teklifi Düzenle",
    sendUpdate: "Güncelleme Gönder",
    expires: "Son geçerlilik",
    amount: "Tutar",
    validUntil: "Geçerlilik Tarihi",
    daysLeft: "Kalan Gün",
    quoteId: "Teklif No",
    lineItemsTitle: "Kalemler",
    item: "Kalem",
    share: "Pay",
    approvalTimeline: "Onay Zaman Çizelgesi",
    account: "Hesap",
    noAccountRecord: "Eşleşen hesap kaydı bulunamadı.",
    quoteNotes: "Teklif Notları",
    statusLabels: {
      Draft: "Taslak",
      Sent: "Gönderildi",
      Accepted: "Kabul Edildi",
      Rejected: "Reddedildi",
    },
    accountStatusLabels: {
      Active: "Aktif",
      Inactive: "Pasif",
      Prospect: "Potansiyel",
    },
    noteItems: [
      {
        title: "Fiyat Kilidi",
        text: "İndirim zaten mevcut tutara yansıtılmış durumda.",
      },
      {
        title: "Uygulama Zaman Çizelgesi",
        text: "Müşteri son incelemede uygulama zaman çizelgesini kabul etti.",
      },
      {
        title: "Satın Alma Hazır",
        text: "Final onay doğrulandıktan sonra satın almaya hazır.",
      },
    ],
    activityItems: [
      {
        title: "Teklif müşteriye gönderildi",
        description: "Taslak tamamlandı ve satın alma ekibiyle paylaşıldı.",
        time: "Bugün",
      },
      {
        title: "Fiyatlandırma gözden geçirildi",
        description:
          "Ticari şartlar satış liderliği tarafından kontrol edildi.",
        time: "2 gün önce",
      },
      {
        title: "Kapsam doğrulandı",
        description: "Uygulama kapsamı müşteri ekibiyle uyumlandı.",
        time: "4 gün önce",
      },
    ],
    lineItems: [
      { name: "Platform aboneliği", share: 0.6 },
      { name: "Uygulama hizmetleri", share: 0.25 },
      { name: "Başarı paketi", share: 0.15 },
    ],
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = quoteDetailCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const quote = demoData.quotes.find((item) => item.id === id);
  const localeCode = locale.value === "tr" ? "tr-TR" : "en-US";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-800";
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800";
      case "Rejected":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Teklif Detayı" : "Quote Detail";
  });

  if (!quote) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/quotes"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  const relatedAccount = demoData.accounts.find(
    (item) => item.name === quote.account,
  );
  const canSendUpdate =
    quote.status !== "Accepted" && quote.status !== "Rejected";
  const validUntil = new Date(quote.validUntil);
  const daysLeft = Math.ceil(
    (validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
  const lineItems = copy.lineItems;

  const baseParts = lineItems.map((item, index) =>
    index < lineItems.length - 1 ? Math.round(quote.amount * item.share) : 0,
  );
  const finalLineTotal =
    quote.amount - baseParts.reduce((sum, value) => sum + value, 0);

  const activity = copy.activityItems.map((item, index) => ({
    ...item,
    icon: [FileTextIcon, DollarSignIcon, CheckCircleIcon][index],
    color: [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-violet-100 text-violet-600",
    ][index],
  }));

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/quotes"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {quote.name}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {quote.account}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/quotes/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
          <button
            disabled={!canSendUpdate}
            onClick$={() => {
              if (!canSendUpdate) {
                return;
              }
              updateQuote(demoData, id, { status: "Sent" });
              navigate(`/quotes/${id}?action=sent`);
            }}
            class={[
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2 sm:px-4",
              canSendUpdate
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none",
            ].join(" ")}
          >
            <CheckCircleIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">
              {copy.sendUpdate}
            </span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(quote.status)}`}
        >
          {copy.statusLabels[quote.status]}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {copy.expires} {quote.validUntil}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-blue-50 p-2">
              <DollarSignIcon class="h-5 w-5 text-blue-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.amount}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            ${quote.amount.toLocaleString()}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2">
              <CalendarIcon class="h-5 w-5 text-emerald-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.validUntil}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {validUntil.toLocaleDateString(localeCode)}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-violet-50 p-2">
              <ClockIcon class="h-5 w-5 text-violet-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.daysLeft}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{daysLeft}</p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2">
              <FileTextIcon class="h-5 w-5 text-amber-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.quoteId}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{quote.name}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.lineItemsTitle}
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
                        {copy.share}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.amount}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
                    {lineItems.map((item, index) => {
                      const amount =
                        index < lineItems.length - 1
                          ? baseParts[index]
                          : finalLineTotal;
                      return (
                        <tr
                          key={item.name}
                          class="transition hover:bg-slate-50/70"
                        >
                          <td class="px-4 py-4 text-sm font-medium text-slate-900">
                            {item.name}
                          </td>
                          <td class="px-4 py-4 text-sm text-slate-600">
                            {Math.round(item.share * 100)}%
                          </td>
                          <td class="px-4 py-4 text-sm font-semibold text-slate-900">
                            ${amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.approvalTimeline}
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
                  {locale.value === "tr" ? "Hesabı Aç" : "Open Account"}
                </Link>
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noAccountRecord}</p>
            )}
          </div>

          <DetailNotesPanel
            title={copy.quoteNotes}
            items={[
              {
                id: "pricing",
                title: copy.noteItems[0].title,
                text: copy.noteItems[0].text,
                icon: FileTextIcon,
                tone: "blue",
              },
              {
                id: "timeline",
                title: copy.noteItems[1].title,
                text: copy.noteItems[1].text,
                icon: ClockIcon,
                tone: "emerald",
              },
              {
                id: "procurement",
                title: copy.noteItems[2].title,
                text: copy.noteItems[2].text,
                icon: CheckCircleIcon,
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
  title: "Quote Detail",
  meta: [
    {
      name: "description",
      content: "Inspect a quote in the Qwik CRM demo.",
    },
  ],
};
