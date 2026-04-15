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
import { updateInvoice } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const invoiceDetailCopy = {
  en: {
    notFound: "Invoice not found",
    back: "Back to Invoices",
    edit: "Edit Invoice",
    recordPayment: "Record Payment",
    due: "Due",
    amount: "Amount",
    dueDate: "Due Date",
    daysUntil: "Days Until",
    paid: "Paid",
    invoiceDetails: "Invoice Details",
    invoiceNumber: "Invoice Number",
    status: "Status",
    paidDate: "Paid Date",
    paymentTimeline: "Payment Timeline",
    account: "Account",
    noAccountRecord: "No matching account record found.",
    paymentNotes: "Payment Notes",
    notPaidYet: "Not paid yet",
    statusLabels: {
      Paid: "Paid",
      Pending: "Pending",
      Overdue: "Overdue",
      Cancelled: "Cancelled",
    },
    noteItems: [
      {
        title: "Reminder Schedule",
        text: "Send a reminder before the due date if payment remains pending.",
      },
      {
        title: "Reconciliation",
        text: "Payment can be reconciled against the linked order once received.",
      },
      {
        title: "Finance Closeout",
        text: "Finance review will close this invoice after settlement.",
      },
    ],
    activityItems: [
      {
        title: "Invoice issued",
        description:
          "Billing team generated the invoice and shared it with the customer.",
        time: "Today",
      },
      {
        title: "Payment reminder sent",
        description: "Automated reminder delivered to the billing contact.",
        time: "2 days ago",
      },
      {
        title: "Payment recorded",
        description: "Finance team marked the invoice as settled.",
        time: "4 days ago",
      },
    ],
  },
  tr: {
    notFound: "Fatura bulunamadı",
    back: "Faturalara geri dön",
    edit: "Faturayı Düzenle",
    recordPayment: "Ödeme Kaydet",
    due: "Vade",
    amount: "Tutar",
    dueDate: "Son Tarih",
    daysUntil: "Kalan Gün",
    paid: "Ödendi",
    invoiceDetails: "Fatura Detayları",
    invoiceNumber: "Fatura No",
    status: "Durum",
    paidDate: "Ödeme Tarihi",
    paymentTimeline: "Ödeme Zaman Çizelgesi",
    account: "Hesap",
    noAccountRecord: "Eşleşen hesap kaydı bulunamadı.",
    paymentNotes: "Ödeme Notları",
    notPaidYet: "Henüz ödenmedi",
    statusLabels: {
      Paid: "Ödendi",
      Pending: "Beklemede",
      Overdue: "Gecikmiş",
      Cancelled: "İptal Edildi",
    },
    noteItems: [
      {
        title: "Hatırlatma Planı",
        text: "Ödeme beklemede kalırsa son tarihten önce bir hatırlatma gönder.",
      },
      {
        title: "Mutabakat",
        text: "Ödeme alındığında bağlantılı sipariş ile mutabakat yapılabilir.",
      },
      {
        title: "Finans Kapanışı",
        text: "Finans incelemesi, mutabakat sonrası bu faturayı kapatacak.",
      },
    ],
    activityItems: [
      {
        title: "Fatura oluşturuldu",
        description:
          "Faturalama ekibi faturayı oluşturdu ve müşteriye paylaştı.",
        time: "Bugün",
      },
      {
        title: "Ödeme hatırlatması gönderildi",
        description: "Otomatik hatırlatma faturalama kişisine iletildi.",
        time: "2 gün önce",
      },
      {
        title: "Ödeme kaydedildi",
        description: "Finans ekibi faturayı kapanmış olarak işaretledi.",
        time: "4 gün önce",
      },
    ],
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = invoiceDetailCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const invoice = demoData.invoices.find((item) => item.id === id);
  const localeCode = locale.value === "tr" ? "tr-TR" : "en-US";

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

  if (!invoice) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/invoices"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  const relatedAccount = demoData.accounts.find(
    (item) => item.name === invoice.account,
  );
  const canRecordPayment =
    invoice.status === "Pending" || invoice.status === "Overdue";
  const dueDate = new Date(invoice.dueDate);
  const paidDate = invoice.paidDate ? new Date(invoice.paidDate) : null;
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Fatura Detayı" : "Invoice Detail";
  });

  const activity = copy.activityItems.map((item, index) => ({
    ...item,
    icon: [FileTextIcon, ClockIcon, CheckCircleIcon][index],
    color: [
      "bg-blue-100 text-blue-600",
      "bg-amber-100 text-amber-600",
      "bg-emerald-100 text-emerald-600",
    ][index],
  }));

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/invoices"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {invoice.invoiceNumber}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {invoice.account}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/invoices/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
          <button
            disabled={!canRecordPayment}
            onClick$={() => {
              if (!canRecordPayment) {
                return;
              }
              updateInvoice(demoData, id, {
                status: "Paid",
                paidDate: new Date().toISOString().slice(0, 10),
              });
              navigate(`/invoices/${id}?action=paid`);
            }}
            class={[
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2 sm:px-4",
              canRecordPayment
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none",
            ].join(" ")}
          >
            <DollarSignIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">
              {copy.recordPayment}
            </span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(invoice.status)}`}
        >
          {copy.statusLabels[invoice.status]}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {copy.due} {dueDate.toLocaleDateString(localeCode)}
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
            ${invoice.amount.toLocaleString()}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2">
              <CalendarIcon class="h-5 w-5 text-emerald-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.dueDate}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {dueDate.toLocaleDateString(localeCode)}
          </p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-violet-50 p-2">
              <ClockIcon class="h-5 w-5 text-violet-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.daysUntil}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{daysUntilDue}</p>
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2">
              <FileTextIcon class="h-5 w-5 text-amber-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.paid}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {paidDate
              ? paidDate.toLocaleDateString(localeCode)
              : copy.notPaidYet}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.invoiceDetails}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.invoiceNumber}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.status}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {copy.statusLabels[invoice.status]}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.dueDate}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {dueDate.toLocaleDateString(localeCode)}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.paidDate}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {invoice.paidDate
                    ? paidDate?.toLocaleDateString(localeCode)
                    : copy.notPaidYet}
                </p>
              </div>
            </div>
          </div>

          <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.paymentTimeline}
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
            title={copy.paymentNotes}
            items={[
              {
                id: "reminder",
                title: copy.noteItems[0].title,
                text: copy.noteItems[0].text,
                icon: ClockIcon,
                tone: "blue",
              },
              {
                id: "reconcile",
                title: copy.noteItems[1].title,
                text: copy.noteItems[1].text,
                icon: DollarSignIcon,
                tone: "emerald",
              },
              {
                id: "closeout",
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
  title: "Invoice Detail",
  meta: [
    {
      name: "description",
      content: "Inspect an invoice in the Qwik CRM demo.",
    },
  ],
};
