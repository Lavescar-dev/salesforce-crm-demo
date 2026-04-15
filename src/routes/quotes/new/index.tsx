import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { addQuote, getAccountNames, type Quote } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const quoteFormCopy = {
  en: {
    title: "New Quote",
    intro: "Create a new sales quote",
    quoteInformation: "Quote Information",
    quoteNumber: "Quote Number *",
    account: "Account *",
    selectAccount: "Select an account",
    amount: "Amount ($) *",
    status: "Status *",
    validUntil: "Valid Until *",
    create: "Create Quote",
    cancel: "Cancel",
    statusLabels: {
      Draft: "Draft",
      Sent: "Sent",
      Accepted: "Accepted",
      Rejected: "Rejected",
    },
  },
  tr: {
    title: "Yeni Teklif",
    intro: "Yeni bir satış teklifi oluşturun",
    quoteInformation: "Teklif Bilgileri",
    quoteNumber: "Teklif No *",
    account: "Hesap *",
    selectAccount: "Bir hesap seçin",
    amount: "Tutar ($) *",
    status: "Durum *",
    validUntil: "Geçerlilik Tarihi *",
    create: "Teklif Oluştur",
    cancel: "İptal",
    statusLabels: {
      Draft: "Taslak",
      Sent: "Gönderildi",
      Accepted: "Kabul Edildi",
      Rejected: "Reddedildi",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = quoteFormCopy[locale.value];
  const navigate = useNavigate();
  const accountOptions = getAccountNames(demoData);
  const formData = useStore({
    name: "",
    account: "",
    amount: 0,
    status: "Draft" as Quote["status"],
    validUntil: "",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Yeni Teklif" : "New Quote";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href="/quotes"
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
          const createdQuote = addQuote(demoData, formData);
          navigate(`/quotes/${createdQuote.id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.quoteInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="name"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.quoteNumber}
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onInput$={(event) => {
                    formData.name = (event.target as HTMLInputElement).value;
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
                      .value as "Draft" | "Sent" | "Accepted" | "Rejected";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Draft">{copy.statusLabels.Draft}</option>
                  <option value="Sent">{copy.statusLabels.Sent}</option>
                  <option value="Accepted">{copy.statusLabels.Accepted}</option>
                  <option value="Rejected">{copy.statusLabels.Rejected}</option>
                </select>
              </div>
              <div>
                <label
                  for="validUntil"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.validUntil}
                </label>
                <input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onInput$={(event) => {
                    formData.validUntil = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  required
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
              href="/quotes"
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
  title: "New Quote",
  meta: [
    {
      name: "description",
      content: "Create a new quote in the Qwik CRM demo.",
    },
  ],
};
