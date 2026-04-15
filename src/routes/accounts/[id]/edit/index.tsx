import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { updateAccount } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const accountEditCopy = {
  en: {
    notFound: "Account not found",
    back: "Back to Accounts",
    title: "Edit Account",
    intro: "Update account information",
    basicInformation: "Basic Information",
    accountName: "Account Name *",
    industry: "Industry *",
    type: "Type *",
    owner: "Owner *",
    companyMetrics: "Company Metrics",
    revenue: "Revenue ($) *",
    employees: "Employees *",
    status: "Status *",
    save: "Save Changes",
    cancel: "Cancel",
    selectType: {
      Enterprise: "Enterprise",
      "Mid-Market": "Mid-Market",
      "Small Business": "Small Business",
    },
    selectStatus: {
      Active: "Active",
      Inactive: "Inactive",
      Prospect: "Prospect",
    },
  },
  tr: {
    notFound: "Hesap bulunamadı",
    back: "Hesaplara geri dön",
    title: "Hesabı Düzenle",
    intro: "Hesap bilgilerini güncelle",
    basicInformation: "Temel Bilgiler",
    accountName: "Hesap Adı *",
    industry: "Sektör *",
    type: "Tür *",
    owner: "Sahip *",
    companyMetrics: "Şirket Metrikleri",
    revenue: "Gelir ($) *",
    employees: "Çalışan *",
    status: "Durum *",
    save: "Değişiklikleri Kaydet",
    cancel: "İptal",
    selectType: {
      Enterprise: "Kurumsal",
      "Mid-Market": "Orta Pazar",
      "Small Business": "Küçük İşletme",
    },
    selectStatus: {
      Active: "Aktif",
      Inactive: "Pasif",
      Prospect: "Potansiyel",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = accountEditCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const account = demoData.accounts.find((item) => item.id === id);

  const formData = useStore({
    name: account?.name ?? "",
    industry: account?.industry ?? "",
    type: account?.type ?? "Mid-Market",
    revenue: account?.revenue ?? 0,
    employees: account?.employees ?? 0,
    status: account?.status ?? "Prospect",
    owner: account?.owner ?? "",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Hesabı Düzenle" : "Edit Account";
  });

  if (!account) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/accounts"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href={`/accounts/${id}`}
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
          updateAccount(demoData, id, formData);
          navigate(`/accounts/${id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.basicInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="name"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.accountName}
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
                  for="industry"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.industry}
                </label>
                <input
                  id="industry"
                  type="text"
                  value={formData.industry}
                  onInput$={(event) => {
                    formData.industry = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="type"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.type}
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange$={(event) => {
                    formData.type = (event.target as HTMLSelectElement)
                      .value as "Enterprise" | "Mid-Market" | "Small Business";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Enterprise">
                    {copy.selectType.Enterprise}
                  </option>
                  <option value="Mid-Market">
                    {copy.selectType["Mid-Market"]}
                  </option>
                  <option value="Small Business">
                    {copy.selectType["Small Business"]}
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
              {copy.companyMetrics}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
              <div>
                <label
                  for="revenue"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.revenue}
                </label>
                <input
                  id="revenue"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.revenue}
                  onInput$={(event) => {
                    formData.revenue =
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
                  for="employees"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.employees}
                </label>
                <input
                  id="employees"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.employees}
                  onInput$={(event) => {
                    formData.employees =
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
                      .value as "Active" | "Inactive" | "Prospect";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Active">{copy.selectStatus.Active}</option>
                  <option value="Inactive">{copy.selectStatus.Inactive}</option>
                  <option value="Prospect">{copy.selectStatus.Prospect}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:pt-6">
            <button
              type="submit"
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-6"
            >
              <SaveIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-sm font-medium sm:text-base">{copy.save}</span>
            </button>
            <Link
              href={`/accounts/${id}`}
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
  title: "Edit Account",
  meta: [
    {
      name: "description",
      content: "Edit an account in the Qwik CRM demo.",
    },
  ],
};
