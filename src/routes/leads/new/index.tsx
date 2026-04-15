import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { addLead, type Lead } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const leadStatusLabels = {
  en: {
    New: "New",
    Contacted: "Contacted",
    Qualified: "Qualified",
    Hot: "Hot",
    Cold: "Cold",
  },
  tr: {
    New: "Yeni",
    Contacted: "İletişim Kuruldu",
    Qualified: "Nitelikli",
    Hot: "Sıcak",
    Cold: "Soğuk",
  },
} as const;

const leadSourceLabels = {
  en: {
    Website: "Website",
    Referral: "Referral",
    "Cold Call": "Cold Call",
    "Social Media": "Social Media",
    Event: "Event",
  },
  tr: {
    Website: "Web Sitesi",
    Referral: "Referans",
    "Cold Call": "Soğuk Arama",
    "Social Media": "Sosyal Medya",
    Event: "Etkinlik",
  },
} as const;

const leadFormCopy = {
  en: {
    backToLeads: "Back to Leads",
    title: "New Lead",
    intro: "Capture a new sales lead",
    basicInformation: "Basic Information",
    leadDetails: "Lead Details",
    labels: {
      fullName: "Full Name *",
      company: "Company *",
      email: "Email *",
      phone: "Phone *",
      status: "Status *",
      source: "Lead Source *",
      value: "Potential Value ($) *",
    },
    buttons: {
      create: "Create Lead",
      cancel: "Cancel",
    },
    statusOptions: leadStatusLabels.en,
    sourceOptions: leadSourceLabels.en,
  },
  tr: {
    backToLeads: "Adalara Dön",
    title: "Yeni Aday",
    intro: "Yeni bir satış adayı ekleyin",
    basicInformation: "Temel Bilgiler",
    leadDetails: "Aday Detayları",
    labels: {
      fullName: "Ad Soyad *",
      company: "Şirket *",
      email: "E-posta *",
      phone: "Telefon *",
      status: "Durum *",
      source: "Lead Kaynağı *",
      value: "Potansiyel Değer ($) *",
    },
    buttons: {
      create: "Adayı Oluştur",
      cancel: "İptal",
    },
    statusOptions: leadStatusLabels.tr,
    sourceOptions: leadSourceLabels.tr,
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = leadFormCopy[locale.value];
  const demoData = useDemoData();
  const navigate = useNavigate();
  const formData = useStore({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "New" as Lead["status"],
    source: "Website" as Lead["source"],
    value: 0,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Yeni Aday" : "New Lead";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href="/leads"
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
          const createdLead = addLead(demoData, formData);
          navigate(`/leads/${createdLead.id}`);
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
                  {copy.labels.fullName}
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
                  for="company"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.company}
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onInput$={(event) => {
                    formData.company = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="email"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onInput$={(event) => {
                    formData.email = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="phone"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.phone}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onInput$={(event) => {
                    formData.phone = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-4 sm:pt-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.leadDetails}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="status"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.status}
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange$={(event) => {
                    formData.status = (event.target as HTMLSelectElement)
                      .value as
                      | "New"
                      | "Contacted"
                      | "Qualified"
                      | "Hot"
                      | "Cold";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  {Object.entries(copy.statusOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  for="source"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.source}
                </label>
                <select
                  id="source"
                  value={formData.source}
                  onChange$={(event) => {
                    formData.source = (event.target as HTMLSelectElement)
                      .value as
                      | "Website"
                      | "Referral"
                      | "Cold Call"
                      | "Social Media"
                      | "Event";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  {Object.entries(copy.sourceOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  for="value"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.labels.value}
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
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:pt-6">
            <button
              type="submit"
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-6"
            >
              <SaveIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-sm font-medium sm:text-base">
                {copy.buttons.create}
              </span>
            </button>
            <Link
              href="/leads"
              class="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-6 sm:text-base"
            >
              {copy.buttons.cancel}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "New Lead",
  meta: [
    {
      name: "description",
      content: "Create a new lead in the Qwik CRM demo.",
    },
  ],
};
