import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  DownloadIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-qwik";
import { Link } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { type Lead } from "~/data/mock-data";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const leadCopy = {
  en: {
    title: "Leads",
    intro: "Manage and track your sales leads",
    newLead: "New Lead",
    searchPlaceholder: "Search leads...",
    filters: "Filters",
    export: "Export",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} leads`,
    empty: "No leads found matching your criteria.",
    actions: { view: "View" },
    statusFilters: {
      all: "All",
      hot: "Hot",
      qualified: "Qualified",
      contacted: "Contacted",
      new: "New",
    },
    headers: {
      name: "Name",
      company: "Company",
      contact: "Contact",
      status: "Status",
      source: "Source",
      value: "Value",
      actions: "Actions",
    },
    csvHeaders: [
      "Name",
      "Company",
      "Email",
      "Phone",
      "Status",
      "Source",
      "Value",
      "Created At",
    ],
  },
  tr: {
    title: "Adaylar",
    intro: "Satış adaylarını yönetin ve takip edin",
    newLead: "Yeni Aday",
    searchPlaceholder: "Aday ara...",
    filters: "Filtreler",
    export: "Dışa Aktar",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} aday gösteriliyor`,
    empty: "Kriterlerinize uyan aday bulunamadı.",
    actions: { view: "Görüntüle" },
    statusFilters: {
      all: "Tümü",
      hot: "Sıcak",
      qualified: "Nitelikli",
      contacted: "İletişim Kuruldu",
      new: "Yeni",
    },
    headers: {
      name: "Ad",
      company: "Şirket",
      contact: "İletişim",
      status: "Durum",
      source: "Kaynak",
      value: "Değer",
      actions: "İşlemler",
    },
    csvHeaders: [
      "Ad",
      "Şirket",
      "E-posta",
      "Telefon",
      "Durum",
      "Kaynak",
      "Değer",
      "Oluşturulma Tarihi",
    ],
  },
} as const;

const leadStatusLabels = {
  en: {
    All: "All",
    Hot: "Hot",
    Qualified: "Qualified",
    Contacted: "Contacted",
    New: "New",
  },
  tr: {
    All: "Tümü",
    Hot: "Sıcak",
    Qualified: "Nitelikli",
    Contacted: "İletişim Kuruldu",
    New: "Yeni",
  },
} as const;

const leadSourceLabels = {
  en: {
    Website: "Website",
    Referral: "Referral",
    Event: "Event",
    "Cold Call": "Cold Call",
    "Social Media": "Social Media",
  },
  tr: {
    Website: "Web Sitesi",
    Referral: "Referans",
    Event: "Etkinlik",
    "Cold Call": "Soğuk Arama",
    "Social Media": "Sosyal Medya",
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = leadCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const statusFilter = useSignal<string>("All");
  const numberLocale = locale.value === "tr" ? "tr-TR" : "en-US";

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Adaylar" : "Leads";
  });

  const filteredLeads = demoData.leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      statusFilter.value === "All" || lead.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: demoData.leads.length,
    Hot: demoData.leads.filter((lead) => lead.status === "Hot").length,
    Qualified: demoData.leads.filter((lead) => lead.status === "Qualified")
      .length,
    Contacted: demoData.leads.filter((lead) => lead.status === "Contacted")
      .length,
    New: demoData.leads.filter((lead) => lead.status === "New").length,
  } as const;

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "Hot":
        return "bg-rose-100 text-rose-800";
      case "Qualified":
        return "bg-emerald-100 text-emerald-800";
      case "Contacted":
        return "bg-blue-100 text-blue-800";
      case "New":
        return "bg-slate-100 text-slate-800";
      case "Cold":
        return "bg-slate-100 text-slate-700";
    }
  };

  const getSourceColor = (source: Lead["source"]) => {
    switch (source) {
      case "Website":
        return "bg-blue-50 text-blue-700";
      case "Referral":
        return "bg-emerald-50 text-emerald-700";
      case "Event":
        return "bg-violet-50 text-violet-700";
      case "Cold Call":
        return "bg-amber-50 text-amber-700";
      case "Social Media":
        return "bg-pink-50 text-pink-700";
    }
  };

  const handleExport = $(() => {
    downloadCsv(
      "leads.csv",
      csvHeaders,
      filteredLeads.map((lead) => [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
        lead.status,
        lead.source,
        lead.value,
        lead.createdAt,
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
          href="/leads/new"
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          <span class="text-sm font-medium">{copy.newLead}</span>
        </Link>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick$={() => {
              statusFilter.value = status;
            }}
            class={[
              "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              statusFilter.value === status
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {
              leadStatusLabels[locale.value][
                status as keyof typeof leadStatusLabels.en
              ]
            }{" "}
            ({count})
          </button>
        ))}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
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
          <div class="flex items-center gap-2">
            <button class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-none sm:px-4">
              <FilterIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{copy.filters}</span>
            </button>
            <button
              type="button"
              onClick$={handleExport}
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-none sm:px-4"
            >
              <DownloadIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="hidden sm:inline">{copy.export}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b border-slate-200 bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                  {copy.headers.name}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell sm:px-6 sm:py-4">
                  {copy.headers.company}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell sm:px-6 sm:py-4">
                  {copy.headers.contact}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                  {copy.headers.status}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell sm:px-6 sm:py-4">
                  {copy.headers.source}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell sm:px-6 sm:py-4">
                  {copy.headers.value}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                  {copy.headers.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} class="transition hover:bg-slate-50/70">
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div>
                      <div class="text-sm font-medium text-slate-900">
                        {lead.name}
                      </div>
                      <div class="text-xs text-slate-500 md:hidden sm:text-sm">
                        {lead.company}
                      </div>
                    </div>
                  </td>
                  <td class="hidden px-4 py-3 sm:px-6 sm:py-4 md:table-cell">
                    <div class="text-sm text-slate-900">{lead.company}</div>
                  </td>
                  <td class="hidden px-4 py-3 sm:px-6 sm:py-4 lg:table-cell">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2 text-sm text-slate-600">
                        <MailIcon class="h-4 w-4" />
                        <span class="max-w-[200px] truncate">{lead.email}</span>
                      </div>
                      <div class="flex items-center gap-2 text-sm text-slate-600">
                        <PhoneIcon class="h-4 w-4" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}
                    >
                      {
                        leadStatusLabels[locale.value][
                          lead.status as keyof typeof leadStatusLabels.en
                        ]
                      }
                    </span>
                  </td>
                  <td class="hidden px-4 py-3 sm:px-6 sm:py-4 sm:table-cell">
                    <span
                      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSourceColor(lead.source)}`}
                    >
                      {
                        leadSourceLabels[locale.value][
                          lead.source as keyof typeof leadSourceLabels.en
                        ]
                      }
                    </span>
                  </td>
                  <td class="hidden px-4 py-3 sm:px-6 sm:py-4 xl:table-cell">
                    <div class="text-sm font-semibold text-slate-900">
                      ${new Intl.NumberFormat(numberLocale).format(lead.value)}
                    </div>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <Link
                      href={`/leads/${lead.id}`}
                      class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                    >
                      {copy.actions.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="text-sm text-slate-600">
        {copy.showing(filteredLeads.length, demoData.leads.length)}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Leads",
  meta: [
    {
      name: "description",
      content: "Browse and filter sales leads in the Qwik CRM demo.",
    },
  ],
};
