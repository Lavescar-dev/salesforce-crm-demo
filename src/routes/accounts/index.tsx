import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  Building2Icon,
  DownloadIcon,
  DollarSignIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { type Account } from "~/data/mock-data";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const accountCopy = {
  en: {
    title: "Accounts",
    intro: "Manage your customer and prospect accounts",
    newAccount: "New Account",
    totalAccounts: "Total Accounts",
    totalRevenue: "Total Revenue",
    totalEmployees: "Total Employees",
    activeAccounts: (count: number) => `${count} active accounts`,
    combinedRevenue: "Combined annual revenue",
    acrossAllAccounts: "Across all accounts",
    typeLabels: {
      All: "All",
      Enterprise: "Enterprise",
      "Mid-Market": "Mid-Market",
      "Small Business": "Small Business",
    },
    searchPlaceholder: "Search accounts by name or industry...",
    filters: "Filters",
    export: "Export",
    table: {
      accountName: "Account Name",
      industry: "Industry",
      type: "Type",
      revenue: "Revenue",
      employees: "Employees",
      status: "Status",
      owner: "Owner",
      actions: "Actions",
    },
    view: "View",
    empty: "No accounts found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} accounts`,
    previous: "Previous",
    next: "Next",
    csvHeaders: [
      "Name",
      "Industry",
      "Type",
      "Revenue",
      "Employees",
      "Status",
      "Owner",
    ],
    statusLabels: {
      Active: "Active",
      Inactive: "Inactive",
      Prospect: "Prospect",
    },
  },
  tr: {
    title: "Hesaplar",
    intro: "Müşteri ve potansiyel hesaplarınızı yönetin",
    newAccount: "Yeni Hesap",
    totalAccounts: "Toplam Hesap",
    totalRevenue: "Toplam Gelir",
    totalEmployees: "Toplam Çalışan",
    activeAccounts: (count: number) => `${count} aktif hesap`,
    combinedRevenue: "Birleşik yıllık gelir",
    acrossAllAccounts: "Tüm hesaplar genelinde",
    typeLabels: {
      All: "Tümü",
      Enterprise: "Kurumsal",
      "Mid-Market": "Orta Pazar",
      "Small Business": "Küçük İşletme",
    },
    searchPlaceholder: "İsme veya sektöre göre hesap ara...",
    filters: "Filtreler",
    export: "Dışa Aktar",
    table: {
      accountName: "Hesap Adı",
      industry: "Sektör",
      type: "Tür",
      revenue: "Gelir",
      employees: "Çalışan",
      status: "Durum",
      owner: "Sahip",
      actions: "İşlemler",
    },
    view: "Görüntüle",
    empty: "Kriterlerinize uyan hesap bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} hesap gösteriliyor`,
    previous: "Önceki",
    next: "Sonraki",
    csvHeaders: ["Ad", "Sektör", "Tür", "Gelir", "Çalışan", "Durum", "Sahip"],
    statusLabels: {
      Active: "Aktif",
      Inactive: "Pasif",
      Prospect: "Potansiyel",
    },
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = accountCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const typeFilter = useSignal<string>("All");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Hesaplar" : "Accounts";
  });

  const filteredAccounts = demoData.accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      account.industry.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType =
      typeFilter.value === "All" || account.type === typeFilter.value;
    return matchesSearch && matchesType;
  });

  const types = ["All", "Enterprise", "Mid-Market", "Small Business"] as const;

  const typeCounts = {
    All: demoData.accounts.length,
    Enterprise: demoData.accounts.filter((item) => item.type === "Enterprise")
      .length,
    "Mid-Market": demoData.accounts.filter((item) => item.type === "Mid-Market")
      .length,
    "Small Business": demoData.accounts.filter(
      (item) => item.type === "Small Business",
    ).length,
  };

  const totalRevenue = filteredAccounts.reduce(
    (sum, account) => sum + account.revenue,
    0,
  );
  const totalEmployees = filteredAccounts.reduce(
    (sum, account) => sum + account.employees,
    0,
  );
  const activeAccounts = filteredAccounts.filter(
    (account) => account.status === "Active",
  ).length;

  const getTypeColor = (type: Account["type"]) => {
    switch (type) {
      case "Enterprise":
        return "bg-violet-100 text-violet-800";
      case "Mid-Market":
        return "bg-blue-100 text-blue-800";
      case "Small Business":
        return "bg-emerald-100 text-emerald-800";
    }
  };

  const getStatusColor = (status: Account["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800";
      case "Inactive":
        return "bg-slate-100 text-slate-800";
      case "Prospect":
        return "bg-amber-100 text-amber-800";
    }
  };

  const handleExport = $(() => {
    downloadCsv(
      "accounts.csv",
      csvHeaders,
      filteredAccounts.map((account) => [
        account.name,
        account.industry,
        account.type,
        account.revenue,
        account.employees,
        account.status,
        account.owner,
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
          href="/accounts/new"
          class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          {copy.newAccount}
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.totalAccounts}
          value={filteredAccounts.length}
          subtitle={copy.activeAccounts(activeAccounts)}
          icon={Building2Icon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.totalRevenue}
          value={`${(totalRevenue / 1_000_000).toFixed(1)}M`}
          subtitle={copy.combinedRevenue}
          icon={DollarSignIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.totalEmployees}
          value={totalEmployees.toLocaleString()}
          subtitle={copy.acrossAllAccounts}
          icon={UsersIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        {types.map((type) => (
          <button
            key={type}
            onClick$={() => {
              typeFilter.value = type;
            }}
            class={[
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
              typeFilter.value === type
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {copy.typeLabels[type as keyof typeof copy.typeLabels] ?? type} (
            {typeCounts[type] || 0})
          </button>
        ))}
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
          <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <FilterIcon class="h-5 w-5" />
            <span>{copy.filters}</span>
          </button>
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
                  {copy.table.accountName}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.industry}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.type}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.revenue}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.employees}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.status}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.owner}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredAccounts.map((account) => (
                <tr key={account.id} class="transition hover:bg-slate-50/70">
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                        <Building2Icon class="h-5 w-5 text-white" />
                      </div>
                      <p class="text-sm font-medium text-slate-900">
                        {account.name}
                      </p>
                    </div>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm text-slate-900">{account.industry}</p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(account.type)}`}
                    >
                      {copy.typeLabels[
                        account.type as keyof typeof copy.typeLabels
                      ] ?? account.type}
                    </span>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm font-semibold text-slate-900">
                      ${(account.revenue / 1_000_000).toFixed(1)}M
                    </p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm text-slate-600">
                      {account.employees.toLocaleString()}
                    </p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(account.status)}`}
                    >
                      {copy.statusLabels[account.status]}
                    </span>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <p class="text-sm text-slate-600">{account.owner}</p>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <Link
                      href={`/accounts/${account.id}`}
                      class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                    >
                      {copy.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-600">
            {copy.showing(filteredAccounts.length, demoData.accounts.length)}
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
  title: "Accounts",
  meta: [
    {
      name: "description",
      content: "Browse accounts in the Qwik CRM demo.",
    },
  ],
};
