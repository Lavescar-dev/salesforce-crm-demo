import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import {
  addOpportunity,
  getAccountNames,
  type Opportunity,
} from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const opportunityFormCopy = {
  en: {
    title: "New Opportunity",
    intro: "Create a new sales opportunity",
    dealInformation: "Deal Information",
    opportunityName: "Opportunity Name *",
    account: "Account *",
    selectAccount: "Select an account",
    stage: "Stage *",
    owner: "Owner *",
    forecastMetrics: "Forecast Metrics",
    probability: "Probability (%) *",
    value: "Value ($) *",
    closeDate: "Close Date *",
    highValue: "Mark as high value opportunity",
    create: "Create Opportunity",
    cancel: "Cancel",
    stages: {
      Prospecting: "Prospecting",
      Qualification: "Qualification",
      Proposal: "Proposal",
      Negotiation: "Negotiation",
      "Closed Won": "Closed Won",
      "Closed Lost": "Closed Lost",
    },
  },
  tr: {
    title: "Yeni Fırsat",
    intro: "Yeni bir satış fırsatı oluşturun",
    dealInformation: "Fırsat Bilgileri",
    opportunityName: "Fırsat Adı *",
    account: "Hesap *",
    selectAccount: "Bir hesap seçin",
    stage: "Aşama *",
    owner: "Sahip *",
    forecastMetrics: "Tahmin Metrikleri",
    probability: "Olasılık (%) *",
    value: "Değer ($) *",
    closeDate: "Kapanış Tarihi *",
    highValue: "Yüksek değerli fırsat olarak işaretle",
    create: "Fırsat Oluştur",
    cancel: "İptal",
    stages: {
      Prospecting: "Keşif",
      Qualification: "Nitelendirme",
      Proposal: "Teklif",
      Negotiation: "Müzakere",
      "Closed Won": "Kazanıldı",
      "Closed Lost": "Kayıp",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = opportunityFormCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const accountOptions = getAccountNames(demoData);
  const searchAccount = location.url.searchParams.get("account") ?? "";
  const initialAccount = accountOptions.includes(searchAccount)
    ? searchAccount
    : "";
  const initialOwner = location.url.searchParams.get("owner") ?? "";
  const formData = useStore({
    name: "",
    account: initialAccount,
    stage: "Prospecting" as Opportunity["stage"],
    probability: 0,
    value: 0,
    closeDate: "",
    owner: initialOwner,
    isHighValue: false,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Yeni Fırsat" : "New Opportunity";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href="/opportunities"
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
          const createdOpportunity = addOpportunity(demoData, formData);
          navigate(`/opportunities/${createdOpportunity.id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.dealInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="name"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.opportunityName}
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
                  for="stage"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.stage}
                </label>
                <select
                  id="stage"
                  value={formData.stage}
                  onChange$={(event) => {
                    formData.stage = (event.target as HTMLSelectElement)
                      .value as
                      | "Prospecting"
                      | "Qualification"
                      | "Proposal"
                      | "Negotiation"
                      | "Closed Won"
                      | "Closed Lost";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Prospecting">{copy.stages.Prospecting}</option>
                  <option value="Qualification">
                    {copy.stages.Qualification}
                  </option>
                  <option value="Proposal">{copy.stages.Proposal}</option>
                  <option value="Negotiation">{copy.stages.Negotiation}</option>
                  <option value="Closed Won">
                    {copy.stages["Closed Won"]}
                  </option>
                  <option value="Closed Lost">
                    {copy.stages["Closed Lost"]}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="owner"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.owner}
                </label>
                <input
                  id="owner"
                  type="text"
                  value={formData.owner}
                  onInput$={(event) => {
                    formData.owner = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-4 sm:pt-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.forecastMetrics}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
              <div>
                <label
                  for="probability"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.probability}
                </label>
                <input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.probability}
                  onInput$={(event) => {
                    formData.probability =
                      Number.parseInt(
                        (event.target as HTMLInputElement).value,
                        10,
                      ) || 0;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="value"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.value}
                </label>
                <input
                  id="value"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.value}
                  onInput$={(event) => {
                    formData.value =
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
                  for="closeDate"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.closeDate}
                </label>
                <input
                  id="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onInput$={(event) => {
                    formData.closeDate = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <input
                id="isHighValue"
                type="checkbox"
                checked={formData.isHighValue}
                onChange$={(event) => {
                  formData.isHighValue = (
                    event.target as HTMLInputElement
                  ).checked;
                }}
                class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                for="isHighValue"
                class="text-sm font-medium text-slate-700"
              >
                {copy.highValue}
              </label>
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
              href="/opportunities"
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
  title: "New Opportunity",
  meta: [
    {
      name: "description",
      content: "Create a new opportunity in the Qwik CRM demo.",
    },
  ],
};
