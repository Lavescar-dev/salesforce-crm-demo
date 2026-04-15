import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { type Opportunity } from "~/data/mock-data";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const opportunityCopy = {
  en: {
    title: "Opportunities",
    intro: "Track and manage your sales opportunities",
    newOpportunity: "New Opportunity",
    totalPipelineValue: "Total Pipeline Value",
    weightedPipeline: "Weighted Pipeline",
    averageDealSize: "Average Deal Size",
    opportunities: (count: number) => `${count} opportunities`,
    probabilityAdjusted: "Probability-adjusted value",
    acrossAllStages: "Across all stages",
    stageLabels: {
      All: "All",
      Prospecting: "Prospecting",
      Qualification: "Qualification",
      Proposal: "Proposal",
      Negotiation: "Negotiation",
      "Closed Won": "Closed Won",
    },
    searchPlaceholder: "Search opportunities...",
    filters: "Filters",
    export: "Export",
    pipelineView: "Pipeline View",
    listView: "List View",
    deals: "deals",
    daysToClose: (days: number) => `${days}d to close`,
    table: {
      opportunity: "Opportunity",
      account: "Account",
      value: "Value",
      stage: "Stage",
      probability: "Probability",
      closeDate: "Close Date",
      owner: "Owner",
      actions: "Actions",
    },
    empty: "No opportunities found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} opportunities`,
    view: "View",
    csvHeaders: [
      "Name",
      "Account",
      "Value",
      "Stage",
      "Probability",
      "Close Date",
      "Owner",
      "High Value",
    ],
  },
  tr: {
    title: "Fırsatlar",
    intro: "Satış fırsatlarınızı takip edin ve yönetin",
    newOpportunity: "Yeni Fırsat",
    totalPipelineValue: "Toplam Pipeline Değeri",
    weightedPipeline: "Ağırlıklı Pipeline",
    averageDealSize: "Ortalama İş Büyüklüğü",
    opportunities: (count: number) => `${count} fırsat`,
    probabilityAdjusted: "Olasılığa göre düzeltilmiş değer",
    acrossAllStages: "Tüm aşamalarda",
    stageLabels: {
      All: "Tümü",
      Prospecting: "Keşif",
      Qualification: "Nitelendirme",
      Proposal: "Teklif",
      Negotiation: "Müzakere",
      "Closed Won": "Kazanıldı",
    },
    searchPlaceholder: "Fırsat ara...",
    filters: "Filtreler",
    export: "Dışa Aktar",
    pipelineView: "Pipeline Görünümü",
    listView: "Liste Görünümü",
    deals: "fırsat",
    daysToClose: (days: number) => `Kapanmaya ${days} gün`,
    table: {
      opportunity: "Fırsat",
      account: "Hesap",
      value: "Değer",
      stage: "Aşama",
      probability: "Olasılık",
      closeDate: "Kapanış Tarihi",
      owner: "Sahip",
      actions: "İşlemler",
    },
    empty: "Kriterlerinize uyan fırsat bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} fırsat gösteriliyor`,
    view: "Görüntüle",
    csvHeaders: [
      "Ad",
      "Hesap",
      "Değer",
      "Aşama",
      "Olasılık",
      "Kapanış Tarihi",
      "Sahip",
      "Yüksek Değer",
    ],
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = opportunityCopy[locale.value];
  const localeCode = locale.value === "tr" ? "tr-TR" : "en-US";
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const stageFilter = useSignal<string>("All");
  const csvHeaders = [...copy.csvHeaders];

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Fırsatlar" : "Opportunities";
  });

  const stages = [
    "All",
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
  ] as const;

  const filteredOpportunities = demoData.opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      opportunity.account
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    const matchesStage =
      stageFilter.value === "All" || opportunity.stage === stageFilter.value;
    return matchesSearch && matchesStage;
  });

  const stageCounts = {
    All: demoData.opportunities.length,
    Prospecting: demoData.opportunities.filter(
      (item) => item.stage === "Prospecting",
    ).length,
    Qualification: demoData.opportunities.filter(
      (item) => item.stage === "Qualification",
    ).length,
    Proposal: demoData.opportunities.filter((item) => item.stage === "Proposal")
      .length,
    Negotiation: demoData.opportunities.filter(
      (item) => item.stage === "Negotiation",
    ).length,
    "Closed Won": demoData.opportunities.filter(
      (item) => item.stage === "Closed Won",
    ).length,
  };

  const getStageColor = (stage: Opportunity["stage"]) => {
    switch (stage) {
      case "Prospecting":
        return "bg-slate-100 text-slate-800";
      case "Qualification":
        return "bg-amber-100 text-amber-800";
      case "Proposal":
        return "bg-blue-100 text-blue-800";
      case "Negotiation":
        return "bg-violet-100 text-violet-800";
      case "Closed Won":
        return "bg-emerald-100 text-emerald-800";
      case "Closed Lost":
        return "bg-rose-100 text-rose-800";
    }
  };

  const totalValue = filteredOpportunities.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const weightedValue = filteredOpportunities.reduce(
    (sum, item) => sum + (item.value * item.probability) / 100,
    0,
  );
  const avgDealSize =
    filteredOpportunities.length > 0
      ? totalValue / filteredOpportunities.length
      : 0;

  const opportunitiesByStage = stages.slice(1).reduce(
    (acc, stage) => {
      acc[stage] = filteredOpportunities.filter((item) => item.stage === stage);
      return acc;
    },
    {} as Record<string, Opportunity[]>,
  );

  const handleExport = $(() => {
    downloadCsv(
      "opportunities.csv",
      csvHeaders,
      filteredOpportunities.map((opportunity) => [
        opportunity.name,
        opportunity.account,
        opportunity.value,
        opportunity.stage,
        opportunity.probability,
        opportunity.closeDate,
        opportunity.owner,
        opportunity.isHighValue ? "Yes" : "No",
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
          href="/opportunities/new"
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          <span class="text-sm font-medium">{copy.newOpportunity}</span>
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.totalPipelineValue}
          value={`${(totalValue / 1_000_000).toFixed(2)}M`}
          subtitle={copy.opportunities(filteredOpportunities.length)}
          icon={TrendingUpIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.weightedPipeline}
          value={`${(weightedValue / 1_000_000).toFixed(2)}M`}
          subtitle={copy.probabilityAdjusted}
          icon={TrendingUpIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.averageDealSize}
          value={`${(avgDealSize / 1000).toFixed(0)}K`}
          subtitle={copy.acrossAllStages}
          icon={TrendingUpIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick$={() => {
              stageFilter.value = stage;
            }}
            class={[
              "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              stageFilter.value === stage
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {copy.stageLabels[stage as keyof typeof copy.stageLabels] ?? stage}{" "}
            ({stageCounts[stage] || 0})
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

      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
          {copy.pipelineView}
        </h2>

        <div class="space-y-4 md:hidden">
          {stages.slice(1).map((stage) => {
            const stageOpps = opportunitiesByStage[stage] || [];
            const stageValue = stageOpps.reduce(
              (sum, item) => sum + item.value,
              0,
            );

            return (
              <div key={stage} class="rounded-xl bg-slate-50 p-4">
                <div class="mb-3 border-b border-slate-200 pb-3">
                  <h3 class="text-sm font-semibold text-slate-900">
                    {copy.stageLabels[stage as keyof typeof copy.stageLabels] ??
                      stage}
                  </h3>
                  <p class="mt-1 text-xs text-slate-500">
                    {stageOpps.length} {copy.deals} · $
                    {(stageValue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div class="space-y-2">
                  {stageOpps.map((opp) => (
                    <div
                      key={opp.id}
                      class="rounded-xl border border-slate-200 bg-white p-3 transition hover:shadow-sm"
                    >
                      <p class="mb-1 text-sm font-medium text-slate-900">
                        {opp.name}
                      </p>
                      <p class="mb-2 text-xs text-slate-600">{opp.account}</p>
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-slate-900">
                          ${(opp.value / 1000).toFixed(0)}K
                        </p>
                        <span class="text-xs text-slate-500">
                          {opp.probability}%
                        </span>
                      </div>
                      {opp.daysToClose !== undefined &&
                      opp.daysToClose <= 30 ? (
                        <div class="mt-2 flex items-center gap-1 text-xs text-amber-600">
                          <CalendarIcon class="h-3 w-3" />
                          {copy.daysToClose(opp.daysToClose)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div class="hidden md:block overflow-x-auto -mx-4 sm:-mx-6">
          <div class="inline-flex min-w-full gap-4 px-4 sm:px-6">
            {stages.slice(1).map((stage) => {
              const stageOpps = opportunitiesByStage[stage] || [];
              const stageValue = stageOpps.reduce(
                (sum, item) => sum + item.value,
                0,
              );

              return (
                <div
                  key={stage}
                  class="w-64 flex-shrink-0 rounded-xl bg-slate-50 p-4"
                >
                  <div class="mb-3">
                    <h3 class="text-sm font-semibold text-slate-900">
                      {copy.stageLabels[
                        stage as keyof typeof copy.stageLabels
                      ] ?? stage}
                    </h3>
                    <p class="mt-1 text-xs text-slate-500">
                      {stageOpps.length} {copy.deals} · $
                      {(stageValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div class="max-h-96 space-y-2 overflow-y-auto">
                    {stageOpps.map((opp) => (
                      <div
                        key={opp.id}
                        class="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition hover:shadow-sm"
                      >
                        <p class="mb-1 line-clamp-2 text-sm font-medium text-slate-900">
                          {opp.name}
                        </p>
                        <p class="mb-2 truncate text-xs text-slate-600">
                          {opp.account}
                        </p>
                        <div class="flex items-center justify-between">
                          <p class="text-sm font-semibold text-slate-900">
                            ${(opp.value / 1000).toFixed(0)}K
                          </p>
                          <span class="text-xs text-slate-500">
                            {opp.probability}%
                          </span>
                        </div>
                        {opp.daysToClose !== undefined &&
                        opp.daysToClose <= 30 ? (
                          <div class="mt-2 flex items-center gap-1 text-xs text-amber-600">
                            <CalendarIcon class="h-3 w-3" />
                            {copy.daysToClose(opp.daysToClose)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <h2 class="text-base font-semibold text-slate-900 sm:text-lg">
            {copy.listView}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b border-slate-200 bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.opportunity}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell sm:px-6">
                  {copy.table.account}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.value}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.stage}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell sm:px-6">
                  {copy.table.probability}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell sm:px-6">
                  {copy.table.closeDate}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 2xl:table-cell sm:px-6">
                  {copy.table.owner}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id} class="transition hover:bg-slate-50/70">
                  <td class="px-4 py-4 sm:px-6">
                    <p class="text-sm font-medium text-slate-900">{opp.name}</p>
                    <p class="mt-1 text-xs text-slate-500 lg:hidden">
                      {opp.account}
                    </p>
                  </td>
                  <td class="hidden px-4 py-4 sm:px-6 lg:table-cell">
                    <p class="text-sm text-slate-900">{opp.account}</p>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <p class="text-sm font-semibold text-slate-900">
                      ${(opp.value / 1000).toFixed(0)}K
                    </p>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStageColor(opp.stage)}`}
                    >
                      {copy.stageLabels[
                        opp.stage as keyof typeof copy.stageLabels
                      ] ?? opp.stage}
                    </span>
                  </td>
                  <td class="hidden px-4 py-4 sm:px-6 xl:table-cell">
                    <p class="text-sm text-slate-600">{opp.probability}%</p>
                  </td>
                  <td class="hidden px-4 py-4 sm:px-6 sm:table-cell">
                    <p class="text-sm text-slate-600">
                      {new Date(opp.closeDate).toLocaleDateString(localeCode)}
                    </p>
                  </td>
                  <td class="hidden px-4 py-4 sm:px-6 2xl:table-cell">
                    <p class="text-sm text-slate-600">{opp.owner}</p>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <Link
                      href={`/opportunities/${opp.id}`}
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
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Opportunities",
  meta: [
    {
      name: "description",
      content: "Manage sales opportunities in the Qwik CRM demo.",
    },
  ],
};
