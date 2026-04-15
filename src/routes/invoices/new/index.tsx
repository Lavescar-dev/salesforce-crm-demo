import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { addInvoice, getAccountNames, type Invoice } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const invoiceFormCopy = {
  en: {
    title: "New Invoice",
    intro: "Create a new invoice record",
    invoiceInformation: "Invoice Information",
    invoiceNumber: "Invoice Number *",
    account: "Account *",
    selectAccount: "Select an account",
    amount: "Amount ($) *",
    status: "Status *",
    dueDate: "Due Date *",
    paidDate: "Paid Date",
    create: "Create Invoice",
    cancel: "Cancel",
    statusLabels: {
      Paid: "Paid",
      Pending: "Pending",
      Overdue: "Overdue",
      Cancelled: "Cancelled",
    },
  },
  tr: {
    title: "Yeni Fatura",
    intro: "Yeni bir fatura kaydı oluşturun",
    invoiceInformation: "Fatura Bilgileri",
    invoiceNumber: "Fatura No *",
    account: "Hesap *",
    selectAccount: "Bir hesap seçin",
    amount: "Tutar ($) *",
    status: "Durum *",
    dueDate: "Son Tarih *",
    paidDate: "Ödeme Tarihi",
    create: "Fatura Oluştur",
    cancel: "İptal",
    statusLabels: {
      Paid: "Ödendi",
      Pending: "Beklemede",
      Overdue: "Gecikmiş",
      Cancelled: "İptal Edildi",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = invoiceFormCopy[locale.value];
  const navigate = useNavigate();
  const accountOptions = getAccountNames(demoData);
  const formData = useStore({
    invoiceNumber: "",
    account: "",
    amount: 0,
    status: "Pending" as Invoice["status"],
    dueDate: "",
    paidDate: "",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Yeni Fatura" : "New Invoice";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href="/invoices"
          class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </Link>
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {copy.title}
          </h1>
          <p class="mt-1 text-sm text-slate-600 sm:text-base">{copy.intro}</p>
        </div>
      </div>

      <form
        preventdefault:submit
        onSubmit$={() => {
          const createdInvoice = addInvoice(demoData, {
            ...formData,
            paidDate: formData.paidDate || null,
          });
          navigate(`/invoices/${createdInvoice.id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.invoiceInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="invoiceNumber"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.invoiceNumber}
                </label>
                <input
                  id="invoiceNumber"
                  type="text"
                  value={formData.invoiceNumber}
                  onInput$={(event) => {
                    formData.invoiceNumber = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="account"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.account}
                </label>
                <select
                  id="account"
                  value={formData.account}
                  onChange$={(event) => {
                    formData.account = (
                      event.target as HTMLSelectElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="" disabled>
                    {copy.selectAccount}
                  </option>
                  {accountOptions.map((accountName) => (
                    <option key={accountName} value={accountName}>
                      {accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  for="amount"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.amount}
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.amount}
                  onInput$={(event) => {
                    formData.amount =
                      Number.parseFloat(
                        (event.target as HTMLInputElement).value,
                      ) || 0;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="status"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.status}
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange$={(event) => {
                    formData.status = (event.target as HTMLSelectElement)
                      .value as "Paid" | "Pending" | "Overdue" | "Cancelled";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Paid">{copy.statusLabels.Paid}</option>
                  <option value="Pending">{copy.statusLabels.Pending}</option>
                  <option value="Overdue">{copy.statusLabels.Overdue}</option>
                  <option value="Cancelled">
                    {copy.statusLabels.Cancelled}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="dueDate"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.dueDate}
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onInput$={(event) => {
                    formData.dueDate = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="paidDate"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.paidDate}
                </label>
                <input
                  id="paidDate"
                  type="date"
                  value={formData.paidDate}
                  onInput$={(event) => {
                    formData.paidDate = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:pt-6">
            <button
              type="submit"
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-6"
            >
              <SaveIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-sm font-medium sm:text-base">
                {copy.create}
              </span>
            </button>
            <Link
              href="/invoices"
              class="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-6 sm:text-base"
            >
              {copy.cancel}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "New Invoice",
  meta: [
    {
      name: "description",
      content: "Create a new invoice in the Qwik CRM demo.",
    },
  ],
};
